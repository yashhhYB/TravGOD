/**
 * AppHeader.js — Role-Aware Fixed Header Component for TRAVGOD
 * Shows different navigation based on user role:
 * - Traveler: Home, Explore, My Trips, Locals, About
 * - Local Guide: Dashboard, Requests, Experiences, Explore
 * - Not logged in: Home, Explore, About + Sign In button
 * 
 * Includes role badge and role-switch button for logged-in users.
 */

import { setupHeaderAuth } from '../utils/headerAuth.js';
import { getUserRole, isLoggedIn, ROLES, getNavConfig } from '../utils/roles.js';

export function getAppHeaderHtml({
  activeNav = 'home',
  isSolid = true,
  centerContent = ''
} = {}) {
  const role = getUserRole();
  const loggedIn = isLoggedIn();

  // Get role-appropriate nav items
  let navItems;
  if (!loggedIn) {
    navItems = [
      { label: 'Home', route: '#/', id: 'home' },
      { label: 'Explore', route: '#/explore', id: 'explore' },
      { label: 'About', route: '#/about', id: 'about' },
    ];
  } else if (role === ROLES.LOCAL) {
    navItems = [
      { label: 'Dashboard', route: '#/host', id: 'host' },
      { label: 'Requests', route: '#/host/requests', id: 'requests' },
      { label: 'Explore', route: '#/d/rome', id: 'explore' },
      { label: 'Become a Local', route: '#/become-a-local', id: 'become-local', hidden: true },
    ];
  } else {
    navItems = [
      { label: 'Home', route: '#/', id: 'home' },
      { label: 'Explore', route: '#/explore', id: 'explore' },
      { label: 'My Trips', route: '#/trips', id: 'trips' },
      { label: 'Locals', route: '#/locals', id: 'locals' },
      { label: 'About', route: '#/about', id: 'about' },
    ];
  }

  const visibleNavItems = navItems.filter(n => !n.hidden);

  return `
    <header class="app-header ${isSolid ? 'solid-header' : ''}" id="app-header">
      <div class="header-inner">
        <!-- Brand Logo -->
        <a href="#/" class="logo" aria-label="TRAVGOD home" style="text-decoration: none;">
          <div class="logo-icon">
            <svg width="18" height="18" data-lucide="map-pin"></svg>
          </div>
          <div>
            <div class="logo-name">TRAVGOD</div>
            <div class="logo-tag">${role === ROLES.LOCAL ? 'Host Dashboard' : 'Explore · Connect · Travel Safe'}</div>
          </div>
        </a>

        <!-- Center Slot (e.g. City Switcher) -->
        ${centerContent ? `<div class="header-center-slot" style="display: flex; align-items: center;">${centerContent}</div>` : ''}

        <!-- Nav Links (role-aware) -->
        <nav class="header-nav" aria-label="Main navigation">
          ${visibleNavItems.map(n => `
            <a href="${n.route}" class="${activeNav === n.id ? 'active' : ''}">${n.label}</a>
          `).join('')}
        </nav>

        <!-- Actions / Auth Slot -->
        <div class="header-actions" id="header-auth-slot">
          <button class="btn-signin" id="btn-sign-in">Sign In</button>
        </div>
      </div>
    </header>
  `;
}

export function initAppHeader(container) {
  const header = container.querySelector('#app-header');
  if (header) {
    setupHeaderAuth(header);
  }
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
