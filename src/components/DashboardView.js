/**
 * DashboardView.js — Destination Dashboard
 * Shows the interactive map and (in future slices) guides and scams.
 */
import { MapViewer } from './MapViewer.js';
import { GUIDES } from '../data/guides.js';
import { SCAMS, PRICES } from '../data/scams.js';
import { renderAIMatchWidget } from './AIMatch.js';
import { renderGuideDirectory } from './GuideDirectory.js';
import { renderScamSense } from './ScamSense.js';
import { calculateMatch } from '../utils/aiMatch.js';

export function renderDashboardView(container, { destination, onBack }) {
  const destGuides = GUIDES.filter(g => g.destinationId === destination.id);
  const destScams = SCAMS.filter(s => s.destinationId === destination.id);
  let rankedScores = null; // Will hold AI match scores if run

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
        
          <!-- Sidebar Tabs -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem;">
            <button id="tab-guides" class="sidebar-tab active" style="flex: 1; padding: 0.5rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; color: white; background: rgba(255,255,255,0.1); border: none; cursor: pointer; transition: all 0.2s;">
              <svg width="14" height="14" data-lucide="users" style="display: inline; margin-right: 0.25rem; vertical-align: -2px;"></svg> Guides
            </button>
            <button id="tab-safety" class="sidebar-tab" style="flex: 1; padding: 0.5rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; color: var(--text-white-70); background: transparent; border: none; cursor: pointer; transition: all 0.2s;">
              <svg width="14" height="14" data-lucide="shield-alert" style="display: inline; margin-right: 0.25rem; vertical-align: -2px;"></svg> ScamSense
            </button>
          </div>

          <!-- Guides Content -->
          <div id="content-guides">
            <div id="ai-match-container"></div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h2 style="color: white; font-size: 1.1rem; font-weight: 800; margin: 0;">Local Guides</h2>
              <span style="font-size: 0.75rem; color: var(--text-white-50);">${destGuides.length} available</span>
            </div>

            <div id="guide-dir-container"></div>
          </div>

          <!-- Safety Content (Hidden by default) -->
          <div id="content-safety" style="display: none;">
            <div id="scam-sense-container"></div>
          </div>
          

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
    
    /* Custom Leaflet Marker */
    .guide-marker {
      background: none;
      border: none;
    }
    .guide-marker-inner {
      width: 40px; height: 40px; border-radius: 50%; border: 3px solid #38bdf8;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5); overflow: hidden; background: #0b1121;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s;
    }
    .guide-marker-inner:hover { transform: scale(1.1); border-color: white; }
    .guide-marker-inner img { width: 100%; height: 100%; object-fit: cover; }
  `;
  container.appendChild(style);

  if (window.lucide) window.lucide.createIcons();

  container.querySelector('#btn-back').addEventListener('click', onBack);

  // Initialize Map
  const mapViewer = new MapViewer('map', destination.coords);

  // Render components
  const aiContainer = container.querySelector('#ai-match-container');
  const dirContainer = container.querySelector('#guide-dir-container');
  const scamContainer = container.querySelector('#scam-sense-container');

  function updateGuideDirectory() {
    renderGuideDirectory(dirContainer, destGuides, rankedScores, (guideId) => {
      alert(`Chat coming in Slice 5! (Clicked guide: ${guideId})`);
    });
  }

  renderAIMatchWidget(aiContainer, (userPrefs) => {
    // Run AI Match algorithm
    rankedScores = {};
    destGuides.forEach(g => {
      rankedScores[g.id] = calculateMatch(userPrefs, g);
    });
    // Re-render directory
    updateGuideDirectory();
  });

  updateGuideDirectory();
  renderScamSense(scamContainer, destScams, PRICES);

  // Add Guide Markers to Map
  destGuides.forEach(g => {
    const iconHtml = `
      <div class="guide-marker-inner" title="${g.name}">
        <img src="${g.avatar}" />
      </div>
    `;
    const divIcon = L.divIcon({
      html: iconHtml,
      className: 'guide-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = mapViewer.addMarker(g.coords, { icon: divIcon });
    marker.on('click', () => {
      // Switch tab to guides if not already
      container.querySelector('#tab-guides').click();
      
      // Scroll to guide card in sidebar
      const card = document.getElementById(`guide-card-${g.id}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.borderColor = '#38bdf8';
        card.style.boxShadow = '0 0 15px rgba(14,165,233,0.3)';
        setTimeout(() => {
          card.style.borderColor = 'rgba(255,255,255,0.1)';
          card.style.boxShadow = 'none';
        }, 1500);
      }
    });
  });

  // Add Scam Markers to Map
  destScams.forEach(s => {
    const isHighRisk = s.risk === 'high';
    const color = isHighRisk ? '#f43f5e' : '#fbbf24';
    const iconHtml = `
      <div style="width: 32px; height: 32px; border-radius: 50%; background: ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 2px solid white; color: white;" title="${s.title}">
        <svg width="16" height="16" data-lucide="alert-triangle"></svg>
      </div>
    `;
    const divIcon = L.divIcon({
      html: iconHtml,
      className: 'scam-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    
    const marker = mapViewer.addMarker(s.coords, { icon: divIcon });
    marker.on('click', () => {
      container.querySelector('#tab-safety').click();
    });
  });

  if (window.lucide) window.lucide.createIcons();

  // Tab toggle logic
  const tabGuides = container.querySelector('#tab-guides');
  const tabSafety = container.querySelector('#tab-safety');
  const contentGuides = container.querySelector('#content-guides');
  const contentSafety = container.querySelector('#content-safety');

  tabGuides.addEventListener('click', () => {
    tabGuides.style.background = 'rgba(255,255,255,0.1)';
    tabGuides.style.color = 'white';
    tabSafety.style.background = 'transparent';
    tabSafety.style.color = 'var(--text-white-70)';
    contentGuides.style.display = 'block';
    contentSafety.style.display = 'none';
  });

  tabSafety.addEventListener('click', () => {
    tabSafety.style.background = 'rgba(255,255,255,0.1)';
    tabSafety.style.color = 'white';
    tabGuides.style.background = 'transparent';
    tabGuides.style.color = 'var(--text-white-70)';
    contentGuides.style.display = 'none';
    contentSafety.style.display = 'block';
  });

  // Filter toggle logic
  const pills = container.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Cleanup function returned for router
  return () => {
    mapViewer.destroy();
  };
}
