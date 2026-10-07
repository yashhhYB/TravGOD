/**
 * LandingView.js
 * Renders the TRAVGOD hero landing page with search bar
 * and destination chips. When a chip is clicked, it fires
 * the onDestinationSelect callback with the destination object.
 */

const DESTINATIONS = [
  { id: 'paris',     name: 'Paris',     flag: '🇫🇷', country: 'France',  coords: [48.8566, 2.3522] },
  { id: 'tokyo',     name: 'Tokyo',     flag: '🇯🇵', country: 'Japan',   coords: [35.6762, 139.6503] },
  { id: 'cairo',     name: 'Cairo',     flag: '🇪🇬', country: 'Egypt',   coords: [30.0444, 31.2357] },
  { id: 'barcelona', name: 'Barcelona', flag: '🇪🇸', country: 'Spain',   coords: [41.3874, 2.1686] },
  { id: 'dubai',     name: 'Dubai',     flag: '🇦🇪', country: 'UAE',     coords: [25.2048, 55.2708] },
];

export function renderLandingView(container, { onDestinationSelect }) {
  container.innerHTML = `
    <div id="landing-view">
      <!-- Global Header -->
      <header class="app-header">
        <div class="header-inner">
          <div class="logo">
            <div class="logo-icon" aria-hidden="true">✈</div>
            <span class="gradient-text">TRAVGOD</span>
          </div>
          <nav class="header-nav" aria-label="Main navigation">
            <a href="#" class="nav-link">How it works</a>
            <a href="#" class="nav-link">Become a Guide</a>
            <a href="#" class="nav-link" id="nav-my-trips">My Trips</a>
            <button class="btn btn-ghost" style="padding: 0.5rem 1.1rem; font-size: 0.9rem;" id="btn-sign-in">Sign In</button>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero" aria-labelledby="hero-heading">
        <div class="hero-bg" aria-hidden="true"></div>
        <div class="hero-grid" aria-hidden="true"></div>

        <div class="hero-content">
          <div class="hero-eyebrow" role="doc-subtitle">
            <span aria-hidden="true">🛡️</span>
            Trusted Travel Intelligence &amp; Local Connections
          </div>

          <h1 id="hero-heading" class="hero-title">
            Travel Smarter.<br>
            <span class="gradient-text">Stay Safe.</span><br>
            Meet the Locals.
          </h1>

          <p class="hero-subtitle">
            Discover any destination through the eyes of a verified local.
            Get real scam warnings, honest price guides, and connect directly
            with trusted guides — all in one place.
          </p>

          <!-- Search Bar -->
          <div class="hero-search">
            <div class="search-container" role="search">
              <div class="search-icon" aria-hidden="true">🔍</div>
              <input
                type="search"
                id="destination-search"
                class="search-input"
                placeholder="Where are you going?"
                aria-label="Search destinations"
                autocomplete="off"
              />
              <button class="search-btn" id="btn-search" aria-label="Search destination">
                Explore →
              </button>
            </div>
          </div>

          <!-- Quick Destination Chips -->
          <div class="popular-destinations" aria-label="Popular destinations">
            <p class="popular-label">Popular destinations</p>
            <div class="destination-chips" role="list">
              ${DESTINATIONS.map(dest => `
                <button
                  class="destination-chip"
                  data-destination-id="${dest.id}"
                  role="listitem"
                  aria-label="Explore ${dest.name}, ${dest.country}"
                >
                  <span class="flag" aria-hidden="true">${dest.flag}</span>
                  ${dest.name}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Trust Indicators -->
          <div class="hero-trust" role="list" aria-label="Platform trust features">
            <div class="trust-item" role="listitem">
              <div class="trust-icon cyan" aria-hidden="true">✓</div>
              <span class="trust-label">Verified Local Guides</span>
            </div>
            <div class="trust-item" role="listitem">
              <div class="trust-icon amber" aria-hidden="true">⚠</div>
              <span class="trust-label">Real Scam Alerts</span>
            </div>
            <div class="trust-item" role="listitem">
              <div class="trust-icon emerald" aria-hidden="true">💬</div>
              <span class="trust-label">Free Pre-Booking Chat</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Feature Strip -->
      <section class="feature-strip" aria-labelledby="features-heading">
        <div class="container">
          <h2 id="features-heading" class="sr-only">TRAVGOD Features</h2>
          <div class="feature-grid">
            <article class="card feature-card" aria-label="Interactive destination map feature">
              <div class="feature-icon cyan" aria-hidden="true">🗺️</div>
              <h3 class="feature-title">Interactive Destination Maps</h3>
              <p class="feature-desc">
                Explore your destination like a local. Our map highlights
                top attractions, food spots, hidden gems, and safety zones —
                all in one command center.
              </p>
            </article>

            <article class="card feature-card" aria-label="ScamSense safety alerts feature">
              <div class="feature-icon amber" aria-hidden="true">🛡️</div>
              <h3 class="feature-title">ScamSense™ Safety Alerts</h3>
              <p class="feature-desc">
                Know the scams before they happen. Get curated tourist trap
                warnings, fair local price guides, and what to do if
                something feels wrong.
              </p>
            </article>

            <article class="card feature-card" aria-label="Verified local guides feature">
              <div class="feature-icon emerald" aria-hidden="true">🧑‍🤝‍🧑</div>
              <h3 class="feature-title">AI-Matched Verified Guides</h3>
              <p class="feature-desc">
                Our AI LocalMatch engine connects you with verified local
                guides who speak your language and share your interests —
                with transparent match scores you can trust.
              </p>
            </article>

            <article class="card feature-card" aria-label="Secure PayPal booking feature">
              <div class="feature-icon blue" aria-hidden="true">💳</div>
              <h3 class="feature-title">Secure PayPal Booking</h3>
              <p class="feature-desc">
                Chat first, book with confidence. Secure guide sessions
                directly through PayPal — transparent pricing, no hidden
                fees, full booking confirmation.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  `;

  // Wire up destination chip clicks
  container.querySelectorAll('.destination-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const id = chip.dataset.destinationId;
      const dest = DESTINATIONS.find(d => d.id === id);
      if (dest) onDestinationSelect(dest);
    });
  });

  // Wire up search button
  const searchInput = container.querySelector('#destination-search');
  const searchBtn   = container.querySelector('#btn-search');

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const dest = DESTINATIONS.find(d => d.name.toLowerCase().startsWith(query));
    if (dest) {
      onDestinationSelect(dest);
    } else if (query) {
      // Highlight the input to signal no match found
      searchInput.style.borderColor = 'var(--rose)';
      setTimeout(() => (searchInput.style.borderColor = ''), 1500);
    }
  }

  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });
}

export { DESTINATIONS };
