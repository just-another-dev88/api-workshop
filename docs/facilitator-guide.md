# 🎤 Facilitator Guide

## DevSecOps, API Security & Cloud Integration (2-Hour Workshop)

Complete run sheet and facilitation script for the 2-hour intensive workshop.

---

## 👥 Know Your Audience

| Group | What They Need | Facilitation Strategy |
|---|---|---|
| **Non-tech** | "Why does this matter to me?" | 🟢 layers: analogies (car assembly line safety, perimeter gates) |
| **Beginners** | "How do the pieces connect?" | 🟡 layers: pipeline stages, OWASP concepts, cloud architecture diagrams |
| **Techy** | "Show me the code & configs" | 🔴 layers: live attack scripts, GitHub Actions CI workflow, Dockerfile hardening |

**Golden Rules:**
1. **Analogy first, technical jargon second.**
2. **Keep the energy high:** With 2 hours, keep moving—save deep rabbit-hole debugging for post-session chat.
3. **Turn demo errors into lessons:** When a live curl command gets `401` or `422`, celebrate that the security guard did its job!

---

## ✅ 30-Minute Pre-Session Checklist

```powershell
cd demo
# Activate Python environment
.\.venv\Scripts\Activate.ps1
# Copy environment configuration
Copy-Item .env.example .env
# Reset SQLite database for fresh demo
Remove-Item todo.db -ErrorAction SilentlyContinue
# Start local API server
uvicorn app.main:app --reload
```
- [ ] Open tabs in browser:
  - `http://127.0.0.1:8000/docs` (Interactive API docs)
  - GitHub **Actions** tab on repo (for DevSecOps CI walkthrough)
  - Workshop website: `https://just-another-dev88.github.io/api-workshop/`
- [ ] Zoom in terminal and browser font sizes (`Ctrl` + `+`).

---

## 🗒️ 2-Hour Run Sheet & Speaking Script

### 0:00 – 0:15 · Intro + Ice Breaker (15 min)
- **Goal:** Break the ice, define what an API is in 2 minutes, and outline the 3 pillars.
- **Icebreaker:** *"Who here used mobile banking, Google Maps, or logged in with Google today? Every one of those relies on APIs talking in the background."*
- **The Core Problem:** Today, APIs are the #1 attack target. We need **DevSecOps** to build them securely, **API Security** to defend them, and **Cloud Integration** to run them reliably.

### 0:15 – 0:45 · [Module 1 – DevSecOps](modules/01-devsecops.md) (30 min)
- **Timing:** 15 min presentation + 15 min CI pipeline walkthrough.
- **Script:** Contrast the old "inspect the car at the end" model with automated safety checks in every step of the assembly line.
- **Explain Shift Left:** Fixing a bug in your IDE takes 2 minutes; fixing a leaked credential or CVE in production can cost millions.
- **Live Pipeline Tour:** Open [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) on GitHub:
  1. Ruff (SAST linting)
  2. Pytest (Unit tests)
  3. `pip-audit` (SCA dependency check)
  4. Gitleaks (Secret detection)
  5. Docker container smoke test

### 0:45 – 1:30 · [Module 2 – API Security](modules/02-api-security.md) (45 min)
- **Timing:** 20 min OWASP principles + 25 min live attack demo.
- **Script:** Explain why APIs are targeted: attackers don't use browsers—they write automated scripts that hit endpoints directly, bypassing frontend validation.
- **Core Threats:** BOLA/IDOR, Broken Authentication, Mass Assignment, Rate Limiting.
- **Live Attack Demo:** Run the 4 attacks against `http://127.0.0.1:8000`:
  1. Unauthenticated request (`401 Unauthorized`)
  2. Mass assignment attempt with `id: 999` (`422 Unprocessable Entity` via Pydantic schema)
  3. SQL injection in title (`201 Created` - safely stored as plain text by parameterized query)
  4. Rapid bombardment of `/health` (`429 Too Many Requests` triggered by rate limiter)

### 1:30 – 2:15 · [Module 3 – Cloud Integration](modules/03-cloud-integration.md) (45 min)
- **Timing:** 25 min Cloud Native architecture + 15 min Docker & checklist + 5 min Q&A.
- **Script:** Moving beyond "it works on my laptop" to 99.99% uptime and auto-scaling.
- **Architecture Walkthrough:**
  - **API Gateway:** The front door for TLS termination, path routing, and edge rate limits.
  - **Workload Identity (IAM Roles):** Why we never hardcode static cloud keys.
  - **Secrets Manager:** Secure runtime injection and automatic rotation.
  - **Containers vs Serverless:** When to use ECS/Cloud Run vs Lambda.
- **Code Tour:** Walk through [`demo/Dockerfile`](../demo/Dockerfile) showing non-root user and health checks.
- **Wrap-up:** Highlight the Cloud Readiness Checklist in the module.

---

## ❓ Frequently Asked Questions

**Q: "Why do we need DevSecOps if we already have a dedicated security team?"**
> *Answer:* Security teams can't manually review every pull request across dozens of microservices. DevSecOps automates repetitive checks into CI, freeing security specialists for threat modeling and architecture.

**Q: "What's the main difference between an API Gateway and a Load Balancer?"**
> *Answer:* Load balancers distribute network packets. API Gateways understand HTTP applications—they enforce JWT validation, path routing, rate limit quotas, and API keys.
