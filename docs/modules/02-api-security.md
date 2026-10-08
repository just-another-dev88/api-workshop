# Module 2 – API Security (45 min)

## 🎯 Learning objectives

- Understand why APIs are the #1 target for automated attacks.
- Master the **OWASP API Security Top 10** vulnerabilities (BOLA/IDOR, broken authentication, mass assignment, and rate limiting).
- Implement defense-in-depth: strict validation schemas, constant-time authentication, and rate limiters.
- Watch live attack attempts against our demo API and see how the defense mechanisms block them.

---

## 🟢 Everyone – Why Are APIs Targeted?

### Fast refresher: What is an API?

An **API (Application Programming Interface)** is the waiter between apps:
- **Client (Your Phone / Browser)** sends an HTTP **Request** (`GET`, `POST`, `PATCH`, `DELETE`).
- **Server** processes the request and sends back a structured **Response** in **JSON** (along with a status code: `200 OK`, `401 Unauthorized`, `422 Unprocessable`, `429 Rate Limited`, `500 Server Error`).

```
  Phone App  ──1. Order (Request)──▶  API  ──▶  Backend Database
             ◀──2. Food (Response)──       ◀──
```

### Websites vs. APIs: Bypassing the front door

When you visit a normal website:
- You interact with forms, buttons, and drop-downs.
- Frontend JavaScript prevents typing letters into numbers or submitting empty forms.

When an attacker targets an **API**:
- There is **no visual browser**.
- Attackers write automated scripts (Python, curl) that call backend endpoints directly at 1,000 requests per second.
- Any restriction created only on the frontend is completely bypassed!

```
Normal User:  [ Phone App ] ──(clicks button)──> [ API ] ──> [ Database ]
Attacker:     [ Automated Script / Curl ] ──────> [ API ] ──> [ Database ] (Bypasses UI!)
```

If the API backend trusts incoming requests because "the frontend already checked it", attackers can access other users' data, change permissions, or take down servers.

---

## 🟡 Curious – The OWASP API Security Pillars

[OWASP (Open Web Application Security Project)](https://owasp.org/API-Security/) identifies the most critical API vulnerabilities. Here are the core threats and how we defend against them:

### 1. BOLA (Broken Object Level Authorization) / IDOR
- **The flaw:** User #42 logs in, then calls `GET /orders/99` and the server hands over User #99's private order!
- **The fix:** Always verify **ownership** at the database query level:
  ```python
  # Check identity AND ownership
  query = select(Order).where(Order.id == order_id, Order.user_id == current_user.id)
  ```

### 2. Broken Authentication & Token Hygiene
- **The flaw:** Passing API keys in URL query strings (leaked into server logs and browser history), or comparing secrets with standard `==` (vulnerable to timing attacks).
- **The fix:**
  - Send tokens in HTTP headers (`Authorization: Bearer <token>` or `X-API-Key`).
  - Read secrets from environment variables, never hardcoded in source code.
  - Use **constant-time comparisons** (`secrets.compare_digest`) to prevent timing attacks.

### 3. Unrestricted Resource Consumption (Missing Rate Limits)
- **The flaw:** Attackers flood endpoints (like `/search` or `/login`) with millions of requests, crashing the server or exhausting cloud budgets.
- **The fix:** Enforce **Rate Limiting** (e.g. 60 requests per minute per IP). When exceeded, return `429 Too Many Requests`.

### 4. Mass Assignment (Broken Property Authorization)
- **The flaw:** Client sends `{"name": "Alice", "role": "admin"}` during registration, and the backend blindly saves all fields into the database, promoting Alice to administrator!
- **The fix:** Strict schemas (Pydantic with `extra = "forbid"`) that explicitly whitelist permitted fields.

### 5. Safe Error Handling
- **The flaw:** Unhandled database errors return raw stack traces showing SQL queries and table structures.
- **The fix:** Log technical details server-side, but return a safe, generic message to the client: `{"detail": "Internal server error"}`.

---

## 🔴 Techy – Live Attack & Defense Demonstrations

In our demo application (`demo/`), we implemented these protections. Let's see them in action!

### Attack 1: Unauthenticated request (Missing API Key)

```powershell
curl -i http://127.0.0.1:8000/todos
```
**Result:** `HTTP/1.1 401 Unauthorized`
```json
{"detail": "Invalid or missing API key"}
```

---

### Attack 2: Mass Assignment attempt

Try sending unauthorized fields (like injecting `id` which only the server should control):

```powershell
curl -i -X POST http://127.0.0.1:8000/todos `
  -H "X-API-Key: <your-api-key>" `
  -H "Content-Type: application/json" `
  -d '{"title": "Valid task", "id": 999}'
```
**Result:** `HTTP/1.1 422 Unprocessable Entity`
The schema rejects unexpected fields immediately:
```json
{"detail": [{"loc": ["body", "id"], "msg": "Extra inputs are not permitted", "type": "extra_forbidden"}]}
```

---

### Attack 3: SQL Injection payload

Try injecting raw SQL into the task title:

```powershell
curl -i -X POST http://127.0.0.1:8000/todos `
  -H "X-API-Key: <your-api-key>" `
  -H "Content-Type: application/json" `
  -d '{"title": "x\"); DROP TABLE todo; --"}'
```
**Result:** `HTTP/1.1 201 Created`
SQLAlchemy uses parameterized queries (`?` placeholders). The SQL command is **never executed**—it is safely stored as literal text!

---

### Attack 4: Rate Limit bombardment

Send 70 rapid requests to the `/health` endpoint (our limit is 60 requests per minute):

```powershell
1..70 | ForEach-Object {
  try { (Invoke-WebRequest http://127.0.0.1:8000/health -UseBasicParsing).StatusCode }
  catch { [int]$_.Exception.Response.StatusCode }
}
```

You will see:
```
200
200
... (first 60 succeed)
429
429  (subsequent requests blocked with "Rate limit exceeded")
```

---

## 💡 Quick check & discussion

1. If an API verifies you are logged in, why is BOLA still possible? (Because authentication checks *who you are*; authorization checks *what you own*)
2. What status code communicates to a client that they are sending requests too quickly? (`429 Too Many Requests`)
