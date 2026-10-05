# Module 5 – API Security (25 min)

## 🎯 Learning objectives
- Understand why APIs are a favourite target for attackers
- Know the 6 basic "locks" every API should have
- See those locks working in the demo

---

## 🟢 Everyone – Your API is a building 🏢

An API is like an office building open to the public. You want visitors in the lobby, but not wandering into the vault.

| Building security | API security | In our demo |
|---|---|---|
| 🪪 **ID / key card** at the door | **Authentication** – "Who are you?" | `X-API-Key` header |
| 🚪 **Floor access** – your card only opens your floors | **Authorization** – "What are you allowed to do?" | Reading is open, changing needs a key |
| 🧳 **Bag check** | **Input validation** – reject dangerous or nonsense data | Title must be 1–200 chars, no extra fields |
| 🚧 **Turnstile / crowd control** | **Rate limiting** – stop floods of requests | Max 60 requests/min per client → `429` |
| 🚚 **Armoured truck** for cash | **Encryption (HTTPS)** – nobody can read data in transit | Added by the hosting platform in production |
| 📹 **CCTV & logbook** | **Logging & monitoring** – notice and investigate attacks | Server logs errors, client sees a generic message |

> **Why care?** Many large data breaches in the news happened through an API that forgot one of these locks – e.g. letting anyone read *other* people's records just by changing a number in the URL.

### Everyday security habits (for everyone, not just developers)
- Never share API keys or passwords in chats, screenshots or code
- Use apps that show 🔒 HTTPS
- Review which apps have access to your Google/Facebook account and remove old ones
- Be careful with "Log in with…" permissions – only grant what's needed

---

## 🟡 Curious – The top API risks (simplified OWASP API Security Top 10)

[OWASP](https://owasp.org/API-Security/) is a global non-profit that lists the most common API security mistakes:

| # | Risk | In plain words | Defence |
|---|---|---|---|
| 1 | **Broken object-level authorization** | Changing `/orders/101` to `/orders/102` shows someone else's order | Check *ownership* on every request |
| 2 | **Broken authentication** | Weak or missing login / keys | Strong keys, MFA, tokens that expire |
| 3 | **Too much data exposed** | API returns your full profile when the app only needs your name | Return only what's needed (`TodoRead` schema) |
| 4 | **No resource limits** | Someone requests 1 million items or floods the API | Rate limiting, paging (`limit ≤ 100`) |
| 5 | **Broken function-level authorization** | Normal users can call admin-only endpoints | Separate & protect admin functions |
| 6 | **Unsafe business flows** | Bots buy all concert tickets in seconds | Limits, bot detection |
| 7 | **SSRF** | API is tricked into calling internal systems | Allow-lists for outgoing calls |
| 8 | **Security misconfiguration** | Debug mode on, default passwords, open CORS | Secure defaults, headers, reviews |
| 9 | **Poor inventory** | Old forgotten API versions still running | Track & retire old versions |
| 10 | **Trusting other APIs blindly** | Using a partner's data without checking it | Validate data from third parties too |

---

## 🧪 Live security demo (10 min)

With the app running at http://127.0.0.1:8000/docs:

| # | Try this | Result | Lesson |
|---|---|---|---|
| 1 | Log out of **Authorize**, `POST /todos` | `401 Invalid or missing API key` | No key, no entry |
| 2 | Authorize with a wrong key, try again | `401` – same message | Don't tell attackers *which* part was wrong |
| 3 | `POST` with `{"title": ""}` | `422` | Bag check |
| 4 | `POST` with `{"title": "Hi", "id": 999}` | `422` | Clients can't set fields they shouldn't |
| 5 | `POST` with `{"title": "x'); DROP TABLE todo; --"}` | `201` – stored as plain text, table survives | SQL injection blocked by parameterized queries |
| 6 | `GET /todos?limit=100000` | `422` | Resource limits |
| 7 | Run the flood script below | After 60 requests → `429` | Rate limiting |

Flood script (works in Windows PowerShell 5.1 and PowerShell 7):
```powershell
1..70 | ForEach-Object {
  try { (Invoke-WebRequest http://127.0.0.1:8000/health -UseBasicParsing).StatusCode }
  catch { [int]$_.Exception.Response.StatusCode }
} | Group-Object | Select-Object Name, Count
```

macOS / Linux:
```bash
for i in $(seq 1 70); do curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/health; done | sort | uniq -c
```

---

## 🔴 Techy – How the demo implements it

**Constant-time API key check** ([security.py](../../demo/app/security.py))
```python
if api_key is None or not secrets.compare_digest(api_key, expected):
    raise HTTPException(401, "Invalid or missing API key")
```

**Secrets from the environment, never in code** ([config.py](../../demo/app/config.py))
```python
api_key: SecretStr = Field(min_length=8)   # app refuses to start without it
```
`.env` is in `.gitignore`; CI runs **gitleaks** to catch accidentally committed secrets.

**Strict schemas** ([models.py](../../demo/app/models.py)) – `extra="forbid"`, length limits, whitespace stripping.

**No stack traces to clients** ([main.py](../../demo/app/main.py)) – a global exception handler logs details server-side and returns `{"detail": "Internal server error"}`.

**Headers & CORS** – `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, only listed origins allowed.

**Container hardening** ([Dockerfile](../../demo/Dockerfile)) – slim image, runs as non-root user.

### Going to production – what's next
| Need | Typical solution |
|---|---|
| Per-user accounts | OAuth2 / OpenID Connect, JWT tokens with expiry |
| HTTPS | Reverse proxy (Nginx, Caddy) or cloud load balancer |
| Shared rate limits across servers | API gateway or Redis |
| Ownership checks (OWASP #1) | `WHERE owner_id = current_user.id` on every query |
| Monitoring | Centralised logs, alerts on spikes of 401/429/500 |

## ❓ Quick check
1. What's the difference between authentication and authorization? *(Who you are vs. what you may do)*
2. What does `429` mean and why is it useful? *(Too many requests – protects against floods)*
3. Where should an API key **never** be stored? *(In code, Git, chats, screenshots)*
