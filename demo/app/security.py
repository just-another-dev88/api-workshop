"""
security.py - Locks and guards for our API
==========================================

1. API KEY  (authentication: "Who are you?")
   Like a key card for an office building. Anyone can look at the lobby
   (reading todos), but you need a key card to change anything
   (create / update / delete). The client sends it in a header:

       X-API-Key: <your-key>

2. RATE LIMITING  ("Slow down!")
   Like a bouncer who only lets a certain number of people in per minute.
   Protects the API from being flooded by one client (abuse / DoS).
   Too many requests -> `429 Too Many Requests`.

3. SECURITY HEADERS
   Extra instructions to browsers that make common web attacks harder.
"""

import secrets
import threading
import time
from collections import defaultdict, deque

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import APIKeyHeader

from app.config import Settings, get_settings

# ---------------------------------------------------------------------------
# 1. API key check
# ---------------------------------------------------------------------------
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def require_api_key(
    api_key: str | None = Depends(api_key_header),
    settings: Settings = Depends(get_settings),
) -> None:
    """Reject the request unless it carries the correct API key."""
    expected = settings.api_key.get_secret_value()
    # compare_digest takes the same time whether the guess is close or not,
    # so attackers can't guess the key letter-by-letter (timing attack).
    if api_key is None or not secrets.compare_digest(api_key, expected):
        # Generic message: don't reveal whether the key was missing or wrong.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
            headers={"WWW-Authenticate": "APIKey"},
        )


# ---------------------------------------------------------------------------
# 2. Simple in-memory rate limiter (sliding window, per client IP)
#    Good enough for a demo. Real systems use an API gateway or Redis.
# ---------------------------------------------------------------------------
class RateLimiter:
    def __init__(self, window_seconds: int = 60) -> None:
        self.window = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()

    def check(self, client_id: str, limit: int) -> bool:
        """Return True if the client is still under the limit."""
        now = time.monotonic()
        with self._lock:
            hits = self._hits[client_id]
            while hits and now - hits[0] > self.window:
                hits.popleft()
            if len(hits) >= limit:
                return False
            hits.append(now)
            return True


rate_limiter = RateLimiter()


def rate_limit(request: Request, settings: Settings = Depends(get_settings)) -> None:
    client_id = request.client.host if request.client else "unknown"
    if not rate_limiter.check(client_id, settings.rate_limit_per_minute):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests, please slow down",
            headers={"Retry-After": "60"},
        )


# ---------------------------------------------------------------------------
# 3. Security headers added to every response
# ---------------------------------------------------------------------------
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}
