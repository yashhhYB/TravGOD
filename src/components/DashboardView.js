/**
 * DashboardView.js — Unified Destination Discovery, Food & Safety Hub
 * Supports Paris 🇫🇷 & Rome 🇮🇹 with standard, clean, premium UI.
 * Powered by Leaflet + CARTO Voyager Basemaps (Key: cb1_4hsg_1_984483a4175c34d8b6e7d692)
 * Features 8 comprehensive tabs:
 * 1. 🧑‍🤝‍🧑 Guides (Paris / Rome Guides with quick filters & integrated Become a Local trigger)
 * 2. 🌟 Overview (City hero, safety score, transit, key districts)
 * 3. 🍽️ Food & Dining (Authentic bistros, trattorias, artisan bakeries, and street food)
 * 4. ⚖️ Rules & Laws (Municipal laws, fines, citations)
 * 5. 🛡️ Scam Radar (Live AI threat detector with 1-click test chips & verified scams)
 * 6. 🏷️ Fair Prices (Tourist trap vs local fair prices, transit, coffee, rent)
 * 7. 🏛️ Hidden Spots (Secret gems with insider tips)
 * 8. 🚑 Emergency (112, Police, Ambulance, English hospitals, 24/7 pharmacies)
 */

import { MapViewer } from './MapViewer.js';
import { GUIDES } from '../data/guides.js';
import { DESTINATIONS } from '../data/destinations.js';
import { CITY_DATA } from '../data/cityData.js';
import { renderAIMatchWidget } from './AIMatch.js';
import { renderGuideDirectory } from './GuideDirectory.js';
import { renderChatWindow } from './ChatWindow.js';
import { renderPayPalModal } from './PayPalModal.js';
import { renderBecomeLocalView } from './BecomeLocalView.js';
import { calculateMatch } from '../utils/aiMatch.js';
import { setupHeaderAuth } from '../utils/headerAuth.js';
import { Storage } from '../utils/storage.js';
import { getSafetyZones, getPlaces, getMockCity, getSampleTrip, getAuditDemo } from '../data/mockData.js';
import { auditTrip, auditDraft, scoreStop, buildIndex } from '../utils/safetyAudit.js';

export function renderDashboardView(container, { initialDestinationId = 'paris', initialTab = 'guides', onBack = null } = {}) {
  let currentDestId = (initialDestinationId === 'rome') ? 'rome' : 'paris';
  let activeTab = initialTab; // 'guides', 'overview', 'food', 'rules', 'scams', 'audit', 'prices', 'hidden', 'emergency'
  let auditMode = 'sample'; // 'sample' or 'flawed'
  let guideFilter = 'all'; // 'all', 'top', 'budget', 'english'
  let foodFilter = 'all'; // 'all', 'bistro', 'bakery', 'street'
  let ruleFilter = 'all'; // 'all', 'serious', 'careful', 'info'
  let priceFilter = 'all'; // 'all', 'Food & Drink', 'Transport', 'Culture', 'Accommodation', 'Guide Services'
  let mapViewer = null;
  let activeMapFilter = 'all'; // 'all', 'guides', 'food', 'attractions', 'safety'
  let rankedScores = null;
  let currentFallbackMessage = null;

  function getCurrentCity() {
    return CITY_DATA[currentDestId] || CITY_DATA.paris;
  }

  function getDestGuides() {
    let list = GUIDES.filter(g => g.destinationId === currentDestId);
    if (guideFilter === 'top') {
      list = list.filter(g => g.rating >= 4.9);
    } else if (guideFilter === 'budget') {
      list = list.filter(g => g.rate <= 30);
    } else if (guideFilter === 'english') {
      list = list.filter(g => g.languages.includes('English'));
    }
    return list;
  }

  function renderLayout() {
    const city = getCurrentCity();
    const destGuides = getDestGuides();

    container.innerHTML = `
      <div class="dash-layout" style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: var(--bg-white, #ffffff); font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- ──── Dashboard Header ──── -->
        <header class="app-header solid-header" id="dash-header" style="position: fixed; top: 0; left: 0; right: 0; height: 72px; z-index: 1000; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(16px); box-shadow: 0 1px 0 var(--border, #e2e8f0); display: flex; align-items: center; padding: 0 var(--pad-x, 2rem);">
          <div class="header-inner" style="width: 100%; max-width: var(--max-w); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;">
            
            <!-- Left: Brand Logo -->
            <a href="#/" class="logo" style="text-decoration: none; display: flex; align-items: center; gap: 0.6rem;">
              <div class="logo-icon">
                <svg width="18" height="18" data-lucide="map-pin"></svg>
              </div>
              <div>
                <div class="logo-name">TRAVGOD</div>
                <div class="logo-tag">Explore · Connect · Travel Safe</div>
              </div>
            </a>

            <!-- Center: City Switcher Pills -->
            <div style="display: flex; align-items: center; background: #f1f5f9; padding: 4px; border-radius: 999px; border: 1px solid #cbd5e1; gap: 3px;">
              <button id="btn-switch-paris" class="city-pill ${currentDestId === 'paris' ? 'active' : ''}" style="display: flex; align-items: center; gap: 0.35rem; padding: 5px 14px; border-radius: 999px; border: none; font-size: 0.84rem; font-weight: 700; cursor: pointer; transition: all 0.2s; background: ${currentDestId === 'paris' ? '#0ea5e9' : 'transparent'}; color: ${currentDestId === 'paris' ? '#ffffff' : '#475569'}; box-shadow: ${currentDestId === 'paris' ? '0 2px 8px rgba(14,165,233,0.3)' : 'none'};">
                <span>🇫🇷</span> Paris
              </button>
              <button id="btn-switch-rome" class="city-pill ${currentDestId === 'rome' ? 'active' : ''}" style="display: flex; align-items: center; gap: 0.35rem; padding: 5px 14px; border-radius: 999px; border: none; font-size: 0.84rem; font-weight: 700; cursor: pointer; transition: all 0.2s; background: ${currentDestId === 'rome' ? '#0ea5e9' : 'transparent'}; color: ${currentDestId === 'rome' ? '#ffffff' : '#475569'}; box-shadow: ${currentDestId === 'rome' ? '0 2px 8px rgba(14,165,233,0.3)' : 'none'};">
                <span>🇮🇹</span> Rome
              </button>
              
              <!-- Coming Soon Dropdown -->
              <div style="position: relative; display: inline-block;">
                <select id="select-more-cities" style="appearance: none; background: transparent; border: none; padding: 5px 12px; font-size: 0.8rem; font-weight: 700; color: #94a3b8; cursor: pointer; outline: none;">
                  <option value="" disabled selected>More Cities (Coming Soon) ▾</option>
                  <option value="tokyo" disabled>🇯🇵 Tokyo (Coming Soon)</option>
                  <option value="barcelona" disabled>🇪🇸 Barcelona (Coming Soon)</option>
                  <option value="bangkok" disabled>🇹🇭 Bangkok (Coming Soon)</option>
                  <option value="cairo" disabled>🇪🇬 Cairo (Coming Soon)</option>
                </select>
              </div>
            </div>

            <!-- Right: Nav Links + Auth -->
            <div style="display: flex; align-items: center; gap: 1.5rem;">
              <nav class="header-nav" aria-label="Main navigation" style="display: flex; align-items: center; gap: 1.75rem;">
                <a href="#/">Home</a>
                <a href="#/explore" class="active">Explore</a>
                <a href="#/trips">My Trips</a>
                <a href="#/about">About</a>
              </nav>
              <div class="header-actions" id="header-auth-slot"></div>
            </div>

          </div>
        </header>

        <!-- ──── Dashboard Main Body (Split 490px Sidebar + Full Map) ──── -->
        <div class="dash-body" style="display: flex; flex: 1; margin-top: 72px; height: calc(100vh - 72px); overflow: hidden;">
          
          <!-- Left Sidebar -->
          <aside class="dash-sidebar" style="width: 490px; flex-shrink: 0; background: var(--bg-white, #ffffff); border-right: 1px solid var(--border, #e2e8f0); display: flex; flex-direction: column; overflow: hidden; z-index: 10;">
            
            <!-- 8 Sub-tabs Navigation Carousel with Slide Arrows -->
            <div class="sidebar-tabs-nav-wrapper" style="position: relative; display: flex; align-items: center; background: #ffffff; border-bottom: 1px solid var(--border, #e2e8f0); flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
              
              <!-- Left Slide Arrow Button -->
              <button id="btn-tabs-arrow-left" class="tab-slide-arrow" aria-label="Slide tabs left" title="Scroll tabs left" style="width: 32px; height: 44px; border: none; background: #ffffff; color: #475569; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; flex-shrink: 0; border-right: 1px solid #e2e8f0; transition: all 0.2s; box-shadow: 2px 0 6px rgba(0,0,0,0.03);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <!-- Scrollable Tabs Track -->
              <div class="sidebar-tabs" id="sidebar-tabs-container" style="display: flex; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; padding: 0 0.25rem; flex: 1; gap: 0.15rem;">
                
                <button class="dash-tab-btn ${activeTab === 'guides' ? 'active' : ''}" data-tab="guides" style="padding: 0.85rem 0.75rem; border: none; border-bottom: 2px solid ${activeTab === 'guides' ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.82rem; font-weight: 700; color: ${activeTab === 'guides' ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
                  <svg width="15" height="15" data-lucide="users"></svg>
                  <span>${city.name} Guides</span>
                </button>

                <button class="dash-tab-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview" style="padding: 0.85rem 0.75rem; border: none; border-bottom: 2px solid ${activeTab === 'overview' ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.82rem; font-weight: 700; color: ${activeTab === 'overview' ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
                  <span>🌟</span> Overview
                </button>

                <button class="dash-tab-btn ${activeTab === 'food' ? 'active' : ''}" data-tab="food" style="padding: 0.85rem 0.75rem; border: none; border-bottom: 2px solid ${activeTab === 'food' ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.82rem; font-weight: 700; color: ${activeTab === 'food' ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
                  <span>🍽️</span> Food & Dining
                </button>

                <button class="dash-tab-btn ${activeTab === 'rules' ? 'active' : ''}" data-tab="rules" style="padding: 0.85rem 0.75rem; border: none; border-bottom: 2px solid ${activeTab === 'rules' ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.82rem; font-weight: 700; color: ${activeTab === 'rules' ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
                  <span>⚖️</span> Rules & Laws
                </button>

                <button class="dash-tab-btn ${activeTab === 'scams' ? 'active' : ''}" data-tab="scams" style="padding: 0.85rem 0.75rem; border: none; border-bottom: 2px solid ${activeTab === 'scams' ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.82rem; font-weight: 700; color: ${activeTab === 'scams' ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
                  <span>🛡️</span> Scam Radar
                </button>

                <button class="dash-tab-btn ${activeTab === 'audit' ? 'active' : ''}" data-tab="audit" style="padding: 0.85rem 0.75rem; border: none; border-bottom: 2px solid ${activeTab === 'audit' ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.82rem; font-weight: 700; color: ${activeTab === 'audit' ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
                  <span>🔬</span> Safety Audit
                </button>

                <button class="dash-tab-btn ${activeTab === 'prices' ? 'active' : ''}" data-tab="prices" style="padding: 0.85rem 0.75rem; border: none; border-bottom: 2px solid ${activeTab === 'prices' ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.82rem; font-weight: 700; color: ${activeTab === 'prices' ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
                  <span>🏷️</span> Fair Prices
                </button>

                <button class="dash-tab-btn ${activeTab === 'hidden' ? 'active' : ''}" data-tab="hidden" style="padding: 0.85rem 0.75rem; border: none; border-bottom: 2px solid ${activeTab === 'hidden' ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.82rem; font-weight: 700; color: ${activeTab === 'hidden' ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
                  <span>🏛️</span> Hidden Spots
                </button>

                <button class="dash-tab-btn ${activeTab === 'emergency' ? 'active' : ''}" data-tab="emergency" style="padding: 0.85rem 0.75rem; border: none; border-bottom: 2px solid ${activeTab === 'emergency' ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.82rem; font-weight: 700; color: ${activeTab === 'emergency' ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
                  <span>🚑</span> Emergency
                </button>

              </div>

              <!-- Right Slide Arrow Button -->
              <button id="btn-tabs-arrow-right" class="tab-slide-arrow" aria-label="Slide tabs right" title="Scroll tabs right" style="width: 32px; height: 44px; border: none; background: #ffffff; color: #475569; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; flex-shrink: 0; border-left: 1px solid #e2e8f0; transition: all 0.2s; box-shadow: -2px 0 6px rgba(0,0,0,0.03);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

            </div>

            <!-- Scrollable Content Panel -->
            <div class="sidebar-scroll-area" id="sidebar-scroll-area" style="flex: 1; overflow-y: auto; padding: 1.25rem;">
              ${renderTabContent(city, destGuides)}
            </div>

          </aside>

          <!-- Right Map Area -->
          <main class="dash-map-area" style="flex: 1; position: relative; height: 100%; background: #e2e8f0;">
            
            <!-- Category Filter Pills Floating over Map -->
            <div class="map-filters" id="map-filters-nav" style="position: absolute; top: 1.25rem; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 0.4rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); padding: 5px 8px; border-radius: 999px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); border: 1px solid #cbd5e1;">
              <button class="map-filter-pill ${activeMapFilter === 'all' ? 'active' : ''}" data-filter="all" style="padding: 5px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; background: ${activeMapFilter === 'all' ? '#0ea5e9' : 'transparent'}; color: ${activeMapFilter === 'all' ? '#ffffff' : '#334155'}; transition: all 0.2s;">All</button>
              <button class="map-filter-pill ${activeMapFilter === 'guides' ? 'active' : ''}" data-filter="guides" style="padding: 5px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; background: ${activeMapFilter === 'guides' ? '#0ea5e9' : 'transparent'}; color: ${activeMapFilter === 'guides' ? '#ffffff' : '#334155'}; transition: all 0.2s;">Guides</button>
              <button class="map-filter-pill ${activeMapFilter === 'food' ? 'active' : ''}" data-filter="food" style="padding: 5px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; background: ${activeMapFilter === 'food' ? '#0ea5e9' : 'transparent'}; color: ${activeMapFilter === 'food' ? '#ffffff' : '#334155'}; transition: all 0.2s;">Food</button>
              <button class="map-filter-pill ${activeMapFilter === 'attractions' ? 'active' : ''}" data-filter="attractions" style="padding: 5px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; background: ${activeMapFilter === 'attractions' ? '#0ea5e9' : 'transparent'}; color: ${activeMapFilter === 'attractions' ? '#ffffff' : '#334155'}; transition: all 0.2s;">Attractions</button>
              <button class="map-filter-pill ${activeMapFilter === 'safety' ? 'active' : ''}" data-filter="safety" style="padding: 5px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; background: ${activeMapFilter === 'safety' ? '#0ea5e9' : 'transparent'}; color: ${activeMapFilter === 'safety' ? '#ffffff' : '#334155'}; transition: all 0.2s;">Safety</button>
            </div>

            <!-- Leaflet Map Container -->
            <div id="dash-leaflet-map" style="width: 100%; height: 100%; z-index: 1;"></div>

          </main>

        </div>
      </div>

      <!-- Modals & Float Containers -->
      <div id="dash-chat-container"></div>
      <div id="dash-modal-container"></div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const headerAuthSlot = container.querySelector('#dash-header');
    if (headerAuthSlot) setupHeaderAuth(headerAuthSlot);

    initLeafletMap(city);
    attachEventHandlers(city);
  }

  // ── Tab Content Renderer ──────────────────────────────────────────────────
  function renderTabContent(city, destGuides) {
    if (activeTab === 'guides') {
      return renderGuidesTab(city, destGuides);
    } else if (activeTab === 'overview') {
      return renderOverviewTab(city);
    } else if (activeTab === 'food') {
      return renderFoodTab(city);
    } else if (activeTab === 'rules') {
      return renderRulesTab(city);
    } else if (activeTab === 'scams') {
      return renderScamsTab(city);
    } else if (activeTab === 'audit') {
      return renderAuditTab(city);
    } else if (activeTab === 'prices') {
      return renderPricesTab(city);
    } else if (activeTab === 'hidden') {
      return renderHiddenTab(city);
    } else if (activeTab === 'emergency') {
      return renderEmergencyTab(city);
    }
    return '';
  }

  // ── 1. Guides Tab ──
  function renderGuidesTab(city, destGuides) {
    return `
      <div>
        <!-- AI Match Widget Slot -->
        <div id="ai-match-slot"></div>

        <!-- Merge Become Local in Locals: Application Banner Card -->
        <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #bfdbfe; border-radius: 16px; padding: 1.15rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; box-shadow: 0 2px 6px rgba(14,165,233,0.06);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: 12px; background: #0284c7; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
              ✨
            </div>
            <div>
              <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">Live in ${city.name}? Earn by guiding</h4>
              <p style="margin: 2px 0 0 0; font-size: 0.78rem; color: #475569;">Show travelers real culture & get paid via PayPal Escrow.</p>
            </div>
          </div>
          <button id="btn-apply-as-guide" style="padding: 0.65rem 1.15rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 0.82rem; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px rgba(14,165,233,0.3);">
            Apply ➔
          </button>
        </div>

        <!-- Section Header with Quick Filter Chips -->
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
            <h2 style="color: var(--text-primary, #0f172a); font-size: 1.1rem; font-weight: 800; margin: 0;">
              Local Guides
            </h2>
            <span style="font-size: 0.8rem; font-weight: 700; color: #0ea5e9; background: #e0f2fe; padding: 2px 8px; border-radius: 999px;">
              ${destGuides.length} available
            </span>
          </div>

          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
            ${[
              { id: 'all', label: 'All' },
              { id: 'top', label: '★ 4.9+ Top Rated' },
              { id: 'budget', label: '≤ €30/hr' },
              { id: 'english', label: 'English Speaking' }
            ].map(f => `
              <button class="guide-filter-chip ${guideFilter === f.id ? 'active' : ''}" data-filter="${f.id}" style="padding: 3px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid ${guideFilter === f.id ? '#0ea5e9' : '#cbd5e1'}; background: ${guideFilter === f.id ? '#0ea5e9' : '#ffffff'}; color: ${guideFilter === f.id ? '#ffffff' : '#475569'}; cursor: pointer;">
                ${f.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Guides Directory Container -->
        <div id="guide-directory-slot"></div>
      </div>
    `;
  }

  // ── 2. Overview Tab ──
  function renderOverviewTab(city) {
    const heroImg = currentDestId === 'paris' 
      ? 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80';

    return `
      <div>
        <!-- City Hero Card -->
        <div style="position: relative; border-radius: 18px; overflow: hidden; margin-bottom: 1.25rem; height: 160px; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
          <img src="${heroImg}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.25rem; color: white;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2px;">
              <span style="font-size: 1.5rem;">${city.flag}</span>
              <h2 style="margin: 0; font-size: 1.5rem; font-weight: 900; letter-spacing: -0.5px;">${city.name}, ${city.country}</h2>
            </div>
            <p style="margin: 0; font-size: 0.8rem; font-weight: 600; color: #e2e8f0;">${city.overview.tagline}</p>
          </div>
        </div>

        <!-- Fast Stats Row -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; margin-bottom: 1.25rem;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.75rem;">
            <span style="font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Safety Index</span>
            <div style="font-size: 0.95rem; font-weight: 900; color: #16a34a; margin-top: 2px;">${city.overview.safetyScore}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.75rem;">
            <span style="font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Best Season</span>
            <div style="font-size: 0.82rem; font-weight: 800; color: #0284c7; margin-top: 2px;">${city.overview.bestSeason.split('&')[0]}</div>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: #475569; line-height: 1.55; margin-bottom: 1.25rem;">
          ${city.overview.description}
        </p>

        <!-- Transit Summary -->
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 0.85rem; margin-bottom: 1.5rem;">
          <strong style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; font-weight: 800; color: #0284c7; text-transform: uppercase;">
            <svg width="14" height="14" data-lucide="train"></svg> Public Transit Overview
          </strong>
          <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #1e3a8a; line-height: 1.45;">
            ${city.overview.transitSummary}
          </p>
        </div>

        <!-- Authentic Districts List -->
        <h3 style="font-size: 0.95rem; font-weight: 900; color: #0f172a; margin: 0 0 0.75rem 0;">Key Authentic Neighborhoods</h3>
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${city.overview.keyDistricts.map(d => `
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.85rem;">
              <strong style="font-size: 0.9rem; color: #0f172a;">${d.name}</strong>
              <p style="margin: 2px 0 0 0; font-size: 0.78rem; color: #64748b; line-height: 1.4;">${d.vibe}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── 3. Food & Dining Tab (NEW & Enhanced with Photos and Categories) ──
  function renderFoodTab(city) {
    let allSpots = city.foodSpots || [];
    let foodSpots = allSpots;
    if (foodFilter === 'bistro') {
      foodSpots = allSpots.filter(f => {
        const cat = f.category.toLowerCase();
        return cat.includes('bistro') || cat.includes('trattoria') || cat.includes('dining') || cat.includes('osteria');
      });
    } else if (foodFilter === 'bakery') {
      foodSpots = allSpots.filter(f => {
        const cat = f.category.toLowerCase();
        return cat.includes('boulangerie') || cat.includes('bakery') || cat.includes('pasticceria') || cat.includes('café') || cat.includes('cafe');
      });
    } else if (foodFilter === 'street') {
      foodSpots = allSpots.filter(f => {
        const cat = f.category.toLowerCase();
        return cat.includes('street') || cat.includes('panini') || cat.includes('crêperie') || cat.includes('creperie');
      });
    }

    return `
      <div>
        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h2 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0;">
              Authentic ${city.name} Culinary Guide
            </h2>
            <span style="font-size: 0.75rem; font-weight: 700; color: #ea580c; background: #ffedd5; padding: 2px 10px; border-radius: 999px;">
              ${foodSpots.length} Handpicked
            </span>
          </div>
          <p style="font-size: 0.78rem; color: #64748b; margin: 3px 0 0 0;">
            100% tourist-trap free: generational bistros, master bakeries, and street delicacies curated by verified locals.
          </p>
        </div>

        <!-- Food Category Filter Pills -->
        <div style="display: flex; gap: 0.4rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
          ${[
            { id: 'all', label: 'All Dishes' },
            { id: 'bistro', label: 'Bistros & Trattorias' },
            { id: 'bakery', label: 'Bakeries & Pastries' },
            { id: 'street', label: 'Street Specialties' }
          ].map(btn => `
            <button class="food-filter-btn ${foodFilter === btn.id ? 'active' : ''}" data-filter="${btn.id}" style="padding: 5px 12px; border-radius: 999px; font-size: 0.74rem; font-weight: 700; border: 1px solid ${foodFilter === btn.id ? '#ea580c' : '#cbd5e1'}; background: ${foodFilter === btn.id ? '#ea580c' : '#ffffff'}; color: ${foodFilter === btn.id ? '#ffffff' : '#475569'}; cursor: pointer; transition: all 0.15s;">
              ${btn.label}
            </button>
          `).join('')}
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.15rem;">
          ${foodSpots.map(f => `
            <div class="food-spot-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.03); transition: all 0.2s;">
              
              ${f.image ? `
                <div style="position: relative; height: 140px; overflow: hidden; background: #f1f5f9;">
                  <img src="${f.image}" alt="${f.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
                  <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%);"></div>
                  <div style="position: absolute; bottom: 8px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <span style="font-size: 0.7rem; font-weight: 800; color: #ffffff; background: rgba(234,88,12,0.95); padding: 3px 10px; border-radius: 999px; backdrop-filter: blur(4px);">
                      ${f.category}
                    </span>
                    <span style="font-size: 0.75rem; font-weight: 800; color: #ffffff; background: rgba(15,23,42,0.85); padding: 2px 8px; border-radius: 6px;">
                      ${f.priceLevel}
                    </span>
                  </div>
                </div>
              ` : ''}

              <div style="padding: 1.15rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem; gap: 0.5rem;">
                  <div>
                    <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #0f172a;">${f.name}</h4>
                    <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 3px; flex-wrap: wrap;">
                      <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">📍 ${f.neighborhood}</span>
                    </div>
                  </div>
                  <button class="btn-fly-to-spot" data-lat="${f.coords[0]}" data-lng="${f.coords[1]}" style="padding: 5px 11px; background: #fff7ed; border: 1px solid #fed7aa; color: #ea580c; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 0.3rem;">
                    <svg width="12" height="12" data-lucide="map-pin"></svg> Show on Map
                  </button>
                </div>

                <div style="background: #fff7ed; border-radius: 8px; padding: 0.55rem 0.75rem; margin: 0.6rem 0; font-size: 0.8rem; color: #9a3412; border-left: 3px solid #ea580c;">
                  <strong>🍴 Signature Dish:</strong> <span style="color: #c2410c; font-weight: 800;">${f.signatureDish}</span>
                </div>

                <p style="font-size: 0.82rem; color: #475569; line-height: 1.45; margin: 0 0 0.55rem 0;">
                  ${f.description}
                </p>

                <div style="font-size: 0.75rem; color: #15803d; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 6px 10px; display: flex; align-items: flex-start; gap: 0.4rem;">
                  <span style="font-weight: 800; flex-shrink: 0;">💡 Local Secret:</span>
                  <span style="line-height: 1.4;">${f.insiderTip}</span>
                </div>
              </div>

            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── 4. Rules & Laws Tab ──
  function renderRulesTab(city) {
    const rules = city.rules.filter(r => ruleFilter === 'all' || r.severity === ruleFilter);

    return `
      <div>
        <div style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0;">Sourced Rules & Laws</h2>
          <p style="font-size: 0.78rem; color: #64748b; margin: 2px 0 0 0;">Avoid fines with official municipal codes.</p>
        </div>

        <!-- Severity Filter Pills -->
        <div style="display: flex; gap: 0.4rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
          ${['all', 'serious', 'careful', 'info'].map(f => `
            <button class="rule-filter-btn ${ruleFilter === f ? 'active' : ''}" data-filter="${f}" style="padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; border: 1px solid ${ruleFilter === f ? '#0ea5e9' : '#cbd5e1'}; background: ${ruleFilter === f ? '#0ea5e9' : '#ffffff'}; color: ${ruleFilter === f ? '#ffffff' : '#475569'}; cursor: pointer;">
              ${f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          `).join('')}
        </div>

        <!-- Rules Cards -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${rules.map(r => {
            const isSerious = r.severity === 'serious';
            const isCareful = r.severity === 'careful';
            const badgeBg = isSerious ? '#fee2e2' : isCareful ? '#fef3c7' : '#e0f2fe';
            const badgeColor = isSerious ? '#b91c1c' : isCareful ? '#b45309' : '#0369a1';

            return `
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
                  <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">${r.title}</h4>
                  <span style="font-size: 0.68rem; font-weight: 800; background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 999px; text-transform: uppercase;">
                    ${r.severity}
                  </span>
                </div>

                <div style="font-size: 0.8rem; font-weight: 800; color: #dc2626; margin-bottom: 0.5rem;">
                  Fine: ${r.penalty}
                </div>

                <p style="font-size: 0.82rem; color: #475569; line-height: 1.45; margin-bottom: 0.65rem;">
                  ${r.summary}
                </p>

                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.6rem; margin-bottom: 0.65rem;">
                  <strong style="display: block; font-size: 0.72rem; color: #166534; text-transform: uppercase; margin-bottom: 2px;">What to do instead:</strong>
                  <span style="font-size: 0.78rem; color: #15803d; line-height: 1.4;">${r.whatToDoInstead}</span>
                </div>

                <div style="font-size: 0.68rem; color: #94a3b8;">
                  Source: <em>${r.citation}</em>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ── 5. Scam Radar (ScamSense) Tab with 1-Click Test Chips ──
  function renderScamsTab(city) {
    const sampleChips = currentDestId === 'paris' ? [
      'Friendship bracelet at Sacré-Cœur',
      'Deaf petition at Eiffel Tower',
      'CDG taxi asking €120',
      'Gold ring on Seine bridge'
    ] : [
      'Centurion photo at Colosseum',
      'Termini ticket machine helper',
      'Skip-the-line tout at Vatican',
      '100g fish weight deception'
    ];

    return `
      <div>
        <div style="margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0;">Scam Radar & AI Threat Detector</h2>
          <p style="font-size: 0.78rem; color: #64748b; margin: 2px 0 0 0;">Real tourist traps verified by verified locals and police advisories.</p>
        </div>

        <!-- Live AI Scam Checker Widget with Quick Test Chips -->
        <div style="background: linear-gradient(135deg, #f8fafc, #eff6ff); border: 1px solid #bfdbfe; border-radius: 16px; padding: 1.15rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem; color: #0284c7; font-weight: 800; font-size: 0.85rem;">
            <svg width="16" height="16" data-lucide="shield-alert"></svg> Live AI Scam Threat Detector
          </div>
          <p style="font-size: 0.78rem; color: #475569; margin-bottom: 0.65rem;">Describe any suspicious interaction or click a quick test example:</p>

          <!-- 1-Click Test Chips -->
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
            ${sampleChips.map(c => `
              <button class="btn-sample-scam-chip" data-query="${c}" style="padding: 3px 10px; background: white; border: 1px solid #cbd5e1; border-radius: 999px; font-size: 0.7rem; font-weight: 700; color: #0284c7; cursor: pointer; transition: all 0.15s;">
                ⚡ "${c}"
              </button>
            `).join('')}
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="ai-scam-input" placeholder="Type suspicious situation..." style="flex: 1; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.82rem; outline: none; background: white;" />
            <button id="btn-run-scam-ai" style="padding: 0.6rem 1.15rem; background: #0284c7; color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; white-space: nowrap;">
              Analyze
            </button>
          </div>
          <div id="ai-scam-result" style="display: none; margin-top: 0.75rem; padding: 0.75rem; border-radius: 8px; font-size: 0.8rem; line-height: 1.45;"></div>
        </div>

        <!-- Verified Scam Cards List -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${city.scams.map(s => `
            <div class="scam-card ${s.risk === 'high' ? 'high' : 'medium'}" style="background: ${s.risk === 'high' ? '#fff1f2' : '#fffbeb'}; border: 1px solid ${s.risk === 'high' ? '#fecdd3' : '#fde68a'}; border-radius: 14px; padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">${s.title}</h4>
                <span style="font-size: 0.68rem; font-weight: 800; background: ${s.risk === 'high' ? '#ffe4e6' : '#fef3c7'}; color: ${s.risk === 'high' ? '#e11d48' : '#d97706'}; padding: 2px 8px; border-radius: 999px;">
                  ${s.risk.toUpperCase()} RISK
                </span>
              </div>

              <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem;">
                📍 ${s.location} &nbsp;•&nbsp; ⏰ ${s.activeHours}
              </div>

              <div style="margin-bottom: 0.5rem;">
                <strong style="display: block; font-size: 0.72rem; color: #991b1b; text-transform: uppercase;">How it works:</strong>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #334155; line-height: 1.4;">${s.howItWorks}</p>
              </div>

              <div style="background: rgba(255,255,255,0.7); border-radius: 8px; padding: 0.6rem; margin-bottom: 0.6rem;">
                <strong style="display: block; font-size: 0.72rem; color: #15803d; text-transform: uppercase;">How to avoid:</strong>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #166534; line-height: 1.4;">${s.howToAvoid}</p>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem;">
                <span style="color: #94a3b8;">Verified: ${s.verifiedAt}</span>
                <button class="btn-fly-to-spot" data-lat="${s.coords[0]}" data-lng="${s.coords[1]}" style="background: none; border: none; color: #0284c7; font-weight: 800; cursor: pointer;">
                  Show on Map ➔
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── 5b. Safety Audit Tab ──
  function renderAuditTab(city) {
    const mockCity = getMockCity(currentDestId);
    const sampleTrip = getSampleTrip(currentDestId);
    const auditDemo = getAuditDemo(currentDestId);

    const tripToAudit = (auditMode === 'flawed' && auditDemo)
      ? { days: [{ day: 1, weekday: auditDemo.draft_weekday, stops: auditDemo.draft }] }
      : (sampleTrip || { days: [] });

    const auditResult = auditTrip(tripToAudit, mockCity);
    const isFlawed = auditMode === 'flawed';

    return `
      <div>
        <!-- Safety Engine Introduction Card -->
        <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border-radius: 18px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.35rem;">🔬</span>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 900; color: #f8fafc;">
                Deterministic Safety Audit
              </h3>
            </div>
            <span style="font-size: 0.68rem; font-weight: 800; background: rgba(56,189,248,0.2); color: #38bdf8; padding: 2px 8px; border-radius: 999px;">
              Rules-Based AI Engine
            </span>
          </div>
          <p style="margin: 0 0 0.85rem 0; font-size: 0.8rem; color: #94a3b8; line-height: 1.45;">
            Evaluates itineraries against 5 core risk pillars: scam exposure geofences, night caution, crowd pressure, local regulations, and scheduling logistics.
          </p>

          <!-- Toggle: Safe Sample vs Flawed Draft Demo -->
          <div style="display: flex; gap: 0.4rem; background: rgba(255,255,255,0.08); padding: 4px; border-radius: 10px;">
            <button id="btn-audit-mode-safe" style="flex: 1; padding: 6px 10px; border-radius: 8px; border: none; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.2s; background: ${!isFlawed ? '#0284c7' : 'transparent'}; color: ${!isFlawed ? '#ffffff' : '#94a3b8'};">
              ✓ Verified 3-Day Route (Grade A)
            </button>
            <button id="btn-audit-mode-flawed" style="flex: 1; padding: 6px 10px; border-radius: 8px; border: none; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.2s; background: ${isFlawed ? '#dc2626' : 'transparent'}; color: ${isFlawed ? '#ffffff' : '#94a3b8'};">
              ⚠️ Flawed Draft (Test Blocking Checks)
            </button>
          </div>
        </div>

        <!-- Audit Scorecard Banner -->
        <div style="background: ${isFlawed ? '#fff1f2' : '#f0fdf4'}; border: 1px solid ${isFlawed ? '#fecdd3' : '#bbf7d0'}; border-radius: 16px; padding: 1.15rem; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: ${isFlawed ? '#991b1b' : '#166534'};">
                Safety Audit Verdict
              </span>
              <h4 style="margin: 2px 0 0 0; font-size: 1.2rem; font-weight: 900; color: ${isFlawed ? '#b91c1c' : '#15803d'};">
                ${auditResult.gradeLabel}
              </h4>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.4rem; font-weight: 900; color: ${isFlawed ? '#b91c1c' : '#15803d'};">
                ${auditResult.meanRisk} <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">/ 100</span>
              </div>
              <span style="font-size: 0.68rem; font-weight: 700; color: #64748b;">Mean Risk Index</span>
            </div>
          </div>

          <!-- Risk Breakdown Progress Bars -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; background: white; padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); font-size: 0.72rem;">
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="font-weight: 700; color: #475569;">🛡️ Scam Exposure</span>
                <span style="font-weight: 800; color: #0f172a;">${isFlawed ? '24/35' : '8/35'}</span>
              </div>
              <div style="height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                <div style="width: ${isFlawed ? '68%' : '23%'}; height: 100%; background: ${isFlawed ? '#e11d48' : '#0284c7'};"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="font-weight: 700; color: #475569;">🌙 Night Caution</span>
                <span style="font-weight: 800; color: #0f172a;">${isFlawed ? '15/20' : '0/20'}</span>
              </div>
              <div style="height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                <div style="width: ${isFlawed ? '75%' : '0%'}; height: 100%; background: ${isFlawed ? '#e11d48' : '#10b981'};"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="font-weight: 700; color: #475569;">👥 Crowd Pressure</span>
                <span style="font-weight: 800; color: #0f172a;">${isFlawed ? '15/15' : '8/15'}</span>
              </div>
              <div style="height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                <div style="width: ${isFlawed ? '100%' : '53%'}; height: 100%; background: #f59e0b;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="font-weight: 700; color: #475569;">⏱️ Logistics Friction</span>
                <span style="font-weight: 800; color: #0f172a;">${isFlawed ? '15/15 (Critical)' : '3/15'}</span>
              </div>
              <div style="height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                <div style="width: ${isFlawed ? '100%' : '20%'}; height: 100%; background: ${isFlawed ? '#dc2626' : '#10b981'};"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Audit Findings Feed -->
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.88rem; font-weight: 800; color: #0f172a; margin: 0 0 0.65rem 0; display: flex; align-items: center; gap: 0.35rem;">
            <span>📋</span> Audit Findings (${auditResult.allFindings.length})
          </h4>

          <div style="display: flex; flex-direction: column; gap: 0.65rem;">
            ${auditResult.allFindings.map(f => {
              const isBlocking = f.severity === 'blocking';
              const isWarn = f.severity === 'warn';
              const bg = isBlocking ? '#fef2f2' : isWarn ? '#fffbeb' : '#f0fdf4';
              const border = isBlocking ? '#fecaca' : isWarn ? '#fef08a' : '#dcfce7';
              const textColor = isBlocking ? '#991b1b' : isWarn ? '#92400e' : '#166534';
              const badgeBg = isBlocking ? '#dc2626' : isWarn ? '#d97706' : '#16a34a';

              return `
                <div style="background: ${bg}; border: 1px solid ${border}; border-radius: 12px; padding: 0.85rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                      <span style="font-size: 0.65rem; font-weight: 900; background: ${badgeBg}; color: white; padding: 2px 7px; border-radius: 4px; text-transform: uppercase;">
                        ${f.severity}
                      </span>
                      <strong style="font-size: 0.82rem; color: #0f172a;">${f.code}</strong>
                    </div>
                    <span style="font-size: 0.7rem; color: #64748b; font-weight: 700;">@ ${f.stop || 'Itinerary'}</span>
                  </div>
                  <p style="margin: 0; font-size: 0.78rem; color: ${textColor}; line-height: 1.45;">
                    ${f.msg}
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Interactive Single-Sight Auditor -->
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 1.15rem;">
          <h4 style="margin: 0 0 0.35rem 0; font-size: 0.9rem; font-weight: 800; color: #0f172a;">
            🔍 Single Landmark Safety Lookup
          </h4>
          <p style="margin: 0 0 0.75rem 0; font-size: 0.78rem; color: #64748b;">
            Test any landmark in ${city.name} to see its crowd index, applicable scams, and night caution radius.
          </p>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
            <select id="select-audit-place" style="flex: 1; min-width: 170px; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; background: white;">
              ${(mockCity.places || []).map(p => `
                <option value="${p.id}">${p.name} (${p.category || 'Sight'})</option>
              `).join('')}
            </select>
            <input type="time" id="input-audit-time" value="10:00" style="padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; background: white;" />
            <button id="btn-evaluate-stop" style="padding: 0.6rem 1rem; background: #0284c7; color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 0.8rem; cursor: pointer;">
              Score Stop
            </button>
          </div>

          <div id="single-stop-audit-result" style="display: none; padding: 0.75rem; border-radius: 10px; font-size: 0.8rem; line-height: 1.45;"></div>
        </div>

      </div>
    `;
  }

  // ── 6. Fair Prices Tab ──
  function renderPricesTab(city) {
    const categories = ['all', 'Food & Drink', 'Transport', 'Culture', 'Accommodation', 'Guide Services'];
    const prices = city.prices.filter(p => priceFilter === 'all' || p.category === priceFilter);

    return `
      <div>
        <div style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0;">Fair Price Guide</h2>
          <p style="font-size: 0.78rem; color: #64748b; margin: 2px 0 0 0;">Never overpay: real local costs vs. tourist rip-offs.</p>
        </div>

        <!-- Filter pills -->
        <div style="display: flex; gap: 0.4rem; overflow-x: auto; margin-bottom: 1rem; padding-bottom: 4px;">
          ${categories.map(c => `
            <button class="price-cat-btn ${priceFilter === c ? 'active' : ''}" data-cat="${c}" style="padding: 4px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; white-space: nowrap; border: 1px solid ${priceFilter === c ? '#0ea5e9' : '#cbd5e1'}; background: ${priceFilter === c ? '#0ea5e9' : '#ffffff'}; color: ${priceFilter === c ? '#ffffff' : '#475569'}; cursor: pointer;">
              ${c === 'all' ? 'All Rates' : c}
            </button>
          `).join('')}
        </div>

        <!-- Price Table -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 0.65rem 0.85rem; font-weight: 800; color: #475569;">Item / Service</th>
                <th style="padding: 0.65rem 0.85rem; font-weight: 800; color: #e11d48;">Tourist Trap</th>
                <th style="padding: 0.65rem 0.85rem; font-weight: 800; color: #16a34a;">Fair Price</th>
              </tr>
            </thead>
            <tbody>
              ${prices.map(p => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 0.75rem 0.85rem;">
                    <strong style="display: block; color: #0f172a;">${p.item}</strong>
                    <span style="font-size: 0.7rem; color: #94a3b8;">${p.note || ''}</span>
                  </td>
                  <td style="padding: 0.75rem 0.85rem; color: #e11d48; font-weight: 700;">
                    ${p.touristRate}
                  </td>
                  <td style="padding: 0.75rem 0.85rem; color: #16a34a; font-weight: 800;">
                    ${p.localRate}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ── 7. Hidden Spots Tab ──
  function renderHiddenTab(city) {
    return `
      <div>
        <div style="margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0;">Verified Hidden Spots</h2>
          <p style="font-size: 0.78rem; color: #64748b; margin: 2px 0 0 0;">Secret local spots contributed by verified ${city.name} guides.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${city.hiddenSpots.map(h => `
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">${h.title}</h4>
                <span style="font-size: 0.72rem; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 2px 8px; border-radius: 999px;">
                  ${h.neighborhood}
                </span>
              </div>

              <p style="font-size: 0.82rem; color: #475569; line-height: 1.45; margin-bottom: 0.6rem;">
                ${h.description}
              </p>

              <div style="background: #f8fafc; border-radius: 8px; padding: 0.5rem 0.75rem; margin-bottom: 0.6rem; font-size: 0.75rem; color: #334155;">
                <strong>💡 Insider Tip:</strong> ${h.localTip}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
                <span style="color: #64748b;">Best Time: ${h.bestTime}</span>
                <button class="btn-fly-to-spot" data-lat="${h.coords[0]}" data-lng="${h.coords[1]}" style="background: none; border: none; color: #0284c7; font-weight: 800; cursor: pointer;">
                  Show on Map ➔
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── 8. Emergency Tab ──
  function renderEmergencyTab(city) {
    const em = city.emergency;
    return `
      <div>
        <div style="margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0;">Emergency Hotlines & Medical</h2>
          <p style="font-size: 0.78rem; color: #64748b; margin: 2px 0 0 0;">Official 24/7 contacts and English-speaking medical facilities.</p>
        </div>

        <!-- Big Emergency Call Cards -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
          <div style="background: #fee2e2; border: 1px solid #fecaca; border-radius: 12px; padding: 1rem; text-align: center;">
            <div style="font-size: 1.6rem; font-weight: 900; color: #b91c1c;">${em.panEuropean}</div>
            <div style="font-size: 0.75rem; font-weight: 800; color: #991b1b; text-transform: uppercase;">Pan-European 112</div>
          </div>
          <div style="background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 12px; padding: 1rem; text-align: center;">
            <div style="font-size: 1.6rem; font-weight: 900; color: #0369a1;">${em.police}</div>
            <div style="font-size: 0.75rem; font-weight: 800; color: #075985; text-transform: uppercase;">Police Hotlines</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.82rem;">
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.85rem;">
            <strong style="color: #0f172a; display: block;">🏥 English-Speaking Hospital</strong>
            <span style="color: #475569;">${em.englishHospital}</span>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.85rem;">
            <strong style="color: #0f172a; display: block;">💊 24/7 Central Pharmacy</strong>
            <span style="color: #475569;">${em.pharmacy247}</span>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.85rem;">
            <strong style="color: #0f172a; display: block;">💳 Lost / Stolen Credit Cards</strong>
            <span style="color: #475569;">${em.lostCreditCard}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ── Leaflet + CARTO Voyager Map Engine ─────────────────────────────────────
  function initLeafletMap(city) {
    if (mapViewer) {
      mapViewer.destroy();
    }
    mapViewer = new MapViewer('dash-leaflet-map', city.coords);
    updateMapMarkers();
  }

  function updateMapMarkers() {
    if (!mapViewer) return;
    mapViewer.clearMarkers();
    const city = getCurrentCity();
    const destGuides = getDestGuides();

    // 1. Guides Markers (Custom Photo Pin with Rate Badge)
    if (activeMapFilter === 'all' || activeMapFilter === 'guides') {
      destGuides.forEach(g => {
        const iconHtml = `
          <div style="position: relative; width: 48px; height: 48px; cursor: pointer;">
            <div style="width: 44px; height: 44px; border-radius: 50%; border: 3px solid #0ea5e9; box-shadow: 0 4px 14px rgba(14,165,233,0.4); overflow: hidden; background: #ffffff;">
              <img src="${g.avatar}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); background: #0284c7; color: white; padding: 1px 6px; border-radius: 999px; font-size: 0.65rem; font-weight: 800; border: 1px solid white; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              €${g.rate}/h
            </div>
          </div>
        `;
        const divIcon = L.divIcon({ html: iconHtml, className: 'custom-guide-marker', iconSize: [48, 48], iconAnchor: [24, 24] });
        const marker = mapViewer.addMarker(g.coords, { icon: divIcon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: inherit; max-width: 210px;">
            <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 4px;">
              <strong style="font-size: 0.95rem; color: #0f172a;">${g.name}</strong>
              <span style="font-size: 0.65rem; color: #16a34a; font-weight: 800; background: #dcfce7; padding: 1px 5px; border-radius: 4px;">✓ Verified</span>
            </div>
            <div style="font-size: 0.78rem; color: #0ea5e9; font-weight: 800; margin-bottom: 4px;">
              ★ ${g.rating} (${g.reviews} reviews) • €${g.rate}/hr
            </div>
            <p style="font-size: 0.75rem; color: #64748b; margin: 0 0 8px 0; line-height: 1.35;">${g.bio.slice(0, 80)}...</p>
            <div style="display: flex; gap: 0.35rem;">
              <button id="pop-chat-${g.id}" style="flex: 1; padding: 5px 8px; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                Message
              </button>
              <button id="pop-book-${g.id}" style="flex: 1; padding: 5px 8px; background: #0ea5e9; color: white; border: none; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                Book
              </button>
            </div>
          </div>
        `);
        marker.on('popupopen', () => {
          const btnChat = document.getElementById(`pop-chat-${g.id}`);
          const btnBook = document.getElementById(`pop-book-${g.id}`);
          if (btnChat) {
            btnChat.onclick = () => {
              renderChatWindow(container.querySelector('#dash-chat-container'), g, () => {
                container.querySelector('#dash-chat-container').innerHTML = '';
              });
            };
          }
          if (btnBook) {
            btnBook.onclick = () => {
              renderPayPalModal(container.querySelector('#dash-modal-container'), g, () => {
                container.querySelector('#dash-modal-container').innerHTML = '';
              });
            };
          }
        });
      });
    }

    // 2. Food Spots Markers (Warm Amber with Fork/Knife)
    if (activeMapFilter === 'all' || activeMapFilter === 'food') {
      const foodList = city.foodSpots || [];
      foodList.forEach(f => {
        const iconHtml = `
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #ea580c; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(234,88,12,0.4); border: 2px solid white; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
            <svg width="15" height="15" data-lucide="utensils"></svg>
          </div>
        `;
        const divIcon = L.divIcon({ html: iconHtml, className: 'food-marker', iconSize: [32, 32], iconAnchor: [16, 16] });
        const marker = mapViewer.addMarker(f.coords, { icon: divIcon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: inherit; max-width: 220px;">
            ${f.image ? `<img src="${f.image}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />` : ''}
            <span style="font-size: 0.65rem; font-weight: 800; color: #ea580c; background: #ffedd5; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${f.category}</span>
            <strong style="display: block; font-size: 0.95rem; color: #0f172a; margin: 3px 0 1px 0;">${f.name}</strong>
            <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 5px;">📍 ${f.neighborhood} • ${f.priceLevel}</div>
            <div style="background: #fff7ed; border-left: 2px solid #ea580c; padding: 4px 6px; border-radius: 4px; font-size: 0.75rem; color: #c2410c; font-weight: 700; margin-bottom: 5px;">
              Must Try: ${f.signatureDish}
            </div>
            <p style="font-size: 0.72rem; color: #475569; margin: 0 0 6px 0; line-height: 1.35;">${f.description.slice(0, 80)}...</p>
            <div style="font-size: 0.7rem; color: #15803d; font-weight: 600;">💡 ${f.insiderTip.slice(0, 65)}...</div>
          </div>
        `);
      });
    }

    // 3. Safety / Scam Markers & Geofences
    if (activeMapFilter === 'all' || activeMapFilter === 'safety') {
      // Scam incident pins
      city.scams.forEach(s => {
        const isHigh = s.risk === 'high';
        const iconHtml = `
          <div style="width: 32px; height: 32px; border-radius: 50%; background: ${isHigh ? '#e11d48' : '#f59e0b'}; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
            <svg width="16" height="16" data-lucide="alert-triangle"></svg>
          </div>
        `;
        const divIcon = L.divIcon({ html: iconHtml, className: 'scam-marker', iconSize: [32, 32], iconAnchor: [16, 16] });
        const marker = mapViewer.addMarker(s.coords, { icon: divIcon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: inherit; max-width: 220px;">
            <span style="font-size: 0.65rem; font-weight: 800; color: ${isHigh ? '#e11d48' : '#d97706'}; text-transform: uppercase;">${s.risk} Risk Scam</span>
            <strong style="display: block; font-size: 0.9rem; color: #0f172a; margin: 2px 0;">${s.title}</strong>
            <p style="font-size: 0.75rem; color: #475569; margin: 0 0 6px 0; line-height: 1.35;">${s.howItWorks.slice(0, 85)}...</p>
            <div style="font-size: 0.72rem; color: #15803d; font-weight: 700;">Avoid: ${s.howToAvoid.slice(0, 75)}...</div>
          </div>
        `);
      });

      // Render verified Safety Zones (geofence circles with radius in meters)
      const zones = getSafetyZones(currentDestId);
      zones.forEach(z => {
        if (!z.lat || !z.lng) return;
        const isNight = z.night_caution;
        const color = isNight ? '#e11d48' : '#f59e0b';
        const circle = mapViewer.addCircle([z.lat, z.lng], z.r_m || 300, {
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 2,
          dashArray: '4, 4'
        });
        circle.bindPopup(`
          <div style="padding: 6px; font-family: inherit; max-width: 220px;">
            <span style="font-size: 0.65rem; font-weight: 800; color: ${color}; text-transform: uppercase;">
              🛡️ Safety Geofence (${z.r_m}m Radius)
            </span>
            <strong style="display: block; font-size: 0.95rem; color: #0f172a; margin: 3px 0 2px 0;">${z.name}</strong>
            <p style="font-size: 0.75rem; color: #475569; margin: 0 0 4px 0; line-height: 1.35;">${z.desc}</p>
            <div style="font-size: 0.7rem; color: #b91c1c; font-weight: 700;">
              ${z.pickpocket ? '⚠️ High Pickpocket Density' : ''} ${z.night_caution ? '• 🌙 Night Caution' : ''}
            </div>
          </div>
        `);
      });
    }

    // 4. Hidden Spots & Cultural Attractions
    if (activeMapFilter === 'all' || activeMapFilter === 'attractions') {
      city.hiddenSpots.forEach(h => {
        const iconHtml = `
          <div style="width: 30px; height: 30px; border-radius: 50%; background: #9333ea; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(147,51,234,0.35); border: 2px solid white; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
            <svg width="15" height="15" data-lucide="camera"></svg>
          </div>
        `;
        const divIcon = L.divIcon({ html: iconHtml, className: 'hidden-marker', iconSize: [30, 30], iconAnchor: [15, 15] });
        const marker = mapViewer.addMarker(h.coords, { icon: divIcon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: inherit; max-width: 200px;">
            <span style="font-size: 0.65rem; font-weight: 800; color: #9333ea; text-transform: uppercase;">Hidden Spot</span>
            <strong style="display: block; font-size: 0.9rem; color: #0f172a; margin: 2px 0;">${h.title}</strong>
            <p style="font-size: 0.75rem; color: #475569; margin: 0 0 4px 0; line-height: 1.35;">${h.description.slice(0, 80)}...</p>
            <div style="font-size: 0.7rem; color: #6b21a8; font-weight: 600;">💡 ${h.localTip.slice(0, 60)}...</div>
          </div>
        `);
      });

      // Render 18 verified iconic landmarks
      const places = getPlaces(currentDestId);
      places.forEach(p => {
        if (!p.lat || !p.lng) return;
        const iconHtml = `
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #0284c7; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(2,132,199,0.35); border: 2px solid white; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
            <svg width="14" height="14" data-lucide="landmark"></svg>
          </div>
        `;
        const divIcon = L.divIcon({ html: iconHtml, className: 'landmark-marker', iconSize: [28, 28], iconAnchor: [14, 14] });
        const marker = mapViewer.addMarker([p.lat, p.lng], { icon: divIcon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: inherit; max-width: 220px;">
            <span style="font-size: 0.65rem; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${p.category || 'Sight'}</span>
            <strong style="display: block; font-size: 0.95rem; color: #0f172a; margin: 3px 0 2px 0;">${p.name}</strong>
            <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 4px;">
              Crowd: <strong>${p.crowd || 'Normal'}</strong> • Duration: ~${p.mins || 60}m
            </div>
            ${p.book === 'required' ? '<div style="font-size: 0.7rem; color: #b91c1c; font-weight: 800; margin-bottom: 3px;">🎟️ Advance Timed Booking Required</div>' : ''}
            ${p.closed_weekday ? `<div style="font-size: 0.7rem; color: #d97706; font-weight: 700;">📅 Closed on ${p.closed_weekday}s</div>` : ''}
            ${p.status === 'closed_renovation' ? '<div style="font-size: 0.7rem; color: #dc2626; font-weight: 800;">🚧 Closed for Renovation</div>' : ''}
          </div>
        `);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ── Event Handlers ────────────────────────────────────────────────────────
  function attachEventHandlers(city) {
    // City switcher buttons
    const btnParis = container.querySelector('#btn-switch-paris');
    const btnRome = container.querySelector('#btn-switch-rome');

    if (btnParis) {
      btnParis.addEventListener('click', () => {
        if (currentDestId !== 'paris') {
          currentDestId = 'paris';
          rankedScores = null;
          renderLayout();
        }
      });
    }

    if (btnRome) {
      btnRome.addEventListener('click', () => {
        if (currentDestId !== 'rome') {
          currentDestId = 'rome';
          rankedScores = null;
          renderLayout();
        }
      });
    }

    // Carousel Slide Arrows
    const tabsTrack = container.querySelector('#sidebar-tabs-container');
    const btnSlideLeft = container.querySelector('#btn-tabs-arrow-left');
    const btnSlideRight = container.querySelector('#btn-tabs-arrow-right');

    if (btnSlideLeft && tabsTrack) {
      btnSlideLeft.addEventListener('click', () => {
        tabsTrack.scrollBy({ left: -160, behavior: 'smooth' });
      });
    }

    if (btnSlideRight && tabsTrack) {
      btnSlideRight.addEventListener('click', () => {
        tabsTrack.scrollBy({ left: 160, behavior: 'smooth' });
      });
    }

    if (tabsTrack) {
      tabsTrack.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          tabsTrack.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    }

    // Sub-tab switcher
    container.querySelectorAll('.dash-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        const scrollArea = container.querySelector('#sidebar-scroll-area');
        if (scrollArea) {
          scrollArea.innerHTML = renderTabContent(getCurrentCity(), getDestGuides());
          if (window.lucide) window.lucide.createIcons();
          attachSubTabListeners();
        }
        // Update tab button styles
        container.querySelectorAll('.dash-tab-btn').forEach(b => {
          const isActive = b.dataset.tab === activeTab;
          b.style.borderBottomColor = isActive ? '#0ea5e9' : 'transparent';
          b.style.color = isActive ? '#0ea5e9' : '#64748b';
        });
      });
    });

    // Map Category filter pills
    container.querySelectorAll('.map-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        activeMapFilter = pill.dataset.filter;
        container.querySelectorAll('.map-filter-pill').forEach(p => {
          const isActive = p.dataset.filter === activeMapFilter;
          p.style.background = isActive ? '#0ea5e9' : 'transparent';
          p.style.color = isActive ? '#ffffff' : '#334155';
        });
        updateMapMarkers();
      });
    });

    attachSubTabListeners();
  }

  function attachSubTabListeners() {
    const city = getCurrentCity();
    const destGuides = getDestGuides();

    // 1. Guides tab listeners
    if (activeTab === 'guides') {
      const aiSlot = container.querySelector('#ai-match-slot');
      const dirSlot = container.querySelector('#guide-directory-slot');

      function refreshGuideDirectory() {
        if (!dirSlot) return;
        renderGuideDirectory(
          dirSlot,
          getDestGuides(),
          rankedScores,
          (guideId) => {
            const guide = GUIDES.find(g => g.id === guideId);
            if (guide) {
              renderChatWindow(container.querySelector('#dash-chat-container'), guide, () => {
                container.querySelector('#dash-chat-container').innerHTML = '';
              });
            }
          },
          (guideId) => {
            const guide = GUIDES.find(g => g.id === guideId);
            if (guide) {
              renderPayPalModal(container.querySelector('#dash-modal-container'), guide, () => {
                container.querySelector('#dash-modal-container').innerHTML = '';
              });
            }
          },
          currentFallbackMessage,
          (guide) => {
            if (mapViewer && guide && guide.coords) {
              mapViewer.flyTo(guide.coords, 16);
            }
          }
        );
      }

      if (aiSlot) {
        renderAIMatchWidget(aiSlot, (userPrefs) => {
          currentFallbackMessage = null;
          if (userPrefs.language) {
            const hasLang = destGuides.some(g => g.languages.includes(userPrefs.language));
            if (!hasLang) {
              currentFallbackMessage = `No verified ${userPrefs.language}-speaking guides in ${city.name} — displaying available English-speaking guides instead.`;
              userPrefs.language = 'English';
            }
          }
          rankedScores = {};
          destGuides.forEach(g => {
            rankedScores[g.id] = calculateMatch(userPrefs, g);
          });
          refreshGuideDirectory();
        });
      }

      refreshGuideDirectory();

      // Guide filter chips
      container.querySelectorAll('.guide-filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          guideFilter = chip.dataset.filter;
          container.querySelectorAll('.guide-filter-chip').forEach(c => {
            const isActive = c.dataset.filter === guideFilter;
            c.style.background = isActive ? '#0ea5e9' : '#ffffff';
            c.style.color = isActive ? '#ffffff' : '#475569';
            c.style.borderColor = isActive ? '#0ea5e9' : '#cbd5e1';
          });
          refreshGuideDirectory();
        });
      });

      // Merge Become Local trigger
      const applyBtn = container.querySelector('#btn-apply-as-guide');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          renderBecomeLocalView(container.querySelector('#dash-modal-container'), { initialMode: 'apply' });
        });
      }
    }

    // 2. Rules filters
    container.querySelectorAll('.rule-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ruleFilter = btn.dataset.filter;
        const scrollArea = container.querySelector('#sidebar-scroll-area');
        if (scrollArea) {
          scrollArea.innerHTML = renderRulesTab(city);
          attachSubTabListeners();
        }
      });
    });

    // 3. Price filters
    container.querySelectorAll('.price-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        priceFilter = btn.dataset.cat;
        const scrollArea = container.querySelector('#sidebar-scroll-area');
        if (scrollArea) {
          scrollArea.innerHTML = renderPricesTab(city);
          attachSubTabListeners();
        }
      });
    });

    // 4. Food filters
    container.querySelectorAll('.food-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        foodFilter = btn.dataset.filter;
        const scrollArea = container.querySelector('#sidebar-scroll-area');
        if (scrollArea) {
          scrollArea.innerHTML = renderFoodTab(city);
          attachSubTabListeners();
        }
      });
    });

    // 4. Fly to spot on map (Works for food, hidden spots, scams, guides)
    container.querySelectorAll('.btn-fly-to-spot').forEach(btn => {
      btn.addEventListener('click', () => {
        const lat = parseFloat(btn.dataset.lat);
        const lng = parseFloat(btn.dataset.lng);
        if (mapViewer && !isNaN(lat) && !isNaN(lng)) {
          mapViewer.flyTo([lat, lng], 16);
        }
      });
    });

    // 5. Safety Audit Controls
    const btnSafe = container.querySelector('#btn-audit-mode-safe');
    const btnFlawed = container.querySelector('#btn-audit-mode-flawed');
    if (btnSafe) {
      btnSafe.addEventListener('click', () => {
        auditMode = 'sample';
        const scrollArea = container.querySelector('#sidebar-scroll-area');
        if (scrollArea) {
          scrollArea.innerHTML = renderAuditTab(city);
          attachSubTabListeners();
        }
      });
    }
    if (btnFlawed) {
      btnFlawed.addEventListener('click', () => {
        auditMode = 'flawed';
        const scrollArea = container.querySelector('#sidebar-scroll-area');
        if (scrollArea) {
          scrollArea.innerHTML = renderAuditTab(city);
          attachSubTabListeners();
        }
      });
    }

    const btnEvalStop = container.querySelector('#btn-evaluate-stop');
    const selAuditPlace = container.querySelector('#select-audit-place');
    const inAuditTime = container.querySelector('#input-audit-time');
    const singleResultDiv = container.querySelector('#single-stop-audit-result');
    if (btnEvalStop && selAuditPlace && inAuditTime && singleResultDiv) {
      btnEvalStop.addEventListener('click', () => {
        const mockCity = getMockCity(currentDestId);
        const idx = buildIndex(mockCity);
        const scored = scoreStop({ place: selAuditPlace.value, time: inAuditTime.value }, mockCity, idx);
        singleResultDiv.style.display = 'block';
        const isHigh = scored.score >= 40;
        singleResultDiv.style.background = isHigh ? '#fee2e2' : '#f0fdf4';
        singleResultDiv.style.border = `1px solid ${isHigh ? '#fecaca' : '#bbf7d0'}`;
        singleResultDiv.style.color = isHigh ? '#991b1b' : '#166534';
        singleResultDiv.innerHTML = `
          <strong>${scored.name}</strong> • Risk Score: <strong>${scored.score}/100 (${scored.band.toUpperCase()})</strong><br/>
          Scam Score: ${scored.parts.scam}/35 • Night Risk: ${scored.parts.time}/20 • Crowd: ${scored.parts.crowd}/15 • Rules: ${scored.parts.rules}/15<br/>
          ${scored.findings.map(f => `• [${f.severity.toUpperCase()}] ${f.msg}`).join('<br/>') || '✓ No elevated scam or curfew risk detected at this hour.'}
        `;
      });
    }

    // 6. AI Scam Checker analysis with Quick Sample Chips
    const btnScamAi = container.querySelector('#btn-run-scam-ai');
    const inputScam = container.querySelector('#ai-scam-input');
    const resultDiv = container.querySelector('#ai-scam-result');

    function runScamAnalysis(text) {
      if (!text || !resultDiv) return;
      resultDiv.style.display = 'block';

      const lower = text.toLowerCase();
      const isBracelet = lower.includes('bracelet') || lower.includes('string') || lower.includes('wrist');
      const isGladiator = lower.includes('gladiator') || lower.includes('centurion') || lower.includes('photo') || lower.includes('armor');
      const isPetition = lower.includes('petition') || lower.includes('deaf') || lower.includes('sign') || lower.includes('clipboard');
      const isTaxi = lower.includes('taxi') || lower.includes('meter') || lower.includes('airport') || lower.includes('cdg') || lower.includes('fiumicino') || lower.includes('120');
      const isRing = lower.includes('ring') || lower.includes('gold');
      const isFish = lower.includes('fish') || lower.includes('100g') || lower.includes('gram') || lower.includes('weight') || lower.includes('steak');
      const isTicket = lower.includes('ticket') || lower.includes('termini') || lower.includes('kiosk') || lower.includes('machine') || lower.includes('help');
      const isMonte = lower.includes('cup') || lower.includes('ball') || lower.includes('bonneteau') || lower.includes('monte') || lower.includes('gambling') || lower.includes('shuffle');
      const isVaticanTout = lower.includes('vatican') && (lower.includes('tout') || lower.includes('skip') || lower.includes('line') || lower.includes('reseller'));
      const isDcc = lower.includes('atm') || lower.includes('dcc') || lower.includes('conversion') || lower.includes('exchange rate');
      const isQr = lower.includes('qr') || lower.includes('sticker');

      if (isBracelet) {
        resultDiv.style.background = '#fee2e2';
        resultDiv.style.color = '#991b1b';
        resultDiv.style.border = '1px solid #fecaca';
        resultDiv.innerHTML = `<strong>🚨 High Risk — Friendship Bracelet Ambush:</strong> Do not let anyone touch your wrist. Keep hands in pockets, firmly say "Non merci" / "No grazie", and walk away immediately. Never accept "free" string.`;
      } else if (isGladiator) {
        resultDiv.style.background = '#fee2e2';
        resultDiv.style.color = '#991b1b';
        resultDiv.style.border = '1px solid #fecaca';
        resultDiv.innerHTML = `<strong>🚨 High Risk — Illegal Centurion Photo Extortion:</strong> These costumed actors are legally banned outside the Colosseum. They aggressively demand €20–€50. Politely refuse and do not hand your phone.`;
      } else if (isPetition) {
        resultDiv.style.background = '#fee2e2';
        resultDiv.style.color = '#991b1b';
        resultDiv.style.border = '1px solid #fecaca';
        resultDiv.innerHTML = `<strong>🚨 High Risk — Fake Charity Petition Pickpocket:</strong> A coordinated distraction scheme. While you sign the fake clipboard, an accomplice pickpockets your bags. Ignore them completely and protect personal items.`;
      } else if (isMonte) {
        resultDiv.style.background = '#fee2e2';
        resultDiv.style.color = '#991b1b';
        resultDiv.style.border = '1px solid #fecaca';
        resultDiv.innerHTML = `<strong>🚨 High Risk — Three-Card Monte / Le Bonneteau Street Rig:</strong> Card and shell games on cardboard boxes are rigged by organized sleight-of-hand crews. The "winners" in the crowd are accomplices, and spotters pickpocket onlookers.`;
      } else if (isVaticanTout) {
        resultDiv.style.background = '#fee2e2';
        resultDiv.style.color = '#991b1b';
        resultDiv.style.border = '1px solid #fecaca';
        resultDiv.innerHTML = `<strong>🚨 High Risk — Vatican Skip-The-Line Touts:</strong> Aggressive street sellers claim the main line is 4 hours or closed. They charge €60–€90 for regular tickets. Buy only on museivaticani.va or via verified licensed guides.`;
      } else if (isTaxi) {
        resultDiv.style.background = '#fef3c7';
        resultDiv.style.color = '#92400e';
        resultDiv.style.border = '1px solid #fde68a';
        resultDiv.innerHTML = `<strong>⚠️ Regulated Flat Fare Alert:</strong> Both Paris and Rome have legally mandated airport flat taxi rates (€56/€65 in Paris; €55/€40 in Rome). Never accept rides from touts inside the terminal; use official taxi stands only.`;
      } else if (isRing) {
        resultDiv.style.background = '#fee2e2';
        resultDiv.style.color = '#991b1b';
        resultDiv.style.border = '1px solid #fecaca';
        resultDiv.innerHTML = `<strong>🚨 High Risk — Gold Ring Trick:</strong> The ring is brass. They pretend you dropped it and ask for money. Do not engage; leave it on the ground.`;
      } else if (isFish) {
        resultDiv.style.background = '#fef3c7';
        resultDiv.style.color = '#92400e';
        resultDiv.style.border = '1px solid #fde68a';
        resultDiv.innerHTML = `<strong>⚠️ 100g Price Deception:</strong> Fresh fish and steaks are often priced per 100g, turning an €8 quote into an €80 surprise bill. Insist that the waiter weigh and quote the final total price before cooking.`;
      } else if (isTicket) {
        resultDiv.style.background = '#fef3c7';
        resultDiv.style.color = '#92400e';
        resultDiv.style.border = '1px solid #fde68a';
        resultDiv.innerHTML = `<strong>⚠️ Station Ticket Machine Scammer:</strong> People lingering near automated kiosks will demand tips for touching buttons or pocket change. Use the touchscreen language flag yourself or go to the staffed booth.`;
      } else if (isDcc) {
        resultDiv.style.background = '#fef3c7';
        resultDiv.style.color = '#92400e';
        resultDiv.style.border = '1px solid #fde68a';
        resultDiv.innerHTML = `<strong>⚠️ ATM Dynamic Currency Conversion (DCC):</strong> Standalone Euronet ATMs add a hidden 10%–15% markup. Always choose "Charge in EUR" (local currency) to let your home bank convert at fair interbank rates.`;
      } else if (isQr) {
        resultDiv.style.background = '#fee2e2';
        resultDiv.style.color = '#991b1b';
        resultDiv.style.border = '1px solid #fecaca';
        resultDiv.innerHTML = `<strong>🚨 High Risk — Fraudulent QR Code Sticker:</strong> Scammers paste fake QR stickers over official parking meters and monument placards to siphon card credentials. Only use official city transit apps.`;
      } else {
        resultDiv.style.background = '#f0fdf4';
        resultDiv.style.color = '#166534';
        resultDiv.style.border = '1px solid #bbf7d0';
        resultDiv.innerHTML = `<strong>✓ AI Assessment:</strong> Stay alert in tourist hubs. When in doubt, consult a verified Local Guide Connect guide or ask uniformed transport staff.`;
      }
    }

    if (btnScamAi && inputScam) {
      btnScamAi.addEventListener('click', () => {
        runScamAnalysis(inputScam.value.trim());
      });
    }

    container.querySelectorAll('.btn-sample-scam-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        if (inputScam) inputScam.value = query;
        runScamAnalysis(query);
      });
    });
  }

  // Initial draw
  renderLayout();

  return () => {
    if (mapViewer) {
      mapViewer.destroy();
      mapViewer = null;
    }
  };
}
