/**
 * LocalsView.js — Verified Local Guides Directory
 * Role-aware: Locals see view-only. Travelers see Chat + Book.
 * Logged-out: login prompt. Email-unverified: disabled with reason.
 * 
 * Rules (from reference):
 * - Directory shows only status=verified guides (not paused, not suspended)
 * - Traveler: Message + Request buttons
 * - Local (other than own): view-only, no contact buttons
 * - Local's OWN profile: Edit, Preview as traveler, Share link
 * - Logged-out: "Sign in to continue" prompt preserving ?next=
 */
import { GUIDES } from '../data/guides.js';
import { renderPayPalModal } from './PayPalModal.js';
import { renderChatWindow } from './ChatWindow.js';
import { renderOnboardingModal } from './OnboardingModal.js';
import { setupHeaderAuth } from '../utils/headerAuth.js';
import { Storage } from '../utils/storage.js';
import { can, getUserRole, isLoggedIn, ROLES, getLocalStatus, LOCAL_STATUS } from '../utils/roles.js';

export function renderLocalsView(container) {
  const user = Storage.get('travgod_user', null);
  const isLocal = isLoggedIn() && getUserRole() === ROLES.LOCAL;
  const isTraveler = isLoggedIn() && getUserRole() === ROLES.TRAVELER;
  const loggedOut = !isLoggedIn();

  let selectedFilter = 'rome';

  // ── Helper: render role-aware action buttons for a guide card ───────────
  function getGuideActions(g) {
    // If this local is viewing their OWN profile in the directory
    if (isLocal && user && (g.userId === user.id || g.name === user.name)) {
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
          <button style="padding: 0.65rem; background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a;
            border-radius: 10px; font-weight: 700; font-size: 0.78rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 0.3rem;"
            onclick="window.location.hash='/host/profile'">
            <svg width="14" height="14" data-lucide="edit-3"></svg> Edit
          </button>
          <button style="padding: 0.65rem; background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569;
            border-radius: 10px; font-weight: 700; font-size: 0.78rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
            <svg width="14" height="14" data-lucide="eye"></svg> Preview
          </button>
          <button style="padding: 0.65rem; background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569;
            border-radius: 10px; font-weight: 700; font-size: 0.78rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
            <svg width="14" height="14" data-lucide="share-2"></svg> Share
          </button>
        </div>
        <p style="font-size: 0.7rem; color: #94a3b8; text-align: center; margin: 0.5rem 0 0; font-style: italic;">
          This is your profile — no Book/Request button shown to other locals
        </p>
      `;
    }

    // If logged in as a LOCAL viewing another local's profile — view only
    if (isLocal) {
      return `
        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px;
          padding: 0.85rem; text-align: center;">
          <svg width="16" height="16" data-lucide="eye" style="color: #94a3b8; vertical-align: -3px;"></svg>
          <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; margin-left: 0.35rem;">
            View only — locals don't contact each other
          </span>
        </div>
      `;
    }

    // Logged out — show disabled buttons with "Sign in" prompt
    if (loggedOut) {
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <button class="btn-login-prompt" style="padding: 0.75rem; background: #f8fafc; border: 1px solid #cbd5e1;
            color: #94a3b8; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 0.4rem;"
            title="Sign in to chat with guides" aria-label="Sign in to chat">
            <svg width="16" height="16" data-lucide="lock"></svg> Chat
          </button>
          <button class="btn-login-prompt" style="padding: 0.75rem; background: #e0f2fe; border: none;
            color: #0284c7; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 0.4rem;"
            title="Sign in to book a guide" aria-label="Sign in to book">
            <svg width="16" height="16" data-lucide="log-in"></svg> Sign In to Book
          </button>
        </div>
      `;
    }

    // Traveler — check if they can send requests (email verified?)
    const chatPerm = can('start_chat');
    const bookPerm = can('send_request');

    const chatDisabled = !chatPerm.allowed;
    const bookDisabled = !bookPerm.allowed;

    const reasonLabels = {
      email_not_verified: 'Verify your email first',
      account_suspended: 'Account suspended',
      account_restricted_needs_approval: 'Account restricted',
    };
    const chatReason = chatDisabled ? (reasonLabels[chatPerm.reason] || 'Unavailable') : '';
    const bookReason = bookDisabled ? (reasonLabels[bookPerm.reason] || 'Unavailable') : '';

    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
        <button class="${chatDisabled ? '' : 'btn-chat-guide'}"
          data-guide-id="${g.id}"
          ${chatDisabled ? 'disabled aria-disabled="true"' : ''}
          style="padding: 0.75rem; background: ${chatDisabled ? '#f1f5f9' : '#f8fafc'};
            border: 1px solid ${chatDisabled ? '#e2e8f0' : '#cbd5e1'};
            color: ${chatDisabled ? '#94a3b8' : '#0f172a'};
            border-radius: 12px; font-weight: 700; font-size: 0.9rem;
            cursor: ${chatDisabled ? 'not-allowed' : 'pointer'};
            display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: background 0.2s;"
          ${chatDisabled ? `title="${chatReason}" aria-label="Chat unavailable: ${chatReason}"` : 'aria-label="Open chat"'}>
          <svg width="16" height="16" data-lucide="${chatDisabled ? 'lock' : 'message-square'}"></svg>
          ${chatDisabled ? chatReason : 'Chat'}
        </button>
        <button class="${bookDisabled ? '' : 'btn-book-guide'}"
          data-guide-id="${g.id}"
          ${bookDisabled ? 'disabled aria-disabled="true"' : ''}
          style="padding: 0.75rem;
            background: ${bookDisabled ? '#f1f5f9' : 'linear-gradient(135deg, #0ea5e9, #0284c7)'};
            border: none; color: ${bookDisabled ? '#94a3b8' : 'white'};
            border-radius: 12px; font-weight: 700; font-size: 0.9rem;
            cursor: ${bookDisabled ? 'not-allowed' : 'pointer'};
            display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: transform 0.2s;"
          ${bookDisabled ? `title="${bookReason}" aria-label="Booking unavailable: ${bookReason}"` : 'aria-label="Book guide"'}>
          <svg width="16" height="16" data-lucide="${bookDisabled ? 'lock' : 'credit-card'}"></svg>
          ${bookDisabled ? bookReason : 'Book Guide'}
        </button>
      </div>
      ${(chatDisabled || bookDisabled) ? `
        <p style="font-size: 0.72rem; color: #f59e0b; font-weight: 600; margin: 0.5rem 0 0; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
          <svg width="12" height="12" data-lucide="alert-triangle"></svg>
          ${bookReason || chatReason}
        </p>` : ''}
    `;
  }

  // ── Filter logic ──────────────────────────────────────────────────────────
  function getFilteredGuides() {
    // Directory only shows verified locals (not paused, not suspended)
    let list = GUIDES.filter(g => !g.status || g.status === 'verified' || g.status === 'active');

    if (selectedFilter === 'rome') {
      list = list.filter(g => g.destinationId === 'rome');
    } else if (selectedFilter === 'high') {
      list = list.filter(g => g.rating >= 4.9);
    } else if (selectedFilter === 'paris') {
      list = list.filter(g => g.destinationId === 'paris');
    }

    // Sort: speaks traveler's language first
    if (user && user.primaryLang) {
      list.sort((a, b) => {
        const aHas = (a.languages || []).some(l => l.toLowerCase().includes(user.primaryLang.toLowerCase()));
        const bHas = (b.languages || []).some(l => l.toLowerCase().includes(user.primaryLang.toLowerCase()));
        return bHas - aHas;
      });
    }

    return list;
  }

  // ── Role banner for locals visiting this page ─────────────────────────────
  function getRoleBanner() {
    if (!isLocal) return '';
    const localStatus = getLocalStatus();
    if (localStatus === LOCAL_STATUS.VERIFIED || localStatus === LOCAL_STATUS.PAUSED) {
      return `
        <div role="note" aria-live="polite" style="background: #ede9fe; border: 1px solid #ddd6fe; border-radius: 12px;
          padding: 0.85rem 1.25rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem;">
          <svg width="18" height="18" data-lucide="eye" style="color: #7c3aed; flex-shrink: 0;"></svg>
          <div>
            <strong style="color: #5b21b6; font-size: 0.88rem;">You're browsing as a Local Guide.</strong>
            <span style="color: #6d28d9; font-size: 0.82rem; margin-left: 0.4rem;">
              You can view other local profiles, but cannot contact or book them.
              <a href="#/d/rome" style="color: #7c3aed; font-weight: 700;">Browse as a traveler →</a>
            </span>
          </div>
        </div>
      `;
    }
    return '';
  }

  // ── Render guide grid ─────────────────────────────────────────────────────
  function renderGrid() {
    const guides = getFilteredGuides();
    const gridEl = container.querySelector('#guides-grid-container');

    gridEl.innerHTML = guides.length === 0 ? `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: white;
        border-radius: 20px; border: 1px solid #e2e8f0;">
        <svg width="40" height="40" data-lucide="users" style="color: #cbd5e1; margin-bottom: 1rem;"></svg>
        <h3 style="color: #475569;">No guides found for this filter.</h3>
        <p style="color: #94a3b8;">Try switching to Rome or All Guides.</p>
      </div>
    ` : guides.map(g => `
      <article style="background: #ffffff; padding: 2rem; border-radius: 24px; border: 1px solid #e2e8f0;
        text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transition: transform 0.2s, box-shadow 0.2s;
        display: flex; flex-direction: column; justify-content: space-between;"
        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.08)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.04)'"
        aria-label="Local guide: ${g.name}">
        <div>
          <!-- Avatar + Verification Badge -->
          <div style="position: relative; display: inline-block; margin-bottom: 1.25rem;">
            <img src="${g.avatar}" alt="Photo of ${g.name}"
              style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;
              border: 4px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
            <div style="position: absolute; bottom: 0; right: -10px; background: #10b981; color: white;
              padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 800;
              border: 2px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.15);"
              aria-label="Verified local guide">
              ${g.isLegend ? '★ Legend' : '✓ Verified'}
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem;">
            <h2 style="margin: 0; font-size: 1.4rem; color: #0f172a; font-weight: 900;">${g.name}</h2>
            <span style="font-size: 0.65rem; font-weight: 700; color: #94a3b8; background: #f1f5f9;
              padding: 2px 6px; border-radius: 4px;" title="Fictional profile for hackathon demonstration">Demo</span>
          </div>

          <div style="font-size: 0.75rem; font-weight: 800; color: #16a34a; background: #dcfce7;
            display: inline-block; padding: 2px 10px; border-radius: 999px; margin-bottom: 0.75rem;">
            ${g.verificationLevel || 'Level 1: ID Reviewed'}
          </div>

          <p style="color: #475569; font-size: 0.88rem; line-height: 1.5; margin: 0 0 1rem 0;">
            "${g.bio || 'Passionate local guide eager to share authentic culture.'}"
          </p>

          <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem;
            margin-bottom: 1rem; font-size: 0.9rem; color: #64748b;">
            <span style="color: #f59e0b; font-weight: 800;" aria-label="${g.rating} stars">★ ${g.rating}</span>
            (${g.reviews || g.reviewCount || 20} reviews) &nbsp;•&nbsp;
            <strong style="color: #0f172a; font-weight: 800;">€${g.rate || g.pricePerHour || 30} / hr</strong>
          </div>

          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.35rem; margin-bottom: 1.5rem;">
            ${(g.languages || []).map(l =>
              `<span style="background: #f1f5f9; color: #475569; padding: 3px 10px; border-radius: 12px;
              font-size: 0.75rem; font-weight: 600;">🗣️ ${l}</span>`
            ).join('')}
          </div>
        </div>

        <!-- Role-aware action buttons -->
        <div id="guide-actions-${g.id}">
          ${getGuideActions(g)}
        </div>

      </article>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    // ── Event handlers ────────────────────────────────────────────────────

    // Logged-out login prompt
    container.querySelectorAll('.btn-login-prompt').forEach(btn => {
      btn.addEventListener('click', () => {
        // Store next destination and open sign-in
        Storage.set('travgod_pending_redirect', '/locals');
        let modalCont = document.getElementById('modal-container');
        if (!modalCont) {
          modalCont = document.createElement('div');
          modalCont.id = 'modal-container';
          document.body.appendChild(modalCont);
        }
        renderOnboardingModal(modalCont, {
          onComplete: () => {
            modalCont.innerHTML = '';
            window.location.hash = '/locals';
          }
        });
      });
    });

    // Traveler Chat handler
    container.querySelectorAll('.btn-chat-guide').forEach(btn => {
      btn.addEventListener('click', () => {
        const guide = GUIDES.find(g => g.id === btn.dataset.guideId);
        if (guide) {
          renderChatWindow(container.querySelector('#chat-container'), guide, () => {
            container.querySelector('#chat-container').innerHTML = '';
          });
        }
      });
    });

    // Traveler Book handler
    container.querySelectorAll('.btn-book-guide').forEach(btn => {
      btn.addEventListener('click', () => {
        const guide = GUIDES.find(g => g.id === btn.dataset.guideId);
        if (guide) {
          renderPayPalModal(container.querySelector('#modal-container'), guide, () => {
            container.querySelector('#modal-container').innerHTML = '';
          });
        }
      });
    });
  }

  // ── Shell HTML ────────────────────────────────────────────────────────────
  container.innerHTML = `
    <header class="app-header" id="app-header"
      style="position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; padding: 0.75rem 1.5rem;">
      <div style="max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
        <a href="#/" class="logo" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none;" aria-label="TRAVGOD home">
          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #0ea5e9, #0284c7);
            border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="20" height="20" data-lucide="map-pin"></svg>
          </div>
          <div>
            <div style="font-size: 1.2rem; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; line-height: 1;">TRAVGOD</div>
            <div style="font-size: 0.68rem; font-weight: 700; color: #0ea5e9; text-transform: uppercase;">Local Guide Connect</div>
          </div>
        </a>
        <nav aria-label="Main navigation" style="display: flex; align-items: center; gap: 1.25rem;">
          <a href="#/" style="font-size: 0.9rem; font-weight: 600; color: #475569; text-decoration: none;">Home</a>
          <a href="#/explore" style="font-size: 0.9rem; font-weight: 600; color: #475569; text-decoration: none;">Explore Map</a>
          <a href="#/d/rome" style="font-size: 0.9rem; font-weight: 600; color: #475569; text-decoration: none;">Rome Hub</a>
          <a href="#/locals" style="font-size: 0.9rem; font-weight: 800; color: #0ea5e9; text-decoration: none;" aria-current="page">Locals</a>
          ${!isLocal ? `<a href="#/trips" style="font-size: 0.9rem; font-weight: 600; color: #475569; text-decoration: none;">Trips</a>` : ''}
          ${isLocal ? `<a href="#/host" style="font-size: 0.9rem; font-weight: 600; color: #10b981; text-decoration: none;">My Dashboard</a>` : ''}
        </nav>
        <div class="header-actions" id="header-auth-slot"></div>
      </div>
    </header>

    <main id="locals-main" style="padding: 100px 5% 80px; max-width: 1200px; margin: 0 auto;">
      <h1 style="font-size: 2.75rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem; letter-spacing: -0.5px;">
        Verified Local Guides
      </h1>
      <p style="color: #64748b; font-size: 1.1rem; margin: 0 0 2rem;">
        Connect with authentic residents who speak your language, bookable with PayPal protection.
      </p>

      <!-- Role banner for locals -->
      ${getRoleBanner()}

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
        <!-- Filter Tabs -->
        <div role="group" aria-label="Filter guides by city" style="display: flex; gap: 0.5rem; background: white; padding: 6px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <button class="guide-filter-pill ${selectedFilter === 'rome' ? 'active' : ''}" data-filter="rome"
            aria-pressed="${selectedFilter === 'rome'}"
            style="padding: 8px 16px; border-radius: 12px; border: none;
            background: ${selectedFilter === 'rome' ? '#0ea5e9' : 'transparent'};
            color: ${selectedFilter === 'rome' ? 'white' : '#64748b'}; font-weight: 800; cursor: pointer;">
            🇮🇹 Rome (Flagship)
          </button>
          <button class="guide-filter-pill ${selectedFilter === 'high' ? 'active' : ''}" data-filter="high"
            aria-pressed="${selectedFilter === 'high'}"
            style="padding: 8px 16px; border-radius: 12px; border: none;
            background: ${selectedFilter === 'high' ? '#0ea5e9' : 'transparent'};
            color: ${selectedFilter === 'high' ? 'white' : '#64748b'}; font-weight: 800; cursor: pointer;">
            Top Rated ★4.9+
          </button>
          <button class="guide-filter-pill ${selectedFilter === 'paris' ? 'active' : ''}" data-filter="paris"
            aria-pressed="${selectedFilter === 'paris'}"
            style="padding: 8px 16px; border-radius: 12px; border: none;
            background: ${selectedFilter === 'paris' ? '#0ea5e9' : 'transparent'};
            color: ${selectedFilter === 'paris' ? 'white' : '#64748b'}; font-weight: 800; cursor: pointer;">
            🇫🇷 Paris
          </button>
        </div>
      </div>

      <!-- Guides Grid -->
      <div id="guides-grid-container"
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;"
        aria-live="polite" aria-label="Guide listings">
      </div>
    </main>

    <div id="chat-container"></div>
    <div id="modal-container"></div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const headerElem = container.querySelector('#app-header');
  if (headerElem) setupHeaderAuth(headerElem);

  // Filter pill listeners
  container.querySelectorAll('.guide-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.guide-filter-pill').forEach(p => {
        p.style.background = 'transparent';
        p.style.color = '#64748b';
        p.setAttribute('aria-pressed', 'false');
      });
      pill.style.background = '#0ea5e9';
      pill.style.color = 'white';
      pill.setAttribute('aria-pressed', 'true');
      selectedFilter = pill.dataset.filter;
      renderGrid();
    });
  });

  renderGrid();
}
