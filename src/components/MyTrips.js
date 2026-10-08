import { Storage } from '../utils/storage.js';

export function renderMyTrips(container, onClose) {
  const bookings = Storage.get('travgod_bookings', []);

  container.innerHTML = `
    <div class="modal-overlay open" style="z-index: 25000;">
      <div class="modal-content" style="max-width: 600px; max-height: 80vh;">
        <div class="modal-header">
          <h2>My Trips</h2>
          <button class="btn-icon" id="btn-close-trips" style="color: var(--text-secondary);">
            <svg width="24" height="24" data-lucide="x"></svg>
          </button>
        </div>
        
        <div class="modal-body" style="padding: 1.5rem; background: var(--bg-gray); overflow-y: auto; flex: 1;">
          ${bookings.length === 0 ? `
            <div style="text-align: center; padding: 4rem 2rem;">
              <svg width="48" height="48" data-lucide="map" style="color: var(--border); margin-bottom: 1rem;"></svg>
              <h3 style="color: var(--text-primary); margin: 0 0 0.5rem 0;">No Upcoming Trips</h3>
              <p style="color: var(--text-secondary); margin: 0;">You haven't booked any guides yet. Discover a destination to get started!</p>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${bookings.map(b => `
                <div style="background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.5rem; display: flex; gap: 1.5rem; align-items: flex-start; box-shadow: var(--shadow-sm);">
                  <img src="${b.guideAvatar}" style="width: 80px; height: 80px; border-radius: var(--radius-sm); object-fit: cover;" />
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                      <div>
                        <span style="display: inline-block; padding: 0.25rem 0.75rem; background: #d1fae5; color: #059669; font-size: 0.75rem; font-weight: 800; border-radius: var(--radius-pill); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Confirmed</span>
                        <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${b.guideName}</h3>
                      </div>
                      <div style="text-align: right;">
                        <div style="font-size: 1.1rem; font-weight: 800; color: var(--blue);">€${b.total.toFixed(2)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); font-family: monospace;">Ref: ${b.id}</div>
                      </div>
                    </div>
                    <div style="display: flex; gap: 1rem; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; margin-bottom: 1rem;">
                      <div style="display: flex; align-items: center; gap: 0.35rem;">
                        <svg width="16" height="16" data-lucide="calendar"></svg> ${b.date}
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.35rem;">
                        <svg width="16" height="16" data-lucide="clock"></svg> ${b.time} (${b.hours} hrs)
                      </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                      <button class="btn-chat-trip" data-guide-id="${b.guideId}" style="padding: 0.5rem 1rem; background: var(--bg-gray); border: 1px solid var(--border); color: var(--text-primary); border-radius: var(--radius-sm); font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
                        Message Guide
                      </button>
                      <button style="padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--blue); color: var(--blue); border-radius: var(--radius-sm); font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  container.querySelector('#btn-close-trips').addEventListener('click', () => {
    container.querySelector('.modal-overlay').classList.remove('open');
    setTimeout(onClose, 300);
  });
}
