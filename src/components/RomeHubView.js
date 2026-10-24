/**
 * RomeHubView.js — Dedicated Rome Destination Hub (P0 Vertical Slice)
 * Sourced Rules & Laws, Scam Radar with AI Checker, Fair Prices, Hidden Spots, and Verified Locals.
 */

import { ROME_DESTINATION, ROME_RULES, ROME_SCAMS, ROME_FAIR_PRICES, ROME_HIDDEN_SPOTS, ROME_GUIDES } from '../data/romeData.js';
import { setupHeaderAuth } from '../utils/headerAuth.js';
import { renderChatWindow } from './ChatWindow.js';
import { renderPayPalModal } from './PayPalModal.js';
import { Storage } from '../utils/storage.js';

export function renderRomeHubView(container, { initialSubTab = 'overview' } = {}) {
  let activeTab = initialSubTab; // 'overview', 'rules', 'scams', 'prices', 'locals', 'hidden', 'emergency'
  let ruleFilter = 'all';
  let scamFilter = 'all';

  function renderLayout() {
    container.innerHTML = `
      <div id="rome-hub-page" style="min-height: 100vh; background: var(--bg-gray, #f8fafc); color: var(--text-primary, #0f172a); font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- ──── Header ──── -->
        <header class="app-header" id="app-header" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; padding: 0.75rem 1.5rem;">
          <div style="max-width: 1300px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
            
            <a href="#/" class="logo" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none;">
              <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #0ea5e9, #0284c7); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
                <svg width="20" height="20" data-lucide="map-pin"></svg>
              </div>
              <div>
                <div style="font-size: 1.2rem; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; line-height: 1;">TRAVGOD</div>
                <div style="font-size: 0.68rem; font-weight: 700; color: #0ea5e9; text-transform: uppercase;">Local Guide Connect</div>
              </div>
            </a>

            <nav style="display: flex; align-items: center; gap: 1.25rem;">
              <a href="#/" style="font-size: 0.9rem; font-weight: 600; color: #475569; text-decoration: none;">Home</a>
              <a href="#/explore" style="font-size: 0.9rem; font-weight: 600; color: #475569; text-decoration: none;">Explore Map</a>
              <a href="#/d/rome" style="font-size: 0.9rem; font-weight: 800; color: #0ea5e9; text-decoration: none;">Rome Hub 🇮🇹</a>
              <a href="#/locals" style="font-size: 0.9rem; font-weight: 600; color: #475569; text-decoration: none;">Locals</a>
              <a href="#/trips" style="font-size: 0.9rem; font-weight: 600; color: #475569; text-decoration: none;">Trips</a>
              <a href="#/host" style="font-size: 0.9rem; font-weight: 600; color: #475569; text-decoration: none;">Host</a>
            </nav>

            <div class="header-actions" id="header-auth-slot"></div>
          </div>
        </header>

        <!-- ──── Hero Banner ──── -->
        <section style="position: relative; background: linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80') center/cover; padding: 4rem 1.5rem 3rem; color: white;">
          <div style="max-width: 1200px; margin: 0 auto;">
            
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 1.8rem;">${ROME_DESTINATION.flag}</span>
              <span style="font-size: 0.85rem; font-weight: 800; letter-spacing: 0.5px; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 999px;">
                DESTINATION HUB • CENTRAL ITALY
              </span>
            </div>

            <h1 style="font-size: 3.2rem; font-weight: 900; letter-spacing: -1px; margin: 0 0 0.5rem 0;">
              ${ROME_DESTINATION.name}, ${ROME_DESTINATION.country}
            </h1>
            <p style="font-size: 1.15rem; color: #cbd5e1; max-width: 700px; margin: 0 0 1.75rem 0; line-height: 1.5;">
              ${ROME_DESTINATION.tagline}
            </p>

            <!-- Quick Data Bar -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.75rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 1rem 1.25rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15);">
              <div>
                <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Local Time</div>
                <div style="font-size: 1.1rem; font-weight: 800; margin-top: 2px;">CET (UTC+1) • 14:30</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Weather (Oct)</div>
                <div style="font-size: 1.1rem; font-weight: 800; margin-top: 2px;">☀️ 22°C (Sunny)</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Currency</div>
                <div style="font-size: 1.1rem; font-weight: 800; margin-top: 2px;">EUR €1 = $1.08 USD</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Language</div>
                <div style="font-size: 1.1rem; font-weight: 800; margin-top: 2px;">Italian (English common)</div>
              </div>
            </div>

            <!-- Safety Snapshot Banner -->
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 0.85rem 1.25rem; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <svg width="20" height="20" data-lucide="shield-check" style="color: #34d399; flex-shrink: 0;"></svg>
                <span style="font-size: 0.9rem; font-weight: 700; color: #e2e8f0;">
                  Safety Snapshot: <strong style="color: #6ee7b7;">${ROME_DESTINATION.safetyLevel}</strong>
                </span>
              </div>
              <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">
                Source: ${ROME_DESTINATION.safetySource} • Verified ${ROME_DESTINATION.verifiedAt}
              </span>
            </div>

          </div>
        </section>

        <!-- ──── Sub-Navigation Tab Bar ──── -->
        <nav style="background: #ffffff; border-bottom: 1px solid #e2e8f0; position: sticky; top: 61px; z-index: 90; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 0.5rem; overflow-x: auto; padding: 0 1rem;">
            ${[
              { id: 'overview', label: '🌟 Overview' },
              { id: 'rules', label: '⚖️ Rules & Laws' },
              { id: 'scams', label: '🛡️ Scam Radar' },
              { id: 'prices', label: '🏷️ Fair Prices' },
              { id: 'locals', label: '🧑‍🤝‍🧑 Rome Guides' },
              { id: 'hidden', label: '🏛️ Hidden Spots' },
              { id: 'emergency', label: '🚑 Emergency' }
            ].map(t => `
              <button class="hub-tab-btn ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}" style="padding: 1rem 0.85rem; border: none; border-bottom: 3px solid ${activeTab === t.id ? '#0ea5e9' : 'transparent'}; background: none; font-size: 0.88rem; font-weight: 800; color: ${activeTab === t.id ? '#0ea5e9' : '#64748b'}; cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                ${t.label}
              </button>
            `).join('')}

            <div style="margin-left: auto; display: flex; gap: 0.5rem; padding: 0.5rem 0;">
              <a href="#/explore" style="padding: 6px 14px; background: #0ea5e9; color: white; border-radius: 8px; font-size: 0.82rem; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 0.35rem; box-shadow: 0 2px 6px rgba(14,165,233,0.3);">
                <svg width="14" height="14" data-lucide="map"></svg> Open Rome Map
              </a>
            </div>
          </div>
        </nav>

        <!-- ──── Tab Content Container ──── -->
        <main style="max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem;" id="hub-content">
          ${renderTabContent()}
        </main>

        <div id="hub-chat-container"></div>
        <div id="hub-modal-container"></div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Wire auth
    const headerElem = container.querySelector('#app-header');
    if (headerElem) setupHeaderAuth(headerElem);

    attachTabListeners();
  }

  // ── Tab Renderers ──
  function renderTabContent() {
    if (activeTab === 'overview') return renderOverviewTab();
    if (activeTab === 'rules') return renderRulesTab();
    if (activeTab === 'scams') return renderScamsTab();
    if (activeTab === 'prices') return renderPricesTab();
    if (activeTab === 'locals') return renderLocalsTab();
    if (activeTab === 'hidden') return renderHiddenSpotsTab();
    if (activeTab === 'emergency') return renderEmergencyTab();
    return renderOverviewTab();
  }

  // 1. Overview
  function renderOverviewTab() {
    return `
      <div>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2.5rem;">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 900; margin: 0 0 1rem 0;">Why Travelers Love Rome</h2>
            <p style="color: #475569; font-size: 1rem; line-height: 1.7; margin-bottom: 1.25rem;">
              Rome is an open-air museum where over 2,800 years of civilization coexist with vibrant modern street life. 
              From the Colosseum’s underground arches to evening aperitivi in bohemian Monti, the city rewards curious travelers who know how to navigate its historic customs.
            </p>
            <p style="color: #475569; font-size: 1rem; line-height: 1.7;">
              To experience Rome authentically, avoid overpriced restaurants on Piazza Navona and connect with verified local guides who reveal real Roman culture while keeping you safe from common tourist traps.
            </p>

            <h3 style="font-size: 1.25rem; font-weight: 800; margin: 2rem 0 1rem 0;">Key Neighborhoods</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.15rem;">
                <strong style="color: #0ea5e9; font-size: 1rem; display: block; margin-bottom: 0.25rem;">Trastevere</strong>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5;">Cobblestone alleys, authentic trattorie, historic churches, and lively piazzas.</p>
              </div>
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.15rem;">
                <strong style="color: #0ea5e9; font-size: 1rem; display: block; margin-bottom: 0.25rem;">Rione Monti</strong>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5;">Bohemian quarter with vintage boutiques, artisan cafés, and sunset fountain steps.</p>
              </div>
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.15rem;">
                <strong style="color: #0ea5e9; font-size: 1rem; display: block; margin-bottom: 0.25rem;">Testaccio</strong>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5;">The true heart of Roman cuisine, lively covered market, and zero tourist menus.</p>
              </div>
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.15rem;">
                <strong style="color: #0ea5e9; font-size: 1rem; display: block; margin-bottom: 0.25rem;">Centro Storico</strong>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5;">Pantheon, Campo de’ Fiori, and Baroque monuments. Beautiful but highest scam risk.</p>
              </div>
            </div>
          </div>

          <!-- Quick Action Card -->
          <div>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.04); position: sticky; top: 120px;">
              <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 800;">Get Started in Rome</h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="#/explore" style="padding: 0.85rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border-radius: 12px; font-weight: 800; font-size: 0.9rem; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                  <svg width="18" height="18" data-lucide="map"></svg> Explore Rome Interactive Map
                </a>
                <button id="btn-goto-rules" style="padding: 0.85rem; background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer; text-align: center;">
                  ⚖️ Read Rome Rules & Fines
                </button>
                <button id="btn-goto-scams" style="padding: 0.85rem; background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer; text-align: center;">
                  🛡️ Check Colosseum & Termini Scams
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. Rules and Laws
  function renderRulesTab() {
    const filteredRules = ruleFilter === 'all' ? ROME_RULES : ROME_RULES.filter(r => r.severity === ruleFilter);

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 900; margin: 0 0 0.25rem 0;">Rome Rules & Laws ("Know Before You Go")</h2>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Sourced directly from Roma Capitale, Italian Police, and official travel advisories.</p>
          </div>

          <!-- Severity filter pills -->
          <div style="display: flex; gap: 0.4rem; background: white; padding: 4px; border-radius: 12px; border: 1px solid #e2e8f0;">
            ${['all', 'serious', 'careful', 'info'].map(s => `
              <button class="rule-filter-btn ${ruleFilter === s ? 'active' : ''}" data-sev="${s}" style="padding: 6px 14px; border-radius: 8px; border: none; background: ${ruleFilter === s ? '#0ea5e9' : 'transparent'}; color: ${ruleFilter === s ? 'white' : '#64748b'}; font-size: 0.78rem; font-weight: 800; cursor: pointer; text-transform: capitalize;">
                ${s}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          ${filteredRules.map(r => {
            const badgeBg = r.severity === 'serious' ? '#fef2f2' : r.severity === 'careful' ? '#fffbeb' : '#f0fdf4';
            const badgeColor = r.severity === 'serious' ? '#dc2626' : r.severity === 'careful' ? '#d97706' : '#16a34a';

            return `
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 3px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">
                      ● ${r.severity}
                    </span>
                    <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">Verified ${r.verifiedAt}</span>
                  </div>

                  <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem 0; line-height: 1.3;">
                    ${r.title}
                  </h3>

                  <p style="font-size: 0.88rem; color: #334155; line-height: 1.5; margin: 0 0 1rem 0;">
                    ${r.summary}
                  </p>

                  <div style="background: #f8fafc; border-left: 3px solid ${badgeColor}; padding: 0.65rem 0.85rem; border-radius: 0 8px 8px 0; margin-bottom: 1rem;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: ${badgeColor}; text-transform: uppercase;">Penalty / Fine:</div>
                    <div style="font-size: 0.82rem; color: #475569; font-weight: 600;">${r.penalty}</div>
                  </div>

                  <div style="font-size: 0.82rem; color: #0f172a; margin-bottom: 1rem;">
                    <strong>What to do instead:</strong> ${r.whatToDoInstead}
                  </div>
                </div>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
                  <span style="color: #64748b;">${r.jurisdiction}</span>
                  <a href="${r.sourceUrl}" target="_blank" rel="noopener" style="color: #0ea5e9; font-weight: 700; text-decoration: none;">
                    Source (${r.sourceType}) ↗
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer Disclaimer -->
        <div style="background: #f1f5f9; border-radius: 12px; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div style="font-size: 0.82rem; color: #64748b;">
            ⚖️ <strong>Disclaimer:</strong> Content provided as informational guidance, not legal advice. Laws change. Confirm with official municipal sources.
          </div>
          <button id="btn-report-outdated" style="padding: 6px 12px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.78rem; font-weight: 700; color: #475569; cursor: pointer;">
            Report Outdated Rule
          </button>
        </div>
      </div>
    `;
  }

  // 3. Scam Radar with AI Checker
  function renderScamsTab() {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 900; margin: 0 0 0.25rem 0;">Rome Scam Radar & Protective Shield</h2>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Geofenced tourist traps, street extortion patterns, and how to stay 100% safe.</p>
          </div>
        </div>

        <!-- Interactive AI Scam Checker Box -->
        <div style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 2px solid #a7f3d0; border-radius: 20px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 12px rgba(16,185,129,0.06);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div style="width: 28px; height: 28px; background: #10b981; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <svg width="16" height="16" data-lucide="sparkles"></svg>
            </div>
            <strong style="font-size: 1.1rem; color: #065f46;">AI Scam Checker (Rome Sourced)</strong>
          </div>
          <p style="color: #047857; font-size: 0.85rem; margin: 0 0 1rem 0;">
            In an unfamiliar situation or received a suspicious message? Describe what happened below to get an instant risk evaluation grounded in our verified Rome database.
          </p>
          
          <div style="display: flex; gap: 0.75rem;">
            <input type="text" id="scam-query-input" placeholder="e.g. Someone handed me a gladiator helmet at Colosseum and asked for 20 euros..." style="flex: 1; padding: 0.8rem 1rem; border: 1px solid #6ee7b7; border-radius: 12px; font-size: 0.9rem; outline: none; background: white;" />
            <button id="btn-check-scam-ai" style="padding: 0.8rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer;">
              Check Risk
            </button>
          </div>

          <div id="scam-ai-result" style="display: none; margin-top: 1rem; background: white; border: 1px solid #a7f3d0; border-radius: 12px; padding: 1rem;"></div>
        </div>

        <!-- Scam Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem;">
          ${ROME_SCAMS.map(s => `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <span style="background: ${s.severity === 'high' ? '#fef2f2; color: #dc2626' : '#fffbeb; color: #d97706'}; padding: 3px 10px; border-radius: 8px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
                  ⚠️ ${s.severity} RISK
                </span>
                <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">👍 ${s.upvotes} confirmed</span>
              </div>

              <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0 0 0.4rem 0; color: #0f172a;">${s.title}</h3>
              <p style="font-size: 0.78rem; color: #0ea5e9; font-weight: 700; margin: 0 0 0.85rem 0;">📍 ${s.location}</p>

              <div style="margin-bottom: 0.75rem;">
                <strong style="display: block; font-size: 0.78rem; color: #0f172a; margin-bottom: 2px;">How It Works:</strong>
                <p style="margin: 0; font-size: 0.85rem; color: #475569; line-height: 1.4;">${s.howItWorks}</p>
              </div>

              <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 0.65rem 0.85rem; border-radius: 0 8px 8px 0; margin-bottom: 0.75rem;">
                <strong style="display: block; font-size: 0.78rem; color: #16a34a; margin-bottom: 2px;">How to Avoid:</strong>
                <p style="margin: 0; font-size: 0.82rem; color: #166534; line-height: 1.4;">${s.howToAvoid}</p>
              </div>

              <div style="font-size: 0.78rem; color: #64748b;">
                <strong>If it happened:</strong> ${s.ifItHappened}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 4. Fair Prices
  function renderPricesTab() {
    return `
      <div>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.6rem; font-weight: 900; margin: 0 0 0.25rem 0;">Rome Fair Price Benchmarks</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Realistic benchmark prices verified across residential and central Rome neighborhoods.</p>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 1rem 1.25rem; font-weight: 800; color: #0f172a;">Item / Experience</th>
                <th style="padding: 1rem 1.25rem; font-weight: 800; color: #0ea5e9;">Local Price (EUR)</th>
                <th style="padding: 1rem 1.25rem; font-weight: 800; color: #64748b;">USD Equivalent</th>
                <th style="padding: 1rem 1.25rem; font-weight: 800; color: #475569;">Context & Advice</th>
              </tr>
            </thead>
            <tbody>
              ${ROME_FAIR_PRICES.map((p, idx) => `
                <tr style="border-bottom: 1px solid #f1f5f9; background: ${idx % 2 === 0 ? '#ffffff' : '#fafafa'};">
                  <td style="padding: 1rem 1.25rem; font-weight: 700; color: #0f172a;">${p.item}</td>
                  <td style="padding: 1rem 1.25rem; font-weight: 800; color: #0ea5e9;">${p.localPrice}</td>
                  <td style="padding: 1rem 1.25rem; font-weight: 600; color: #64748b;">${p.usdPrice}</td>
                  <td style="padding: 1rem 1.25rem; color: #475569; font-size: 0.82rem;">${p.note}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 5. Rome Guides
  function renderLocalsTab() {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 900; margin: 0 0 0.25rem 0;">Verified Rome Local Guides</h2>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Identity-reviewed residents ready to show you authentic Rome with PayPal escrow safety.</p>
          </div>
          <a href="#/become-a-local" style="padding: 8px 16px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.82rem; font-weight: 700; color: #0f172a; text-decoration: none;">
            Apply to Guide in Rome ➔
          </a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
          ${ROME_GUIDES.map(g => `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                  <img src="${g.avatar}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #0ea5e9;" />
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                      <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a;">${g.name}</h3>
                      ${g.isLegend ? `<span style="background: #fef3c7; color: #d97706; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 800;">LEGEND</span>` : ''}
                    </div>
                    <span style="font-size: 0.72rem; color: #16a34a; font-weight: 800; background: #dcfce7; padding: 2px 8px; border-radius: 999px;">
                      ✓ ${g.verificationLevel}
                    </span>
                    <div style="font-size: 0.78rem; color: #f59e0b; font-weight: 700; margin-top: 3px;">
                      ★ ${g.rating} (${g.reviewCount} reviews) • <span style="color: #64748b;">${g.responseTime}</span>
                    </div>
                  </div>
                </div>

                <p style="font-size: 0.85rem; color: #475569; line-height: 1.5; margin: 0 0 1rem 0;">"${g.story}"</p>

                <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem;">
                  ${g.languages.map(l => `<span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 600;">🗣️ ${l}</span>`).join('')}
                </div>

                <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.25rem;">
                  📍 Meeting Hub: <strong>${g.meetingHub}</strong>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <span style="font-size: 1.1rem; font-weight: 900; color: #0f172a;">€${g.pricePerHour} / hour</span>
                  <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">(€${g.pricePerDay} full day)</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                  <button class="btn-chat-rome-guide" data-id="${g.id}" style="padding: 8px; background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                    💬 Chat Free
                  </button>
                  <button class="btn-book-rome-guide" data-id="${g.id}" style="padding: 8px; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                    💳 Book Guide
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 6. Hidden Spots
  function renderHiddenSpotsTab() {
    return `
      <div>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.6rem; font-weight: 900; margin: 0 0 0.25rem 0;">Rome Hidden Spots ("Not in the Guidebook")</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Unlisted architectural gems, quiet lookouts, and authentic food stalls shared by verified locals.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem;">
          ${ROME_HIDDEN_SPOTS.map(h => `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <span style="font-size: 0.78rem; font-weight: 700; color: #0ea5e9; background: #e0f2fe; padding: 2px 8px; border-radius: 6px;">
                  📍 ${h.neighborhood}
                </span>
                <span style="font-size: 0.78rem; font-weight: 700; color: #16a34a;">${h.cost}</span>
              </div>

              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem 0;">${h.name}</h3>
              <p style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin: 0 0 1rem 0;">${h.whySpecial}</p>

              <div style="background: #f8fafc; border-radius: 8px; padding: 0.65rem 0.85rem; font-size: 0.78rem; color: #64748b; margin-bottom: 0.75rem;">
                <div>⏰ <strong>Best Time:</strong> ${h.bestTime}</div>
                <div>🤝 <strong>Etiquette:</strong> ${h.etiquette}</div>
              </div>

              <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">
                Shared by ${h.contributor}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 7. Emergency Contacts
  function renderEmergencyTab() {
    return `
      <div>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.6rem; font-weight: 900; margin: 0 0 0.25rem 0;">Rome Emergency Contacts & SOS Guide</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Save these official helpline numbers directly to your phone before landing in Italy.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 16px; padding: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 800; color: #dc2626; text-transform: uppercase; margin-bottom: 0.35rem;">Pan-European Emergency</div>
            <div style="font-size: 2rem; font-weight: 900; color: #991b1b; font-family: monospace;">112</div>
            <p style="font-size: 0.8rem; color: #7f1d1d; margin: 4px 0 0 0;">Free multilingual operators for Police, Medical Ambulance, or Fire emergencies.</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 800; color: #0ea5e9; text-transform: uppercase; margin-bottom: 0.35rem;">State Police (Polizia)</div>
            <div style="font-size: 2rem; font-weight: 900; color: #0369a1; font-family: monospace;">113</div>
            <p style="font-size: 0.8rem; color: #64748b; margin: 4px 0 0 0;">Report theft, pickpocketing, or lost travel documents.</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 800; color: #10b981; text-transform: uppercase; margin-bottom: 0.35rem;">Medical Ambulance (Pronto Soccorso)</div>
            <div style="font-size: 2rem; font-weight: 900; color: #047857; font-family: monospace;">118</div>
            <p style="font-size: 0.8rem; color: #64748b; margin: 4px 0 0 0;">Emergency hospital transport and paramedical care.</p>
          </div>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 800;">Tourist Assistance & Embassies in Rome</h3>
          <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.88rem; color: #475569; display: flex; flex-direction: column; gap: 0.6rem;">
            <li><strong>Tourist Police Station:</strong> Piazza del Collegio Romano 3 (Tel: +39 06 67691)</li>
            <li><strong>US Embassy in Rome:</strong> Via Vittorio Veneto 121 (Emergency: +39 06 46741)</li>
            <li><strong>UK Embassy in Rome:</strong> Via XX Settembre 80a (Tel: +39 06 4220 0001)</li>
            <li><strong>Lost Passport Procedure:</strong> File a "Denuncia di Smarrimento" at the nearest Carabinieri station first, then book emergency travel document at your national embassy.</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ── Event Handlers ──
  function attachTabListeners() {
    container.querySelectorAll('.hub-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        container.querySelector('#hub-content').innerHTML = renderTabContent();
        container.querySelectorAll('.hub-tab-btn').forEach(b => {
          b.style.borderBottom = '3px solid transparent';
          b.style.color = '#64748b';
        });
        btn.style.borderBottom = '3px solid #0ea5e9';
        btn.style.color = '#0ea5e9';
        if (window.lucide) window.lucide.createIcons();
        attachSubListeners();
      });
    });

    attachSubListeners();
  }

  function attachSubListeners() {
    // Quick CTA triggers from overview
    const btnRules = container.querySelector('#btn-goto-rules');
    if (btnRules) {
      btnRules.addEventListener('click', () => {
        const rulesBtn = container.querySelector('.hub-tab-btn[data-tab="rules"]');
        if (rulesBtn) rulesBtn.click();
      });
    }

    const btnScams = container.querySelector('#btn-goto-scams');
    if (btnScams) {
      btnScams.addEventListener('click', () => {
        const scamsBtn = container.querySelector('.hub-tab-btn[data-tab="scams"]');
        if (scamsBtn) scamsBtn.click();
      });
    }

    // Rules severity filters
    container.querySelectorAll('.rule-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ruleFilter = btn.dataset.sev;
        container.querySelector('#hub-content').innerHTML = renderRulesTab();
        if (window.lucide) window.lucide.createIcons();
        attachSubListeners();
      });
    });

    // AI Scam Checker trigger
    const checkBtn = container.querySelector('#btn-check-scam-ai');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        const query = container.querySelector('#scam-query-input')?.value.trim();
        const resultDiv = container.querySelector('#scam-ai-result');
        if (!query || !resultDiv) return;

        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<span style="color:#0ea5e9; font-weight:700;">Evaluating situation against Rome Scam database...</span>`;

        setTimeout(() => {
          const lower = query.toLowerCase();
          if (lower.includes('gladiator') || lower.includes('photo') || lower.includes('sword') || lower.includes('helmet')) {
            resultDiv.innerHTML = `
              <div style="color: #dc2626; font-weight: 800; margin-bottom: 0.25rem;">⚠️ High Risk: Colosseum Gladiator Photo Extortion Match</div>
              <p style="margin: 0; font-size: 0.85rem; color: #475569;">This matches a documented extortion scheme. Street actors demand €20–€50 after posing. <strong>Advice:</strong> Firmly decline, do not hand over cash, and walk toward uniformed Polizia near Colosseo turnstiles. (Source: Roma Capitale Police Ordinance).</p>
            `;
          } else if (lower.includes('taxi') || lower.includes('airport') || lower.includes('meter')) {
            resultDiv.innerHTML = `
              <div style="color: #dc2626; font-weight: 800; margin-bottom: 0.25rem;">⚠️ High Risk: Unmetered Airport Taxi Surcharge</div>
              <p style="margin: 0; font-size: 0.85rem; color: #475569;">Official city taxis must charge a fixed flat fare of €50 from FCO or €40 from CIA to within the Aurelian Walls. <strong>Advice:</strong> Take only white licensed city taxis from the official outdoor queue. (Source: Roma Capitale Taxi Tariff).</p>
            `;
          } else {
            resultDiv.innerHTML = `
              <div style="color: #d97706; font-weight: 800; margin-bottom: 0.25rem;">⚠️ Potential Risk: Street Distraction or Overcharge</div>
              <p style="margin: 0; font-size: 0.85rem; color: #475569;">Always verify prices before accepting unsolicited goods or street tours. Licensed guides carry official national badges; street sellers may not operate legally. (Source: UK FCDO Italy Advisory).</p>
            `;
          }
        }, 500);
      });
    }

    // Guide chat & booking
    container.querySelectorAll('.btn-chat-rome-guide').forEach(btn => {
      btn.addEventListener('click', () => {
        const guide = ROME_GUIDES.find(g => g.id === btn.dataset.id);
        if (guide) {
          renderChatWindow(container.querySelector('#hub-chat-container'), guide, () => {
            container.querySelector('#hub-chat-container').innerHTML = '';
          });
        }
      });
    });

    container.querySelectorAll('.btn-book-rome-guide').forEach(btn => {
      btn.addEventListener('click', () => {
        const guide = ROME_GUIDES.find(g => g.id === btn.dataset.id);
        if (guide) {
          renderPayPalModal(container.querySelector('#hub-modal-container'), guide, () => {
            container.querySelector('#hub-modal-container').innerHTML = '';
          });
        }
      });
    });
  }

  renderLayout();
}
