/**
 * ExploreView.js — Unified Destination Explorer
 * Re-exports the standard clean DashboardView for Paris & Rome.
 */

import { renderDashboardView } from './DashboardView.js';

export function renderExploreView(container, options = {}) {
  return renderDashboardView(container, {
    initialDestinationId: options.initialDestinationId || 'paris',
    initialTab: options.initialTab || 'guides',
    ...options
  });
}
