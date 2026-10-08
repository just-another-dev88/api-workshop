# Module 1 – API Essentials & Live Demo (30 min)

## 🎯 Learning objectives

- Explain what an API is using an everyday analogy (the restaurant waiter).
- Identify APIs in daily life (rides, payments, maps, logins).
- Understand how apps communicate: HTTP methods, JSON payloads, and status codes.
- See a working API in action via interactive Swagger documentation.

---

## 🟢 Everyone – What is an API?

### The restaurant analogy

When you sit at a restaurant:
1. You look at the **menu**.
2. You place your order with the **waiter**.
3. The waiter takes your order to the **kitchen**.
4. The kitchen prepares your food.
5. The waiter brings your plate back to your table.

```
┌───────────┐      1. Order (Request)      ┌────────────┐      Takes to      ┌─────────────┐
│ Customer  │ ───────────────────────────> │   Waiter   │ ─────────────────> │   Kitchen   │
│   (App)   │ <─────────────────────────── │   (API)    │ <───────────────── │  (Server &  │
└───────────┘      2. Food (Response)      └────────────┘      Brings from   │  Database)  │
                                                                             └─────────────┘
```

In software:
- **You (Customer)** = the mobile app or browser on your phone.
- **The Waiter** = the **API** (Application Programming Interface).
- **The Kitchen** = the company's servers and database.

You never enter the kitchen, touch the stove, or see the chef's secret recipe. You simply place a request with the waiter, and the waiter brings back what you ordered.

### APIs in our daily lives

Every modern smartphone app is a mosaic of different APIs working together:

| What you do | The app you see | The invisible API at work |
|---|---|---|
| Order a ride | Grab / Uber | Google Maps API (routes & traffic) |
| Pay for food | Food delivery app | Stripe / PayPal / Banking API |
| Log in with 1 tap | Mobile game | "Sign in with Google / Apple" OAuth API |
| Track delivery weather | E-commerce | OpenWeatherMap API |

Without APIs, every company would have to launch their own satellites for GPS, build their own banking network, and manufacture their own weather sensors from scratch!

---

## 🟡 Curious – How APIs Work Under the Hood

### Clients, servers, and requests

When software speaks to software, it uses the same protocol that powers web browsers: **HTTP / HTTPS**.

Every API interaction consists of:
1. A **Request**: What you send to the server.
2. A **Response**: What the server sends back to you.

### The 4 primary HTTP verbs (methods)

Think of HTTP verbs as the action you want the waiter to take:

| HTTP Verb | Plain English | Example Action |
|---|---|---|
| `GET` | *"Show me"* | Retrieve list of to-do items or user profile |
| `POST` | *"Create this"* | Add a new to-do task or submit an order |
| `PATCH` / `PUT` | *"Update this"* | Mark a task as done or change delivery address |
| `DELETE` | *"Remove this"* | Delete a to-do item or cancel an order |

### The universal data language: JSON

APIs pass information back and forth using **JSON** (JavaScript Object Notation)—a lightweight, text-based format that is easy for humans to read and machines to parse:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "done": false,
  "priority": "high"
}
```

### Status codes: The waiter's response

Every response begins with a 3-digit status code telling you what happened:

- **`200 OK` / `201 Created`**: Success! Everything went smoothly.
- **`400 Bad Request` / `422 Unprocessable Entity`**: The client sent invalid data (e.g. empty title).
- **`401 Unauthorized`**: Identity missing or invalid (no API key provided).
- **`403 Forbidden`**: Identity recognized, but you don't have permission for this resource.
- **`404 Not Found`**: The requested item or endpoint does not exist.
- **`429 Too Many Requests`**: Rate limit exceeded—slow down!
- **`500 Internal Server Error`**: The server crashed or encountered a bug.

---

## 🔴 Techy – 5-Minute Live Demo (FastAPI + Swagger UI)

To see this in action, we run our workshop demo app built with **FastAPI**:

```powershell
# From the repository's demo directory:
cd demo
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` in your browser.

FastAPI generates an interactive **OpenAPI (Swagger)** dashboard automatically:

1. **`GET /health`**:
   - Click **Try it out** → **Execute**.
   - Server returns `200 OK` with `{"status": "ok", "app": "todo-api"}`.
2. **`GET /todos`**:
   - Click **Execute**. Returns an empty list `[]` (clean database).
3. **`POST /todos`**:
   - Send `{"title": "Prepare DevSecOps slides"}`.
   - Without an API key header (`X-API-Key`), it immediately returns **`401 Unauthorized`**!
   - Provide your configured API key in the `X-API-Key` header, and the server returns **`201 Created`** with an auto-assigned ID and timestamp.

That's the entire lifecycle of an API request: route, validation, authentication, and response!

---

## 💡 Quick check & discussion

1. If you submit an order form with a missing email address, what status code family do you expect? (`4xx` client error)
2. Why is JSON preferred over sending raw HTML between apps? (Lightweight, structured, language-agnostic)
