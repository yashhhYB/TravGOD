import { Storage } from '../utils/storage.js';

export function renderPayPalModal(container, guide, onClose) {
  let hours = 2; // Default 2 hours
  let total = guide.rate * hours;
  
  // HTML Structure
  container.innerHTML = `
    <div class="modal-overlay open">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Book Guide</h2>
          <button class="btn-icon" id="btn-close-modal" style="color: var(--text-secondary);">
            <svg width="24" height="24" data-lucide="x"></svg>
          </button>
        </div>
        
        <div class="modal-body" id="modal-form-view">
          <div style="display: flex; gap: 1rem; margin-bottom: 2rem; align-items: center;">
            <img src="${guide.avatar}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover;" />
            <div>
              <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-primary);">${guide.name}</h3>
              <div style="font-size: 0.9rem; color: var(--text-secondary);">€${guide.rate} / hour</div>
            </div>
          </div>

          <div class="booking-field">
            <label>Select Date</label>
            <input type="date" id="book-date" class="booking-input" required />
          </div>

          <div style="display: flex; gap: 1rem;">
            <div class="booking-field" style="flex: 1;">
              <label>Start Time</label>
              <input type="time" id="book-time" class="booking-input" value="10:00" required />
            </div>
            <div class="booking-field" style="flex: 1;">
              <label>Duration</label>
              <select id="book-hours" class="booking-input">
                <option value="1">1 Hour</option>
                <option value="2" selected>2 Hours</option>
                <option value="3">3 Hours</option>
                <option value="4">4 Hours</option>
                <option value="8">Full Day (8 Hours)</option>
              </select>
            </div>
          </div>

          <div class="booking-summary">
            <div class="summary-row">
              <span>Guide Rate</span>
              <span>€${guide.rate}/hr</span>
            </div>
            <div class="summary-row">
              <span>Duration</span>
              <span id="summary-hours">${hours} hours</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span id="summary-total">€${total.toFixed(2)}</span>
            </div>
          </div>

          <!-- PayPal Button Container -->
          <div id="paypal-button-container"></div>
        </div>

        <!-- Success View (Hidden initially) -->
        <div class="modal-body" id="modal-success-view" style="display: none; text-align: center; padding: 3rem 2rem;">
          <div style="width: 64px; height: 64px; background: #d1fae5; color: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
            <svg width="32" height="32" data-lucide="check"></svg>
          </div>
          <h2 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1.5rem;">Booking Confirmed!</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">Your trip with ${guide.name} is scheduled and confirmed.</p>
          
          <div style="background: var(--bg-gray); padding: 1rem; border-radius: var(--radius-md); text-align: left; margin-bottom: 2rem;">
            <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; margin-bottom: 0.25rem;">Reference ID</div>
            <div id="success-ref" style="font-family: monospace; font-size: 1.1rem; color: var(--text-primary); font-weight: 600;"></div>
          </div>

          <button id="btn-done" style="width: 100%; padding: 0.875rem; background: var(--blue); color: white; border: none; border-radius: var(--radius-pill); font-weight: 700; font-size: 1rem; cursor: pointer;">
            View My Trips
          </button>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Handle Close
  const handleClose = () => {
    const overlay = container.querySelector('.modal-overlay');
    if (overlay) overlay.classList.remove('open');
    setTimeout(onClose, 300);
  };
  container.querySelector('#btn-close-modal').addEventListener('click', handleClose);

  // Set minimum date to today
  const dateInput = container.querySelector('#book-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  dateInput.min = today;

  // Handle Hour Change
  container.querySelector('#book-hours').addEventListener('change', (e) => {
    hours = parseInt(e.target.value, 10);
    total = guide.rate * hours;
    container.querySelector('#summary-hours').innerText = `${hours} hour${hours > 1 ? 's' : ''}`;
    container.querySelector('#summary-total').innerText = `€${total.toFixed(2)}`;
  });

  // Render PayPal Button
  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            description: `TRAVGOD Guide Booking: ${guide.name}`,
            amount: {
              currency_code: 'USD',
              value: total.toString() // In reality, we'd convert EUR to USD or use EUR natively, simplifying for demo
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          // Success!
          const date = container.querySelector('#book-date').value;
          const time = container.querySelector('#book-time').value;
          
          const bookingId = `TG-${Math.random().toString(36).substring(2, 8).toUpperCase()}-PAR`;
          
          // Save to LocalStorage
          const bookings = Storage.get('travgod_bookings', []);
          bookings.push({
            id: bookingId,
            guideId: guide.id,
            guideName: guide.name,
            guideAvatar: guide.avatar,
            date,
            time,
            hours,
            total,
            status: 'confirmed',
            createdAt: new Date().toISOString()
          });
          Storage.set('travgod_bookings', bookings);

          // Show Success View
          container.querySelector('#modal-form-view').style.display = 'none';
          container.querySelector('#modal-success-view').style.display = 'block';
          container.querySelector('#success-ref').innerText = bookingId;
          
          container.querySelector('#btn-done').addEventListener('click', () => {
            handleClose();
            // In a real app we'd trigger a router change to My Trips here
          });
        });
      }
    }).render('#paypal-button-container');
  } else {
    container.querySelector('#paypal-button-container').innerHTML = '<p style="color: red; text-align: center;">PayPal SDK failed to load.</p>';
  }
}
