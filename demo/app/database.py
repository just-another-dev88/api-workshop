"""
database.py - Talking to SQLite
===============================

SQLite is a database that lives in a single file (`todo.db`).
No server to install - perfect for demos and small apps.

We use SQLModel (made by the creator of FastAPI). It lets us work with
Python objects instead of writing raw SQL, and it automatically uses
*parameterized queries*, which protects us from SQL injection attacks.
"""

from collections.abc import Iterator

from sqlmodel import Session, SQLModel, create_engine

from app.config import get_settings

settings = get_settings()

# The "engine" is the connection to the database file.
# check_same_thread=False is needed because FastAPI may use several threads.
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},
)


def create_db_and_tables() -> None:
    """Create the tables if they don't exist yet."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    """
    Give each request its own database session, and close it afterwards.
    FastAPI calls this automatically via `Depends(get_session)`.
    """
    with Session(engine) as session:
        yield session
