/**
 * SignInModal.js — User Sign In & Taste Profile Modal
 */
import { Storage } from '../utils/storage.js';

export function renderSignInModal(container, onClose) {
  const user = Storage.get('travgod_user', {
    name: 'Yash B.',
    email: 'yash@example.com',
    role: 'tourist',
    tastes: ['Foodie Destination', 'Neoclassical Architecture', 'Indie Music']
  });

  container.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;" id="signin-backdrop">
      <div style="background: var(--bg-card, #1e293b); border: 1px solid var(--border-light, rgba(255,255,255,0.1)); border-radius: 20px; width: 100%; max-width: 480px; padding: 2rem; color: var(--text-primary, #f8fafc); position: relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
        
        <button id="btn-close-signin" style="position: absolute; top: 1.25rem; right: 1.25rem; background: transparent; border: none; color: var(--text-secondary, #94a3b8); cursor: pointer;">
          <svg width="20" height="20" data-lucide="x"></svg>
        </button>

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="display: inline-flex; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #a855f7); align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(14,165,233,0.3);">
            <svg width="28" height="28" data-lucide="user-check" style="color: white;"></svg>
          </div>
          <h2 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 800;">Welcome to TRAVGOD</h2>
          <p style="margin: 0; color: var(--text-secondary, #94a3b8); font-size: 0.9rem;">Sign in to access Qloo Taste AI matching & bookings</p>
        </div>

        <form id="signin-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary, #94a3b8); margin-bottom: 0.35rem;">Full Name</label>
            <input type="text" id="user-name" value="${user.name}" required style="width: 100%; padding: 0.75rem 1rem; background: var(--bg-body, #0f172a); border: 1px solid var(--border-light, rgba(255,255,255,0.1)); border-radius: 10px; color: white; font-size: 0.95rem; box-sizing: border-box;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary, #94a3b8); margin-bottom: 0.35rem;">Email Address</label>
            <input type="email" id="user-email" value="${user.email}" required style="width: 100%; padding: 0.75rem 1rem; background: var(--bg-body, #0f172a); border: 1px solid var(--border-light, rgba(255,255,255,0.1)); border-radius: 10px; color: white; font-size: 0.95rem; box-sizing: border-box;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary, #94a3b8); margin-bottom: 0.35rem;">Account Role</label>
            <select id="user-role" style="width: 100%; padding: 0.75rem 1rem; background: var(--bg-body, #0f172a); border: 1px solid var(--border-light, rgba(255,255,255,0.1)); border-radius: 10px; color: white; font-size: 0.95rem; box-sizing: border-box;">
              <option value="tourist" ${user.role === 'tourist' ? 'selected' : ''}>Tourist / Traveler</option>
              <option value="guide" ${user.role === 'guide' ? 'selected' : ''}>Verified Local Guide</option>
            </select>
          </div>

          <div style="margin-top: 0.5rem; background: rgba(14, 165, 233, 0.08); padding: 1rem; border-radius: 12px; border: 1px dashed rgba(14, 165, 233, 0.3);">
            <div style="font-size: 0.85rem; font-weight: 700; color: #0ea5e9; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
              <svg width="16" height="16" data-lucide="sparkles"></svg> Qloo Taste AI Preferences
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${user.tastes.map(t => `<span style="background: rgba(14, 165, 233, 0.2); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">${t}</span>`).join('')}
            </div>
          </div>

          <button type="submit" style="margin-top: 0.5rem; padding: 0.85rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: opacity 0.2s;">
            Save & Continue
          </button>
        </form>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const backdrop = container.querySelector('#signin-backdrop');
  const closeBtn = container.querySelector('#btn-close-signin');
  const form = container.querySelector('#signin-form');

  const close = () => {
    container.innerHTML = '';
    if (onClose) onClose();
  };

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedUser = {
      name: container.querySelector('#user-name').value,
      email: container.querySelector('#user-email').value,
      role: container.querySelector('#user-role').value,
      tastes: user.tastes
    };
    Storage.set('travgod_user', updatedUser);
    
    if (updatedUser.role === 'guide') {
      window.location.hash = '/guide-dashboard';
    }
    close();
  });
}
