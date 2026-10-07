/**
 * main.js — TRAVGOD Application Entry Point
 *
 * This is the first file the browser runs when the app loads.
 * It controls which "view" (Landing, Dashboard, etc.) is shown,
 * acting like a traffic director for the whole app.
 *
 * Current views:
 *   - landing:   Hero search page (default)
 *   - dashboard: Destination map + guides (Slice 2+)
 */

import { renderLandingView } from './components/LandingView.js';

// ── App State ──────────────────────────────────────────────────────────────
// This object holds the current "state" of the app —
// which view is showing and which destination is selected.
const state = {
  view: 'landing',          // 'landing' | 'dashboard'
  selectedDestination: null, // The destination object chosen by the user
};

// The root DOM element where every view gets rendered
const appRoot = document.getElementById('app');

// ── View Router ────────────────────────────────────────────────────────────
/**
 * navigate(view, data)
 * Clears the app root and renders the requested view.
 * Each view function is responsible for its own HTML and events.
 */
function navigate(view, data = {}) {
  state.view = view;
  appRoot.innerHTML = ''; // Clear current view

  if (view === 'landing') {
    renderLandingView(appRoot, {
      onDestinationSelect: (dest) => {
        state.selectedDestination = dest;
        navigate('dashboard', { destination: dest });
      },
    });
  }

  if (view === 'dashboard') {
    // Dashboard will be built in Slice 2.
    // For now, show a placeholder so the router is wired correctly.
    appRoot.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #0a0f1d;
        color: #f1f5f9;
        text-align: center;
        padding: 2rem;
      ">
        <div style="font-size: 3rem;">🗺️</div>
        <h2 style="font-size: 2rem; font-weight: 800;">
          ${data.destination?.flag || ''} ${data.destination?.name || 'Destination'} Dashboard
        </h2>
        <p style="color: #94a3b8; max-width: 480px;">
          The interactive map &amp; guide dashboard is coming in Slice 2.
          The router is working — <strong style="color: #06b6d4;">destination selection is live!</strong>
        </p>
        <button onclick="window.location.reload()"
          style="
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            border-radius: 999px;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            border: none;
            font-family: inherit;
          ">
          ← Back to Landing
        </button>
      </div>
    `;
  }
}

// ── Boot ───────────────────────────────────────────────────────────────────
// Start the app on the landing page
navigate('landing');
