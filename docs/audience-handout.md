# 📄 Audience Handout – DevSecOps, API Security & Cloud Integration

## ⚡ Cheat Sheet – The 3 Core Pillars

| # | Pillar | In One Sentence |
|---|---|---|
| 1 | **DevSecOps** | An automated *assembly line* that catches code flaws, vulnerable dependencies, and leaked secrets on every commit. |
| 2 | **API Security** | Defense-in-depth: strict schema validation, constant-time auth, object ownership checks (BOLA), and rate limits. |
| 3 | **Cloud Integration** | Modern cloud-native design: perimeter API Gateways, least-privilege IAM, runtime secrets managers, and hardened containers. |

---

## 🍽️ The API Refresher

```
  Customer (App)  ──1. Order (Request)──▶  Waiter (API)  ──▶  Kitchen (Server & DB)
                  ◀──2. Food (Response)──                 ◀──
```

### HTTP Methods & Status Codes

| Method | Plain Meaning |
|---|---|
| `GET` | "Show me" (read data) |
| `POST` | "Create this" (insert new data) |
| `PATCH` / `PUT` | "Change this" (modify existing data) |
| `DELETE` | "Remove this" (delete data) |

| Status Code | Meaning |
|---|---|
| `200` / `201` | Success / Resource Created |
| `400` / `422` | Client Error: Request malformed or schema invalid |
| `401` | Unauthorized: Missing or invalid credentials |
| `403` | Forbidden: Authenticated, but access denied |
| `404` | Not Found: Resource or route does not exist |
| `429` | Too Many Requests: Rate limit tripped—back off |
| `500` | Server Error: Unhandled backend exception |

---

## 🛡️ The DevSecOps Security Gates

1. **Pre-commit / Linters:** Instant feedback on syntax and dangerous patterns inside your editor.
2. **SAST (Static Analysis):** Scans code without executing it for bugs and security flaws (e.g. Ruff with Bandit rules).
3. **SCA (Dependency Audit):** Flags known CVEs in third-party libraries (e.g. `pip-audit`, `npm audit`).
4. **Secret Scanning:** Halts commits containing hardcoded API keys or private tokens (e.g. Gitleaks).
5. **DAST & Smoke Testing:** Exercises the running application and container image in staging/CI.

---

## ☁️ The Modern Cloud-Native API Stack

```
User App ──▶ API Gateway ──▶ Hardened Container (ECS / Cloud Run) ──▶ Managed Database
               │                        │
               ▼                        ▼
        Edge TLS & Quotas        Cloud Secrets Manager (IAM Roles)
```

- **API Gateway:** Centralized edge routing, TLS termination, API key quotas, and DDoS shielding.
- **Workload Identity:** Temporary, short-lived IAM credentials instead of static keys.
- **Secrets Manager:** Secure key/password storage injected at startup with automatic rotation.

---

## 📖 Glossary

| Term | Plain Meaning |
|---|---|
| **API** | Application Programming Interface – rules allowing different apps to communicate |
| **DevSecOps** | Integrating automated security validations throughout the DevOps pipeline |
| **Shift Left** | Moving security and testing earlier in the software development lifecycle |
| **SAST** | Static Application Security Testing – scanning source code for vulnerabilities |
| **SCA** | Software Composition Analysis – detecting CVEs in open-source dependencies |
| **BOLA / IDOR** | Broken Object Level Authorization – accessing another user's data by guessing an ID |
| **Mass Assignment** | Exploit where client sends unauthorized fields (e.g. `role=admin`) into database |
| **Rate Limiting** | Restricting the number of requests a client can make in a given timeframe |
| **API Gateway** | Entry point managing traffic, security policies, and routing for backend services |
| **Cloud IAM** | Identity & Access Management – controls who or what can perform actions in the cloud |
| **Secrets Manager** | Cloud service for securely storing and rotating passwords and API credentials |

---

## 🧠 Quick Quiz

1. **Why is fixing a security flaw in production 100x more costly than in the IDE?**
2. **What is the difference between SAST and SCA?**
3. **If an authenticated user changes an order ID in the URL to view someone else's order, what flaw is this?**
4. **Why should an API return generic 500 error messages instead of full database stack traces?**
5. **Why should cloud applications use IAM Roles instead of hardcoding AWS access keys in config files?**

<details>
<summary>Click to view answers</summary>

1. Production fixes involve potential security breaches, downtime, customer communication, emergency patches, and regulatory impact, whereas IDE fixes take seconds.
2. SAST scans the custom source code you wrote; SCA scans third-party open-source libraries and dependencies.
3. BOLA (Broken Object Level Authorization), also known as IDOR.
4. Stack traces leak internal table structures, software versions, and query syntax to potential attackers.
5. IAM Roles use temporary, automatically rotated credentials with least-privilege permissions, eliminating static credentials that could leak in git or container images.

</details>

---

## 🔗 Further Learning Resources

- [OWASP API Security Top 10](https://owasp.org/API-Security/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides)
- [AWS API Gateway Architectural Guide](https://docs.aws.amazon.com/apigateway/)
