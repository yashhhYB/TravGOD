---
doc: checklist
status: approved
---

# Local Guide Connect (v3) — Sliced Build Checklist
Architecture: Dual Flagship Destinations (Paris 🇫🇷 & Rome 🇮🇹) with CARTO Voyager Basemaps

Build Mode: Learn & Verify (Local only — no remote pushes)

## Slices

- [x] **1. Sign In & Onboarding Flow (`/signin`, `/onboarding`)**
  - **Becomes usable**: Traveler can click "Sign In", choose Google demo profile or custom role (Traveler vs. Local Guide), select languages, and complete 60-second Travel DNA (Interests, Pace, Budget). Preferences persist in `localStorage` and dynamic header shows user avatar and role badge.
  - **Why now**: Foundation for personalizing the entire app. Establishes user identity and Travel DNA before exploring.
  - **Verification**: Complete onboarding ➔ check `localStorage` contains `travgod_user` and `travgod_travel_dna` ➔ header updates.

- [x] **2. Dual Knowledge Hubs: Paris 🇫🇷 & Rome 🇮🇹 (`/d/paris`, `/d/rome`)**
  - **Becomes usable**: Unified, standard, clean dashboard with 7 comprehensive tabs: 🧑‍🤝‍🧑 Guides (with AI LocalMatch & integrated Become a Local application), 🌟 Overview, ⚖️ Rules & Laws (fines & official citations), 🛡️ Scam Radar (ScamSense with live AI threat analyzer), 🏷️ Fair Prices (tourist vs local rates, rent, coffee, transit), 🏛️ Hidden Spots, and 🚑 Emergency contacts.
  - **Why now**: Fulfills the "Value before payment" principle and powers the safety layer before map interactions.
  - **Verification**: Navigate to `/d/paris` and `/d/rome` ➔ verify all 7 tabs load with hand-checked data, fines, and official citations.

- [x] **3. Interactive Map (Leaflet + CARTO Voyager Basemaps)**
  - **Becomes usable**: Interactive map powered by CARTO Voyager raster tiles (`cb1_4hsg_1_984483a4175c34d8b6e7d692`), category filter pills (All, Guides, Food, Attractions, Safety), custom photo markers for local guides, warning markers for scam hotspots, and 1-click smooth fly-to navigation from sidebar cards.
  - **Why now**: The central exploration signature screen of the platform.
  - **Verification**: Open `/explore` ➔ toggle filters ➔ test marker popups ➔ test "Show on Map" from any guide, hidden spot, or scam card.

- [x] **4. Rome Verified Local Guides & Free Chat (`/locals`, `/inbox`)**
  - **Becomes usable**: Filterable directory of 6 demo Rome local guides with verification badges (ID Reviewed, Identity Matched, Local Legend), languages, rates, reviews from confirmed check-ins, and free chat window with simulated bilingual replies and AI translation toggle.
  - **Why now**: The core human connection of Local Guide Connect.
  - **Verification**: Filter guides by language ➔ open chat with Marco ➔ send message ➔ receive Italian reply ➔ toggle translation ➔ verify English translation.

- [x] **5. Become a Local & Host Application Wizard (`/become-a-local`, `/host`)**
  - **Becomes usable**: Complete host application wizard (Bio, languages, experience builder, verification upload simulation, and 5-question Safety Training Quiz). Upon passing, user unlocks Host Dashboard with calendar availability, upcoming bookings, and hidden spot manager.
  - **Why now**: Closes the bilateral marketplace loop for locals.
  - **Verification**: Apply as local ➔ complete safety quiz ➔ reach Host Dashboard ➔ toggle availability.

- [x] **6. AI Rome Trip Planner (`/trips`)**
  - **Becomes usable**: Generates a safety-aware day-by-day Rome itinerary based on Travel DNA. Each stop shows arrival time, visit duration, walking distance from previous stop, scam alerts within 300m, and Qloo taste match reason.
  - **Why now**: Turns discovery into an actionable, safety-aware daily plan.
  - **Verification**: Open Trips ➔ review day-by-day stops ➔ verify 300m scam warning badge on Colosseum stop.

- [x] **7. PayPal Sandbox Escrow Booking & Check-In Flow (`/checkout`, `/bookings`)**
  - **Becomes usable**: Book a guide experience via PayPal Sandbox modal. Lifecycle states: `pending_payment` ➔ `paid (held in escrow)` ➔ `checked_in` ➔ `released (payout minus fee)`. Bookings page tracks status and issue reporting.
  - **Why now**: Completes the core transaction and hackathon sponsor requirement.
  - **Verification**: Book experience ➔ approve PayPal sandbox payment ➔ verify booking saved with `paid (held)` status ➔ click Check-in ➔ confirm payout release.

## Hands-on Checkpoints

- [x] Early usable behavior explored — verified interactive map, verified local guide directory, and AI LocalMatch.
- [x] Final kick-the-tires exploration and feedback completed — after all 7 slices: tested dual city hubs (Rome & Paris), Scam Radar with AI threat analyzer, PayPal Sandbox Escrow Booking, In-Person Check-In, and Escrow Payout Release.

## Final Review

- [x] Final review complete — feedback resolved, deterministic safety audit passed, and ready to ship.

## Code Tour and App Map

- [x] Learning activity complete — verified end-to-end PayPal Sandbox Escrow lifecycle and Safety Audit Engine recap.
- [x] Optional edit and transfer reflection addressed — verified escrow check-in flow and local guide payout release.
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded architecture.

Activity and evidence: Verified end-to-end PayPal Sandbox Escrow lifecycle (Pending -> Paid held in escrow -> In-Person Check-In -> Released Payout) and Safety Audit Engine.
Route and stops: GuideDirectory.js -> PayPalModal.js (onApprove/Instant Pay) -> MyTrips.js (Check-in & Escrow Payout release) -> safetyAudit.js.
Activity mode: recap

