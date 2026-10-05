"""
Automated tests - a robot that checks the API every time code changes.
Run with:  pytest -v
"""

from app.config import Settings, get_settings
from app.main import app


# --- Happy paths -----------------------------------------------------------
def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_create_and_get_todo(client, auth):
    r = client.post("/todos", json={"title": "Buy milk"}, headers=auth)
    assert r.status_code == 201
    body = r.json()
    assert body["title"] == "Buy milk"
    assert body["done"] is False
    assert "id" in body and "created_at" in body

    r = client.get(f"/todos/{body['id']}")
    assert r.status_code == 200
    assert r.json()["title"] == "Buy milk"


def test_list_and_filter_todos(client, auth):
    client.post("/todos", json={"title": "A"}, headers=auth)
    client.post("/todos", json={"title": "B", "done": True}, headers=auth)

    assert len(client.get("/todos").json()) == 2
    done = client.get("/todos", params={"done": True}).json()
    assert [t["title"] for t in done] == ["B"]


def test_update_todo(client, auth):
    todo = client.post("/todos", json={"title": "Write slides"}, headers=auth).json()
    r = client.patch(f"/todos/{todo['id']}", json={"done": True}, headers=auth)
    assert r.status_code == 200
    assert r.json()["done"] is True
    assert r.json()["title"] == "Write slides"


def test_delete_todo(client, auth):
    todo = client.post("/todos", json={"title": "Temp"}, headers=auth).json()
    assert client.delete(f"/todos/{todo['id']}", headers=auth).status_code == 204
    assert client.get(f"/todos/{todo['id']}").status_code == 404


# --- Security: authentication ---------------------------------------------
def test_write_without_api_key_is_rejected(client):
    assert client.post("/todos", json={"title": "Hack"}).status_code == 401
    assert client.patch("/todos/1", json={"done": True}).status_code == 401
    assert client.delete("/todos/1").status_code == 401


def test_write_with_wrong_api_key_is_rejected(client):
    r = client.post("/todos", json={"title": "Hack"}, headers={"X-API-Key": "wrong"})
    assert r.status_code == 401
    assert r.json()["detail"] == "Invalid or missing API key"


# --- Security: input validation -------------------------------------------
def test_empty_title_is_rejected(client, auth):
    assert client.post("/todos", json={"title": ""}, headers=auth).status_code == 422
    assert client.post("/todos", json={"title": "   "}, headers=auth).status_code == 422


def test_too_long_title_is_rejected(client, auth):
    assert client.post("/todos", json={"title": "x" * 201}, headers=auth).status_code == 422


def test_unknown_fields_are_rejected(client, auth):
    r = client.post("/todos", json={"title": "Ok", "id": 999}, headers=auth)
    assert r.status_code == 422


def test_sql_injection_is_stored_as_plain_text(client, auth):
    evil = "x'); DROP TABLE todo; --"
    r = client.post("/todos", json={"title": evil}, headers=auth)
    assert r.status_code == 201
    assert client.get("/todos").json()[0]["title"] == evil  # table still exists


def test_limit_is_bounded(client):
    assert client.get("/todos", params={"limit": 1000}).status_code == 422


# --- Errors ----------------------------------------------------------------
def test_missing_todo_returns_404(client, auth):
    assert client.get("/todos/12345").status_code == 404
    assert client.patch("/todos/12345", json={"done": True}, headers=auth).status_code == 404
    assert client.delete("/todos/12345", headers=auth).status_code == 404


# --- Security: headers & rate limiting ------------------------------------
def test_security_headers_present(client):
    r = client.get("/health")
    assert r.headers["X-Content-Type-Options"] == "nosniff"
    assert r.headers["X-Frame-Options"] == "DENY"


def test_rate_limit_returns_429(client):
    strict = Settings(api_key="test-key-123456", rate_limit_per_minute=3)  # type: ignore[arg-type]
    app.dependency_overrides[get_settings] = lambda: strict
    codes = [client.get("/health").status_code for _ in range(4)]
    assert codes == [200, 200, 200, 429]
