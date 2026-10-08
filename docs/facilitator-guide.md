# 🎤 Facilitator Guide

## DevSecOps, API Security & Cloud Integration Workshop

Everything you need to deliver the 3-hour workshop. Read once fully during preparation, then keep the **Run Sheet** open on the day.

---

## 👥 Know Your Audience

| Group | What They Need | Facilitation Strategy |
|---|---|---|
| **Non-tech** | "Why does this matter to me?" | 🟢 layers: analogies (waiter, car assembly line), daily app examples |
| **Beginners** | "How do the pieces connect?" | 🟡 layers: HTTP verbs, status codes, DevSecOps stages, cloud architecture |
| **Techy** | "Show me the code & configs" | 🔴 layers: live Swagger demo, attack scripts, CI workflow YAML, Dockerfile |

**Golden Rules:**
1. **Analogy first, technical term second.** (Say "waiter" before "HTTP API endpoint", "assembly line safety gate" before "SAST/SCA").
2. **Interactive check-ins every 15 minutes:** *"Thumbs up if this makes sense, sideways if halfway, down if lost."*
3. **Keep demo failures teaching moments:** If a live command returns `401` or `422`, emphasize that the security gate worked!

---

## ✅ Facilitator Setup Checklist

### One Week Before
- [ ] Verify venue Wi-Fi permits outbound HTTPS and GitHub connectivity.
- [ ] Distribute the [Audience Handout](audience-handout.md) as pre-reading.
- [ ] Confirm this repository is pushed to GitHub with at least one green Actions run.

### 30 Minutes Before Kick-off
```powershell
cd demo
# Activate Python environment
.\.venv\Scripts\Activate.ps1
# Set workshop API key in .env
Copy-Item .env.example .env
# Reset SQLite database to start fresh
Remove-Item todo.db -ErrorAction SilentlyContinue
# Launch demo server
uvicorn app.main:app --reload
```
- [ ] Open tabs in browser:
  - `http://127.0.0.1:8000/docs` (Interactive Swagger UI)
  - Repository **Actions** tab on GitHub (for Module 2 CI walkthrough)
  - Published workshop website: `https://just-another-dev88.github.io/api-workshop/`
- [ ] Zoom in terminal and browser fonts (Ctrl + `+`) so the back row can easily read code.

---

## 🗒️ Detailed Run Sheet & Facilitator Script

### 0:00 – 0:15 · Welcome & Icebreaker
- **Goal:** Break the ice and establish psychological safety for mixed skill levels.
- **Hook:** *"How many of you used Google Maps, sent money on a phone, or logged into an app with Apple/Google today? You've already interacted with dozens of APIs before breakfast."*
- **Explain the 🟢🟡🔴 layers:** Tell attendees not to stress over red technical details if they are non-technical—focus on the concepts.

### 0:15 – 0:45 · [Module 1 – API Essentials & Live Demo](modules/01-api-fundamentals.md) (30 min)
- **Timing:** 15 min presentation + 15 min live demo & discussion.
- **Script:** Introduce the **Restaurant Waiter** analogy. Walk through HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`) as conversational verbs.
- **Interactive Demo:**
  - Open `http://127.0.0.1:8000/docs`.
  - Execute `GET /health`. Point out the `200 OK` and JSON response format.
  - Execute `POST /todos` without a key. Show the `401 Unauthorized` response to tease Module 3.
  - Provide key, create a todo, and query `GET /todos` to verify it in the database.

### 0:45 – 1:15 · [Module 2 – Introduction to DevSecOps](modules/02-introduction-to-devsecops.md) (30 min)
- **Timing:** 15 min concept & shift-left discussion + 15 min CI pipeline walkthrough.
- **Script:** Contrast the traditional "inspect the car at the end" model with automated safety checks in the assembly line.
- **Explain the Shift Left economics:** Finding a bug in your IDE takes 2 minutes; finding a security hole in production can cost millions.
- **Pipeline Walkthrough:** Open [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) on GitHub. Point out:
  1. Ruff (SAST linting)
  2. Pytest (Unit testing)
  3. `pip-audit` (SCA dependency vulnerability scan)
  4. Gitleaks (Secret detection)
  5. Docker container smoke test

### 1:15 – 1:30 · ☕ Mid-Session Break (15 min)
- Allow participants to stretch, ask one-on-one questions, and get water.

### 1:30 – 2:15 · [Module 3 – API Security Deep Dive](modules/03-api-security.md) (45 min)
- **Timing:** 25 min OWASP concepts + 20 min live attack demo.
- **Script:** Explain why APIs are the #1 target—attackers write scripts that call endpoints directly without touching the browser UI.
- **Core Concepts:** BOLA/IDOR, Broken Authentication, Mass Assignment, Rate Limiting.
- **Live Attack Demo:**
  - Run the 4 attacks from your terminal against `http://127.0.0.1:8000`:
    1. Unauthenticated request (`401`)
    2. Mass assignment with `id: 999` (`422` error from Pydantic `extra="forbid"`)
    3. SQL injection in title (`201` safe storage via SQLAlchemy parameterized queries)
    4. Rate limit bombardment of `/health` (`429 Too Many Requests`)

### 2:15 – 3:00 · [Module 4 – Cloud Integration](modules/04-cloud-integration.md) (45 min)
- **Timing:** 25 min Cloud Native architecture + 15 min Docker & checklist + 5 min Q&A.
- **Script:** Address the "it works on my machine" problem. Introduce the modern cloud-native architecture:
  - **API Gateway:** The front door (SSL termination, routing, quotas).
  - **Workload Identity:** Why we never hardcode AWS/GCP access keys into code.
  - **Secrets Manager:** Secure runtime injection and rotation.
  - **Containers vs Serverless:** When to choose ECS/Cloud Run vs Lambda.
- **Code Tour:** Walk through [`demo/Dockerfile`](../demo/Dockerfile) showing non-root user and health checks.
- **Wrap-Up & Quiz:** Use the quiz in the [Audience Handout](audience-handout.md) to test retention with the room.

---

## ❓ Common Attendee Questions & How to Answer

**Q: "Why do we need DevSecOps if we already have a dedicated security team?"**
> *Answer:* A security team cannot manually review hundreds of code commits every day. DevSecOps gives developers immediate automated feedback in their PRs so security teams can focus on architecture and threat modeling rather than reviewing syntax.

**Q: "What's the difference between an API Gateway and a load balancer?"**
> *Answer:* A load balancer distributes traffic evenly across servers. An API Gateway does that too, but adds intelligent API features like path-based routing, JWT token validation, rate limit quotas, and API key management.

**Q: "Can an API completely prevent all SQL injection?"**
> *Answer:* Yes, by consistently using parameterized queries or modern ORMs (like SQLAlchemy or Prisma) and never concatenating user strings directly into SQL commands.
