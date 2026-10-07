---
doc: prd
status: approved
---

# TRAVGOD — Product Requirements

TRAVGOD is a destination discovery, travel safety, trusted-local matching, and booking platform enabling tourists to explore cities safely, avoid scams with price transparency, and connect with background-verified local guides.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

## The Core Journey

The end-to-end user path follows a simple, seamless 10-step flow:
1. **Landing Page Arrival**: Tourist arrives at TRAVGOD landing page featuring a prominent destination search bar (*"Where are you going?"*) and popular city chips (Paris, Tokyo, Cairo, Barcelona, Dubai).
2. **Destination Selection**: Tourist selects or searches a city (e.g., **Paris**).
3. **Map-First Dashboard**: TRAVGOD opens the Paris Destination Dashboard featuring an interactive map displaying attractions, food, safety/scam zones, and verified local guide locations.
4. **ScamSense & Price Check**: Tourist views curated scam alert cards (scam type, location, red flags, prevention) and realistic local price guidance (e.g. food/clothing/transport tourist prices vs. fair local ranges).
5. **Guide Discovery & AI LocalMatch**: Tourist filters guides by language (e.g. English + Spanish) or uses **AI LocalMatch** by entering preferences (budget, interests, schedule) to receive ranked guide recommendations with match percentages and explanations.
6. **Free Chat / Consultation**: Tourist opens a **Free Chat** directly with a guide (e.g. Alex) to ask questions with optional AI-assisted translation.
7. **Initiate Booking**: Tourist clicks *"Book Guide — $25/hr"*, opening a detailed Booking Summary screen showing total cost, duration, date, time, and guide verification status.
8. **PayPal Checkout**: Tourist completes payment using the integrated PayPal Sandbox checkout modal.
9. **Booking Confirmed**: Screen immediately transitions to a **Booking Confirmed** state displaying reference ID, payment success status, meeting details, and next action buttons (*"Open Chat"*, *"View Booking"*, *"Add to My Trip"*).
10. **My Trips Management**: The booking is saved to **My Bookings / My Trips** lifecycle tracker (Confirmed / Upcoming / Completed).

## Screens and Layout

TRAVGOD features 4 main responsive view surfaces with smooth tab/modal transitions:
1. **Landing / Discovery Screen**:
   - Hero banner with headline & value proposition.
   - Prominent search input with auto-suggestions.
   - Quick-select destination cards/chips (Paris, Tokyo, Cairo, etc.).
   - Trust indicators & feature highlights.
2. **Interactive Destination Dashboard (Command Center)**:
   - **Header & Navigation**: Destination search, city selector, My Trips link.
   - **Central Interactive Map**: Category filter toggles (*All, Guides, Hotels, Food, Attractions, Safety*). Clickable map markers opening interactive location popups.
   - **Safety & ScamSense Panel**: Scam alert cards and local price comparison widgets.
   - **Verified Guides Directory & AI LocalMatch Widget**: Filterable grid of guide cards + AI matching preferences box.
3. **Free Chat & Messaging Surface**:
   - Tourist-guide conversation container with timestamped messages.
   - AI Translation Toggle (*"Translate to my language"* / *"View original"*).
   - Embedded link to active or pending guide booking.
4. **Booking Summary & PayPal Checkout Modal / Screen**:
   - Itemized booking cost summary ($25/hr × hours + service fee = Total).
   - Native PayPal Sandbox checkout container.
   - **Booking Confirmed Confirmation Card** with instant status update.

## Look and Feel

- **Visual Style**: Premium modern travel platform combining the visual sophistication of Stripe/Linear with the discovery energy of Airbnb.
- **Color Palette**: Clean dark mode with deep navy (`#0a0f1d`) and charcoal card backgrounds (`rgba(18, 26, 47, 0.75)`), vibrant cyan-blue (`#06b6d4` / `#3b82f6`) primary accents, emerald green (`#10b981`) for verification & success, and amber/rose for scam alerts.
- **Glassmorphic UI**: Subtle border highlights (`rgba(255, 255, 255, 0.08)`), backdrop blur effects, high-contrast typography using *Plus Jakarta Sans* or *Inter*.
- **Trust Elements**: Glowing green **"Verified Local"** / **"Identity Verified"** badges, star ratings, scam warning cards with clear iconography.

## Features and Behavior

### 1. Landing Page & Destination Search
Source: `scope.md > The Core Loop`
- User enters text in the search input or clicks a quick-select chip (e.g. *Paris*).
- Clicking a city instantly routes to the interactive Paris Destination Dashboard without page reloads.

### 2. Map-First Destination Dashboard
Source: `scope.md > What "Working" Looks Like`
- Interactive map renders markers for Attractions, Food, Safety Alerts, and Local Guides.
- Category pills (*All, Guides, Hotels, Food, Attractions, Safety*) filter map markers dynamically.
- Clicking a marker displays a compact info card with photo, title, details, and action button.

### 3. Safety & ScamSense Hub + Price Guidance
Source: `scope.md > The Unique Kernel`
- **Scam Cards**: Displays common scams in Paris (e.g. *Sacré-Cœur String Scam*, *Gold Ring Distraction*), explaining red flags, locations, and how to avoid them.
- **Fair Price Range Guide**: Displays realistic price comparisons for common tourist expenses (e.g. Taxi from CDG Airport: Tourist Trap €120 vs Fair Local €55–€65; Street Crepe: €3–€5; Vintage Jacket: €20–€40).

### 4. Verified Local Guides Directory & AI LocalMatch
Source: `scope.md > The POC Boundary`
- **Guide Card**: Shows photo, name, languages spoken (e.g., *English, French, Spanish*), bio/expertise, star rating (e.g., 4.9 ★), reviews count, hourly rate ($25/hr), and **"Verified Local"** badge.
- **Filter Controls**: Filter by language, max hourly rate, rating, and availability.
- **AI LocalMatch**: User selects preferences (e.g., *Interest: Food & Vintage Markets, Language: English, Budget: $20-$40/hr*). Algorithm ranks guides with match score (e.g., *"Alex — 96% Match"*) and an explicit explanation breakdown (*"Matches your interest in vintage fashion, speaks fluent English, within your $30 budget"*).

### 5. Interactive Chat & AI Translation
Source: `scope.md > The POC Boundary`
- Clicking **"Free Chat"** opens direct messaging with the selected guide.
- Includes pre-populated quick prompt chips (*"Are vintage markets open on Sundays?"*, *"Is late night metro safe around Pigalle?"*).
- Features an AI translation toggle for multilingual messaging with *"Show Original"* option.

### 6. PayPal Booking & Trip Management
Source: `scope.md > The POC Boundary`
- Clicking **"Book Guide — $25/hr"** opens the Booking Summary modal.
- User selects date, start time, and duration (e.g. 2 hours).
- Renders the PayPal Sandbox button. Upon successful authorization:
  1. Displays **Booking Confirmed** screen with Reference # (e.g. `RM-89421-PAR`).
  2. Updates guide status badge to **"Booked for Oct 12"**.
  3. Saves trip into **My Trips** tab with status `Confirmed`.
  4. Provides quick action buttons (*"Open Chat"*, *"View Booking"*, *"Add to Calendar"*).

## States and Boundaries

- **Normal State**: Active dashboard with map, loaded guide list, scam cards, and chat/booking modals.
- **Empty / No Match State (Language Filter)**:
  - If a user filters by an unavailable language (e.g. *Icelandic* in Paris):
  - Displays: *"No verified Icelandic-speaking guides currently available in Paris."*
  - Provides recovery actions: *"Show all verified guides (12 speaking English)"*, *"Try another language"*, *"Notify me"*.
- **Booking Success State**: Immediate transition to verified purchase receipt card with booking reference.
- **Guide Slot Unavailable State**: Prevents duplicate bookings with notification: *"This time slot has just been reserved. Please select another time."*

## Product Decisions

- **Combined Map & Dashboard**: Placed interactive map, scam alerts, and guide directory on a unified command dashboard rather than separate isolated pages.
- **Free Chat Before Booking**: Included free pre-booking chat to build trust between tourist and local before financial commitment.
- **Realistic Mock Verification**: Used "Identity Verified" badges backed by mock ID verification to ensure fast, safe PoC demonstration.
- **PayPal Sandbox Checkout**: Integrated native PayPal checkout component for realistic payment flow.

## What We're Building

- Landing Page with destination search & quick city chips.
- Interactive Map-First Dashboard for Paris (Attractions, Food, Safety, Guides).
- Safety & ScamSense Panel with common scam cards & local price comparison guides.
- Verified Guide Directory with language filtering & AI LocalMatch score widget.
- Free Tourist-Guide Chat window with AI translation toggle.
- Booking Summary & PayPal Sandbox Checkout integration.
- Booking Confirmed state & My Trips management panel.
- No Match / Edge case fallback screens.

## Deferred From the POC

- Real government ID document upload & OCR API verification pipeline.
- Live multi-user WebSocket backend for instant cross-device messaging.
- Multi-currency automatic conversion API.

## Possible Later Enhancements

- Real-time video/audio call consultation mode.
- Interactive audio tour guide recording uploads from verified locals.

## Non-Goals

- Full peer-to-peer payout escrow accounting system (handled via standard PayPal Sandbox).
- Global vehicle rental / flight booking booking engines.

## Open Questions

None currently. All product requirements defined and scoped for hackathon PoC delivery.
