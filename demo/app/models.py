"""
models.py - What a "Todo" looks like
====================================

We define:
  * `Todo`        -> the table stored in the database
  * `TodoCreate`  -> what a client must send to CREATE a todo
  * `TodoUpdate`  -> what a client may send to UPDATE a todo
  * `TodoRead`    -> what the API sends back

Separating these is a security habit: clients can never set fields
they shouldn't (like `id` or `created_at`), and validation rules
(e.g. "title must be 1-200 characters") are checked automatically.
If the input is wrong, FastAPI replies with `422 Unprocessable Entity`.
"""

from datetime import UTC, datetime

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


def _now() -> datetime:
    return datetime.now(UTC)


class TodoBase(SQLModel):
    title: str = Field(min_length=1, max_length=200, description="What needs doing")
    done: bool = Field(default=False, description="Is it finished?")


class Todo(TodoBase, table=True):
    """The database table."""

    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=_now)


class TodoCreate(TodoBase):
    """Request body for POST /todos. Unknown fields are rejected."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class TodoUpdate(SQLModel):
    """Request body for PATCH /todos/{id}. Every field is optional."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    title: str | None = Field(default=None, min_length=1, max_length=200)
    done: bool | None = None


class TodoRead(TodoBase):
    """What the API returns to the client."""

    id: int
    created_at: datetime
