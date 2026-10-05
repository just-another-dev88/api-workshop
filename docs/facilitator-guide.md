# 🎤 Facilitator Guide

Everything you need to run the 3-hour API workshop. Read once fully, then use the **run sheet** on the day.

---

## 👥 Know your audience

| Group | What they want | How to serve them |
|---|---|---|
| **Non-tech** | "Why should I care?" | 🟢 layers, analogies, real stories, activities |
| **Beginners** | "How does it actually work?" | 🟡 layers, Swagger UI demo, status codes |
| **Techy** | "Show me the code" | 🔴 layers, code-along, challenges, repo link |

**Golden rules**
1. **Analogy first, term second.** Say "waiter" before you say "API endpoint".
2. **Every new word goes on the board** (or point to the glossary in the handout).
3. **Mix groups** in activities – techies explain to non-techies, everyone learns.
4. **Skip 🔴 sections** if you're behind schedule – nobody will miss them in the room; techies can read them later.
5. Check in every ~15 minutes: *"Thumbs up if this makes sense, sideways if kind of, down if lost."*

---

## ✅ Setup checklist

### One week before
- [ ] Confirm venue Wi-Fi works and allows outbound HTTPS (for live API calls & GitHub)
- [ ] Share pre-reading: [audience handout](audience-handout.md); tell techies to install Python 3.11+ and Git
- [ ] Push this repo to GitHub so the **Actions** tab has at least one green run to show
- [ ] Print handouts / prepare QR code to the repo

### On the day (30 min before)
```powershell
cd demo
.\.venv\Scripts\Activate.ps1          # or create it: python -m venv .venv; pip install -r requirements-dev.txt
Copy-Item .env.example .env           # set API_KEY=workshop-secret-123 (easy to read on screen)
Remove-Item todo.db -ErrorAction SilentlyContinue   # start with an empty list
uvicorn app.main:app --reload
```
- [ ] Open tabs: `http://127.0.0.1:8000/docs`, the 3 public API URLs from Module 1, GitHub Actions page
- [ ] Run `pytest -q` once – confirm 15 passed
- [ ] (Optional) `docker build -t todo-api .` beforehand so the build is cached and fast on stage
- [ ] Increase browser & terminal font size (Ctrl + `+`) – the back row must read it
- [ ] Have a **backup**: screenshots of each demo step in case Wi-Fi or laptop fails

---

## 🗒️ Run sheet & script

### 0:00 – 0:15 · Welcome & icebreaker
- Introduce yourself and the goal: *"By the end, you'll see the invisible messengers behind every app."*
- **Icebreaker:** "Raise your hand if you used a map app today… paid with your phone… logged in with Google… checked the weather." → *"Congratulations, you've all used APIs already."*
- Explain the 🟢🟡🔴 layers: *"If something feels too technical, it's a 🔴 bonus – just relax and enjoy the show."*

### 0:15 – 0:40 · [Module 1 – What is an API?](modules/01-what-is-an-api.md)
- Tell the **restaurant story** slowly; draw it on the board.
- Introduce GET/POST/PATCH/DELETE as "show me / add / change / remove".
- **Live demo:** open the 3 public API links. Ask a non-tech volunteer to read the JSON aloud – shows it's human-readable.
- Status codes as "the waiter's mood" – get the room to shout out what `404` means.

### 0:40 – 1:00 · [Module 2 – APIs in daily life](modules/02-apis-in-daily-life.md)
- Walk through the "day full of APIs" table – ask the room for their own examples.
- Ride-booking sequence diagram.
- **Group activity (10 min):** "Unbox an app". Walk around, help groups. 1-minute presentations from 2–3 groups.

### 1:00 – 1:20 · [Module 3 – Society & economy](modules/03-apis-for-society-and-economy.md)
- "Digital roads" analogy.
- Pick **one** example per area (community / government / economy) that fits your local audience – local examples land best.
- Cover risks briefly – sets up Module 5.
- **Pair discussion (8 min)**, then collect 3–4 ideas on the board.

### 1:20 – 1:30 · ☕ Break
- Make sure the demo server is still running.

### 1:30 – 2:10 · [Module 4 – Let's build an API](modules/04-building-an-api.md)
- Show the restaurant ↔ demo mapping table.
- Follow the **12-step Swagger walkthrough** exactly. Let the audience suggest todo titles.
- Step 3 (401 error) is intentional – smile and say *"Hold that thought until Module 5."*
- Techies: point them to the code tour and code-along challenges; don't live-code everything on stage.

### 2:10 – 2:35 · [Module 5 – API security](modules/05-api-security.md)
- Building-security analogy table.
- Mention that big real-world breaches often come from one missing "lock".
- **Live security demo** (7 steps) – the SQL-injection one and the rate-limit flood get the biggest reactions.
- End with "everyday security habits" for everyone.

### 2:35 – 2:55 · [Module 6 – DevOps](modules/06-devops-basics.md)
- Bakery assembly-line analogy.
- Tell the **true story** of the dependency audit catching 7 vulnerabilities.
- Run `pytest -v` live (it's fast and visual), show Docker, show GitHub Actions green run.

### 2:55 – 3:00 · Wrap-up
- Recap the 6 ideas in one sentence each (see handout cheat sheet).
- Quick quiz (5 questions from the handout) – show of hands or Kahoot/Mentimeter.
- Share the repo link / QR code and a feedback form.

---

## 💬 Common questions & simple answers

| Question | Answer |
|---|---|
| "Is an API the same as an app?" | No. The app is what you see; the API is the messenger behind it that fetches data. |
| "Is an API the same as a website?" | A website returns pages for humans; an API returns data (JSON) for programs. |
| "Do I need to code to use an API?" | Not always – tools like Swagger UI, Postman, Zapier and Make let you use APIs without coding. |
| "Are APIs free?" | Many have free tiers; popular ones charge per use (e.g. per SMS, per payment, per AI request). |
| "Is it safe that apps share my data through APIs?" | It can be, if the API uses authentication, encryption and only shares what you allowed – that's what Module 5 is about. Always review app permissions. |
| "What's the difference between an API key and a password?" | A password identifies a *person*; an API key usually identifies an *app*. Both must be kept secret. |
| "What language should I learn to build APIs?" | Python (FastAPI) and JavaScript (Node.js/Express) are beginner-friendly; Java, Go and C# are common in big companies. |
| "Is SQLite used in real life?" | Yes – it's in every smartphone and browser! For busy web servers, PostgreSQL/MySQL are more common. |
| "What is AI's relation to APIs?" | Most AI tools (chatbots, image generation) are offered to developers *through* APIs. |

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| App won't start: `api_key Field required` | Create `demo/.env` from `.env.example` (or set `API_KEY` env var). This is intentional – secure by default. |
| `Activate.ps1 cannot be loaded` | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, or use `.\.venv\Scripts\python -m uvicorn app.main:app` |
| Port 8000 already in use | `uvicorn app.main:app --port 8001` |
| `401` even after Authorize | Check for spaces in the pasted key; restart the server after editing `.env` |
| Got `429` during the demo | You hit the rate limit – wait 60 s, or raise `RATE_LIMIT_PER_MINUTE` in `.env` |
| Want a clean slate | Stop the server, delete `todo.db`, start again |
| No internet | Use backup screenshots for Module 1; the demo works fully offline |
| Docker not installed | Skip the container step; show the Dockerfile and the CI run instead |
