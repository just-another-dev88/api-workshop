# 📄 Audience Handout – APIs, Security & DevOps

## ⚡ Cheat sheet – the 6 big ideas

| # | Idea | In one sentence |
|---|---|---|
| 1 | **What is an API?** | A *waiter* that carries requests from one app to another and brings back answers. |
| 2 | **APIs in daily life** | Every app you use is many services connected by APIs – maps, payments, logins, messages. |
| 3 | **Society & economy** | APIs are *digital roads*: built once, they let others create new services, jobs and transparency. |
| 4 | **Building an API** | With Python + FastAPI, a working API with a database takes about 100 lines. |
| 5 | **Security** | Keys, permission checks, input checks, rate limits, encryption and monitoring keep APIs safe. |
| 6 | **DevOps** | An automated *assembly line* tests, packages and ships code safely and often. |

## 🍽️ The restaurant analogy

```
  You (app)  ──order──▶  Waiter (API)  ──▶  Kitchen (server/database)
             ◀──food───                ◀──
```

## 🔤 HTTP methods

| Say | Method |
|---|---|
| Show me | `GET` |
| Add | `POST` |
| Change | `PATCH` / `PUT` |
| Remove | `DELETE` |

## 🚦 Status codes

| Code | Meaning |
|---|---|
| `200` / `201` / `204` | Success / Created / Done, nothing to show |
| `400` / `422` | Your request is wrong |
| `401` | Who are you? (no / bad key) |
| `403` | I know you, but you're not allowed |
| `404` | Not found |
| `429` | Too many requests – slow down |
| `500` | Server's fault |

---

## 📖 Glossary

| Term | Plain meaning |
|---|---|
| **API** | Application Programming Interface – rules that let software talk to other software |
| **Client** | The app making the request (phone app, website, script) |
| **Server** | The computer that receives requests and sends responses |
| **Endpoint** | A specific address on an API, e.g. `/todos` |
| **Request / Response** | The question sent to the API / the answer it sends back |
| **HTTP / HTTPS** | The language of the web / the encrypted (🔒 safe) version |
| **JSON** | A simple text format for data: `{"name": "Ana", "age": 30}` |
| **REST** | A popular style of API using URLs and HTTP methods |
| **CRUD** | Create, Read, Update, Delete – the four basic data actions |
| **Database** | Organised storage for data. **SQLite** is a tiny one stored in a single file |
| **FastAPI** | A Python toolkit for building APIs quickly |
| **Swagger UI / OpenAPI** | An auto-generated, clickable "menu" for trying an API in the browser |
| **API key** | A secret code that identifies an app calling an API |
| **Authentication** | Proving *who* you are |
| **Authorization** | Deciding *what* you're allowed to do |
| **Validation** | Checking incoming data is correct and safe |
| **Rate limiting** | Capping how many requests a client can make in a time window |
| **SQL injection** | An attack that sneaks database commands into input fields |
| **OWASP** | Non-profit that publishes the most common security risks |
| **Webhook** | When an API calls *you* to say something happened |
| **Open data / Open banking** | Organisations sharing data via APIs for public or customer benefit |
| **Git** | A tool that saves every version of code (a time machine) |
| **Branch / Pull Request** | A separate line of work / a request to review and merge it |
| **CI/CD** | Continuous Integration / Delivery – automatic testing and releasing |
| **Container / Docker** | A sealed "box" with an app and everything it needs, runs the same everywhere |
| **DevOps / DevSecOps** | Developers and operations working as one team with automation (plus built-in security) |
| **Deploy** | Putting an app online for people to use |

---

## 🧠 Quiz

1. In the restaurant analogy, what is the API?
   a) The kitchen  b) The waiter  c) The menu
2. Which HTTP method adds something new?
   a) GET  b) POST  c) DELETE
3. You get a `401` response. What's wrong?
   a) The server crashed  b) The item doesn't exist  c) You didn't prove who you are
4. Why doesn't a ride-hailing app build its own maps?
   a) It's illegal  b) Reusing a maps API is faster and cheaper  c) Maps aren't needed
5. What does rate limiting protect against?
   a) Floods of requests  b) Typos  c) Slow internet
6. Where should you **never** put an API key?
   a) In an environment variable  b) In your code on GitHub  c) In a secret manager
7. What does CI do?
   a) Designs the app's logo  b) Automatically tests every code change  c) Deletes old code
8. What problem do containers solve?
   a) "It works on my machine" but not elsewhere  b) Slow typing  c) Expensive laptops

<details>
<summary>Answers</summary>

1-b · 2-b · 3-c · 4-b · 5-a · 6-b · 7-b · 8-a
</details>

---

## 🚀 Keep learning

| Level | Resource |
|---|---|
| 🟢 | Play with public APIs in your browser: <https://github.com/public-apis/public-apis> |
| 🟢 | No-code API automation: Zapier, Make, n8n |
| 🟡 | Try APIs without code: Postman, Hoppscotch (<https://hoppscotch.io>) |
| 🟡 | MDN – HTTP overview: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview> |
| 🔴 | FastAPI tutorial: <https://fastapi.tiangolo.com/tutorial/> |
| 🔴 | OWASP API Security Top 10: <https://owasp.org/API-Security/> |
| 🔴 | GitHub Actions docs: <https://docs.github.com/actions> |
| 🔴 | Docker getting started: <https://docs.docker.com/get-started/> |
| All | This workshop's demo code: see `demo/README.md` in the repo |
