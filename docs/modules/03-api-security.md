# Module 3 – API Security Deep Dive (45 min)

## 🎯 Learning objectives

- Understand why APIs are the #1 attack surface on the modern web.
- Explore the **OWASP API Security Top 10** vulnerabilities (BOLA, broken auth, mass assignment, rate limiting).
- Implement defense-in-depth: strict validation schemas, constant-time auth, and rate limiters.
- Watch live attack attempts against our demo API and see how the defense mechanisms block them.

---

## 🟢 Everyone – Why Are APIs Targeted?

### Websites vs. APIs: The invisible door

When you visit a normal website:
- You see buttons, text boxes, and dropdown menus.
- The browser prevents you from clicking disabled buttons or typing letters into a phone number field.

When an attacker targets an **API**:
- There is **no visual browser**.
- Attackers send automated scripts directly to the server at 1,000 requests per second.
- Any restriction created only in JavaScript on the frontend is completely bypassed!

```
     Normal User:    [ Phone UI ] ──(clicks button)──> [ API ] ──> [ Database ]
     Attacker:       [ Python Script / Curl ] ────────> [ API ] ──> [ Database ] (Bypasses UI!)
```

If the API blindly trusts requests because "the frontend checked it", attackers can read other people's accounts, change prices, or flood the database until the service crashes.

---

## 🟡 Curious – The OWASP API Security Pillars

[OWASP (Open Web Application Security Project)](https://owasp.org/API-Security/) tracks the most critical API vulnerabilities. Here are the top threats and how we defend against them:

### 1. BOLA (Broken Object Level Authorization) / IDOR
- **The flaw:** A user logs in as User #42, then requests `GET /orders/99` and the server hands over someone else's order!
- **The fix:** Always verify **ownership** at the database query level: `WHERE id = :order_id AND user_id = :current_user_id`.

### 2. Broken Authentication & Token Hygiene
- **The flaw:** Passing secrets in URL query parameters (which get saved in server logs), using weak predictable keys, or comparing tokens with standard string equality `==` (vulnerable to timing attacks).
- **The fix:**
  - Send tokens in HTTP headers (`Authorization: Bearer <token>` or `X-API-Key`).
  - Read secrets from environment variables, never hardcoded in source code.
  - Use **constant-time comparisons** (`secrets.compare_digest`) so attackers cannot measure millisecond differences to guess characters.

### 3. Unrestricted Resource Consumption (Missing Rate Limits)
- **The flaw:** An attacker floods an unauthenticated endpoint (like `/login` or `/search`) millions of times, knocking your server offline or running up thousands of dollars in cloud bills.
- **The fix:** Implement **Rate Limiting** (e.g. 60 requests per minute per IP). When the limit is reached, return `429 Too Many Requests`.

### 4. Mass Assignment (Broken Property Authorization)
- **The flaw:** A client submits `{"name": "Alice", "role": "admin"}` on a registration form, and the server blindly saves all fields into the database, making Alice an administrator!
- **The fix:** Use strict schema models (like Pydantic with `extra = "forbid"`) that explicitly whitelist which fields can be written by clients.

### 5. Information Disclosure in Error Messages
- **The flaw:** A database error returns a 500 page displaying the entire database query, table names, and server stack trace.
- **The fix:** Log detailed diagnostics on the server, but return a safe, generic message to the client: `{"detail": "Internal server error"}`.

---

## 🔴 Techy – Live Attack Demo Against the Todo API

In our demo application, we implemented these exact security protections. Let's test them live!

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

Try sending unexpected fields (like injecting `id` or `created_at` which only the server should control):

```powershell
curl -i -X POST http://127.0.0.1:8000/todos `
  -H "X-API-Key: <your-api-key>" `
  -H "Content-Type: application/json" `
  -d '{"title": "Valid task", "id": 999}'
```
**Result:** `HTTP/1.1 422 Unprocessable Entity`
The Pydantic schema rejects unauthorized fields immediately:
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
429
429  (subsequent requests blocked with "Rate limit exceeded")
```

---

## 💡 Quick check & discussion

1. Why shouldn't sensitive API keys be passed as URL query strings (e.g. `?apiKey=secret`)? (URLs appear in server access logs, browser history, proxy caches, and referrer headers)
2. What HTTP status code communicates to a client that they are sending requests too quickly? (`429 Too Many Requests`)
