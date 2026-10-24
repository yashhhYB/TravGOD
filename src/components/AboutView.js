/**
 * AboutView.js — Standardized, Premium About Page for TRAVGOD
 * Highlights Hackathon Mission, Core Architectural Pillars (Qloo, CARTO, PayPal, ScamSense),
 * Verified Metrics, and Flagship Destination Support.
 */

import { getAppHeaderHtml, initAppHeader } from './AppHeader.js';

export function renderAboutView(container) {
  container.innerHTML = `
    <div id="about-page" style="min-height: 100vh; background: #ffffff; color: var(--text-primary, #0f172a); font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Fixed Standard Header -->
      ${getAppHeaderHtml({ activeNav: 'about', isSolid: true })}

      <!-- Main Content (with 72px top offset) -->
      <main style="padding-top: 72px;">
        
        <!-- Hero Section -->
        <section style="background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%); padding: 5rem 1.5rem 3.5rem; text-align: center; border-bottom: 1px solid #e2e8f0;">
          <div style="max-width: 860px; margin: 0 auto;">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; padding: 6px 16px; border-radius: 999px; font-size: 0.82rem; font-weight: 800; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
              <span>🛡️</span> Built for Build with AI Hackathon
            </div>
            
            <h1 style="font-size: 3rem; font-weight: 900; letter-spacing: -1.2px; line-height: 1.15; margin: 0 0 1.25rem 0; color: #0f172a;">
              Travel Safer. Connect Real.
            </h1>
            
            <p style="font-size: 1.2rem; color: #475569; line-height: 1.6; margin: 0 auto 2rem; max-width: 720px;">
              TRAVGOD eliminates tourist traps, opaque pricing, and street fraud by uniting 
              <strong>Qloo Cultural Intelligence</strong>, <strong>CARTO Geospatial Basemaps</strong>, and 
              <strong>PayPal Neutral Escrow</strong> into a single trusted travel ecosystem.
            </p>

            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <a href="#/explore" style="padding: 0.85rem 1.75rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border-radius: 14px; font-weight: 800; text-decoration: none; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(14,165,233,0.35); transition: transform 0.2s;">
                Explore Flagship Cities (Paris & Rome) ➔
              </a>
              <a href="#/trips" style="padding: 0.85rem 1.75rem; background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 14px; font-weight: 800; text-decoration: none; font-size: 0.95rem; transition: background 0.2s;">
                View Escrow Bookings & Itinerary
              </a>
            </div>
          </div>
        </section>

        <!-- Mission / The Problem & Solution -->
        <section style="max-width: 1100px; margin: 0 auto; padding: 4.5rem 1.5rem;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-size: 2.1rem; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; margin: 0 0 0.5rem 0;">
              The Mission: Restoring Trust to Travel
            </h2>
            <p style="color: #64748b; font-size: 1.05rem; max-width: 650px; margin: 0 auto;">
              Over $12 Billion is lost annually to rigged tourist menus, scam artists, and predatory street touts in top European destinations.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem;">
            
            <!-- Card 1: Problem -->
            <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 20px; padding: 2rem;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: #ffe4e6; color: #e11d48; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 1.25rem;">
                ⚠️
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #9f1239; margin: 0 0 0.75rem 0;">The Tourist Trap Epidemic</h3>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; color: #881337; line-height: 1.5;">
                <li>• Unmetered rogue airport cabs charging €120+ instead of flat city rates.</li>
                <li>• Banned Colosseum gladiators aggressively demanding €50 for photos.</li>
                <li>• Menus quoting fish by the 100g leading to €180 surprise dinner receipts.</li>
                <li>• Generic online reviews crowded with paid promotional ratings.</li>
              </ul>
            </div>

            <!-- Card 2: Solution -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; padding: 2rem;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 1.25rem;">
                🛡️
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #166534; margin: 0 0 0.75rem 0;">The TRAVGOD Architecture</h3>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; color: #14532d; line-height: 1.5;">
                <li>• <strong>Neutral PayPal Escrow:</strong> 100% money-back protection until GPS check-in.</li>
                <li>• <strong>AI Scam Radar:</strong> Live 300m proximity warnings on itinerary stops.</li>
                <li>• <strong>Verified Fair Prices:</strong> Real local costs vs. rip-off rates with municipal legal citations.</li>
                <li>• <strong>Authentic Food & Guides:</strong> Zero-trap recommendations handpicked by true locals.</li>
              </ul>
            </div>

          </div>
        </section>

        <!-- Technical Pillars Showcase -->
        <section style="background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 4.5rem 1.5rem;">
          <div style="max-width: 1100px; margin: 0 auto;">
            
            <div style="text-align: center; margin-bottom: 3.5rem;">
              <span style="font-size: 0.8rem; font-weight: 800; color: #0ea5e9; text-transform: uppercase;">Core Engineering</span>
              <h2 style="font-size: 2.1rem; font-weight: 900; color: #0f172a; margin: 0.25rem 0 0.5rem 0;">
                Powered by Industry-Leading Technologies
              </h2>
              <p style="color: #64748b; font-size: 1rem;">The advanced platforms that make TRAVGOD intelligent, safe, and lightning fast.</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
              
              <!-- Pillar 1 -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                  <svg width="22" height="22" data-lucide="sparkles"></svg>
                </div>
                <h4 style="margin: 0 0 0.4rem 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">Qloo Taste AI™</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5;">
                  Deep cultural graph understanding traveler DNA (Food & Wine, Architecture, History) to rank authentic guides and non-touristy culinary gems with high confidence scores.
                </p>
              </div>

              <!-- Pillar 2 -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                  <svg width="22" height="22" data-lucide="map"></svg>
                </div>
                <h4 style="margin: 0 0 0.4rem 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">CARTO Basemaps & Leaflet</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5;">
                  CARTO Voyager vector/raster basemaps with custom pins for verified guides, secret bakeries, municipal scam threat clusters, and one-click coordinate fly-to transitions.
                </p>
              </div>

              <!-- Pillar 3 -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                  <svg width="22" height="22" data-lucide="shield-check"></svg>
                </div>
                <h4 style="margin: 0 0 0.4rem 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">PayPal Escrow Protocol</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5;">
                  Dual-key escrow locking funds on booking and executing payouts only when the traveler triggers GPS in-person check-in on tour day, eliminating fraudulent bookings.
                </p>
              </div>

              <!-- Pillar 4 -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                  <svg width="22" height="22" data-lucide="alert-triangle"></svg>
                </div>
                <h4 style="margin: 0 0 0.4rem 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">ScamSense Proximity Radar</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5;">
                  Active safety engine flagging known street scams (Sacré-Cœur friendship string, Colosseum centurions, unmetered taxis) within a 300m walking radius of itinerary stops.
                </p>
              </div>

            </div>

          </div>
        </section>

        <!-- Flagship Cities Status -->
        <section style="max-width: 1100px; margin: 0 auto; padding: 4.5rem 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span style="font-size: 0.8rem; font-weight: 800; color: #0ea5e9; text-transform: uppercase;">Active Coverage</span>
              <h2 style="font-size: 2rem; font-weight: 900; color: #0f172a; margin: 0.25rem 0 0 0;">
                Two Flagship Cities Live
              </h2>
            </div>
            <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">
              Tokyo, Barcelona, Bangkok & Cairo coming soon in Q1 2027
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            
            <!-- Paris Card -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              <div style="height: 160px; position: relative;">
                <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%);"></div>
                <div style="position: absolute; bottom: 12px; left: 16px;">
                  <h3 style="margin: 0; color: white; font-size: 1.4rem; font-weight: 900;">🇫🇷 Paris, France</h3>
                  <span style="font-size: 0.8rem; color: #bae6fd; font-weight: 700;">Safety Index: 92/100 • 6 Verified Guides • 7 Food Gems</span>
                </div>
              </div>
              <div style="padding: 1.25rem;">
                <p style="font-size: 0.85rem; color: #475569; margin: 0 0 1rem 0; line-height: 1.5;">
                  Covering Le Marais, Montmartre, Canal Saint-Martin, and Latin Quarter. Features official Préfecture de Police citations, Navigo pricing, and ScamSense radar.
                </p>
                <a href="#/explore" style="font-size: 0.85rem; font-weight: 800; color: #0ea5e9; text-decoration: none;">Explore Paris Hub ➔</a>
              </div>
            </div>

            <!-- Rome Card -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              <div style="height: 160px; position: relative;">
                <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%);"></div>
                <div style="position: absolute; bottom: 12px; left: 16px;">
                  <h3 style="margin: 0; color: white; font-size: 1.4rem; font-weight: 900;">🇮🇹 Rome, Italy</h3>
                  <span style="font-size: 0.8rem; color: #bae6fd; font-weight: 700;">Safety Index: 90/100 • 6 Verified Guides • 7 Food Gems</span>
                </div>
              </div>
              <div style="padding: 1.25rem;">
                <p style="font-size: 0.85rem; color: #475569; margin: 0 0 1rem 0; line-height: 1.5;">
                  Covering Trastevere, Centro Storico, Monti, and Testaccio. Features Polizia di Stato alerts, BIT transit cards, and authentic carbonara benchmarks.
                </p>
                <a href="#/explore" style="font-size: 0.85rem; font-weight: 800; color: #0ea5e9; text-decoration: none;">Explore Rome Hub ➔</a>
              </div>
            </div>

          </div>
        </section>

        <!-- Bottom CTA -->
        <section style="background: linear-gradient(135deg, #0284c7, #0369a1); color: white; padding: 4rem 1.5rem; text-align: center;">
          <div style="max-width: 700px; margin: 0 auto;">
            <h2 style="font-size: 2.2rem; font-weight: 900; margin: 0 0 1rem 0;">Ready to experience authentic travel?</h2>
            <p style="font-size: 1.05rem; opacity: 0.9; line-height: 1.6; margin: 0 0 2rem 0;">
              Connect with verified locals, plan fraud-proof itineraries, and keep your deposits 100% protected in neutral escrow.
            </p>
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <a href="#/explore" style="padding: 0.85rem 1.75rem; background: #ffffff; color: #0284c7; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 0.95rem;">
                Start Exploring
              </a>
              <a href="#/become-a-local" style="padding: 0.85rem 1.75rem; background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: white; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 0.95rem; backdrop-filter: blur(8px);">
                Become a Local Guide
              </a>
            </div>
          </div>
        </section>

      </main>

      <!-- Standard Footer -->
      <footer class="app-footer" style="background: #0f172a; color: white; padding: 3rem 1.5rem 1.5rem;">
        <div style="max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; border-bottom: 1px solid #1e293b; padding-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 32px; height: 32px; background: #0ea5e9; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="18" height="18" data-lucide="map-pin"></svg>
            </div>
            <div>
              <div style="font-size: 1.15rem; font-weight: 900; letter-spacing: -0.5px;">TRAVGOD</div>
              <div style="font-size: 0.65rem; color: #0ea5e9; font-weight: 600;">Explore · Connect · Travel Safe</div>
            </div>
          </div>

          <nav style="display: flex; gap: 1.5rem; font-size: 0.88rem;">
            <a href="#/" style="color: #94a3b8; text-decoration: none;">Home</a>
            <a href="#/explore" style="color: #94a3b8; text-decoration: none;">Explore</a>
            <a href="#/trips" style="color: #94a3b8; text-decoration: none;">My Trips</a>
            <a href="#/about" style="color: #0ea5e9; text-decoration: none; font-weight: 700;">About</a>
          </nav>
        </div>

        <div style="max-width: 1100px; margin: 1.5rem auto 0; font-size: 0.78rem; color: #64748b; text-align: center;">
          © 2026 TRAVGOD (Local Guide Connect). Sourced with Qloo AI, CARTO Basemaps & PayPal Sandbox Escrow.
        </div>
      </footer>

    </div>
  `;

  initAppHeader(container);
}
