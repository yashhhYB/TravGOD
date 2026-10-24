/**
 * BottomNav.js — Role-Aware Mobile Bottom Navigation
 * Shows different tabs based on user role:
 * - Traveler: Explore, Trips, Locals, Messages, Profile
 * - Local (verified): Home, Requests, Calendar, Messages, More
 * - Local (unverified): Application, Training, Community, Profile
 */

import { getNavConfig, getUserRole, isLoggedIn, ROLES } from '../utils/roles.js';

export function renderBottomNav(container, { activeTab = '' } = {}) {
  if (!isLoggedIn()) return '';

  const navConfig = getNavConfig();
  const tabs = navConfig.bottomTabs || [];
  const role = getUserRole();

  const isLocal = role === ROLES.LOCAL;
  const accentColor = isLocal ? '#10b981' : '#0ea5e9';
  const accentBg = isLocal ? 'rgba(16, 185, 129, 0.1)' : 'rgba(14, 165, 233, 0.1)';

  const navHtml = `
    <nav class="bottom-nav" id="bottom-nav" role="navigation" aria-label="Main navigation">
      <div class="bottom-nav-inner">
        ${tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return `
            <a href="${tab.route}" 
               class="bottom-nav-tab ${isActive ? 'active' : ''}" 
               data-tab="${tab.id}"
               aria-label="${tab.label}"
               aria-current="${isActive ? 'page' : 'false'}"
               style="
                 --tab-color: ${isActive ? accentColor : '#94a3b8'};
                 --tab-bg: ${isActive ? accentBg : 'transparent'};
               ">
              <div class="bottom-nav-icon-wrap">
                <svg width="20" height="20" data-lucide="${tab.icon}"></svg>
                ${tab.id === 'messages' ? '<span class="bottom-nav-badge" id="msg-badge" style="display: none;">2</span>' : ''}
                ${tab.id === 'requests' ? '<span class="bottom-nav-badge" id="req-badge" style="display: none;">3</span>' : ''}
              </div>
              <span class="bottom-nav-label">${tab.label}</span>
            </a>
          `;
        }).join('')}
      </div>

      ${isLocal ? `
        <div class="bottom-nav-role-indicator local">
          <svg width="10" height="10" data-lucide="shield-check"></svg>
          Local Mode
        </div>
      ` : ''}
    </nav>
  `;

  return navHtml;
}

/**
 * Initialize bottom nav after DOM insertion — sets up Lucide icons
 * and simulates notification badges for demo
 */
export function initBottomNav(container) {
  if (window.lucide) window.lucide.createIcons();

  // Demo: show badges after a short delay
  setTimeout(() => {
    const msgBadge = container.querySelector('#msg-badge');
    if (msgBadge) {
      msgBadge.style.display = 'flex';
      msgBadge.style.animation = 'badgePop 0.3s var(--ease)';
    }
    const reqBadge = container.querySelector('#req-badge');
    if (reqBadge) {
      reqBadge.style.display = 'flex';
      reqBadge.style.animation = 'badgePop 0.3s var(--ease)';
    }
  }, 1500);
}
