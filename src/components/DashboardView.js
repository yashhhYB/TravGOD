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
import { renderChatWindow } from './ChatWindow.js';
import { renderPayPalModal } from './PayPalModal.js';
import { calculateMatch } from '../utils/aiMatch.js';

export function renderDashboardView(container, { destination, onBack }) {
  const destGuides = GUIDES.filter(g => g.destinationId === destination.id);
  const destScams = SCAMS.filter(s => s.destinationId === destination.id);
  let rankedScores = null; // Will hold AI match scores if run

  container.innerHTML = `
    <div class="dash-layout">
      
      <!-- Dashboard Header -->
      <header class="dash-header">
        <button id="btn-back" class="btn-dash-back">
          <svg width="18" height="18" data-lucide="arrow-left"></svg> Home
        </button>
        <div style="margin-left: 1.5rem; display: flex; align-items: center; gap: 0.5rem; flex: 1;">
          <span style="font-size: 1.25rem;">${destination.flag}</span>
          <h1 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0;">${destination.name} <span style="color: var(--text-secondary); font-weight: 500;">${destination.country}</span></h1>
        </div>
      </header>

      <!-- Dashboard Layout -->
      <div class="dash-body">
        
          <!-- Sidebar -->
          <aside class="dash-sidebar">
            <div class="sidebar-tabs">
              <button id="tab-guides" class="sidebar-tab active">
                <svg width="16" height="16" data-lucide="users"></svg> Guides
              </button>
              <button id="tab-safety" class="sidebar-tab">
                <svg width="16" height="16" data-lucide="shield-alert"></svg> ScamSense
              </button>
            </div>

            <div class="sidebar-scroll-area">
              <!-- Guides Content -->
              <div id="content-guides">
                <div id="ai-match-container"></div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <h2 style="color: var(--text-primary); font-size: 1.1rem; font-weight: 800; margin: 0;">Local Guides</h2>
                  <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">${destGuides.length} available</span>
                </div>

                <div id="guide-dir-container"></div>
              </div>

              <!-- Safety Content (Hidden by default) -->
              <div id="content-safety" style="display: none;">
                <div id="scam-sense-container"></div>
              </div>
            </div>
          </aside>

        <!-- Main Map Area -->
        <main class="dash-map-area">
          
          <!-- Category Filters -->
          <div class="map-filters">
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
    
    <!-- Chat Container -->
    <div id="chat-container"></div>

    <!-- Modal Container -->
    <div id="modal-container"></div>
  `;

  if (window.lucide) window.lucide.createIcons();

  container.querySelector('#btn-back').addEventListener('click', onBack);

  // Initialize Map
  const mapViewer = new MapViewer('map', destination.coords);

  // Render components
  const aiContainer = container.querySelector('#ai-match-container');
  const dirContainer = container.querySelector('#guide-dir-container');
  const scamContainer = container.querySelector('#scam-sense-container');

  function updateGuideDirectory() {
    renderGuideDirectory(dirContainer, destGuides, rankedScores, 
      // onChatClick
      (guideId) => {
        const guide = destGuides.find(g => g.id === guideId);
        if (guide) {
          const chatContainer = container.querySelector('#chat-container');
          renderChatWindow(chatContainer, guide, () => {
            chatContainer.innerHTML = '';
          });
        }
      },
      // onBookClick
      (guideId) => {
        const guide = destGuides.find(g => g.id === guideId);
        if (guide) {
          const modalContainer = container.querySelector('#modal-container');
          renderPayPalModal(modalContainer, guide, () => {
            modalContainer.innerHTML = '';
          });
        }
      }
    );
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
      iconSize: [44, 44],
      iconAnchor: [22, 22]
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
    const riskClass = isHighRisk ? 'high' : 'medium';
    const iconHtml = `
      <div class="scam-marker-inner ${riskClass}" title="${s.title}">
        <svg width="18" height="18" data-lucide="alert-triangle"></svg>
      </div>
    `;
    const divIcon = L.divIcon({
      html: iconHtml,
      className: 'scam-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
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
    tabGuides.classList.add('active');
    tabSafety.classList.remove('active');
    contentGuides.style.display = 'block';
    contentSafety.style.display = 'none';
  });

  tabSafety.addEventListener('click', () => {
    tabSafety.classList.add('active');
    tabGuides.classList.remove('active');
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
