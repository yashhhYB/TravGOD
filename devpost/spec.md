---
doc: spec
status: approved
---

# TRAVGOD — Technical Spec

## How This Works, In Plain Language

TRAVGOD is built as a fast, responsive Single Page Application (SPA) using **Vite**, **Vanilla JavaScript (ES Modules)**, and **CSS3**. 

Here is how the pieces work together:
- **The Interface (Vite + HTML/CSS)**: Renders a dark-theme UI with glassmorphism cards, cyan-blue accents, and smooth transitions.
- **The Interactive Map (Leaflet.js)**: Renders a dark-style map of selected destinations (like Paris), plotting custom SVG icons for local guides, food, attractions, and scam warning zones. Clicking any marker hooks an event listener that opens a detailed info popup.
- **The AI LocalMatch Engine (`src/utils/aiMatch.js`)**: A scoring algorithm that compares tourist preferences (languages spoken, budget, interests) against guide attributes, calculating weighted match percentages (e.g., 96% Match) with plain-language explanations.
- **Data & Local State (`src/data/` + `localStorage`)**: Seeded datasets supply verified guide profiles, scam cards, and fair pricing guides. User bookings and chat history are saved in `localStorage` so everything persists across refreshes.
- **PayPal Payment Flow (PayPal SDK v6)**: Loads the official PayPal Sandbox checkout button. When the payment completes, the SDK fires an `onApprove` callback that instantly updates local state, generates a booking reference code (`RM-89421-PAR`), and transitions the screen to **Booking Confirmed**.

## The Core Journey Through the System

PRD Reference: `prd.md > The Core Journey`

1. **User Search / Selection**: User types a city name or clicks a quick-select chip (e.g. *Paris*) on the Landing View (`#landing-view`).
2. **Dashboard Initialization**: `app.js` initializes `MapViewer.js` centering Leaflet on Paris coordinates (`[48.8566, 2.3522]`), rendering category markers (Attractions, Food, Guides, Safety).
3. **Exploring ScamSense**: `ScamSensePanel.js` pulls curated scam cards and fair price ranges from `src/data/scams.js`.
4. **Filtering Guides & AI Match**:
   - Selecting language filters updates `VerifiedGuidesDirectory.js`.
   - Running **AI LocalMatch** invokes `calculateMatch(userPrefs, guide)`, sorting guide cards by match percentage.
5. **Free Chat**: Clicking **"Free Chat"** opens `ChatContainer.js` with simulated response messaging and an AI translation toggle (`translateMessage()`).
6. **PayPal Booking Checkout**:
   - Clicking **"Book Guide — $25/hr"** opens `PayPalCheckoutModal.js`.
   - Renders `paypal.Buttons()`.
   - On payment authorization, `onApprove` triggers `confirmBooking(bookingData)`, updating `localStorage` and rendering `ConfirmationView.js`.
7. **My Trips Management**: `MyTripsPanel.js` reads active bookings from `localStorage` and displays confirmed guide bookings.

## Stack

- **Frontend Runtime & Build**: Vite (`^5.0.0`) + Vanilla JavaScript (ES6+ Modules).
  - *Rationale*: Zero framework overhead, 1-second local startup, standard DOM APIs for complete transparency.
  - *Doc*: [Vite Documentation](https://vitejs.dev/)
- **Styling**: CSS3 custom properties (design tokens), Flexbox/Grid, Glassmorphism, CSS Animations.
  - *Rationale*: Native browser CSS styling without extra compiler dependencies.
- **Interactive Map**: Leaflet.js (`^1.9.4`) via CDN / npm with CartoDB Dark Matter tile layer.
  - *Rationale*: Open-source interactive maps requiring zero paid API keys or registration.
  - *Doc*: [Leaflet.js Documentation](https://leafletjs.com/)
- **Payments**: PayPal JavaScript SDK v6 (`https://www.paypal.com/sdk/js?client-id=sb`).
  - *Rationale*: Official PayPal SDK in Sandbox mode for realistic checkout & callback simulation.
  - *Doc*: [PayPal JS SDK Docs](https://developer.paypal.com/sdk/js/)
- **Icons**: Lucide Icons (`^0.300.0`) via CDN / ESM.

## Where It Runs and How Someone Tries It

- **Runtime**: Local Node.js environment (`Node.js v18+`).
- **Startup Command**:
  ```bash
  npm install
  npm run dev
  ```
- **Local Access URL**: `http://localhost:5173`
- **Submission & Recording**: Demo video recorded locally showing the full Paris dashboard journey, guide search, free chat, and PayPal Sandbox payment confirmation. Repository hosted publicly on GitHub.

## Look and Feel

PRD Reference: `prd.md > Look and Feel`

- **Theme**: Premium Dark Mode (`#0a0f1d` background, `#121a2f` glassmorphic cards).
- **Accents**: Cyan-blue (`#06b6d4` / `#3b82f6`) primary buttons and glows, Emerald green (`#10b981`) for verification badges, Amber (`#f59e0b`) for scam warnings.
- **Typography**: *Plus Jakarta Sans* via Google Fonts for clean UI hierarchy.

## Components

Implements: `prd.md > Features and Behavior`

### 1. LandingView Component
- Renders hero search bar and destination chips (Paris, Tokyo, Cairo, Barcelona, Dubai).
- PRD ref: `prd.md > 1. Landing Page & Destination Search`.

### 2. MapViewer Component (Leaflet.js Integration)
- Renders map, tile layer, and category markers (Guides, Food, Attractions, Safety).
- Hooks marker `click` events to display custom location popups.
- PRD ref: `prd.md > 2. Map-First Destination Dashboard`.

### 3. ScamSensePanel Component
- Renders scam warning cards and interactive price guidance widget.
- PRD ref: `prd.md > 3. Safety & ScamSense Hub + Price Guidance`.

### 4. VerifiedGuidesDirectory Component
- Renders guide profiles with verified badges, ratings, languages, and action buttons.
- Supports language, price, and availability filtering.
- PRD ref: `prd.md > 4. Verified Local Guides Directory & AI LocalMatch`.

### 5. AILocalMatchWidget Component
- Collects tourist preferences and invokes the AI match engine.
- Renders match percentages (e.g. 96%) and explanation chips.
- PRD ref: `prd.md > 4. Verified Local Guides Directory & AI LocalMatch`.

### 6. ChatContainer Component
- Renders free direct chat window between tourist and guide.
- Includes AI translation toggle button.
- PRD ref: `prd.md > 5. Interactive Chat & AI Translation`.

### 7. PayPalCheckoutModal Component
- Renders booking summary and initializes PayPal Sandbox button container.
- Handles `onApprove` payment callback and triggers `ConfirmationView`.
- PRD ref: `prd.md > 6. PayPal Booking & Trip Management`.

### 8. MyTripsPanel Component
- Renders confirmed booking itinerary items stored in `localStorage`.
- PRD ref: `prd.md > 6. PayPal Booking & Trip Management`.

## Data Model

All data structures are typed cleanly in JavaScript ES modules:

```javascript
// Guide Schema
const Guide = {
  id: "guide-paris-01",
  name: "Alexandre Dubois",
  city: "Paris",
  avatar: "https://...",
  verifiedBadge: "Identity Verified",
  rating: 4.9,
  reviewCount: 38,
  languages: ["English", "French", "Spanish"],
  hourlyRate: 25,
  bio: "Native Parisian specializing in food tours and vintage markets.",
  coordinates: [48.8566, 2.3522]
};

// Scam Card Schema
const ScamAlert = {
  id: "scam-paris-01",
  city: "Paris",
  title: "Sacré-Cœur Bracelet Scam",
  location: "Montmartre Steps",
  riskLevel: "High",
  description: "Scammers tie a string bracelet on your finger and demand €20+.",
  preventionTip: "Keep hands in pockets when walking near Montmartre stairs."
};

// Price Guide Schema
const PriceItem = {
  item: "CDG Airport Taxi",
  touristTrapPrice: "€120 - €150",
  fairLocalPrice: "€55 - €65",
  tip: "Only take official taxi queues; ignore unregulated drivers at arrival gates."
};

// Booking Record (Saved in localStorage 'travgod_bookings')
const Booking = {
  bookingId: "RM-89421-PAR",
  guideId: "guide-paris-01",
  guideName: "Alexandre Dubois",
  city: "Paris",
  date: "2026-10-12",
  hours: 2,
  totalPaid: 50,
  status: "Confirmed",
  createdAt: "2026-10-07T15:40:00Z"
};
```

## File Structure

```
travgod/
├── index.html               # Main HTML entry point
├── package.json             # Vite dependencies & scripts
├── vite.config.js           # Vite server configuration
├── devpost/                 # Devpost planning workspace docs
│   ├── learner-profile.md
│   ├── scope.md
│   ├── scope.html
│   ├── prd.md
│   ├── prd.html
│   ├── spec.md
│   └── spec.html
└── src/
    ├── main.js              # Application entry point & routing
    ├── styles/
    │   └── main.css         # Custom CSS Design System (Dark mode, Glassmorphism)
    ├── data/
    │   ├── destinations.js  # Destination cities metadata
    │   ├── guides.js        # Seeded verified guide profiles
    │   └── scams.js         # ScamSense warning cards & price guides
    ├── components/
    │   ├── Header.js        # Top navigation & search bar
    │   ├── MapViewer.js     # Leaflet.js map integration & markers
    │   ├── ScamSense.js     # Scam cards & price comparison widget
    │   ├── GuideDirectory.js# Guide listings & language filters
    │   ├── AIMatch.js       # AI LocalMatch preference widget
    │   ├── Chat.js          # Direct chat container & AI translation
    │   ├── PayPalModal.js   # PayPal SDK checkout & payment callback
    │   └── MyTrips.js       # Saved booking lifecycle panel
    └── utils/
        ├── aiMatch.js       # Match scoring calculation engine
        └── storage.js       # localStorage helper functions
```

## External Services and Dependencies

1. **Leaflet.js (v1.9.4)**: Free map rendering via CartoDB Dark tiles. Zero API keys.
2. **PayPal JS SDK (v6)**: Loaded via `<script src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD"></script>`. Uses sandbox client `sb` for mock test payments.

## Important Failure Modes

- **Unserved Language Filter** → Renders friendly empty state with alternative language suggestions (*"Show 12 English-speaking guides"*).
- **Map Tiles Slow to Load** → Displays dark gradient placeholder with loading spinner until Leaflet tiles resolve.
- **PayPal SDK Sandbox Timeout** → Provides fallback manual confirmation button for smooth demo flow.

## What Was Simplified and Why

- **Mock Verification Badges**: Used pre-verified badge markers instead of real legal background check APIs for instant PoC execution.
- **PayPal Sandbox Mode**: Integrated sandbox client `sb` instead of complex live merchant account onboarding.
- **Simulated Chat Bot**: Built realistic local chat response generator for instant tourist-guide interaction.

## Decisions and Open Issues

- **Learner-Selected Stack**: Vite + Vanilla JS + Leaflet.js + PayPal SDK.
- **Key Concepts to Deep-Dive During Build**:
  1. *Leaflet Marker Hooks*: How Leaflet `marker.on('click', fn)` attaches popups to map coordinates.
  2. *AI Matching Logic*: How `calculateMatch()` computes percentage weights based on language, budget, and interest overlaps.
  3. *PayPal Callback Handling*: How PayPal's `onApprove` promise resolves to trigger instant UI state updates and `localStorage` saves.
