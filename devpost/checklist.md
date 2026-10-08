---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Project scaffolded and landing page renders**
  Becomes usable: Running app at `http://localhost:5173` showing the TRAVGOD hero landing page — dark background, search bar ("Where are you going?"), destination chips (Paris, Tokyo, Cairo, Barcelona, Dubai), and full design system (colors, fonts, glassmorphism).
  Why now: Everything else has somewhere to land. Bootstrapping, Vite config, CSS design system, and the first visible screen all live here. Confirms the whole toolchain works before building features.
  PRD ref: `prd.md > 1. Landing Page & Destination Search`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Look and Feel`
  Build: Scaffold the full file structure per spec. Install Vite. Write `index.html`, `src/main.js`, and `src/styles/main.css` with design tokens (dark palette, glassmorphism, Plus Jakarta Sans). Build LandingView with hero search bar and destination chip cards.
  Verify (mechanical): `npm run dev` starts without errors; browser opens to dark landing page showing hero search bar and all five destination chips.
  Learner check: Open `http://localhost:5173` — does the landing page look premium and match the Stripe/Airbnb visual feel we described?
  Commit: `feat: scaffold project and render landing page`

- [x] **2. Destination dashboard with interactive Leaflet map**
  Becomes usable: Clicking a destination chip (e.g. Paris) opens the full Destination Dashboard with a live dark-themed interactive Leaflet map centered on that city, with category filter toggles (All, Guides, Food, Attractions, Safety) and the dashboard header.
  Why now: The map is the kernel of TRAVGOD. Proving it works early — with real Leaflet tiles and click interaction — eliminates the biggest technical risk before building any other feature around it.
  PRD ref: `prd.md > 2. Map-First Destination Dashboard`
  Spec ref: `spec.md > 2. MapViewer Component`, `spec.md > External Services and Dependencies`
  Build: Install Leaflet. Build `MapViewer.js` with CartoDB Dark Matter tile layer. Load destination coordinates from `src/data/destinations.js`. Render category filter pills. Wire destination chip clicks in `main.js` to swap the Landing view for the Dashboard view.
  Verify (mechanical): Click "Paris" chip → dashboard renders; Leaflet map loads dark tiles centered on Paris; category filter pills are visible and clickable.
  Learner check: Click Paris, then try each category filter toggle. Does the map feel alive and responsive? (This is the Leaflet marker hook in action — we'll look at the code together after.)
  Commit: `feat: destination dashboard with interactive Leaflet map`

- [x] **3. Guide markers on map and guide directory with AI LocalMatch**
  Becomes usable: Verified guide markers appear on the Paris map. The guide directory panel shows filterable guide cards (photo, name, languages, rate, Verified badge, match %). The AI LocalMatch widget computes and displays ranked match scores with plain-language explanations.
  Why now: This is the other half of the unique kernel — connecting tourists with verified locals. The AI match algorithm is one of the three concepts to deeply understand; building it here, before payment, lets us see it clearly.
  PRD ref: `prd.md > 4. Verified Local Guides Directory & AI LocalMatch`
  Spec ref: `spec.md > 4. VerifiedGuidesDirectory Component`, `spec.md > 5. AILocalMatchWidget Component`, `spec.md > Data Model`
  Build: Populate `src/data/guides.js` with 6 seeded Paris guide profiles. Build `GuideDirectory.js` with language/price filter controls. Build `AIMatch.js` with preference inputs. Write `src/utils/aiMatch.js` — `calculateMatch(userPrefs, guide)` with weighted language (40%), interest (35%), budget (25%) scoring. Add guide markers to Leaflet map (clicking a marker highlights their guide card). Build `src/utils/storage.js` for localStorage helpers.
  Verify (mechanical): Guide cards render; language filter narrows the list correctly; entering preferences and running AI LocalMatch re-ranks cards by percentage; map markers are visible and clicking one scrolls to/highlights its card.
  Learner check: Set your preferences to English + €20-€40/hr + food & vintage markets and run AI LocalMatch. Does Alexandre show as the top match with a clear explanation of why?
  Commit: `feat: guide directory, map markers, and AI LocalMatch engine`

- [x] **4. ScamSense panel with scam cards and price comparison guides**
  Becomes usable: The ScamSense section on the dashboard shows Paris scam alert cards (scam type, location, red flags, prevention tip) and a Fair Price Guide widget comparing tourist trap prices to fair local ranges.
  Why now: ScamSense is the safety pillar of TRAVGOD's value proposition. It can be built independently of payment/chat and verified quickly against seeded data.
  PRD ref: `prd.md > 3. Safety & ScamSense Hub + Price Guidance`
  Spec ref: `spec.md > 3. ScamSensePanel Component`
  Build: Populate `src/data/scams.js` with 5 Paris scam alerts and 8 price comparison items. Build `ScamSense.js` rendering scam cards with risk-level color coding (amber for medium, rose for high) and a price comparison table (Tourist Price vs Fair Local Price).
  Verify (mechanical): ScamSense section renders all scam cards with correct risk colors and all price rows with both price columns populated.
  Learner check: Scroll through the ScamSense section. Do the scam warnings feel realistic and clear? Does the price comparison make the tourist vs. local difference obvious at a glance?
  Commit: `feat: ScamSense scam alert cards and fair price guide`

- [ ] **5. Free chat window with AI translation toggle**
  Becomes usable: Clicking "Free Chat" on a guide card opens a chat window. Tourist can send messages and receive simulated guide responses. An AI translation toggle switches incoming messages between the guide's language and English.
  Why now: Chat is required for the core journey before booking (tourists consult, then commit). Simulated responses keep this buildable without a real backend, keeping it in scope.
  PRD ref: `prd.md > 5. Interactive Chat & AI Translation`
  Spec ref: `spec.md > 6. ChatContainer Component`
  Build: Build `Chat.js` with message thread UI, input bar, send button, and auto-scroll. Add simulated guide responses (array of canned replies tied to keywords). Implement translation toggle: stores original message text and a mock-translated version, toggling between them. Wire "Free Chat" button on guide cards to open chat panel.
  Verify (mechanical): Click "Free Chat" on Alexandre's card → chat opens; type a message → send → simulated response appears; click translation toggle → message text changes; toggle back → original text returns.
  Learner check: Start a chat with a guide and try the translation toggle. Does the conversation feel natural? Does it clearly label when a message has been translated?
  Commit: `feat: free chat window with AI translation toggle`

- [ ] **6. PayPal Sandbox booking flow and Booking Confirmed state**
  Becomes usable: Clicking "Book Guide — $25/hr" opens a Booking Summary modal with date/time selection and itemized cost. The PayPal Sandbox button renders and processes a test payment. On completion, the screen transitions to a Booking Confirmed card with reference ID, guide info, and action buttons (Open Chat, View Booking, Add to Calendar). The booking saves to `localStorage`.
  Why now: This is the final major feature and the PayPal callback is the third deep-dive concept. It completes the full core journey end-to-end.
  PRD ref: `prd.md > 6. PayPal Booking & Trip Management`
  Spec ref: `spec.md > 7. PayPalCheckoutModal Component`, `spec.md > External Services and Dependencies`
  Build: Build `PayPalModal.js` with date/time picker, hour selector, itemized price breakdown, and PayPal SDK button container. Load PayPal SDK via `<script src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD">`. Implement `onApprove` callback: generate booking ID (`TG-{random}-PAR`), save to `localStorage` via `storage.js`, render Booking Confirmed view with all fields. Update guide card status to "Booked for [date]".
  Verify (mechanical): Click "Book Guide" → modal opens with correct price math; PayPal button renders; complete sandbox payment → Booking Confirmed card appears with a valid reference ID; check `localStorage` in browser DevTools → booking object is saved correctly.
  Learner check: Complete the full Paris booking flow. When the Booking Confirmed screen appears, what happens in the code? (We'll trace the `onApprove` callback path through to the UI update together.)
  Commit: `feat: PayPal sandbox booking flow and Booking Confirmed state`

- [ ] **7. My Trips panel and empty-state fallbacks**
  Becomes usable: My Trips panel reads confirmed bookings from `localStorage` and displays them with status badges (Confirmed, Upcoming). Empty states render correctly when no guides match the active language filter. Guide slot-unavailable state shows a friendly message with alternatives.
  Why now: This finishes the full lifecycle and ensures the app handles edge cases gracefully, making the demo feel like a real product rather than a happy-path prototype.
  PRD ref: `prd.md > 6. PayPal Booking & Trip Management`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > 8. MyTripsPanel Component`, `spec.md > Important Failure Modes`
  Build: Build `MyTrips.js` reading from `localStorage` and rendering booking cards with status chips. Wire "My Trips" nav link to show the panel. Add empty-state UI to the guide directory for zero-match filters ("No verified Icelandic-speaking guides in Paris — showing 12 English-speaking guides instead"). Add slot-conflict guard on booking open (check if guide already has a confirmed booking for the selected date).
  Verify (mechanical): After a completed booking, navigate to My Trips → booking appears with "Confirmed" badge; filter guides by "Icelandic" → friendly empty state renders with English-guide fallback count.
  Learner check: Navigate to My Trips and verify your Paris booking is there. Then filter guides by a language with no matches and confirm the fallback message appears.
  Commit: `feat: My Trips panel, booking lifecycle, and empty-state fallbacks`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after Slice 3 (map + guides + AI LocalMatch complete): tourist can discover Paris, explore the map, and run AI LocalMatch to find their best guide.
- [ ] Final kick-the-tires exploration and feedback completed — after all slices, before submission.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
- [Redesigned UI] — [learner requested a light theme with video background and Airbnb-style white sections, overwriting the initial dark premium design].
