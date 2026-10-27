# Local Guide Connect (TRAVGOD Engine) 🌍🛡️

> **Travel safer. Connect real.**  
> *An AI-powered travel safety platform and verified local guide marketplace protected by PayPal Sandbox Escrow.*

[![GitLab CI/CD](https://img.shields.io/badge/GitLab%20CI%2FCD-All%209%20Stages%20Passing-FC6D26?style=flat-square&logo=gitlab)](https://gitlab.com/yashbodadeyb333/TravGOD/-/pipelines)
[![GitLab Duo](https://img.shields.io/badge/GitLab%20Duo-Agent%20Platform%20Flows-6e49ff?style=flat-square&logo=gitlab)](https://docs.gitlab.com/user/duo_agent_platform/)
[![Green Software](https://img.shields.io/badge/Green%20SCI-98.97%25%20Carbon%20Reduction-22c55e?style=flat-square)](https://greensoftware.foundation/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Devpost Hackathon](https://img.shields.io/badge/Devpost-Life%20After%20Code-003E54?style=flat-square&logo=devpost)](https://gitlab-transcend.devpost.com/)
[![PayPal Track](https://img.shields.io/badge/PayPal-Sandbox%20Escrow%20Protection-00457C?style=flat-square&logo=paypal)](https://developer.paypal.com/)

---

## 📌 Submission Overview

- **Project Name**: Local Guide Connect (TRAVGOD Engine)
- **Hackathon Track**: **Life After Code — The GitLab Transcend Hackathon** (Path A: Start Fresh / Path B: Bring Your Own)
- **GitLab Repository**: [https://gitlab.com/yashbodadeyb333/TravGOD](https://gitlab.com/yashbodadeyb333/TravGOD)
- **Autonomy Level**: **Hands-off / Supervised Autonomous Agent Lifecycle**
- **DevSecOps Stages**: **All 9 Stages Covered** (`plan` · `create` · `verify` · `package` · `secure` · `release` · `configure` · `monitor` · `govern`)
- **GitLab Duo Features**: Custom Flows (`.gitlab/duo/flows/`), Agent Runtime (`.gitlab/duo/agent-config.yml`), MCP Server (`.gitlab/mcp.json`), MR Review Instructions (`.gitlab/duo/mr-review-instructions.yaml`).
- **Sustainability (SCI)**: ISO/IEC 21031 Software Carbon Intensity audited with **98.97% carbon reduction** (Opt-in for $5,000 Environmentally Impactful prize!).
- **License**: [MIT License](file:///d:/devpost%20begin/LICENSE)
- **Devpost Submission Guide**: [devpost/gitlab-transcend-submission.md](file:///d:/devpost%20begin/devpost/gitlab-transcend-submission.md)

---

## 🚨 The Problem

Traveling to world capitals like Rome and Paris can be exhilarating, but for first-time or solo travelers, it is often fraught with anxiety:
1. **Rampant Tourist Traps & Street Scams**: Friendship bracelet ambushes at the Colosseum, deaf-mute fake petition touts at Notre-Dame, rigged three-card monte games, and inflated bills.
2. **Confusing Municipal Rules & Steep Fines**: Eating near historic monuments or rolling luggage down heritage steps can trigger fines between €150 and €500.
3. **Ghosting & Payment Insecurity**: Travelers hesitate to hire local guides online for fear of unverified hosts, no-shows, or scam payment links. Conversely, honest local guides fear cancellations without pay.

---

## 💡 The Solution

**Local Guide Connect (TRAVGOD)** bridges this gap by unifying street-level interactive intelligence, verified local residents, and bulletproof **PayPal Escrow Protection**:

- 🛡️ **Value Before Payment**: Tourists can explore sourced municipal rules, scam hotspots, and fair local prices *before* spending a single euro.
- 🧑‍🤝‍🧑 **Verified Local Guides**: Meet vetted neighborhood locals with transparent trust badges, authentic reviews, and free bilingual chat with AI translation.
- 💳 **PayPal Sandbox Escrow**: Payments remain safely locked in escrow and are released to the guide **only after** an in-person, GPS-verified check-in on tour day. Zero risk of ghosting for either party.
- 🔬 **Deterministic Safety Audit Engine**: Evaluates itineraries across 5 core risk pillars (Scam Density, Night Caution, Crowd Pressure, Local Rules Friction, Logistics Friction).

---

## 🔑 Key Features & Architecture

### 1. Dual Flagship Knowledge Hubs (`/d/rome`, `/d/paris`)
- **7 Comprehensive Hub Tabs**:
  - 🧑‍🤝‍🧑 **Guides**: Filterable local guide directory with AI LocalMatch recommendations.
  - 🌟 **Overview**: City highlights, rapid safety summaries, and seasonal guidance.
  - ⚖️ **Rules & Laws**: Official municipal decrees, prohibited actions, fines (€100–€500), and official citations.
  - 🛡️ **Scam Radar (ScamSense)**: Geotagged scam alerts, exact modus operandi, and live AI Threat Analyzer.
  - 🏷️ **Fair Prices**: Transparent benchmarks comparing tourist-trap prices against authentic local rates.
  - 🏛️ **Hidden Spots**: Off-the-beaten-path gems submitted by locals.
  - 🚑 **Emergency Contacts**: One-tap access to emergency numbers, tourist police, English-speaking clinics, and embassies.

### 2. Interactive Map (Leaflet + CARTO Voyager Basemaps)
- High-contrast, clean CARTO Voyager raster tiles.
- Interactive category filter pills: `All`, `Guides`, `Food`, `Attractions`, `Safety Hotspots`.
- Custom guide photo pins and pulsating warning pins for high-risk scam zones.
- 1-click smooth fly-to navigation linking sidebar cards directly to coordinates on the map.

### 3. Verified Local Guide Marketplace & Bilingual AI Chat
- 6 seeded local guide profiles for Rome and Paris with verified tiers:
  - `ID Reviewed` (Level 1)
  - `Identity Matched` (Level 2)
  - `Local Legend` (Top Rated, 25+ tours)
- **Free In-App Chat**: Simulated bilingual conversation with instant AI Translation Toggle between Italian/French and English.

### 4. PayPal Sandbox Escrow Protection Flow (`/checkout`, `/trips`)
The platform implements a multi-stage escrow lifecycle guaranteeing mutual safety:
```
[ 1. Pending Payment ]
       ↓
[ 2. Paid in Escrow (Held safely by PayPal) ]
       ↓
[ 3. In-Person Tour Check-In (GPS Verified) ]
       ↓
[ 4. Escrow Released (88% to Local Guide / 12% Platform Fee) ]
```
- Fully integrated with the official **PayPal JavaScript SDK** (`window.paypal.Buttons`) for sandbox test payments, accompanied by a 1-click Instant Payment option for rapid hackathon grading.
- Live dispute / escrow hold buttons allow travelers to freeze funds if an issue arises.

### 5. AI Safety Itinerary Planner & 300m Fraud Radar (`/trips`)
- Curated 3-day itineraries for Rome and Paris tailored to the traveler's **Travel DNA** (Interests, Pace, Budget).
- Automated **300m Fraud Radar Geofence**: Automatically surfaces warning badges on itinerary stops located within 300 meters of known scam hotspots.
- **Qloo Taste AI™**: Personalization tags explaining cultural affinity and authenticity scores.
- Real-time itinerary completion tracker with interactive "Mark Visited" checkboxes.

### 6. Deterministic Safety Audit Engine (`src/utils/safetyAudit.js`)
- An algorithmic rule engine inspired by flight safety audits:
  - Evaluates schedules against 5 pillars: Scam exposure, time-of-day risks, crowd density, rule violations, and logistical walking feasibility.
  - Computes a mean risk index (0–100) and awards an Audit Grade (`Grade A: Fully Verified` vs `Violations Detected`).

### 7. Become a Local & Host Application Wizard (`/become-a-local`)
- Empowers neighborhood residents to monetize their local passion legitimately.
- Includes a mandatory 5-question **Safety & Code of Ethics Training Quiz**.
- Unlocks the **Host Dashboard** (`/host`) with availability calendar, upcoming reservations, and earnings analytics.

---

## 🤖 GitLab Duo Autonomous DevSecOps Lifecycle (Life After Code)

TravGOD features an end-to-end, multi-agent post-code automation engine running natively on GitLab CI/CD, orchestrated by the **GitLab Duo Agent Platform**:

```
[ Git Commit / MR ]
       │
       ▼
 [ 1. PLAN ] ───► GitLab Duo Plan Sentinel (Triage, Blast Radius, PRD alignment)
       │
       ▼
 [ 2. CREATE ] ──► Duo Code Reviewer Agent & Syntax Validator
       │
       ▼
 [ 3. VERIFY ] ──► Unit Testing & Deterministic Safety Engine Verification
       │
       ▼
 [ 4. PACKAGE ] ─► Optimized Vite 5 Bundle Packaging
       │
       ▼
 [ 5. SECURE ] ──► Duo Security Remediation Agent (Secret Detection, SAST, CVEs)
       │
       ▼
 [ 6. RELEASE ] ─► Autonomous Semantic Release Notes & Changelog Generation
       │
       ▼
 [ 7. CONFIGURE ]► Environment Drift Sentinel & Secret Fallback Auditing
       │
       ▼
 [ 8. MONITOR ] ─► Synthetic Route Latency Simulation & Web Performance Budgets
       │
       ▼
 [ 9. GOVERN ] ──► Green SCI Carbon Audit (ISO/IEC 21031) & MIT License Verification
       │
       ▼
 [ 10. DEPLOY ] ─► Automated Production Hosting on GitLab Pages
```

### 📋 DevSecOps Stages Breakdown

| Stage | CI Job | Agent Role | Output Artifact |
|---|---|---|---|
| **1. PLAN** | `ai_plan_triage` | Analyzes commit & MR diffs, classifies changes into DevSecOps stages, evaluates blast radius. | `ci-artifacts/plan-triage-summary.md` |
| **2. CREATE** | `duo_code_review` & `code_lint` | Enforces coding standards, checks escrow state transitions, validates JS/JSON syntax. | `ci-artifacts/code-review-report.md` |
| **3. VERIFY** | `unit_tests` | Executes automated Node test runner for geodesic distance and safety audits. | Test execution logs |
| **4. PACKAGE** | `package_build` | Vite 5 tree-shaken static production bundling into `dist/`. | `dist/` |
| **5. SECURE** | `duo_security_remediation` | Secret detection, SAST eval inspection, dependency CVE audit, and patch generation. | `ci-artifacts/security-remediation-report.md` |
| **6. RELEASE** | `ai_semantic_release` | Autonomous semantic changelog and structured AI release notes compiler. | `ci-artifacts/release-notes.md` |
| **7. CONFIGURE** | `config_drift_check` | Configuration drift sentinel verifying environment schemas and secret fallbacks. | Configuration validation logs |
| **8. MONITOR** | `synthetic_health_check` | Synthetic route latency simulation (100% SLA) and Web Performance Budget enforcement. | `ci-artifacts/health-monitor-report.md` |
| **9. GOVERN** | `green_sci_carbon_audit` & `license_compliance` | ISO/IEC 21031 Software Carbon Intensity scoring and 100% MIT License verification. | `ci-artifacts/green-sci-report.md` & `ci-artifacts/sustainability-badge.json` |

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core** | Vanilla JavaScript (ES Modules), HTML5 Semantic Structure |
| **Styling** | Modern Vanilla CSS, Glassmorphism, CSS Custom Properties, Plus Jakarta Sans typography |
| **Bundler & Dev Server** | Vite 5 |
| **Mapping Engine** | Leaflet.js with CARTO Voyager Raster Tiles (`cb1_4hsg_1_984483a4175c34d8b6e7d692`) |
| **Payments & Escrow** | PayPal JavaScript SDK (Sandbox Mode, Client `sb`) |
| **AI / Personalization** | Qloo Taste AI™ API (`hackathon.api.qloo.com`), Deterministic Safety Audit Engine |
| **Icons** | Lucide Icons |
| **Data Persistence** | Browser `localStorage` abstraction layer (`src/utils/storage.js`) |

---

## 🚀 Running the Project Locally

Follow these quick steps to run the project in your local development environment:

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (comes with Node.js)

### 1. Clone the repository
```bash
git clone https://github.com/yashhhYB/TravGOD.git
cd TravGOD
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser at the local URL (usually `http://localhost:5173`).

### 4. Build for production (Optional)
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory.

---

## 📁 Repository Structure

```
├── devpost/                    # Hackathon planning & verification artifacts
│   ├── scope.md                # Vertical slice boundary & kernel definition
│   ├── prd.md                  # Complete product requirements & user journey
│   ├── spec.md                 # Technical blueprint & component architecture
│   ├── checklist.md            # Sliced build checklist (100% completed)
│   └── app-map.html            # Interactive application architecture map
├── src/
│   ├── components/             # Reusable UI view components
│   │   ├── AppHeader.js        # Standard 72px persistent header & auth state
│   │   ├── LandingView.js      # Hero landing page & destination selector
│   │   ├── DashboardView.js    # 7-tab city knowledge hub (Paris & Rome)
│   │   ├── ExploreView.js      # Interactive map view with CARTO Voyager basemap
│   │   ├── GuideDirectory.js   # Local guide marketplace & AI LocalMatch
│   │   ├── ChatWindow.js       # Free bilingual chat with AI translation
│   │   ├── PayPalModal.js      # PayPal Sandbox Escrow booking modal
│   │   ├── MyTrips.js          # Escrow lifecycle command center & itinerary
│   │   ├── BecomeLocalView.js  # Host application wizard & safety quiz
│   │   ├── HostDashboardView.js# Host calendar & payout management
│   │   ├── SignInModal.js      # Demo login & role selection modal
│   │   └── OnboardingModal.js  # 60-second Travel DNA configuration
│   ├── data/                   # Verified datasets for Rome and Paris
│   │   ├── destinations.js     # City metadata & high-level stats
│   │   ├── guides.js           # Verified local guide profiles
│   │   ├── mockData.js         # Comprehensive safety, rules, & price benchmarks
│   │   └── cityData.js         # City places & coordinate catalogs
│   ├── services/               # API service wrappers (Qloo Taste AI, Google Maps)
│   ├── utils/                  # Core algorithms (Safety Audit, Storage, Roles)
│   ├── styles/main.css         # Design system, themes, and animations
│   └── main.js                 # Client-side router and view controller
├── index.html                  # HTML entry point with SDK inclusions
├── package.json                # Project scripts and dependencies
└── vite.config.js              # Vite configuration
```

---

## 🔒 Security & Privacy Notice
- Sensitive personal learning files (`devpost/learner-profile.md`) and `.env` files are strictly excluded via `.gitignore`.
- All financial transactions use PayPal Sandbox test environments; no live credentials or real funds are handled.
- Seeded guide profiles are labeled demo profiles with public meeting hubs only (no private residential addresses).

---

## 🏆 Hackathon Credits & Authorship
- **Author**: Yash B.
- **Track**: Devpost Build With AI: Basics & PayPal Hackathon
- **License**: MIT
