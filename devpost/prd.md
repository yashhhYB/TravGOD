---
doc: prd
status: approved
---

# Local Guide Connect — Product Requirements Document (v3)

Tagline: Travel safer. Connect real.

## 1. Product Overview & The 5 Pillars
Local Guide Connect is an end-to-end travel platform built around five core pillars:
1. **Interactive Map**: Google Maps Platform with street-level view, 3D tilt, nearby essentials, hidden spots, and geofenced Scam Radar.
2. **Rules & Laws ("Know Before You Go")**: Plain-language legal guides with severity badges, fines, source links, and last-verified dates.
3. **Scam Radar & Shield**: Curated hotspots, fair price benchmarks, and an AI risk checker with citations.
4. **Verified Local Guides**: Transparently reviewed local guides bookable with PayPal escrow payment protection.
5. **Safety-Aware Trip Planning**: AI day-by-day itinerary with walking routes, scam warnings within 300m, and Qloo taste recommendations.

## 2. Core User Journey (Rome Deep Slice)
1. **Landing & Onboarding**: Traveler or Local signs in via demo Google Auth, selects role, primary languages, and completes 60-second Travel DNA (interests, pace, budget).
2. **Rome Destination Hub (`/d/rome`)**: Traveler views Rome's weather, currency calculator, safety snapshot, and quick-links to Rules, Scams, Prices, and Guides.
3. **Explore Map (`/explore`)**: Traveler explores Rome with interactive layer toggles (Places, Hidden Spots, Guide Hubs, Scam Radar). Clicking a pin displays preview card, distance, and 1-click Street View.
4. **Legal & Price Check**: Traveler reviews 12 hand-checked Rome laws (eating on monument steps fines, night drinking bans) and fair prices (airport taxi fixed fare €50, coffee €1.30).
5. **Local Guide Connection**: Traveler filters Rome guides (e.g., Marco, Sofia) by language, views verification level, initiates free chat with translation, or books an experience.
6. **PayPal Escrow Checkout**: Traveler selects time slot, reviews price breakdown, and completes sandbox PayPal payment (`paid, held by platform`).
7. **Trip Workspace**: Traveler builds or reviews day-by-day Rome itinerary with real route times and scam alerts.
8. **Become a Local (`/become-a-local/apply`)**: Resident applies via 5-step wizard (story, languages, experience, verification, safety quiz) and accesses Host Dashboard (`/host`).

## 3. Screen Inventory & Requirements

### Screen 1: Sign In & Onboarding (`/signin`, `/onboarding`)
- Google Sign-In demo popup with role toggle (Traveler vs. Local Guide).
- Language picker (primary + secondary).
- Travel DNA cards: Interests (Food, History, Nightlife, Art), Pace (Slow, Balanced, Packed), Budget ($/$$/$$$).
- Optional Emergency Contact for SOS sharing.

### Screen 2: Explore Map & Destination Hub (`/explore`, `/d/rome`)
- Google Maps Platform integration (Roadmap, Satellite/3D tilt, Street View panorama).
- Layer toggles: Places, Hidden Spots, Guide Hubs, Scam Radar.
- Route distance and duration calculation from user location or origin to any landmark.
- Dynamic personalization highlighting spots matching user's Travel DNA.

### Screen 3: Rome Knowledge Hub (Rules, Scams, Prices)
- **Rules (`/d/rome/rules`)**: Severity badges (Info, Careful, Serious), plain-language summary, what to do instead, source URLs, verified dates, and outdated report trigger.
- **Scam Radar (`/d/rome/scams`)**: Hotspots, "How it works", "How to avoid", and interactive AI Scam Checker.
- **Fair Prices (`/d/rome/prices`)**: Item, typical local price in EUR, USD equivalent, and note.

### Screen 4: Verified Local Guides (`/locals`, `/locals/:id`)
- 6 demo Rome profiles (Marco, Sofia, Matteo, Elena, Lorenzo, Giulia).
- Badges: Level 1 (ID Reviewed), Level 2 (Identity Matched), Local Legend (25+ bookings, 4.8★).
- Free in-app chat modal with instant simulated bilingual reply and translation toggle.
- Direct PayPal booking trigger.

### Screen 5: Become a Local & Host Dashboard (`/become-a-local`, `/host`)
- Marketing landing page with earnings breakdown.
- Multi-step application wizard with 5-question Safety Training Quiz.
- Host Dashboard: Upcoming bookings, calendar availability, payout status, and hidden spot manager.

### Screen 6: Trip Planner & Workspace (`/trips`)
- Day-by-day itinerary generator for Rome.
- Route calculation between stops, scam flags within 300m, and Qloo taste affinity tags.

### Screen 7: PayPal Checkout & My Bookings (`/checkout`, `/bookings`)
- PayPal Sandbox order creation and payment capture.
- Escrow lifecycle: `paid (held)` ➔ `checked_in` ➔ `released (payout minus fee)`.
- My Bookings dashboard with check-in, issue reporting, and review release.

## 4. Guardrails & Compliance
- Transparent demo disclaimer: All seeded profiles labeled "Demo profile".
- Non-alarmist safety language with source links and last-verified dates.
- Guidance disclaimer: "Guidance, not legal advice."
- Sensitive data isolation: No home addresses shown on map (approximate public meeting hubs only).
