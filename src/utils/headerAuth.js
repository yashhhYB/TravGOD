/**
 * headerAuth.js — Dynamic User Profile & Header Auth Helper
 * Shows role badge (Traveler/Local Guide) with role-switch capability.
 * Traveler: blue badge, Local: green badge with "Switch to X" option
 */
import { Storage } from './storage.js';
import { renderOnboardingModal } from '../components/OnboardingModal.js';
import { getUserRole, isLoggedIn, switchRole, ROLES } from './roles.js';

export function setupHeaderAuth(headerContainer) {
  if (!headerContainer) return;
  const user = Storage.get('travgod_user', null);
  const actionArea = headerContainer.querySelector('.header-actions') || headerContainer.querySelector('#header-auth-slot');
  if (!actionArea) return;

  if (user) {
    const role = getUserRole();
    const isGuide = role === ROLES.LOCAL;
    const roleName = isGuide ? 'Local Guide' : 'Traveler';
    const roleColor = isGuide ? '#16a34a' : '#0284c7';
    const roleBg = isGuide ? '#dcfce7' : '#e0f2fe';
    const switchTarget = isGuide ? 'traveler' : 'guide';
    const switchLabel = isGuide ? 'Traveler Mode' : 'Local Mode';

    actionArea.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <!-- Role Switch Button -->
        <button id="btn-role-switch" style="display: flex; align-items: center; gap: 0.35rem; padding: 4px 10px; background: transparent; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 0.7rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s;" title="Switch to ${switchLabel}">
          <svg width="12" height="12" data-lucide="repeat"></svg>
          ${switchLabel}
        </button>

        <!-- User menu button -->
        <div id="user-menu-btn" style="display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 10px 4px 6px; border-radius: 999px; cursor: pointer; transition: all 0.2s;" title="Manage Account & Travel DNA">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />
          <span style="font-size: 0.82rem; font-weight: 700; color: #0f172a;">${user.name.split(' ')[0]}</span>
          <span style="font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 999px; background: ${roleBg}; color: ${roleColor};">
            ${roleName}
          </span>
        </div>
      </div>
    `;

    // Role switch handler
    const roleSwitch = actionArea.querySelector('#btn-role-switch');
    if (roleSwitch) {
      roleSwitch.addEventListener('click', () => {
        switchRole(switchTarget);
        if (switchTarget === ROLES.LOCAL) {
          window.location.hash = '/host';
        } else {
          window.location.hash = '/d/rome';
        }
      });
    }

    // User menu handler
    const userBtn = actionArea.querySelector('#user-menu-btn');
    if (userBtn) {
      userBtn.addEventListener('click', () => {
        let modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
          modalContainer = document.createElement('div');
          modalContainer.id = 'modal-container';
          document.body.appendChild(modalContainer);
        }
        renderOnboardingModal(modalContainer, {
          onComplete: () => {
            setupHeaderAuth(headerContainer);
          }
        });
      });
    }
  } else {
    actionArea.innerHTML = `
      <button class="btn-signin" id="btn-sign-in" style="padding: 0.5rem 1.25rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; border-radius: 999px; font-weight: 700; font-size: 0.85rem; cursor: pointer; box-shadow: 0 2px 6px rgba(14,165,233,0.3);">
        Sign In
      </button>
    `;

    const signBtn = actionArea.querySelector('#btn-sign-in');
    if (signBtn) {
      signBtn.addEventListener('click', () => {
        let modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
          modalContainer = document.createElement('div');
          modalContainer.id = 'modal-container';
          document.body.appendChild(modalContainer);
        }
        renderOnboardingModal(modalContainer, {
          onComplete: () => {
            setupHeaderAuth(headerContainer);
          }
        });
      });
    }
  }

  if (window.lucide) window.lucide.createIcons();
}
