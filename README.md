# 🔌 API Workshop – How the Apps We Use Every Day Talk to Each Other

Materials for a **3-hour, beginner-friendly workshop** on APIs, API security and DevOps.
Designed for a **mixed audience**: non-tech, beginners and developers in the same room.

## 🎯 Goals

By the end, participants can:
1. Explain **what an API is** using an everyday analogy.
2. Spot **APIs in their daily lives** (payments, maps, ride-hailing, logins…).
3. Describe how APIs **improve communities, society and the economy**.
4. Watch (or build) a **real API** and use it from a browser.
5. Name the **basic ways APIs are kept secure**.
6. Understand how **DevOps** gets code safely from a laptop to the internet.

## 🗂️ What's in here

| Path | For | Description |
|---|---|---|
| [docs/00-agenda.md](docs/00-agenda.md) | Everyone | Timetable |
| [docs/facilitator-guide.md](docs/facilitator-guide.md) | Facilitator | Script, timings, setup checklist, FAQs, troubleshooting |
| [docs/audience-handout.md](docs/audience-handout.md) | Audience | Cheat sheet, glossary, quiz, further learning |
| [docs/modules/](docs/modules/) | Both | Six modules – the actual content |
| [demo/](demo/) | Both | FastAPI + SQLite Todo API |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | Techy | Real CI pipeline used in Module 6 |

### Modules

1. [What is an API?](docs/modules/01-what-is-an-api.md)
2. [APIs in daily life](docs/modules/02-apis-in-daily-life.md)
3. [APIs for community, society & economy](docs/modules/03-apis-for-society-and-economy.md)
4. [Let's build an API (Todo demo)](docs/modules/04-building-an-api.md)
5. [API security](docs/modules/05-api-security.md)
6. [DevOps basics](docs/modules/06-devops-basics.md)

## 🚦 Three depth levels

Every module is split into layers so one session works for everyone:

| Layer | Who | Content |
|---|---|---|
| 🟢 **Everyone** | All participants | Analogies, stories, no jargon |
| 🟡 **Curious** | Beginners who want more | How it works: HTTP, JSON, status codes |
| 🔴 **Techy** | Developers | Code, tools, deep-dives – optional, skip if short on time |

## ⚡ Quick start (demo)

```powershell
cd demo
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
# open http://127.0.0.1:8000/docs
```

See [demo/README.md](demo/README.md) for details, tests and Docker.
