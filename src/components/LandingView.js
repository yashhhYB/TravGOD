/**
 * LandingView.js — TRAVGOD Landing Page
 * Full professional build with video background, Lucide icons,
 * smooth transitions, header scroll effect, and search routing.
 */

const DESTINATIONS = [
  { id: 'paris',     name: 'Paris',     country: 'France',   img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=120&q=80', coords: [48.8566, 2.3522] },
  { id: 'tokyo',     name: 'Tokyo',     country: 'Japan',    img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=120&q=80', coords: [35.6762, 139.6503] },
  { id: 'cairo',     name: 'Cairo',     country: 'Egypt',    img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=120&q=80', coords: [30.0444, 31.2357] },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain',    img: 'https://images.unsplash.com/photo-1583422409516-2895a77ef244?auto=format&fit=crop&w=120&q=80', coords: [41.3874, 2.1686] },
  { id: 'dubai',     name: 'Dubai',     country: 'UAE',      img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=120&q=80', coords: [25.2048, 55.2708] },
  { id: 'newyork',   name: 'New York',  country: 'USA',      img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=120&q=80', coords: [40.7128, -74.0060] },
];

const TRUST_ITEMS = [
  { icon: 'shield-check',   title: 'Verified Locals',      desc: 'Real people, real profiles' },
  { icon: 'alert-triangle', title: 'Scam Alerts',          desc: 'Stay informed, stay safe' },
  { icon: 'tag',            title: 'Local Price Guide',    desc: "Know what's fair" },
  { icon: 'message-circle', title: 'Multi-Language Chat',  desc: 'Break language barriers' },
  { icon: 'credit-card',    title: 'Secure Booking',       desc: 'Powered by PayPal' },
  { icon: 'zap',            title: 'AI LocalMatch',        desc: 'Find your perfect local' },
];

const STEPS = [
  { icon: 'search',        num: 1, title: 'Choose Destination', desc: 'Search or pick from popular cities.' },
  { icon: 'map',           num: 2, title: 'Explore & Plan',     desc: 'View map, places, prices and safety tips.' },
  { icon: 'users',         num: 3, title: 'Find Trusted Locals', desc: 'Browse verified guides and read reviews.' },
  { icon: 'message-square',num: 4, title: 'Chat & Book',        desc: 'Start a free chat and book with PayPal.' },
  { icon: 'plane',         num: 5, title: 'Enjoy Your Trip',    desc: 'Get local support and create memories.' },
];

const REVIEWS = [
  { name: 'Sarah Johnson', trip: 'Trip to Paris',     avatar: 'https://i.pravatar.cc/100?img=5',  stars: '★★★★★ 5.0', text: 'TRAVGOD made my Paris trip so much easier! I found an amazing local guide who showed me the real Paris. The safety alerts were super helpful and the booking was smooth.' },
  { name: 'James Miller',  trip: 'Trip to Tokyo',     avatar: 'https://i.pravatar.cc/100?img=12', stars: '★★★★★ 4.9', text: 'The map feature is incredible! I could see nearby restaurants, hotels and even verified guides. AI matching got me the perfect local who spoke my language.' },
  { name: 'Emily Davis',   trip: 'Trip to Barcelona', avatar: 'https://i.pravatar.cc/100?img=9',  stars: '★★★★★ 5.0', text: 'I loved the local price guide and scam alerts. It helped me avoid tourist traps and save money. TRAVGOD truly feels like a travel companion!' },
];

// ── Helpers ─────────────────────────────────────────────────
const icon = (name, size = 20) =>
  `<svg width="${size}" height="${size}" data-lucide="${name}" style="flex-shrink:0;"></svg>`;

// ── Render ───────────────────────────────────────────────────
export function renderLandingView(container, { onDestinationSelect }) {
  container.innerHTML = `
    <div id="landing-view">

      <!-- ──── Header ──── -->
      <header class="app-header" id="app-header">
        <div class="header-inner">
          <a href="#" class="logo" aria-label="TRAVGOD home">
            <div class="logo-icon">${icon('map-pin', 18)}</div>
            <div>
              <div class="logo-name">TRAVGOD</div>
              <div class="logo-tag">Explore · Connect · Travel Safe</div>
            </div>
          </a>

          <nav class="header-nav" aria-label="Main navigation">
            <a href="#" class="active">Home</a>
            <a href="#">Explore</a>
            <a href="#">Locals</a>
            <a href="#">Trips</a>
            <a href="#">About</a>
          </nav>

          <div class="header-actions">
            <button class="btn-signin" id="btn-sign-in" aria-label="Sign in">Sign In</button>
          </div>
        </div>
      </header>

      <!-- ──── Hero ──── -->
      <section class="hero" aria-labelledby="hero-heading">
        <video class="hero-video" id="hero-video" autoplay loop muted playsinline preload="auto">
          <source src="/363550.mp4" type="video/mp4" />
        </video>
        <div class="hero-overlay" aria-hidden="true"></div>

        <div class="hero-inner">
          <!-- Left -->
          <div class="hero-left">
            <div class="hero-eyebrow">
              ${icon('sparkles', 14)} Your AI Travel Companion
            </div>

            <h1 class="hero-title" id="hero-heading">
              Discover Amazing Places.<br>
              Connect with <span class="highlight">Trusted Locals</span>.<br>
              Travel Safer.
            </h1>

            <p class="hero-subtitle">
              Get personalized recommendations, verified local guides,
              real-time safety alerts and everything you need for a
              better travel experience.
            </p>

            <div class="hero-search-wrap">
              <div class="search-pill" role="search">
                ${icon('map-pin', 18)}
                <input
                  type="search"
                  id="destination-search"
                  placeholder="Where do you want to go?"
                  autocomplete="off"
                  aria-label="Search destinations"
                />
                <button class="btn-search" id="btn-search" aria-label="Search">
                  Search ${icon('search', 16)}
                </button>
              </div>
            </div>

            <div class="popular-section">
              <div class="popular-label">
                ${icon('map-pin', 14)} Popular Destinations
              </div>
              <div class="destinations-row">
                ${DESTINATIONS.map(d => `
                  <button class="dest-chip" data-destination-id="${d.id}" aria-label="Explore ${d.name}">
                    <img src="${d.img}" alt="${d.name}" loading="lazy" />
                    <div class="dest-chip-info">
                      <span class="dest-chip-name">${d.name}</span>
                      <span class="dest-chip-country">${d.country}</span>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: Floating Card -->
          <div class="hero-right">
            <div class="float-card">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80"
                alt="Paris, France"
                class="float-card-img"
                loading="lazy"
              />
              <div class="float-card-text">
                <h3>Paris, France</h3>
                <p>Iconic landmarks, rich culture and unforgettable experiences await.</p>
                <a href="#" class="float-card-link" data-destination-id="paris" id="float-card-cta">
                  Explore Paris ${icon('arrow-right', 14)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ──── Trust Strip ──── -->
      <section class="trust-strip" aria-label="Platform features">
        <div class="trust-strip-inner">
          ${TRUST_ITEMS.map(t => `
            <div class="trust-item">
              <div class="trust-icon">${icon(t.icon, 20)}</div>
              <div class="trust-label">
                <h4>${t.title}</h4>
                <p>${t.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- ──── How It Works ──── -->
      <section class="how-it-works" aria-labelledby="how-heading">
        <div class="how-inner">
          <div class="how-lead">
            <div class="section-eyebrow">${icon('sparkles', 14)} Simple Steps</div>
            <h2 class="section-title" id="how-heading">How TRAVGOD Works</h2>
            <p class="section-desc">
              From discovering your destination to booking trusted locals,
              we make your travel journey simple, safe and unforgettable.
            </p>
            <a href="#" class="btn-outline">Learn More ${icon('arrow-right', 16)}</a>
          </div>

          <div class="how-steps">
            <div class="steps-flow">
              ${STEPS.map(s => `
                <div class="step">
                  <div class="step-num">${s.num}</div>
                  <div class="step-icon">${icon(s.icon, 26)}</div>
                  <h4>${s.title}</h4>
                  <p>${s.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- ──── Testimonials ──── -->
      <section class="testimonials" aria-labelledby="reviews-heading">
        <div class="testimonials-inner">
          <div class="testimonials-head">
            <div>
              <h2 id="reviews-heading">What Our Travelers Say</h2>
              <p>Real stories from real travelers around the world.</p>
            </div>
            <button class="btn-outline" style="align-self:flex-end;">
              View More ${icon('arrow-right', 16)}
            </button>
          </div>

          <div class="reviews-grid">
            ${REVIEWS.map(r => `
              <article class="review-card">
                <div class="reviewer">
                  <img src="${r.avatar}" alt="${r.name}" class="reviewer-avatar" loading="lazy" />
                  <div>
                    <div class="reviewer-name">${r.name}</div>
                    <div class="reviewer-trip">${r.trip}</div>
                  </div>
                </div>
                <div class="review-stars">${r.stars}</div>
                <p class="review-text">"${r.text}"</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- ──── Footer ──── -->
      <footer class="app-footer">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="logo">
              <div class="logo-icon">${icon('map-pin', 18)}</div>
              <div>
                <div class="logo-name">TRAVGOD</div>
                <div class="logo-tag">Explore · Connect · Travel Safe</div>
              </div>
            </div>
            <p>Your trusted travel companion for discovering new places, connecting with locals and traveling safer.</p>
            <div class="footer-social">
              <a href="#" aria-label="Facebook">${icon('facebook', 16)}</a>
              <a href="#" aria-label="Instagram">${icon('instagram', 16)}</a>
              <a href="#" aria-label="Twitter">${icon('twitter', 16)}</a>
              <a href="#" aria-label="YouTube">${icon('youtube', 16)}</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Explore</a></li>
              <li><a href="#">Locals</a></li>
              <li><a href="#">Trips</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Destinations</h4>
            <ul>
              <li><a href="#" data-destination-id="paris">Paris</a></li>
              <li><a href="#" data-destination-id="tokyo">Tokyo</a></li>
              <li><a href="#" data-destination-id="cairo">Cairo</a></li>
              <li><a href="#" data-destination-id="barcelona">Barcelona</a></li>
              <li><a href="#" data-destination-id="dubai">Dubai</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety Guide</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div class="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Get travel tips, updates and special offers.</p>
            <div class="newsletter-form">
              <input type="email" placeholder="Enter your email address" aria-label="Email for newsletter" />
              <button type="button">Subscribe</button>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2025 TRAVGOD. All rights reserved.</span>
          <span>Made with ♥ for travelers</span>
        </div>
      </footer>

    </div>
  `;

  // ── Render Lucide icons ──────────────────────────────────
  if (window.lucide) window.lucide.createIcons();

  // ── Force video play (fixes autoplay in dynamically injected HTML) ──
  const video = container.querySelector('#hero-video');
  if (video) {
    video.load(); // Reload the source after injection
    video.play().catch(() => {
      // Autoplay blocked — the dark background fallback will show
      console.info('TRAVGOD: Video autoplay was blocked by browser policy.');
    });
  }

  // ── Header scroll effect ─────────────────────────────────
  const header = document.getElementById('app-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Destination routing ──────────────────────────────────
  function go(id) {
    const dest = DESTINATIONS.find(d => d.id === id);
    if (dest) onDestinationSelect(dest);
  }

  // Chip buttons
  container.querySelectorAll('.dest-chip').forEach(btn => {
    btn.addEventListener('click', () => go(btn.dataset.destinationId));
  });
  // Floating card CTA
  container.querySelector('#float-card-cta')?.addEventListener('click', e => {
    e.preventDefault(); go('paris');
  });
  // Footer destination links
  container.querySelectorAll('.footer-col a[data-destination-id]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); go(a.dataset.destinationId); });
  });

  // ── Search ───────────────────────────────────────────────
  const searchInput = container.querySelector('#destination-search');
  const searchBtn   = container.querySelector('#btn-search');

  function handleSearch() {
    const q = searchInput.value.trim().toLowerCase();
    const dest = DESTINATIONS.find(d => d.name.toLowerCase().startsWith(q));
    if (dest) {
      go(dest.id);
    } else if (q) {
      searchInput.style.boxShadow = 'inset 0 0 0 2px #ef4444';
      searchInput.focus();
      setTimeout(() => (searchInput.style.boxShadow = ''), 1800);
    }
  }
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });

  // ── Cleanup on view unmount ──────────────────────────────
  return () => window.removeEventListener('scroll', onScroll);
}

export { DESTINATIONS };
