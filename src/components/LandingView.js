/**
 * LandingView.js
 * Renders the new TRAVGOD hero landing page matching the light-theme UI inspiration.
 */

const DESTINATIONS = [
  { id: 'paris',     name: 'Paris',     country: 'France',  img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=200&q=80', coords: [48.8566, 2.3522] },
  { id: 'tokyo',     name: 'Tokyo',     country: 'Japan',   img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80', coords: [35.6762, 139.6503] },
  { id: 'cairo',     name: 'Cairo',     country: 'Egypt',   img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=200&q=80', coords: [30.0444, 31.2357] },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain',   img: 'https://images.unsplash.com/photo-1583422409516-2895a77ef244?auto=format&fit=crop&w=200&q=80', coords: [41.3874, 2.1686] },
  { id: 'dubai',     name: 'Dubai',     country: 'UAE',     img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=200&q=80', coords: [25.2048, 55.2708] },
];

export function renderLandingView(container, { onDestinationSelect }) {
  container.innerHTML = `
    <div id="landing-view">
      
      <!-- Global Header (Transparent over Video) -->
      <header class="app-header">
        <div class="header-inner">
          <div class="logo">
            <div class="logo-icon"><i data-lucide="map-pin" style="color:white; width:18px;"></i></div>
            <span>TRAVGOD</span>
          </div>
          <nav class="header-nav">
            <a href="#" class="active">Home</a>
            <a href="#">Explore</a>
            <a href="#">Locals</a>
            <a href="#">Trips</a>
            <a href="#">About</a>
          </nav>
          <div class="header-actions">
            <i data-lucide="search" style="cursor:pointer; opacity:0.9;"></i>
            <button class="btn-login" id="btn-sign-in">Sign In</button>
          </div>
        </div>
      </header>

      <!-- Hero Section with Video Background -->
      <section class="hero">
        <video autoplay loop muted playsinline class="hero-video">
          <!-- Force browser to load video by appending a query param to bypass weird cache locks -->
          <source src="/363550.mp4" type="video/mp4">
        </video>
        <div class="hero-overlay"></div>
        
        <div class="hero-content-wrapper">
          
          <!-- Left side content -->
          <div class="hero-text-side">
            <div class="hero-eyebrow"><i data-lucide="sparkles" style="width:14px; margin-right:4px;"></i> Your AI Travel Companion</div>
            <h1 class="hero-title">
              Discover Amazing Places.<br>
              Connect with <span class="text-blue">Trusted Locals</span>.<br>
              Travel Safer.
            </h1>
            <p class="hero-subtitle">
              Get personalized recommendations, verified local guides, real-time safety alerts and everything you need for a better travel experience.
            </p>
            
            <div class="search-pill">
              <i data-lucide="map-pin" class="icon" style="color:#64748b;"></i>
              <input type="text" id="destination-search" placeholder="Where do you want to go?" autocomplete="off" />
              <button class="btn-search" id="btn-search">Search <i data-lucide="search" style="width:18px;"></i></button>
            </div>
            
            <div class="popular-label"><i data-lucide="map" style="width:16px;"></i> Popular Destinations</div>
            <div class="destinations-row">
              ${DESTINATIONS.map(dest => `
                <div class="dest-card" data-destination-id="${dest.id}">
                  <img src="${dest.img}" alt="${dest.name}" class="dest-img" />
                  <div class="dest-info">
                    <span class="dest-name">${dest.name}</span>
                    <span class="dest-country">${dest.country}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right side content -->
          <div class="hero-image-side">
            <div class="floating-card">
              <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80" alt="Paris" class="floating-img" />
              <div class="floating-text">
                <h3>Paris, France</h3>
                <p>Iconic landmarks, rich culture and unforgettable experiences.</p>
                <a href="#" class="explore-link" data-destination-id="paris">Explore Paris <i data-lucide="arrow-right" style="width:14px;"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Strip -->
      <section class="trust-strip">
        <div class="trust-strip-inner">
          <div class="trust-item">
            <div class="trust-icon-box"><i data-lucide="shield-check"></i></div>
            <div class="trust-text"><h4>Verified Locals</h4><p>Real people, real profiles</p></div>
          </div>
          <div class="trust-item">
            <div class="trust-icon-box"><i data-lucide="alert-triangle"></i></div>
            <div class="trust-text"><h4>Scam Alerts</h4><p>Stay informed, stay safe</p></div>
          </div>
          <div class="trust-item">
            <div class="trust-icon-box"><i data-lucide="tag"></i></div>
            <div class="trust-text"><h4>Local Price Guide</h4><p>Know what's fair</p></div>
          </div>
          <div class="trust-item">
            <div class="trust-icon-box"><i data-lucide="message-circle"></i></div>
            <div class="trust-text"><h4>Multi-Language Chat</h4><p>Break language barriers</p></div>
          </div>
          <div class="trust-item">
            <div class="trust-icon-box"><i data-lucide="credit-card"></i></div>
            <div class="trust-text"><h4>Secure Booking</h4><p>Powered by PayPal</p></div>
          </div>
          <div class="trust-item">
            <div class="trust-icon-box"><i data-lucide="zap"></i></div>
            <div class="trust-text"><h4>AI LocalMatch</h4><p>Find your perfect local</p></div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-it-works">
        <div class="section-subtitle"><i data-lucide="sparkles" style="width:16px;"></i> Simple Steps</div>
        <div style="display: flex; max-width: 1200px; margin: 0 auto 3rem;">
          <div style="flex: 1; text-align: left;">
            <h2 class="section-title" style="margin-bottom: 1rem;">How TRAVGOD Works</h2>
            <p class="intro-text" style="margin: 0; max-width: 350px;">From discovering your destination to booking trusted locals, we make your travel journey simple, safe and unforgettable.</p>
            <button class="btn-outline" style="margin-top: 1.5rem;">Learn More <i data-lucide="arrow-right" style="width:16px; vertical-align:middle;"></i></button>
          </div>
          <div style="flex: 2;">
            <div class="steps-container">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-icon"><i data-lucide="search" style="width:28px; height:28px;"></i></div>
                <h4>Choose Destination</h4>
                <p>Search or pick from popular cities and countries.</p>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-icon"><i data-lucide="map" style="width:28px; height:28px;"></i></div>
                <h4>Explore & Plan</h4>
                <p>View map, places, prices, and safety tips.</p>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-icon"><i data-lucide="users" style="width:28px; height:28px;"></i></div>
                <h4>Find Trusted Locals</h4>
                <p>Browse verified guides and read reviews.</p>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-icon"><i data-lucide="message-square" style="width:28px; height:28px;"></i></div>
                <h4>Chat & Book</h4>
                <p>Start a free chat and book with PayPal.</p>
              </div>
              <div class="step">
                <div class="step-number">5</div>
                <div class="step-icon"><i data-lucide="plane" style="width:28px; height:28px;"></i></div>
                <h4>Enjoy Your Trip</h4>
                <p>Get local support and create memories.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials">
        <div class="testimonials-header">
          <div>
            <h2>What Our Travelers Say</h2>
            <p>Real stories from real travelers around the world.</p>
          </div>
          <button class="btn-outline">View More Reviews <i data-lucide="arrow-right" style="width:16px; vertical-align:middle;"></i></button>
        </div>
        
        <div class="reviews-grid">
          <!-- Review 1 -->
          <div class="review-card">
            <div class="reviewer">
              <img src="https://i.pravatar.cc/100?img=5" class="reviewer-avatar" />
              <div class="reviewer-info">
                <h4>Sarah Johnson</h4><p>Trip to Paris</p>
              </div>
            </div>
            <div class="stars">★★★★★ 5.0</div>
            <p class="review-text">"TRAVGOD made my Paris trip so much easier! I found an amazing local guide who showed me the real Paris. The safety alerts were super helpful and the booking process was smooth."</p>
          </div>
          <!-- Review 2 -->
          <div class="review-card">
            <div class="reviewer">
              <img src="https://i.pravatar.cc/100?img=12" class="reviewer-avatar" />
              <div class="reviewer-info">
                <h4>James Miller</h4><p>Trip to Tokyo</p>
              </div>
            </div>
            <div class="stars">★★★★☆ 4.9</div>
            <p class="review-text">"The map feature is incredible! I could see nearby restaurants, hotels and even verified guides. The AI matching got me the perfect local who spoke my language."</p>
          </div>
          <!-- Review 3 -->
          <div class="review-card">
            <div class="reviewer">
              <img src="https://i.pravatar.cc/100?img=9" class="reviewer-avatar" />
              <div class="reviewer-info">
                <h4>Emily Davis</h4><p>Trip to Barcelona</p>
              </div>
            </div>
            <div class="stars">★★★★★ 5.0</div>
            <p class="review-text">"I loved the local price guide and scam alerts. It helped me avoid tourist traps and save money. TRAVGOD truly feels like a travel companion!"</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <div class="logo"><i data-lucide="map-pin"></i> TRAVGOD</div>
            <p>Your trusted travel companion for discovering new places, connecting with locals and traveling safer.</p>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
              <i data-lucide="facebook" style="width:20px; cursor:pointer;"></i>
              <i data-lucide="instagram" style="width:20px; cursor:pointer;"></i>
              <i data-lucide="twitter" style="width:20px; cursor:pointer;"></i>
            </div>
          </div>
          <div class="footer-links">
            <h4>Quick Links</h4>
            <ul><li><a href="#">Home</a></li><li><a href="#">Explore</a></li><li><a href="#">Locals</a></li><li><a href="#">Trips</a></li><li><a href="#">About Us</a></li></ul>
          </div>
          <div class="footer-links">
            <h4>Destinations</h4>
            <ul><li><a href="#">Paris</a></li><li><a href="#">Tokyo</a></li><li><a href="#">Cairo</a></li><li><a href="#">Barcelona</a></li><li><a href="#">Dubai</a></li></ul>
          </div>
          <div class="footer-links">
            <h4>Support</h4>
            <ul><li><a href="#">Help Center</a></li><li><a href="#">Safety Guide</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">Privacy Policy</a></li><li><a href="#">Contact Us</a></li></ul>
          </div>
          <div class="newsletter">
            <h4>Newsletter</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 1rem;">Get travel tips, updates and special offers.</p>
            <input type="email" placeholder="Enter your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </footer>

    </div>
  `;

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Wire up destination chip clicks
  container.querySelectorAll('.dest-card, .explore-link').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const id = chip.dataset.destinationId;
      const dest = DESTINATIONS.find(d => d.id === id);
      if (dest) onDestinationSelect(dest);
    });
  });

  // Wire up search button
  const searchInput = container.querySelector('#destination-search');
  const searchBtn   = container.querySelector('#btn-search');

  // Force video playback to fix innerHTML autoplay issue
  const video = container.querySelector('.hero-video');
  if (video) {
    video.play().catch(err => console.log('Video autoplay blocked:', err));
  }

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const dest = DESTINATIONS.find(d => d.name.toLowerCase().startsWith(query));
    if (dest) {
      onDestinationSelect(dest);
    } else if (query) {
      // Highlight the input to signal no match found
      searchInput.style.outline = '2px solid red';
      setTimeout(() => (searchInput.style.outline = 'none'), 1500);
    }
  }

  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });
}

export { DESTINATIONS };
