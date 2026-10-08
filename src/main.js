/**
 * main.js — TRAVGOD Application Entry Point
 *
 * This is the first file the browser runs when the app loads.
 * It controls which "view" (Landing, Dashboard, etc.) is shown,
 * acting like a traffic director for the whole app.
 */

import { renderLandingView } from './components/LandingView.js';
import { renderDashboardView } from './components/DashboardView.js';

// ── App State ──────────────────────────────────────────────────────────────
const state = {
  view: 'landing',          // 'landing' | 'dashboard'
  selectedDestination: null, // The destination object chosen by the user
  cleanupFn: null,           // Function to cleanup previous view resources
};

// The root DOM element where every view gets rendered
const appRoot = document.getElementById('app');

// ── View Router ────────────────────────────────────────────────────────────
function navigate(view, data = {}) {
  // 1. Cleanup old view if necessary
  if (state.cleanupFn) {
    state.cleanupFn();
    state.cleanupFn = null;
  }

  // 2. Update state and clear DOM
  state.view = view;
  appRoot.innerHTML = ''; 

  // 3. Render new view
  if (view === 'landing') {
    state.cleanupFn = renderLandingView(appRoot, {
      onDestinationSelect: (dest) => {
        state.selectedDestination = dest;
        navigate('dashboard', { destination: dest });
      },
    });
  }

  if (view === 'dashboard') {
    state.cleanupFn = renderDashboardView(appRoot, {
      destination: data.destination,
      onBack: () => navigate('landing')
    });
  }
}

// ── Boot ───────────────────────────────────────────────────────────────────
navigate('landing');
