/**
 * main.js — TRAVGOD Application Router with Role-Based Route Guards
 * Supports Traveler and Local Guide roles with automatic redirects.
 * 
 * Traveler: Explore, Trips, Locals, Messages, Profile
 * Local: Host Dashboard (Home, Requests, Calendar, Messages, More)
 * 
 * Route guards enforce:
 * - Travelers cannot access /host/* routes
 * - Locals redirected away from /trips, /bookings, /request, /checkout
 * - Unauthenticated users prompted to sign in for protected routes
 */

import { renderLandingView } from './components/LandingView.js';
import { renderDashboardView } from './components/DashboardView.js';
import { renderAboutView } from './components/AboutView.js';
import { renderBecomeLocalView } from './components/BecomeLocalView.js';
import { renderMyTrips } from './components/MyTrips.js';
import { renderHostDashboardView } from './components/HostDashboardView.js';
import { renderOnboardingModal } from './components/OnboardingModal.js';
import { DESTINATIONS } from './data/destinations.js';
import { checkRouteAccess, getUserRole, isLoggedIn, ROLES } from './utils/roles.js';

// ── App State ──────────────────────────────────────────────────────────────
const state = {
  currentRoute: '',
  selectedDestination: null,
  cleanupFn: null,
  pendingRedirect: null,  // store where to go after sign-in
};

const appRoot = document.getElementById('app');

// ── Toast Notification ─────────────────────────────────────────────────────
function showRoleToast(message, type = 'info') {
  const existing = document.getElementById('role-toast');
  if (existing) existing.remove();

  const colors = {
    info: { bg: '#e0f2fe', border: '#bae6fd', text: '#0c4a6e', icon: 'info' },
    warning: { bg: '#fef3c7', border: '#fde68a', text: '#92400e', icon: 'alert-triangle' },
    redirect: { bg: '#f0fdf4', border: '#bbf7d0', text: '#065f46', icon: 'arrow-right' },
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.id = 'role-toast';
  toast.innerHTML = `
    <div style="position: fixed; top: 84px; left: 50%; transform: translateX(-50%); z-index: 9999;
      background: ${c.bg}; border: 1px solid ${c.border}; color: ${c.text};
      padding: 0.65rem 1.25rem; border-radius: 12px; font-size: 0.85rem; font-weight: 700;
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: flex; align-items: center; gap: 0.5rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      animation: toastSlide 0.35s cubic-bezier(0.22, 1, 0.36, 1);">
      <svg width="16" height="16" data-lucide="${c.icon}"></svg>
      ${message}
    </div>
  `;
  document.body.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── View Router ────────────────────────────────────────────────────────────
function router() {
  const hash = window.location.hash.slice(1) || '/';
  
  if (state.cleanupFn) {
    state.cleanupFn();
    state.cleanupFn = null;
  }
  
  // ── Route Guard Check ────────────────────────────────────────────────────
  const access = checkRouteAccess(hash);
  if (!access.allowed && access.redirect) {
    if (access.redirect === '/signin') {
      // Store where user wanted to go, redirect after sign-in
      state.pendingRedirect = hash;
      showRoleToast('Please sign in to continue', 'info');
    } else {
      const role = getUserRole();
      if (role === ROLES.LOCAL) {
        showRoleToast('Locals use the Host Dashboard for this feature', 'redirect');
      } else {
        showRoleToast('Become a Local to access host features', 'redirect');
      }
    }
    window.location.hash = access.redirect;
    return;
  }
  
  state.currentRoute = hash;
  appRoot.innerHTML = '';
  
  // Close any open modals when navigating
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) modalContainer.innerHTML = '';

  // ── Route Matching ───────────────────────────────────────────────────────
  
  if (hash === '/' || hash === '') {
    state.cleanupFn = renderLandingView(appRoot, {
      onDestinationSelect: (dest) => {
        state.selectedDestination = dest;
        if (dest.id === 'rome') {
          window.location.hash = '/d/rome';
        } else {
          window.location.hash = '/d/paris';
        }
      },
    });
  } else if (hash === '/signin' || hash === '/onboarding') {
    state.cleanupFn = renderLandingView(appRoot, {
      onDestinationSelect: (dest) => {
        state.selectedDestination = dest;
        window.location.hash = dest.id === 'rome' ? '/d/rome' : '/d/paris';
      }
    });
    let modalCont = document.getElementById('modal-container');
    if (!modalCont) {
      modalCont = document.createElement('div');
      modalCont.id = 'modal-container';
      document.body.appendChild(modalCont);
    }
    renderOnboardingModal(modalCont, {
      onComplete: (user) => {
        // After sign-in, redirect to pending page or role-based default
        if (state.pendingRedirect) {
          window.location.hash = state.pendingRedirect;
          state.pendingRedirect = null;
        } else if (user && user.role === 'guide') {
          window.location.hash = '/host';
        } else {
          window.location.hash = '/d/rome';
        }
      }
    });
  } else if (hash === '/d/rome' || hash.startsWith('/d/rome/')) {
    const subTab = hash.includes('/rules') ? 'rules' : 
                   hash.includes('/scams') ? 'scams' : 
                   hash.includes('/prices') ? 'prices' : 
                   hash.includes('/food') ? 'food' :
                   hash.includes('/locals') || hash.includes('/guides') ? 'guides' : 
                   hash.includes('/hidden') ? 'hidden' : 
                   hash.includes('/emergency') ? 'emergency' : 
                   hash.includes('/overview') ? 'overview' : 'guides';
    state.cleanupFn = renderDashboardView(appRoot, { initialDestinationId: 'rome', initialTab: subTab });
  } else if (hash === '/d/paris' || hash.startsWith('/d/paris/')) {
    const subTab = hash.includes('/rules') ? 'rules' : 
                   hash.includes('/scams') ? 'scams' : 
                   hash.includes('/prices') ? 'prices' : 
                   hash.includes('/food') ? 'food' :
                   hash.includes('/locals') || hash.includes('/guides') ? 'guides' : 
                   hash.includes('/hidden') ? 'hidden' : 
                   hash.includes('/emergency') ? 'emergency' : 
                   hash.includes('/overview') ? 'overview' : 'guides';
    state.cleanupFn = renderDashboardView(appRoot, { initialDestinationId: 'paris', initialTab: subTab });
  } else if (hash === '/dashboard' || hash === '/explore' || hash === '/locals') {
    state.cleanupFn = renderDashboardView(appRoot, { initialDestinationId: 'paris', initialTab: 'guides' });
  } else if (hash === '/about') {
    renderAboutView(appRoot);
  } else if (hash === '/become-a-local') {
    renderBecomeLocalView(appRoot, { initialMode: 'landing' });
  } else if (hash === '/host' || hash.startsWith('/host/')) {
    // Host dashboard with sub-tab support
    const subTab = hash.includes('/requests') ? 'requests' :
                   hash.includes('/calendar') ? 'calendar' :
                   hash.includes('/messages') ? 'messages' :
                   hash.includes('/experiences') ? 'experiences' :
                   hash.includes('/earnings') ? 'earnings' :
                   hash.includes('/more') ? 'more' :
                   hash.includes('/spots') ? 'more' :
                   hash.includes('/reviews') ? 'more' :
                   hash.includes('/training') ? 'more' :
                   hash.includes('/profile') ? 'more' : 'home';
    renderHostDashboardView(appRoot, { initialTab: subTab });
  } else if (hash === '/guide-dashboard') {
    // Legacy route redirect
    renderHostDashboardView(appRoot, { initialTab: 'home' });
  } else if (hash === '/trips' || hash === '/bookings') {
    renderMyTrips(appRoot);
  } else if (hash === '/messages') {
    // For now redirect to the explore with messages indicator
    if (getUserRole() === ROLES.LOCAL) {
      renderHostDashboardView(appRoot, { initialTab: 'messages' });
    } else {
      state.cleanupFn = renderDashboardView(appRoot, { initialDestinationId: 'rome', initialTab: 'guides' });
    }
  } else if (hash === '/profile') {
    // For now redirect to onboarding/profile settings
    if (getUserRole() === ROLES.LOCAL) {
      renderHostDashboardView(appRoot, { initialTab: 'more' });
    } else {
      state.cleanupFn = renderLandingView(appRoot, {
        onDestinationSelect: (dest) => {
          state.selectedDestination = dest;
          window.location.hash = dest.id === 'rome' ? '/d/rome' : '/d/paris';
        }
      });
      let modalCont = document.getElementById('modal-container');
      if (!modalCont) {
        modalCont = document.createElement('div');
        modalCont.id = 'modal-container';
        document.body.appendChild(modalCont);
      }
      renderOnboardingModal(modalCont);
    }
  } else if (hash === '/community') {
    // Redirect to explore for now
    state.cleanupFn = renderDashboardView(appRoot, { initialDestinationId: 'rome', initialTab: 'guides' });
  } else if (hash === '/safety') {
    state.cleanupFn = renderDashboardView(appRoot, { initialDestinationId: 'rome', initialTab: 'emergency' });
  } else if (hash === '/saved') {
    // Redirect to trips view which has saved places
    renderMyTrips(appRoot);
  } else {
    // 404 Fallback
    appRoot.innerHTML = `<div style="padding: 100px; text-align: center;"><h1>404 Not Found</h1><a href="#/">Go Home</a></div>`;
  }
}

// ── Inject toast animation keyframe ────────────────────────────────────────
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes toastSlide {
    from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(toastStyle);

// ── Boot ───────────────────────────────────────────────────────────────────
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
