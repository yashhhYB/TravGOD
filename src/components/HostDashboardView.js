/**
 * HostDashboardView.js — Complete Local Host Dashboard
 * Verified locals see: Home, Requests, Calendar, Messages, More
 * Unverified locals see: Application checklist, Training status
 * 
 * Key restrictions enforced:
 * - Locals can NEVER start a chat (reply only)
 * - Locals can NEVER send booking requests
 * - Private fields (ID docs, payout, exact location) never exposed
 */

import { Storage } from '../utils/storage.js';
import { getAppHeaderHtml, initAppHeader } from './AppHeader.js';
import { renderBottomNav, initBottomNav } from './BottomNav.js';
import {
  isLocal, isLocalVerified, getLocalStatus, switchRole,
  LOCAL_STATUS, PERMISSIONS, getPermissions, can, getLocalStatusBanner
} from '../utils/roles.js';

// ── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_REQUESTS = [
  {
    id: 'req-001',
    travelerName: 'Aiko T.',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
    travelerCountry: 'Japan',
    travelerLanguages: 'Japanese, English',
    partySize: 1,
    experience: 'Historic Trastevere Alleys & Secret Bakeries',
    date: 'Tomorrow, Oct 16',
    time: '10:00 AM – 1:00 PM',
    duration: '3 hours',
    totalAmount: '€96.00',
    message: 'Hi! I\'m visiting Rome for the first time and would love a guided tour of Trastevere. I\'m interested in local bakeries and hidden viewpoints.',
    status: 'pending',
    expiresIn: '18h 42m',
    completedTrips: 3,
    cancellationRate: 'Low',
    verifiedEmail: true,
  },
  {
    id: 'req-002',
    travelerName: 'Daniel H.',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    travelerCountry: 'United States',
    travelerLanguages: 'English, Spanish',
    partySize: 2,
    experience: 'Aventine Hill & Testaccio Market Crawl',
    date: 'Friday, Oct 18',
    time: '2:00 PM – 5:30 PM',
    duration: '3.5 hours',
    totalAmount: '€130.00',
    message: 'Hey Marco! Looking for a real food tour off the beaten path. We\'re adventurous eaters and want authentic Roman cuisine.',
    status: 'pending',
    expiresIn: '22h 15m',
    completedTrips: 7,
    cancellationRate: 'None',
    verifiedEmail: true,
  },
];

const MOCK_BOOKINGS = [
  {
    id: 'bk-001',
    travelerName: 'Sarah J.',
    travelerAvatar: 'https://i.pravatar.cc/100?img=5',
    experience: 'Evening Trastevere Wine Walk',
    date: 'Wed, Oct 16',
    time: '6:00 PM',
    status: 'confirmed',
    amount: '€85.00',
    meetingPoint: 'Piazza Santa Maria in Trastevere',
  },
  {
    id: 'bk-002',
    travelerName: 'James M.',
    travelerAvatar: 'https://i.pravatar.cc/100?img=12',
    experience: 'Morning Testaccio Market Tour',
    date: 'Sat, Oct 19',
    time: '9:00 AM',
    status: 'confirmed',
    amount: '€64.00',
    meetingPoint: 'Piramide Metro Station Exit B',
  },
];

const MOCK_EXPERIENCES = [
  {
    id: 'exp-001',
    title: 'Historic Trastevere Alleys & Secret Bakeries',
    duration: '3 hours',
    rate: '€32/hr',
    status: 'active',
    bookings: 14,
    rating: 4.95,
    reviews: 12,
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'exp-002',
    title: 'Aventine Hill & Testaccio Market Crawl',
    duration: '3.5 hours',
    rate: '€35/hr',
    status: 'active',
    bookings: 8,
    rating: 4.88,
    reviews: 7,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'exp-003',
    title: 'Evening Wine & Aperitivo Hidden Bars',
    duration: '2.5 hours',
    rate: '€28/hr',
    status: 'draft',
    bookings: 0,
    rating: null,
    reviews: 0,
    image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=300&q=80',
  },
];

const MOCK_EARNINGS = {
  held: 320,
  released: 1450,
  pending: 226,
  thisMonth: 545,
  lastMonth: 890,
  totalBookings: 24,
  avgRating: 4.92,
  responseTime: '12 min',
  responseRate: 98,
};

const MOCK_MESSAGES = [
  {
    id: 'msg-001',
    travelerName: 'Aiko T.',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
    lastMessage: 'Hi! I\'m visiting Rome for the first time...',
    time: '2 hours ago',
    unread: 2,
    hasBooking: false,
  },
  {
    id: 'msg-002',
    travelerName: 'Sarah J.',
    travelerAvatar: 'https://i.pravatar.cc/100?img=5',
    lastMessage: 'Can\'t wait for tomorrow\'s tour! See you at the piazza.',
    time: 'Yesterday',
    unread: 0,
    hasBooking: true,
  },
  {
    id: 'msg-003',
    travelerName: 'Daniel H.',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    lastMessage: 'What types of food will we try at Testaccio?',
    time: '3 days ago',
    unread: 1,
    hasBooking: false,
  },
];

const MOCK_CALENDAR_EVENTS = [
  { date: '2026-10-16', title: 'Trastevere Bakery Walk', time: '10:00 AM', traveler: 'Aiko T.', status: 'confirmed' },
  { date: '2026-10-16', title: 'Evening Wine Walk', time: '6:00 PM', traveler: 'Sarah J.', status: 'confirmed' },
  { date: '2026-10-18', title: 'Testaccio Market Crawl', time: '2:00 PM', traveler: 'Daniel H.', status: 'pending' },
  { date: '2026-10-19', title: 'Morning Market Tour', time: '9:00 AM', traveler: 'James M.', status: 'confirmed' },
];

// ── Render Host Dashboard ───────────────────────────────────────────────────
export function renderHostDashboardView(container, { initialTab = 'home' } = {}) {
  let activeTab = initialTab;
  const user = Storage.get('travgod_user', null);
  const localStatus = user?.localStatus || LOCAL_STATUS.VERIFIED;

  // Status groups
  const isVerifiedActive = localStatus === LOCAL_STATUS.VERIFIED;
  const isPaused = localStatus === LOCAL_STATUS.PAUSED;
  const isSuspended = localStatus === LOCAL_STATUS.SUSPENDED;
  const isPreVerification = [LOCAL_STATUS.DRAFT, LOCAL_STATUS.SUBMITTED,
    LOCAL_STATUS.IN_REVIEW, LOCAL_STATUS.NEEDS_INFO, LOCAL_STATUS.REJECTED].includes(localStatus);
  // Verified OR paused → can access full dashboard (paused = read-mostly)
  const hasDashboardAccess = isVerifiedActive || isPaused || isSuspended;

  // ── Status Banner ──────────────────────────────────────────────────────────
  function renderStatusBanner() {
    if (localStatus === LOCAL_STATUS.VERIFIED) return ''; // no banner for active verified
    const banner = getLocalStatusBanner(localStatus);
    if (!banner) return '';
    return `
      <div role="alert" aria-live="assertive"
        style="background: ${banner.bg}; border: 1.5px solid ${banner.border}; border-radius: 14px;
          padding: 1rem 1.25rem; margin-bottom: 1.5rem;
          display: flex; align-items: flex-start; gap: 0.85rem; flex-wrap: wrap;">
        <svg width="20" height="20" data-lucide="${banner.icon}"
          style="color: ${banner.color}; flex-shrink: 0; margin-top: 2px;"></svg>
        <div style="flex: 1; min-width: 200px;">
          <div style="font-size: 0.82rem; font-weight: 800; color: ${banner.color};
            text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.3rem;">
            ${banner.label}
          </div>
          <p style="font-size: 0.88rem; color: #334155; margin: 0; line-height: 1.5;">
            ${banner.message}
          </p>
        </div>
        ${banner.action ? `
          <a href="${banner.actionRoute || '#'}" 
            style="white-space: nowrap; padding: 0.5rem 1rem; background: ${banner.color};
              color: white; border-radius: 8px; font-size: 0.82rem; font-weight: 800;
              text-decoration: none; display: flex; align-items: center; gap: 0.4rem;
              transition: opacity 0.2s; align-self: flex-start;"
            onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
            ${banner.action} →
          </a>` : ''}
      </div>
    `;
  }

  function render() {
    container.innerHTML = `
      <div class="host-dashboard" style="min-height: 100vh; background: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- Header with Local branding -->
        ${getHostHeader()}

        <!-- Main content area -->
        <main class="host-main" id="host-main-content" style="padding-top: 72px; padding-bottom: 80px;">
          <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem clamp(1rem, 3vw, 2rem);">
            <!-- Status banner for every non-verified status -->
            ${renderStatusBanner()}
            ${hasDashboardAccess ? renderDashboardContent() : renderPreVerificationContent()}
          </div>
        </main>

        <!-- Role-aware bottom navigation -->
        ${renderBottomNav(container, { activeTab })}

      </div>
    `;

    initAppHeader(container);
    initBottomNav(container);
    if (window.lucide) window.lucide.createIcons();
    attachHandlers();
  }

  // ── Host Header (different from traveler header) ──────────────────────────
  function getHostHeader() {
    return `
      <header class="app-header solid-header" id="app-header" style="position: fixed; top: 0; left: 0; right: 0; height: 72px; z-index: 1000; background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%); backdrop-filter: blur(16px); display: flex; align-items: center; padding: 0 clamp(1rem, 3vw, 2rem);">
        <div class="header-inner" style="width: 100%; max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
          
          <a href="#/" class="logo" style="text-decoration: none; display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 34px; height: 34px; background: rgba(255,255,255,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" data-lucide="map-pin" style="color: #6ee7b7;"></svg>
            </div>
            <div>
              <div style="font-size: 1.05rem; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">TRAVGOD</div>
              <div style="font-size: 0.58rem; font-weight: 600; color: rgba(255,255,255,0.7); letter-spacing: 0.5px;">Host Dashboard</div>
            </div>
          </a>

          <!-- Host nav tabs (desktop) -->
          <nav style="display: flex; align-items: center; gap: 0.25rem;" class="host-desktop-nav">
            ${['home', 'requests', 'calendar', 'experiences', 'earnings'].map(tab => `
              <button class="host-nav-tab ${activeTab === tab ? 'active' : ''}" data-tab="${tab}"
                style="padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; 
                color: ${activeTab === tab ? '#ffffff' : 'rgba(255,255,255,0.7)'}; 
                background: ${activeTab === tab ? 'rgba(255,255,255,0.15)' : 'transparent'};
                border: none; cursor: pointer; transition: all 0.2s;">
                ${tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            `).join('')}
          </nav>

          <!-- Auth area -->
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button id="btn-switch-to-traveler" style="padding: 6px 14px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #d1fae5; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem;">
              <svg width="14" height="14" data-lucide="repeat"></svg>
              Traveler Mode
            </button>
            <div class="header-actions" id="header-auth-slot">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <img src="${user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'}" 
                     alt="Profile photo"
                     style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;
                     border: 2px solid ${localStatus === LOCAL_STATUS.SUSPENDED ? '#fca5a5' : localStatus === LOCAL_STATUS.PAUSED ? '#fde68a' : '#6ee7b7'};" />
                <div>
                  <div style="font-size: 0.82rem; font-weight: 700; color: #ffffff;">${user?.name?.split(' ')[0] || 'Marco'}</div>
                  <div style="font-size: 0.62rem; font-weight: 600;
                    color: ${localStatus === LOCAL_STATUS.SUSPENDED ? '#fca5a5' : localStatus === LOCAL_STATUS.PAUSED ? '#fde68a' : '#6ee7b7'}">
                    ● ${localStatus === LOCAL_STATUS.VERIFIED ? 'Verified Local' :
                        localStatus === LOCAL_STATUS.PAUSED ? 'Vacation Mode' :
                        localStatus === LOCAL_STATUS.SUSPENDED ? 'Suspended' :
                        localStatus === LOCAL_STATUS.IN_REVIEW ? 'Under Review' :
                        localStatus === LOCAL_STATUS.NEEDS_INFO ? 'Action Required' :
                        localStatus === LOCAL_STATUS.DRAFT ? 'Draft' :
                        localStatus === LOCAL_STATUS.SUBMITTED ? 'Submitted' :
                        localStatus === LOCAL_STATUS.REJECTED ? 'Rejected' : localStatus}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  // ── DASHBOARD CONTENT (verified, paused, or suspended) ───────────────────
  function renderDashboardContent() {
    // Suspended: only home, earnings, bookings, help
    if (isSuspended) {
      switch (activeTab) {
        case 'earnings': return renderEarningsTab(true);
        case 'home': return renderSuspendedHomeTab();
        default: return renderSuspendedHomeTab();
      }
    }
    switch (activeTab) {
      case 'home': return renderHomeTab();
      case 'requests': return isPaused ? renderPausedRequestsTab() : renderRequestsTab();
      case 'calendar': return renderCalendarTab();
      case 'messages': return renderMessagesTab();
      case 'experiences': return renderExperiencesTab();
      case 'earnings': return renderEarningsTab(false);
      case 'more': return renderMoreTab();
      default: return renderHomeTab();
    }
  }

  // ── SUSPENDED HOME TAB ────────────────────────────────────────────────────
  function renderSuspendedHomeTab() {
    return `
      <div style="animation: fadeUp 0.4s var(--ease); max-width: 680px; margin: 2rem auto; text-align: center;">
        <div style="background: #fee2e2; border: 1.5px solid #fecaca; border-radius: 20px; padding: 2.5rem;">
          <svg width="40" height="40" data-lucide="shield-x" style="color: #ef4444; margin-bottom: 1rem;"></svg>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #991b1b; margin: 0 0 0.75rem;">Account Suspended</h2>
          <p style="color: #7f1d1d; font-size: 0.95rem; line-height: 1.6; margin: 0 0 1.5rem;">
            Your local account has been suspended. You can still view your past earnings and booking history.
            Contact support to understand the reason or appeal the decision.
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button class="host-nav-tab" data-tab="earnings"
              style="padding: 0.85rem; background: white; border: 1px solid #fecaca;
              border-radius: 12px; font-weight: 700; color: #991b1b; cursor: pointer;
              display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <svg width="16" height="16" data-lucide="wallet"></svg>
              View Earnings
            </button>
            <a href="mailto:support@travgod.com"
              style="padding: 0.85rem; background: #ef4444; border-radius: 12px; font-weight: 700;
              color: white; text-decoration: none; display: flex; align-items: center;
              justify-content: center; gap: 0.5rem;">
              <svg width="16" height="16" data-lucide="life-buoy"></svg>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // ── PAUSED REQUESTS TAB (can decline only, not accept new) ────────────────
  function renderPausedRequestsTab() {
    return `
      <div style="animation: fadeUp 0.4s var(--ease);">
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.35rem;">Requests</h2>
        </div>
        <!-- Paused mode banner -->
        <div role="note" style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px;
          padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
          <svg width="18" height="18" data-lucide="pause-circle" style="color: #d97706; flex-shrink: 0;"></svg>
          <span style="font-size: 0.85rem; color: #92400e; font-weight: 600;">
            <strong>Vacation Mode is on.</strong> You cannot accept new requests.
            You can still decline existing pending requests with a reason.
          </span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${MOCK_REQUESTS.map(req => `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.75rem;">
              <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.25rem;">
                <img src="${req.travelerAvatar}" style="width: 44px; height: 44px; border-radius: 50%;" alt="" />
                <div>
                  <strong>${req.travelerName}</strong> — ${req.experience}
                  <div style="font-size: 0.8rem; color: #64748b;">${req.date}</div>
                </div>
              </div>
              <div style="display: flex; gap: 0.75rem;">
                <!-- Accept disabled during pause -->
                <button disabled aria-disabled="true"
                  style="flex: 1; padding: 0.75rem; background: #f1f5f9; border: 1px solid #e2e8f0;
                  color: #94a3b8; border-radius: 12px; font-weight: 700; cursor: not-allowed;
                  display: flex; align-items: center; justify-content: center; gap: 0.4rem;"
                  title="Cannot accept during vacation mode">
                  <svg width="16" height="16" data-lucide="lock"></svg> Accept
                </button>
                <button class="btn-decline-request" data-req="${req.id}"
                  style="padding: 0.75rem 1.5rem; background: white; border: 2px solid #ef4444;
                  color: #ef4444; border-radius: 12px; font-weight: 800; cursor: pointer;
                  display: flex; align-items: center; gap: 0.4rem;">
                  <svg width="16" height="16" data-lucide="x"></svg> Decline
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── HOME TAB ──────────────────────────────────────────────────────────────
  function renderHomeTab() {
    return `
      <div style="animation: fadeUp 0.4s var(--ease);">
        <!-- Welcome Banner -->
        <div style="background: linear-gradient(135deg, #064e3b, #065f46); border-radius: 20px; padding: 2rem; margin-bottom: 1.5rem; color: white; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -20px; right: -20px; width: 120px; height: 120px; background: rgba(110, 231, 183, 0.1); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -30px; right: 40px; width: 80px; height: 80px; background: rgba(110, 231, 183, 0.08); border-radius: 50%;"></div>
          <div style="position: relative;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="background: rgba(110,231,183,0.2); padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 800; color: #6ee7b7;">
                ● Active Local Guide
              </span>
              <span style="font-size: 0.72rem; color: rgba(255,255,255,0.7); font-weight: 600;">Level 2: Identity Matched</span>
            </div>
            <h1 style="font-size: 1.8rem; font-weight: 900; margin: 0.25rem 0 0.5rem; letter-spacing: -0.5px;">
              Welcome back, ${user?.name?.split(' ')[0] || 'Marco'} 👋
            </h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin: 0;">You have <strong style="color: #6ee7b7;">2 pending requests</strong> and <strong style="color: #6ee7b7;">2 upcoming bookings</strong> this week.</p>
          </div>
        </div>

        <!-- Quick Metrics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          ${[
            { label: 'Held in Escrow', value: '€320.00', sub: 'Releasing after check-in', color: '#0ea5e9', icon: 'lock' },
            { label: 'Total Payouts', value: '€1,450', sub: 'Direct to PayPal', color: '#10b981', icon: 'wallet' },
            { label: 'Response Rate', value: '98%', sub: 'Avg: 12 minutes', color: '#8b5cf6', icon: 'zap' },
            { label: 'Rating', value: '4.92 ★', sub: '24 reviews', color: '#f59e0b', icon: 'star' },
          ].map(m => `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.25rem; transition: transform 0.2s, box-shadow 0.2s;"
                 onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)'" 
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${m.label}</span>
                <div style="width: 28px; height: 28px; background: ${m.color}15; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <svg width="14" height="14" data-lucide="${m.icon}" style="color: ${m.color};"></svg>
                </div>
              </div>
              <div style="font-size: 1.6rem; font-weight: 900; color: #0f172a; margin-bottom: 2px;">${m.value}</div>
              <span style="font-size: 0.72rem; color: #64748b; font-weight: 600;">${m.sub}</span>
            </div>
          `).join('')}
        </div>

        <!-- Pending Requests Preview -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" data-lucide="inbox" style="color: #f59e0b;"></svg>
              Pending Requests
              <span style="background: #fef3c7; color: #d97706; padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 800;">2 new</span>
            </h3>
            <button class="host-nav-tab" data-tab="requests" style="padding: 6px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; color: #16a34a; font-size: 0.78rem; font-weight: 700; cursor: pointer;">View All</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${MOCK_REQUESTS.slice(0, 2).map(req => `
              <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; transition: background 0.2s;"
                   onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                <div style="display: flex; align-items: center; gap: 0.85rem; flex: 1;">
                  <img src="${req.travelerAvatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                      <strong style="font-size: 0.92rem;">${req.travelerName}</strong>
                      <span style="font-size: 0.65rem; background: #e0f2fe; color: #0284c7; padding: 1px 6px; border-radius: 4px; font-weight: 700;">${req.travelerCountry}</span>
                      ${req.verifiedEmail ? '<span style="font-size: 0.65rem; background: #dcfce7; color: #16a34a; padding: 1px 6px; border-radius: 4px; font-weight: 700;">✓ Email</span>' : ''}
                    </div>
                    <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">${req.experience} • ${req.date}</div>
                  </div>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-size: 0.92rem; font-weight: 800; color: #0f172a;">${req.totalAmount}</div>
                  <div style="font-size: 0.7rem; color: #f59e0b; font-weight: 700; display: flex; align-items: center; gap: 0.25rem; justify-content: flex-end;">
                    <svg width="12" height="12" data-lucide="clock"></svg>
                    Expires ${req.expiresIn}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Upcoming Bookings -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem;">
          <h3 style="margin: 0 0 1rem; font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="18" height="18" data-lucide="calendar-check" style="color: #10b981;"></svg>
            Upcoming Bookings
          </h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${MOCK_BOOKINGS.map(b => `
              <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <img src="${b.travelerAvatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
                  <div>
                    <strong style="font-size: 0.9rem;">${b.travelerName}</strong>
                    <div style="font-size: 0.78rem; color: #64748b;">${b.experience}</div>
                    <div style="font-size: 0.75rem; color: #475569; margin-top: 2px;">
                      <svg width="12" height="12" data-lucide="map-pin" style="display: inline; vertical-align: -2px;"></svg>
                      ${b.meetingPoint}
                    </div>
                  </div>
                </div>
                <div style="text-align: right;">
                  <span style="background: #dcfce7; color: #16a34a; padding: 3px 10px; border-radius: 8px; font-size: 0.72rem; font-weight: 800;">${b.amount} Paid</span>
                  <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">${b.date} at ${b.time}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- To-Do List -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem; font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="18" height="18" data-lucide="check-square" style="color: #8b5cf6;"></svg>
            Today's To-Do
          </h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${[
              { text: 'Respond to Aiko T.\'s request', urgent: true, done: false },
              { text: 'Confirm meeting point for Sarah J.', urgent: false, done: true },
              { text: 'Respond to Daniel H.\'s request', urgent: true, done: false },
              { text: 'Update Trastevere experience photos', urgent: false, done: false },
            ].map(todo => `
              <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.85rem; border-radius: 10px; background: ${todo.done ? '#f0fdf4' : todo.urgent ? '#fef3c7' : '#f8fafc'}; ${todo.done ? 'opacity: 0.7;' : ''}">
                <div style="width: 20px; height: 20px; border-radius: 6px; border: 2px solid ${todo.done ? '#10b981' : '#cbd5e1'}; background: ${todo.done ? '#10b981' : 'white'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${todo.done ? '<svg width="12" height="12" data-lucide="check" style="color: white;"></svg>' : ''}
                </div>
                <span style="font-size: 0.85rem; font-weight: 600; color: ${todo.done ? '#64748b' : '#0f172a'}; ${todo.done ? 'text-decoration: line-through;' : ''}">${todo.text}</span>
                ${todo.urgent && !todo.done ? '<span style="font-size: 0.65rem; background: #fef3c7; color: #d97706; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-left: auto;">Urgent</span>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ── REQUESTS TAB ──────────────────────────────────────────────────────────
  function renderRequestsTab() {
    return `
      <div style="animation: fadeUp 0.4s var(--ease);">
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.35rem;">Incoming Requests</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Accept, counter, or decline requests from travelers. You have 24 hours to respond.</p>
        </div>

        <!-- Important: Locals cannot start chats or send requests -->
        <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
          <svg width="18" height="18" data-lucide="info" style="color: #d97706; flex-shrink: 0;"></svg>
          <span style="font-size: 0.82rem; color: #92400e; font-weight: 600;">
            As a Local, you can only <strong>respond</strong> to requests. You cannot start chats or send booking requests to travelers.
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${MOCK_REQUESTS.map(req => `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <!-- Request header -->
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="position: relative;">
                    <img src="${req.travelerAvatar}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;" />
                    ${req.verifiedEmail ? '<div style="position: absolute; bottom: -2px; right: -2px; background: #10b981; border: 2px solid white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;"><svg width="10" height="10" data-lucide="check" style="color: white;"></svg></div>' : ''}
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                      <strong style="font-size: 1.05rem;">${req.travelerName}</strong>
                      <span style="font-size: 0.7rem; background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 999px; font-weight: 700;">${req.travelerCountry}</span>
                    </div>
                    <div style="font-size: 0.78rem; color: #64748b; display: flex; align-items: center; gap: 0.75rem; margin-top: 2px;">
                      <span>🗣️ ${req.travelerLanguages}</span>
                      <span>👥 ${req.partySize} ${req.partySize === 1 ? 'person' : 'people'}</span>
                      <span>${req.completedTrips} trips</span>
                      <span style="color: ${req.cancellationRate === 'None' ? '#10b981' : '#f59e0b'};">Cancel: ${req.cancellationRate}</span>
                    </div>
                  </div>
                </div>
                <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 10px; padding: 0.5rem 0.85rem; text-align: center;">
                  <div style="font-size: 0.68rem; color: #92400e; font-weight: 700; text-transform: uppercase;">Expires in</div>
                  <div style="font-size: 1.1rem; font-weight: 900; color: #d97706;">${req.expiresIn}</div>
                </div>
              </div>

              <!-- Request details -->
              <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
                <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.5rem;">${req.experience}</div>
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.82rem; color: #475569;">
                  <span style="display: flex; align-items: center; gap: 0.3rem;">
                    <svg width="14" height="14" data-lucide="calendar"></svg> ${req.date}
                  </span>
                  <span style="display: flex; align-items: center; gap: 0.3rem;">
                    <svg width="14" height="14" data-lucide="clock"></svg> ${req.time}
                  </span>
                  <span style="display: flex; align-items: center; gap: 0.3rem;">
                    <svg width="14" height="14" data-lucide="timer"></svg> ${req.duration}
                  </span>
                  <span style="font-weight: 800; color: #0f172a;">${req.totalAmount}</span>
                </div>
              </div>

              <!-- Traveler message -->
              <div style="background: #f0f9ff; border-left: 3px solid #0ea5e9; border-radius: 0 10px 10px 0; padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
                <div style="font-size: 0.72rem; font-weight: 700; color: #0ea5e9; margin-bottom: 0.25rem;">Traveler's Message</div>
                <p style="font-size: 0.88rem; color: #334155; margin: 0; line-height: 1.5;">"${req.message}"</p>
              </div>

              <!-- Action buttons -->
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button class="btn-accept-request" data-req="${req.id}" style="flex: 1; min-width: 120px; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
                  <svg width="16" height="16" data-lucide="check"></svg> Accept
                </button>
                <button class="btn-counter-request" data-req="${req.id}" style="padding: 0.75rem 1.5rem; background: white; border: 2px solid #0ea5e9; color: #0ea5e9; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
                  <svg width="16" height="16" data-lucide="repeat"></svg> Counter
                </button>
                <button class="btn-decline-request" data-req="${req.id}" style="padding: 0.75rem 1.5rem; background: white; border: 2px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
                  <svg width="16" height="16" data-lucide="x"></svg> Decline
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── CALENDAR TAB ──────────────────────────────────────────────────────────
  function renderCalendarTab() {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return `
      <div style="animation: fadeUp 0.4s var(--ease);">
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.35rem;">Calendar</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Your schedule at a glance. Manage availability and upcoming tours.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 360px; gap: 1.5rem;">
          <!-- Calendar Grid -->
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800;">${monthName}</h3>
              <div style="display: flex; gap: 0.5rem;">
                <button style="width: 32px; height: 32px; border-radius: 8px; background: #f1f5f9; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                  <svg width="16" height="16" data-lucide="chevron-left"></svg>
                </button>
                <button style="width: 32px; height: 32px; border-radius: 8px; background: #f1f5f9; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                  <svg width="16" height="16" data-lucide="chevron-right"></svg>
                </button>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center;">
              ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => 
                `<div style="font-size: 0.72rem; font-weight: 700; color: #94a3b8; padding: 0.5rem; text-transform: uppercase;">${d}</div>`
              ).join('')}
              ${Array(firstDay).fill('').map(() => '<div></div>').join('')}
              ${Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isToday = day === today.getDate();
                const hasEvent = [16, 18, 19].includes(day);
                return `
                  <div style="padding: 0.6rem; border-radius: 10px; font-size: 0.85rem; font-weight: ${isToday ? '800' : '600'}; 
                    background: ${isToday ? '#064e3b' : hasEvent ? '#f0fdf4' : 'transparent'}; 
                    color: ${isToday ? 'white' : hasEvent ? '#065f46' : '#334155'};
                    cursor: pointer; transition: background 0.2s; position: relative;"
                    onmouseover="this.style.background='${isToday ? '#064e3b' : '#f1f5f9'}'" 
                    onmouseout="this.style.background='${isToday ? '#064e3b' : hasEvent ? '#f0fdf4' : 'transparent'}'">
                    ${day}
                    ${hasEvent ? '<div style="width: 5px; height: 5px; background: #10b981; border-radius: 50%; margin: 2px auto 0;"></div>' : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Events Sidebar -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <h3 style="margin: 0; font-size: 1rem; font-weight: 800;">This Week's Events</h3>
            ${MOCK_CALENDAR_EVENTS.map(evt => `
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; border-left: 4px solid ${evt.status === 'confirmed' ? '#10b981' : '#f59e0b'};">
                <div style="font-weight: 800; font-size: 0.9rem; margin-bottom: 0.35rem;">${evt.title}</div>
                <div style="font-size: 0.78rem; color: #64748b; display: flex; flex-direction: column; gap: 0.2rem;">
                  <span>${evt.date} at ${evt.time}</span>
                  <span>with ${evt.traveler}</span>
                  <span style="font-weight: 700; color: ${evt.status === 'confirmed' ? '#10b981' : '#f59e0b'}; text-transform: capitalize;">${evt.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ── MESSAGES TAB ──────────────────────────────────────────────────────────
  function renderMessagesTab() {
    return `
      <div style="animation: fadeUp 0.4s var(--ease);">
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.35rem;">Messages</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Conversations from travelers who contacted you. You can reply but cannot start new chats.</p>
        </div>

        <!-- Cannot Start Chat Warning -->
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
          <svg width="18" height="18" data-lucide="message-circle-off" style="color: #0284c7; flex-shrink: 0;"></svg>
          <span style="font-size: 0.82rem; color: #0c4a6e; font-weight: 600;">
            Only travelers can start conversations. Phone numbers and emails are masked until booking is confirmed.
          </span>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
          ${MOCK_MESSAGES.map((msg, i) => `
            <div style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; ${i < MOCK_MESSAGES.length - 1 ? 'border-bottom: 1px solid #f1f5f9;' : ''} cursor: pointer; transition: background 0.2s;"
                 onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
              <div style="position: relative;">
                <img src="${msg.travelerAvatar}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" />
                ${msg.unread > 0 ? `<div style="position: absolute; top: -2px; right: -2px; background: #ef4444; color: white; font-size: 0.65rem; font-weight: 800; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white;">${msg.unread}</div>` : ''}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <strong style="font-size: 0.92rem;">${msg.travelerName}</strong>
                  <span style="font-size: 0.72rem; color: #94a3b8;">${msg.time}</span>
                </div>
                <p style="font-size: 0.82rem; color: #64748b; margin: 2px 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${msg.lastMessage}</p>
              </div>
              ${msg.hasBooking ? '<span style="font-size: 0.65rem; background: #dcfce7; color: #16a34a; padding: 2px 8px; border-radius: 999px; font-weight: 700; white-space: nowrap;">Booking</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── EXPERIENCES TAB ───────────────────────────────────────────────────────
  function renderExperiencesTab() {
    return `
      <div style="animation: fadeUp 0.4s var(--ease);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.35rem;">My Experiences</h2>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Create and manage the tours you offer to travelers. Max ${PERMISSIONS.guide.maxActiveExperiences} active experiences.</p>
          </div>
          <button style="padding: 0.65rem 1.25rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
            <svg width="16" height="16" data-lucide="plus"></svg> New Experience
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem;">
          ${MOCK_EXPERIENCES.map(exp => `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;"
                 onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.08)'" 
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              <div style="position: relative;">
                <img src="${exp.image}" style="width: 100%; height: 160px; object-fit: cover;" />
                <span style="position: absolute; top: 12px; right: 12px; background: ${exp.status === 'active' ? '#10b981' : '#94a3b8'}; color: white; padding: 3px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 800; text-transform: capitalize;">${exp.status}</span>
              </div>
              <div style="padding: 1.25rem;">
                <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 800;">${exp.title}</h3>
                <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.82rem; color: #64748b; margin-bottom: 0.75rem;">
                  <span>${exp.duration}</span>
                  <span style="font-weight: 800; color: #0f172a;">${exp.rate}</span>
                  ${exp.rating ? `<span style="color: #f59e0b;">★ ${exp.rating} (${exp.reviews})</span>` : '<span style="color: #94a3b8;">No reviews yet</span>'}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.78rem; color: #64748b;">${exp.bookings} bookings</span>
                  <div style="display: flex; gap: 0.5rem;">
                    <button style="padding: 6px 12px; background: #f1f5f9; border: none; border-radius: 8px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">
                      <svg width="12" height="12" data-lucide="edit-3"></svg> Edit
                    </button>
                    ${exp.status === 'active' ? `
                      <button style="padding: 6px 12px; background: #fef3c7; border: none; border-radius: 8px; font-size: 0.78rem; font-weight: 700; color: #d97706; cursor: pointer;">Pause</button>
                    ` : `
                      <button style="padding: 6px 12px; background: #dcfce7; border: none; border-radius: 8px; font-size: 0.78rem; font-weight: 700; color: #16a34a; cursor: pointer;">Publish</button>
                    `}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── EARNINGS TAB ──────────────────────────────────────────────────────────
  function renderEarningsTab() {
    return `
      <div style="animation: fadeUp 0.4s var(--ease);">
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.35rem;">Earnings</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Track your payouts, held funds, and financial overview.</p>
        </div>

        <!-- Earnings Summary -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: linear-gradient(135deg, #064e3b, #065f46); border-radius: 20px; padding: 1.75rem; color: white;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #6ee7b7; text-transform: uppercase; margin-bottom: 0.5rem;">Total Released</div>
            <div style="font-size: 2.2rem; font-weight: 900;">€${MOCK_EARNINGS.released.toLocaleString()}</div>
            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 0.25rem;">Direct to PayPal</div>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.75rem;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #0ea5e9; text-transform: uppercase; margin-bottom: 0.5rem;">Held in Escrow</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #0f172a;">€${MOCK_EARNINGS.held}</div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">Releases after check-in</div>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.75rem;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #f59e0b; text-transform: uppercase; margin-bottom: 0.5rem;">Pending Payout</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #0f172a;">€${MOCK_EARNINGS.pending}</div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">Processing in 1–2 days</div>
          </div>
        </div>

        <!-- Monthly Breakdown -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.75rem; margin-bottom: 1.5rem;">
          <h3 style="margin: 0 0 1.25rem; font-size: 1.1rem; font-weight: 800;">Monthly Breakdown</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${[
              { month: 'October 2026 (so far)', amount: MOCK_EARNINGS.thisMonth, bar: 61 },
              { month: 'September 2026', amount: MOCK_EARNINGS.lastMonth, bar: 100 },
              { month: 'August 2026', amount: 720, bar: 81 },
              { month: 'July 2026', amount: 440, bar: 49 },
            ].map(m => `
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.85rem; font-weight: 600; color: #334155;">${m.month}</span>
                  <strong style="font-size: 0.85rem; color: #0f172a;">€${m.amount}</strong>
                </div>
                <div style="height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden;">
                  <div style="height: 100%; width: ${m.bar}%; background: linear-gradient(90deg, #10b981, #059669); border-radius: 4px; transition: width 0.6s var(--ease);"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Payout Info -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 1.25rem; display: flex; align-items: center; gap: 0.85rem;">
          <svg width="20" height="20" data-lucide="shield-check" style="color: #16a34a; flex-shrink: 0;"></svg>
          <div>
            <div style="font-size: 0.88rem; font-weight: 700; color: #065f46;">PayPal Sandbox Connected</div>
            <div style="font-size: 0.78rem; color: #047857;">Payouts are sent to your verified PayPal email after traveler check-in or automatically 24 hours after the experience ends.</div>
          </div>
        </div>
      </div>
    `;
  }

  // ── MORE TAB ──────────────────────────────────────────────────────────────
  function renderMoreTab() {
    const menuItems = [
      { label: 'My Experiences', icon: 'sparkles', color: '#10b981', tab: 'experiences' },
      { label: 'Hidden Spots', icon: 'map-pin', color: '#8b5cf6', desc: `Max ${PERMISSIONS.guide.maxHiddenSpotsPerWeek}/week` },
      { label: 'Earnings & Payouts', icon: 'wallet', color: '#f59e0b', tab: 'earnings' },
      { label: 'Reviews & Ratings', icon: 'star', color: '#ec4899', desc: 'Reply to traveler reviews' },
      { label: 'Training Center', icon: 'graduation-cap', color: '#0ea5e9', desc: 'Safety quiz & guidelines' },
      { label: 'Edit Profile', icon: 'user', color: '#6366f1', desc: 'Bio, rate, languages (no re-verify)' },
      { label: 'Explore as Traveler', icon: 'compass', color: '#14b8a6', route: '#/d/rome' },
      { label: 'Community', icon: 'message-square', color: '#f97316', desc: 'Answer with Verified badge' },
      { label: 'Safety Center', icon: 'shield', color: '#ef4444', desc: 'Guide safety tips' },
      { label: 'Settings', icon: 'settings', color: '#64748b' },
    ];

    return `
      <div style="animation: fadeUp 0.4s var(--ease);">
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0;">More</h2>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
          ${menuItems.map((item, i) => `
            <div class="${item.tab ? 'host-nav-tab' : ''}" ${item.tab ? `data-tab="${item.tab}"` : ''} ${item.route ? `onclick="window.location.hash='${item.route}'"` : ''}
                 style="padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; ${i < menuItems.length - 1 ? 'border-bottom: 1px solid #f1f5f9;' : ''} cursor: pointer; transition: background 0.2s;"
                 onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
              <div style="width: 36px; height: 36px; background: ${item.color}15; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="18" height="18" data-lucide="${item.icon}" style="color: ${item.color};"></svg>
              </div>
              <div style="flex: 1;">
                <div style="font-size: 0.92rem; font-weight: 700; color: #0f172a;">${item.label}</div>
                ${item.desc ? `<div style="font-size: 0.75rem; color: #64748b;">${item.desc}</div>` : ''}
              </div>
              <svg width="16" height="16" data-lucide="chevron-right" style="color: #94a3b8;"></svg>
            </div>
          `).join('')}
        </div>

        <!-- Vacation Mode -->
        <div style="margin-top: 1.5rem; background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <svg width="20" height="20" data-lucide="palm-tree" style="color: #f59e0b;"></svg>
            <div>
              <div style="font-size: 0.92rem; font-weight: 700;">Vacation Mode</div>
              <div style="font-size: 0.78rem; color: #64748b;">Hide from search while keeping your profile</div>
            </div>
          </div>
          <div style="width: 44px; height: 24px; background: #e2e8f0; border-radius: 12px; position: relative; cursor: pointer;">
            <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
          </div>
        </div>

        <!-- Switch Role -->
        <button id="btn-switch-to-traveler-more" style="margin-top: 1rem; width: 100%; padding: 0.85rem; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 14px; font-weight: 700; font-size: 0.9rem; cursor: pointer; color: #0284c7; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <svg width="16" height="16" data-lucide="repeat"></svg>
          Switch to Traveler Mode
        </button>
      </div>
    `;
  }

  // ── PRE-VERIFICATION CONTENT (draft, submitted, in_review, needs_info, rejected) ──
  function renderPreVerificationContent() {
    const statusConfig = {
      [LOCAL_STATUS.DRAFT]: {
        label: 'Draft', color: '#64748b', bg: '#f1f5f9',
        message: 'Complete your application to be listed as a Local Guide.',
        canEdit: true, canTrain: true,
      },
      [LOCAL_STATUS.SUBMITTED]: {
        label: 'Application Submitted', color: '#0ea5e9', bg: '#e0f2fe',
        message: 'Your application is being reviewed (1-2 business days). You cannot edit while it is in review.',
        canEdit: false, canTrain: true,
      },
      [LOCAL_STATUS.IN_REVIEW]: {
        label: 'Under Review', color: '#8b5cf6', bg: '#ede9fe',
        message: 'Our team is actively reviewing your profile. You can take the Safety Training while you wait.',
        canEdit: false, canTrain: true,
      },
      [LOCAL_STATUS.NEEDS_INFO]: {
        label: 'Action Required', color: '#f59e0b', bg: '#fef3c7',
        message: 'We need additional information from you. Please update and resubmit your application.',
        canEdit: true, canTrain: true,
      },
      [LOCAL_STATUS.REJECTED]: {
        label: 'Application Not Approved', color: '#ef4444', bg: '#fee2e2',
        message: 'Your application was not approved at this time. Check your email for the reason. You may reapply once.',
        canEdit: true, canTrain: false,
      },
    };

    const status = statusConfig[localStatus] || statusConfig[LOCAL_STATUS.DRAFT];

    return `
      <div style="max-width: 680px; margin: 2rem auto; animation: fadeUp 0.4s var(--ease);">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 style="font-size: 1.8rem; font-weight: 900; margin: 0 0 0.5rem;">Your Local Application</h1>
          <p style="color: #64748b; font-size: 0.95rem; margin: 0;">${status.message}</p>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 2rem; margin-bottom: 1.25rem;">
          <h2 style="margin: 0 0 1rem; font-size: 1.1rem; font-weight: 800;">Application Checklist</h2>
          ${[
            { text: 'Profile photo & bio', done: true },
            { text: 'Languages & neighborhood', done: true },
            { text: 'First experience draft', done: localStatus !== LOCAL_STATUS.DRAFT },
            { text: 'ID verification upload', done: localStatus !== LOCAL_STATUS.DRAFT },
            { text: 'Safety training quiz (8/10 required)', done: false },
            { text: 'Payout email (PayPal)', done: false },
          ].map(item => `
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;">
              <div style="width: 24px; height: 24px; border-radius: 50%;
                background: ${item.done ? '#10b981' : '#e2e8f0'};
                display: flex; align-items: center; justify-content: center; flex-shrink: 0;" aria-hidden="true">
                ${item.done ? '<svg width="14" height="14" data-lucide="check" style="color: white;"></svg>' :
                  '<div style="width: 8px; height: 8px; border-radius: 50%; background: #94a3b8;"></div>'}
              </div>
              <span style="font-size: 0.9rem; font-weight: 600;
                color: ${item.done ? '#16a34a' : '#334155'};
                ${item.done ? 'text-decoration: line-through;' : ''}">
                ${item.text}
              </span>
            </div>
          `).join('')}

          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;">
            ${status.canEdit ? `
              <a href="#/become-a-local"
                style="padding: 0.85rem; background: linear-gradient(135deg, #10b981, #059669);
                color: white; border-radius: 14px; font-weight: 800; font-size: 0.95rem;
                text-align: center; text-decoration: none; display: block;
                box-shadow: 0 4px 14px rgba(16,185,129,0.3);">
                ${localStatus === LOCAL_STATUS.REJECTED ? 'Reapply as Local Guide' : 'Continue Application'} →
              </a>` : `
              <div style="padding: 0.85rem; background: #f1f5f9; border: 1px dashed #cbd5e1;
                border-radius: 14px; text-align: center; color: #94a3b8; font-size: 0.9rem; font-weight: 600;"
                role="note">
                <svg width="14" height="14" data-lucide="lock" style="vertical-align: -2px; margin-right: 0.3rem;"></svg>
                Application locked while under review
              </div>`}
            ${status.canTrain ? `
              <a href="#/host/training"
                style="padding: 0.85rem; background: white; border: 2px solid #8b5cf6;
                color: #7c3aed; border-radius: 14px; font-weight: 800; font-size: 0.9rem;
                text-align: center; text-decoration: none; display: block;">
                Take Safety Training →
              </a>` : ''}
          </div>
        </div>

        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 14px;
          padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.75rem;">
          <svg width="18" height="18" data-lucide="message-square" style="color: #0ea5e9; flex-shrink: 0;"></svg>
          <p style="margin: 0; font-size: 0.85rem; color: #0c4a6e;">
            While you wait, you can read and participate in the
            <a href="#/community" style="color: #0ea5e9; font-weight: 700;">Community</a>.
          </p>
        </div>
      </div>
    `;
  }

  // ── Event Handlers ────────────────────────────────────────────────────────
  function attachHandlers() {
    // Tab navigation
    container.querySelectorAll('.host-nav-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) {
          activeTab = tab;
          render();
        }
      });
    });

    // Switch to Traveler mode
    const switchBtns = container.querySelectorAll('#btn-switch-to-traveler, #btn-switch-to-traveler-more');
    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchRole('traveler');
        window.location.hash = '/d/rome';
      });
    });

    // Accept request demo
    container.querySelectorAll('.btn-accept-request').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.innerHTML = '<svg width="16" height="16" data-lucide="check-circle"></svg> Accepted!';
        btn.style.background = '#059669';
        btn.disabled = true;
        if (window.lucide) window.lucide.createIcons();
      });
    });

    // Counter request demo
    container.querySelectorAll('.btn-counter-request').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.innerHTML = '<svg width="16" height="16" data-lucide="send"></svg> Counter Sent';
        btn.style.background = '#0ea5e9';
        btn.style.color = 'white';
        btn.style.borderColor = '#0ea5e9';
        if (window.lucide) window.lucide.createIcons();
      });
    });

    // Decline request demo
    container.querySelectorAll('.btn-decline-request').forEach(btn => {
      btn.addEventListener('click', () => {
        const reason = prompt('Reason for declining (required):');
        if (reason) {
          btn.innerHTML = '<svg width="16" height="16" data-lucide="x-circle"></svg> Declined';
          btn.style.background = '#ef4444';
          btn.style.color = 'white';
          btn.disabled = true;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }

  render();
}
