# 🔌 Workshop: DevSecOps, API Security & Cloud Integration

Materials for a **2-hour, beginner-friendly workshop** on automated DevSecOps, API Security, and Cloud Native Integration.
Designed for a **mixed audience**: non-tech, beginners and developers in the same room.

📖 **Read it online (phone or laptop):** <https://just-another-dev88.github.io/api-workshop/>

## 🎯 Goals

By the end, participants can:
1. Explain **DevSecOps & Shift Left**: automating security into the CI assembly line.
2. Defend APIs against **OWASP Top 10** risks (BOLA, broken auth, mass assignment, DoS).
3. Architect APIs for the **Cloud** using API Gateways, IAM Roles, Secrets Managers, and hardened containers.

## ⏱️ Agenda (2 Hours)

| Time | Module | Format |
|---|---|---|
| 0:00 – 0:15 (15 min) | **Intro + Ice Breaker** | Interactive kickoff |
| 0:15 – 0:45 (30 min) | [Module 1: DevSecOps](docs/modules/01-devsecops.md) | Discussion + GitHub Actions walkthrough |
| 0:45 – 1:30 (45 min) | [Module 2: API Security](docs/modules/02-api-security.md) | Live attack & defense demos |
| 1:30 – 2:15 (45 min) | [Module 3: Cloud Integration](docs/modules/03-cloud-integration.md) | Architecture walkthrough + checklist |

## 🗂️ What's in here

| Path | For | Description |
|---|---|---|
| [docs/00-agenda.md](docs/00-agenda.md) | Everyone | 2-hour timetable and 90-minute fast-track |
| [docs/facilitator-guide.md](docs/facilitator-guide.md) | Facilitator | Script, timings, setup checklist, FAQs, troubleshooting |
| [docs/audience-handout.md](docs/audience-handout.md) | Audience | Cheat sheet, glossary, quiz, further learning |
| [docs/modules/](docs/modules/) | Both | Three core workshop modules |
| [demo/](demo/) | Both | FastAPI + SQLite Todo API with security features |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | Techy | Real DevSecOps CI pipeline (Ruff, Pytest, pip-audit, Gitleaks, Docker) |
| [website/](website/) | Maintainers | Docusaurus site that publishes `docs/` to GitHub Pages |
| [.github/workflows/docs.yml](.github/workflows/docs.yml) | Maintainers | Builds, tests and deploys the docs site |

### Modules

1. [DevSecOps](docs/modules/01-devsecops.md) (30 min)
2. [API Security](docs/modules/02-api-security.md) (45 min)
3. [Cloud Integration](docs/modules/03-cloud-integration.md) (45 min)

## 🚦 Three depth levels

Every module is split into layers so one session works for everyone:

| Layer | Who | Content |
|---|---|---|
| 🟢 **Everyone** | All participants | Analogies, stories, no jargon |
| 🟡 **Curious** | Beginners who want more | How it works: pipeline gates, OWASP pillars, cloud architecture |
| 🔴 **Techy** | Developers | Code, live attacks, configs, and deep-dives |

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

## 🌐 Docs website (GitHub Pages)

The markdown in [docs/](docs/) is published as a mobile-friendly site with [Docusaurus](https://docusaurus.io).
The site lives in [website/](website/) and reads `docs/` directly, so **edit the markdown as usual**.

```powershell
cd website
npm install
npm start            # live preview at http://localhost:3000/api-workshop/
npm test             # unit tests (link-rewriting plugin)
npm run build        # production build – fails on broken links
npm run test:e2e     # Playwright smoke tests, desktop + mobile (after build)
```

[.github/workflows/docs.yml](.github/workflows/docs.yml) builds and tests the site on every change to `docs/` or `website/`,
and **deploys to GitHub Pages on push to `main`**.
