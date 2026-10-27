# AGENTS.md — GitLab Duo Agent Platform Context

Welcome to **Local Guide Connect (TravGOD)**. This document provides system instructions and architectural context for **GitLab Duo Agents**, flows, and automated triggers operating across the DevSecOps lifecycle.

---

## 📌 Project Overview
TravGOD is an AI-powered travel safety platform and verified local guide marketplace protected by **PayPal Sandbox Escrow**.
- **Stack**: Vanilla JS (ES Modules), Vite 5, Leaflet + CARTO Voyager raster maps, CSS custom properties.
- **Key Invariants**:
  1. **Strict Escrow State Machine**: Pending -> Paid in Escrow -> Check-in (GPS Verified) -> Escrow Released. No direct payment pathways exist.
  2. **Deterministic Safety Audit Engine** (`src/utils/safetyAudit.js` / `mock/safety-audit.mjs`): Risk formulas, penalties, and findings are 100% deterministic mathematical calculations. LLMs explain findings; they never compute or alter scores.
  3. **Green Software Architecture**: Pure client-side execution eliminates expensive GPU inference for itinerary checks, achieving a 98.97% Software Carbon Intensity (SCI) reduction.

---

## 🔄 GitLab Duo DevSecOps Lifecycle Stages (9 Stages Covered)

| Stage | Agent / Job | Automation Role | Artifact Output |
|---|---|---|---|
| **1. PLAN** | `ai_plan_triage` | Triages PRs/commits, predicts blast radius, maps changes to PRD/Spec. | `ci-artifacts/plan-triage-summary.md` |
| **2. CREATE** | `duo_code_review` & `code_lint` | Enforces coding standards, checks escrow patterns, validates JS/JSON syntax. | `ci-artifacts/code-review-report.md` |
| **3. VERIFY** | `unit_tests` | Executes automated Node test runner and deterministic audit checks. | Test execution logs |
| **4. PACKAGE** | `package_build` | Vite 5 tree-shaken static bundling. | `dist/` |
| **5. SECURE** | `duo_security_remediation` | Secret detection, SAST eval inspection, dependency CVE audit, patch generation. | `ci-artifacts/security-remediation-report.md` |
| **6. RELEASE** | `ai_semantic_release` | Autonomous semantic release changelog and release notes. | `ci-artifacts/release-notes.md` |
| **7. CONFIGURE** | `config_drift_check` | Validates configuration integrity and environment variable fallbacks. | Configuration validation logs |
| **8. MONITOR** | `synthetic_health_check` | Synthetic route latency simulation and web performance budgets. | `ci-artifacts/health-monitor-report.md` |
| **9. GOVERN** | `green_sci_carbon_audit` & `license_compliance` | ISO/IEC 21031 Software Carbon Intensity scoring & MIT License verification. | `ci-artifacts/green-sci-report.md` |

---

## 🤖 GitLab Duo Autonomy Level: Hands-Off & Supervised
- **Supervised Mode**: Agents autonomously execute Plan -> Create -> Verify -> Package -> Secure -> Release, posting summaries to MRs for human sign-off on production promotion.
- **Hands-off Mode**: On merge to `main`, the pipeline runs the full loop through synthetic health monitoring, Green SCI carbon audit, and automated GitLab Pages deployment with zero human intervention.

---

## 🛠️ Local & CI Execution Commands
- **Lint**: `npm run lint`
- **Test**: `npm test`
- **Build**: `npm run build`
- **Plan Triage**: `npm run ci:plan`
- **Code Review**: `npm run ci:review`
- **Security Audit**: `npm run ci:security`
- **Green Carbon Audit**: `npm run ci:sci`
- **Health Monitor**: `npm run ci:monitor`
- **Release Notes**: `npm run ci:release`
