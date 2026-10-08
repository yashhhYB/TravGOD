/**
 * DashboardView.js — Destination Dashboard
 * Shows the interactive map and (in future slices) guides and scams.
 */
import { MapViewer } from './MapViewer.js';

export function renderDashboardView(container, { destination, onBack }) {
  container.innerHTML = `
    <div id="dashboard-view" style="display: flex; flex-direction: column; height: 100vh; background: var(--navy); overflow: hidden;">
      
      <!-- Dashboard Header -->
      <header class="dash-header" style="height: 64px; display: flex; align-items: center; padding: 0 1.5rem; background: rgba(10,25,47,0.95); border-bottom: 1px solid rgba(255,255,255,0.1); z-index: 100;">
        <button id="btn-back" style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-white-70); font-size: 0.9rem; font-weight: 600;">
          <svg width="16" height="16" data-lucide="arrow-left"></svg> Home
        </button>
        <div style="margin-left: 2rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.25rem;">${destination.flag}</span>
          <h1 style="font-size: 1.1rem; font-weight: 700; color: white; margin: 0;">${destination.name} <span style="color: var(--text-white-50); font-weight: 500;">${destination.country}</span></h1>
        </div>
      </header>

      <!-- Dashboard Layout -->
      <div style="display: flex; flex: 1; overflow: hidden;">
        
        <!-- Sidebar Placeholder (Will hold Guides & ScamSense later) -->
        <aside style="width: 400px; background: #0b1121; border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; padding: 1.5rem; overflow-y: auto;">
          <h2 style="color: white; font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem;">Explore</h2>
          
          <div style="background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2); border-radius: 12px; padding: 2rem; text-align: center; color: var(--text-white-70);">
            <p>Guide Directory and AI Match coming in Slice 3</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2); border-radius: 12px; padding: 2rem; text-align: center; color: var(--text-white-70); margin-top: 1.5rem;">
            <p>ScamSense coming in Slice 4</p>
          </div>
        </aside>

        <!-- Main Map Area -->
        <main style="flex: 1; position: relative; display: flex; flex-direction: column;">
          
          <!-- Category Filters -->
          <div style="position: absolute; top: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 0.5rem; background: rgba(10,25,47,0.85); backdrop-filter: blur(10px); padding: 0.5rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <button class="filter-pill active">All</button>
            <button class="filter-pill">Guides</button>
            <button class="filter-pill">Food</button>
            <button class="filter-pill">Attractions</button>
            <button class="filter-pill">Safety</button>
          </div>

          <!-- Map Container -->
          <div id="map" style="flex: 1; width: 100%; z-index: 1;"></div>
        </main>

      </div>
    </div>
  `;

  // Filter Pill CSS (injected for scoping)
  const style = document.createElement('style');
  style.textContent = `
    .filter-pill {
      padding: 0.4rem 1.25rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-white-70);
      transition: all 0.2s;
    }
    .filter-pill:hover { color: white; background: rgba(255,255,255,0.1); }
    .filter-pill.active { background: var(--blue); color: white; }
  `;
  container.appendChild(style);

  if (window.lucide) window.lucide.createIcons();

  container.querySelector('#btn-back').addEventListener('click', onBack);

  // Filter toggle logic
  const pills = container.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Initialize Map
  const mapViewer = new MapViewer('map', destination.coords);

  // Cleanup function returned for router
  return () => {
    mapViewer.destroy();
  };
}
