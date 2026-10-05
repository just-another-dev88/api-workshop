"""
main.py - The Todo API
======================

Run it:
    uvicorn app.main:app --reload

Then open http://127.0.0.1:8000/docs for the interactive "Swagger UI",
where you can try every endpoint from your browser - no code needed.

Restaurant analogy 🍽️
    You (client)  ->  Waiter (API)  ->  Kitchen (database)
    The MENU is the list of endpoints below. You order with an HTTP
    method + path, and the waiter brings back a response (JSON).

    | Method | Path          | Meaning              | Needs key? |
    |--------|---------------|----------------------|------------|
    | GET    | /health       | Is the API alive?    | No         |
    | GET    | /todos        | Show me all todos    | No         |
    | GET    | /todos/{id}   | Show me one todo     | No         |
    | POST   | /todos        | Add a new todo       | Yes        |
    | PATCH  | /todos/{id}   | Change a todo        | Yes        |
    | DELETE | /todos/{id}   | Remove a todo        | Yes        |
"""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import Session, select

from app.config import get_settings
from app.database import create_db_and_tables, get_session
from app.models import Todo, TodoCreate, TodoRead, TodoUpdate
from app.security import SECURITY_HEADERS, rate_limit, require_api_key

logger = logging.getLogger("todo-api")
settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Runs once when the app starts: make sure the tables exist."""
    create_db_and_tables()
    yield


app = FastAPI(
    title="Todo API - Workshop Demo",
    description=(
        "A tiny, secure-by-default API for learning. "
        "Write actions need an `X-API-Key` header."
    ),
    version="1.0.0",
    lifespan=lifespan,
    dependencies=[Depends(rate_limit)],  # every endpoint is rate limited
)

# CORS: only the websites we list may call this API from a browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "X-API-Key"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    for name, value in SECURITY_HEADERS.items():
        response.headers.setdefault(name, value)
    return response


@app.exception_handler(Exception)
async def unhandled_error(request: Request, exc: Exception) -> JSONResponse:
    """Never leak stack traces to clients; log the details on the server instead."""
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def get_todo_or_404(todo_id: int, session: Session) -> Todo:
    todo = session.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo


# ---------------------------------------------------------------------------
# Endpoints (the "menu")
# ---------------------------------------------------------------------------
@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    """Used by monitoring tools and Docker to check the API is running."""
    return {"status": "ok"}


@app.get("/todos", response_model=list[TodoRead], tags=["todos"])
def list_todos(
    done: bool | None = Query(default=None, description="Filter by finished / not finished"),
    limit: int = Query(default=50, ge=1, le=100, description="Max items to return"),
    offset: int = Query(default=0, ge=0, description="Items to skip (for paging)"),
    session: Session = Depends(get_session),
) -> list[Todo]:
    statement = select(Todo)
    if done is not None:
        statement = statement.where(Todo.done == done)
    statement = statement.order_by(Todo.id).offset(offset).limit(limit)
    return list(session.exec(statement).all())


@app.get("/todos/{todo_id}", response_model=TodoRead, tags=["todos"])
def get_todo(todo_id: int, session: Session = Depends(get_session)) -> Todo:
    return get_todo_or_404(todo_id, session)


@app.post(
    "/todos",
    response_model=TodoRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_api_key)],
    tags=["todos"],
)
def create_todo(payload: TodoCreate, session: Session = Depends(get_session)) -> Todo:
    todo = Todo.model_validate(payload)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo


@app.patch(
    "/todos/{todo_id}",
    response_model=TodoRead,
    dependencies=[Depends(require_api_key)],
    tags=["todos"],
)
def update_todo(todo_id: int, payload: TodoUpdate, session: Session = Depends(get_session)) -> Todo:
    todo = get_todo_or_404(todo_id, session)
    changes = payload.model_dump(exclude_unset=True, exclude_none=True)
    todo.sqlmodel_update(changes)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo


@app.delete(
    "/todos/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_api_key)],
    tags=["todos"],
)
def delete_todo(todo_id: int, session: Session = Depends(get_session)) -> None:
    todo = get_todo_or_404(todo_id, session)
    session.delete(todo)
    session.commit()
