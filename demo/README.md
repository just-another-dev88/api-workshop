# Todo API – Workshop Demo

A tiny **FastAPI + SQLite** API used in [Module 4](../docs/modules/04-building-an-api.md),
[Module 5](../docs/modules/05-api-security.md) and [Module 6](../docs/modules/06-devops-basics.md).

## 1. Run it locally (Windows PowerShell)

```powershell
cd demo
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
Copy-Item .env.example .env        # then edit API_KEY in .env
uvicorn app.main:app --reload
```

macOS / Linux: use `source .venv/bin/activate` and `cp .env.example .env`.

Open **http://127.0.0.1:8000/docs** → interactive Swagger UI.

## 2. Endpoints

| Method | Path | Needs `X-API-Key`? | What it does |
|---|---|---|---|
| GET | `/health` | No | Is the API alive? |
| GET | `/todos?done=&limit=&offset=` | No | List todos |
| GET | `/todos/{id}` | No | Get one todo |
| POST | `/todos` | **Yes** | Create `{"title": "...", "done": false}` |
| PATCH | `/todos/{id}` | **Yes** | Update title and/or done |
| DELETE | `/todos/{id}` | **Yes** | Delete |

In Swagger UI click **Authorize 🔒**, paste your API key, and the write endpoints will work.

### Try it with curl

```bash
curl http://127.0.0.1:8000/todos
curl -X POST http://127.0.0.1:8000/todos -H "Content-Type: application/json" \
     -H "X-API-Key: change-me-please" -d '{"title": "Buy milk"}'
```

## 3. Run the tests

```powershell
pytest -v        # automated tests
ruff check .     # code style + security lint
pip-audit -r requirements.txt   # known-vulnerable libraries?
```

## 4. Run with Docker

```powershell
docker build -t todo-api .
docker run -p 8000:8000 -e API_KEY=your-secret-key -v todo-data:/data todo-api
```

## 5. Code tour

| File | What's inside |
|---|---|
| [app/main.py](app/main.py) | The endpoints ("the menu") |
| [app/models.py](app/models.py) | Shape of a Todo + validation rules |
| [app/database.py](app/database.py) | SQLite connection |
| [app/security.py](app/security.py) | API key, rate limiting, security headers |
| [app/config.py](app/config.py) | Settings from environment variables |
| [tests/test_todos.py](tests/test_todos.py) | Automated tests |

## 6. Security features (and where to find them)

| Feature | Protects against | File |
|---|---|---|
| API key on write endpoints, constant-time compare | Unauthorized changes | `security.py` |
| Strict input validation (length, types, no extra fields) | Bad / malicious data | `models.py` |
| ORM parameterized queries | SQL injection | `database.py`, `main.py` |
| Rate limiting (per IP) | Flooding / brute force | `security.py` |
| Bounded paging (`limit ≤ 100`) | Huge responses / resource exhaustion | `main.py` |
| Generic error messages | Leaking internals | `main.py` |
| Restricted CORS + security headers | Browser-based attacks | `main.py`, `security.py` |
| Secrets from env, `.env` git-ignored | Leaked credentials | `config.py` |
| Non-root Docker user | Container break-out impact | `Dockerfile` |

> ⚠️ This is a teaching demo. For production you'd add HTTPS (via a reverse proxy / cloud
> load balancer), per-user accounts (OAuth2 / JWT), a shared rate-limit store (e.g. Redis),
> logging & monitoring, and a production database (e.g. PostgreSQL).
