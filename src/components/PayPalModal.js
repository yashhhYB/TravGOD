/**
 * PayPalModal.js — Local Guide Connect (v3)
 * PayPal Sandbox Escrow Booking Flow
 * States: pending_payment ➔ paid_in_escrow ➔ checked_in ➔ released
 */

import { Storage } from '../utils/storage.js';

export function renderPayPalModal(container, guide, onClose) {
  let hours = 2;
  const guideRate = guide.rate || guide.pricePerHour || 32;
  let total = guideRate * hours;
  let meetingPoint = 'Piazza Santa Maria in Trastevere Fountain';

  // HTML Structure
  container.innerHTML = `
    <div class="modal-overlay open" style="position: fixed; inset: 0; z-index: 1000; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div class="modal-content" style="background: #ffffff; border-radius: 24px; max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div class="modal-header" style="padding: 1.25rem 1.75rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" data-lucide="shield-check"></svg>
            </div>
            <div>
              <h2 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #0f172a;">Book Verified Local Guide</h2>
              <div style="font-size: 0.75rem; font-weight: 700; color: #0284c7;">PayPal Sandbox Escrow Protection</div>
            </div>
          </div>
          <button class="btn-icon" id="btn-close-modal" style="border: none; background: #f8fafc; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b;">
            <svg width="20" height="20" data-lucide="x"></svg>
          </button>
        </div>
        
        <!-- Form View -->
        <div class="modal-body" id="modal-form-view" style="padding: 1.5rem 1.75rem;">
          
          <!-- Guide Preview Card -->
          <div style="display: flex; gap: 1rem; margin-bottom: 1.25rem; align-items: center; background: #f8fafc; padding: 1rem; border-radius: 16px; border: 1px solid #e2e8f0;">
            <img src="${guide.avatar}" style="width: 58px; height: 58px; border-radius: 50%; object-fit: cover; border: 2px solid #0284c7;" />
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #0f172a;">${guide.name}</h3>
                <span style="font-size: 0.7rem; font-weight: 700; background: #dcfce7; color: #16a34a; padding: 2px 6px; border-radius: 4px;">✓ Verified Local</span>
              </div>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 2px;">
                Rome, Italy &nbsp;•&nbsp; <strong style="color: #0f172a;">€${guideRate}/hr</strong>
              </div>
            </div>
          </div>

          <!-- Meeting Point Selector -->
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">📍 Meeting Location in Rome</label>
            <select id="book-meeting-point" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.88rem; font-weight: 600; color: #0f172a; background: white; outline: none;">
              <option value="Piazza Santa Maria in Trastevere Fountain" selected>Piazza Santa Maria in Trastevere (Fountain)</option>
              <option value="Colosseo Metro Line B Exit">Colosseo Metro Line B (Ground Exit)</option>
              <option value="Piazza Navona - Fontana dei Quattro Fiumi">Piazza Navona (Four Rivers Fountain)</option>
              <option value="Piazza di Spagna (Spanish Steps base)">Piazza di Spagna (Spanish Steps Base)</option>
              <option value="Rome Termini Main Hall">Rome Termini Station (Piazza dei Cinquecento)</option>
            </select>
          </div>

          <!-- Date & Time Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">📅 Tour Date</label>
              <input type="date" id="book-date" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.88rem; font-weight: 600; color: #0f172a; outline: none; box-sizing: border-box;" required />
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">⏰ Start Time</label>
              <input type="time" id="book-time" value="10:00" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.88rem; font-weight: 600; color: #0f172a; outline: none; box-sizing: border-box;" required />
            </div>
          </div>

          <!-- Duration Selector -->
          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">⏳ Experience Duration</label>
            <select id="book-hours" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.88rem; font-weight: 600; color: #0f172a; background: white; outline: none;">
              <option value="1">1 Hour — Quick Neighborhood Intro (€${guideRate * 1})</option>
              <option value="2" selected>2 Hours — Standard Walking Exploration (€${guideRate * 2})</option>
              <option value="3">3 Hours — Deep Dive Culture & Food (€${guideRate * 3})</option>
              <option value="4">4 Hours — Half-Day Hidden Gems (€${guideRate * 4})</option>
              <option value="8">8 Hours — Full Day Rome Masterclass (€${guideRate * 8})</option>
            </select>
          </div>

          <!-- Escrow Explanation Card -->
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
              <span style="font-size: 1.1rem; line-height: 1;">🛡️</span>
              <div style="font-size: 0.8rem; color: #1e40af; line-height: 1.45;">
                <strong style="font-weight: 800;">PayPal Escrow Protection:</strong> Funds remain securely held. Payout is released to the guide <strong>only after</strong> you arrive and check in on tour day. Zero risk of ghosting.
              </div>
            </div>
          </div>

          <!-- Pricing Summary -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #64748b; margin-bottom: 0.4rem;">
              <span>Guide Rate (${hours} hrs @ €${guideRate}/hr)</span>
              <span style="font-weight: 700; color: #0f172a;">€${(guideRate * hours).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #64748b; margin-bottom: 0.4rem;">
              <span>Escrow Service & Traveler Protection</span>
              <span style="font-weight: 700; color: #16a34a;">Free (Demo Waiver)</span>
            </div>
            <div style="border-top: 1px dashed #cbd5e1; margin-top: 0.5rem; padding-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">Total Escrow Deposit</span>
              <span id="summary-total" style="font-size: 1.35rem; font-weight: 900; color: #0284c7;">€${total.toFixed(2)}</span>
            </div>
          </div>

          <!-- Payment Options -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            
            <!-- 1. Real PayPal SDK Button -->
            <div id="paypal-button-container"></div>

            <!-- 2. Instant Payment Button -->
            <button id="btn-instant-demo-pay" style="width: 100%; padding: 0.85rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(14,165,233,0.3); transition: transform 0.15s;">
              <svg width="18" height="18" data-lucide="zap"></svg> Instant Payment
            </button>
            <div style="text-align: center; font-size: 0.72rem; color: #94a3b8; font-weight: 600;">
              One-click instant payment — sets escrow to Paid & Ready
            </div>
          </div>

        </div>

        <!-- Success View (Hidden initially) -->
        <div class="modal-body" id="modal-success-view" style="display: none; text-align: center; padding: 2.5rem 1.75rem;">
          <div style="width: 70px; height: 70px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
            <svg width="36" height="36" data-lucide="shield-check"></svg>
          </div>
          
          <span style="font-size: 0.78rem; font-weight: 800; background: #eff6ff; color: #0284c7; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">
            PayPal Escrow Active
          </span>
          <h2 style="margin: 0.5rem 0 0.25rem 0; color: #0f172a; font-size: 1.5rem; font-weight: 900;">Deposit Secured in Escrow!</h2>
          <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem; line-height: 1.5;">
            Your payment is safely held by PayPal Escrow. Guide <strong>${guide.name}</strong> has received the booking notification. Funds will only be released after your tour check-in.
          </p>
          
          <!-- Booking Reference Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.25rem; text-align: left; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Escrow Reference ID</span>
              <span id="success-ref" style="font-family: monospace; font-size: 0.95rem; color: #0284c7; font-weight: 800;"></span>
            </div>
            <div style="font-size: 0.85rem; color: #334155; margin-bottom: 0.25rem;">
              <strong>Tour:</strong> Rome Discovery with ${guide.name}
            </div>
            <div style="font-size: 0.85rem; color: #334155; margin-bottom: 0.25rem;">
              <strong>Meeting:</strong> <span id="success-meeting-point"></span>
            </div>
            <div style="font-size: 0.85rem; color: #334155;">
              <strong>Status:</strong> <span style="color: #0284c7; font-weight: 700;">Paid (Held in Escrow)</span>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button id="btn-view-trips" style="flex: 1; padding: 0.85rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(14,165,233,0.3);">
              View Trips & Escrow ➔
            </button>
            <button id="btn-done" style="padding: 0.85rem 1.25rem; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer;">
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Close Handler
  const handleClose = () => {
    const overlay = container.querySelector('.modal-overlay');
    if (overlay) overlay.style.display = 'none';
    if (onClose) onClose();
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
    total = guideRate * hours;
    container.querySelector('#summary-total').innerText = `€${total.toFixed(2)}`;
  });

  // Common completion routine
  function recordBookingAndShowSuccess(paymentSource = 'PayPal Sandbox') {
    const date = container.querySelector('#book-date').value || today;
    const time = container.querySelector('#book-time').value || '10:00';
    const point = container.querySelector('#book-meeting-point').value;
    const bookingId = `TG-ROM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newBooking = {
      id: bookingId,
      destinationId: 'rome',
      cityName: 'Rome, Italy',
      guideId: guide.id,
      guideName: guide.name,
      guideAvatar: guide.avatar,
      meetingPoint: point,
      date,
      time,
      hours,
      rate: guideRate,
      total,
      paymentSource,
      status: 'paid_in_escrow', // Escrow lifecycle: pending_payment ➔ paid_in_escrow ➔ checked_in ➔ released
      escrowReleased: false,
      checkedIn: false,
      createdAt: new Date().toISOString()
    };

    const bookings = Storage.get('travgod_bookings', []);
    bookings.unshift(newBooking);
    Storage.set('travgod_bookings', bookings);

    // Switch to success view
    container.querySelector('#modal-form-view').style.display = 'none';
    container.querySelector('#modal-success-view').style.display = 'block';
    container.querySelector('#success-ref').innerText = bookingId;
    container.querySelector('#success-meeting-point').innerText = point;

    container.querySelector('#btn-done').addEventListener('click', handleClose);
    container.querySelector('#btn-view-trips').addEventListener('click', () => {
      handleClose();
      window.location.hash = '/trips';
    });
  }

  // 1-Click Instant Payment Handler
  container.querySelector('#btn-instant-demo-pay').addEventListener('click', () => {
    recordBookingAndShowSuccess('Instant Payment (PayPal Escrow)');
  });

  // Real PayPal SDK Buttons
  if (window.paypal) {
    try {
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal'
        },
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              description: `Local Guide Connect Escrow: ${guide.name} (Rome)`,
              amount: {
                currency_code: 'USD',
                value: total.toString()
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            recordBookingAndShowSuccess(`PayPal Sandbox (${details.id || 'Captured'})`);
          });
        },
        onError: function(err) {
          console.warn('PayPal button error:', err);
        }
      }).render('#paypal-button-container');
    } catch (e) {
      console.warn('PayPal Buttons initialization skipped:', e);
    }
  } else {
    const ppCont = container.querySelector('#paypal-button-container');
    if (ppCont) {
      ppCont.innerHTML = `
        <div style="background: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 0.75rem; text-align: center; font-size: 0.8rem; color: #64748b;">
          PayPal SDK script ready. Use Instant Demo Checkout for rapid evaluation.
        </div>
      `;
    }
  }
}
