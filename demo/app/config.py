"""
config.py - App settings
========================

Settings are read from ENVIRONMENT VARIABLES (or a local `.env` file),
never hard-coded in the source. This is a key security habit:

    ❌  API_KEY = "super-secret"        # ends up in Git history forever
    ✅  API_KEY read from the environment  # stays on the server only

Copy `.env.example` to `.env` and edit the values before running the app.
"""

from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # The secret "key" a client must send to change data.
    # It is REQUIRED: if it's missing the app refuses to start (secure by default).
    api_key: SecretStr = Field(min_length=8)

    # Where the SQLite database file lives.
    database_url: str = "sqlite:///./todo.db"

    # Which websites (origins) are allowed to call this API from a browser.
    # Comma-separated list, e.g. "http://localhost:3000,https://myapp.com"
    allowed_origins: str = "http://localhost:8000"

    # How many requests one client may make per minute (simple rate limiting).
    rate_limit_per_minute: int = 60

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """Load settings once and reuse them (cached)."""
    return Settings()  # type: ignore[call-arg]
