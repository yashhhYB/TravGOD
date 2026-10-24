/**
 * BecomeLocalView.js — Become a Local Landing, 5-Step Application Wizard & Host Dashboard
 * Local Guide Connect (v3)
 */

import { Storage } from '../utils/storage.js';
import { getAppHeaderHtml, initAppHeader } from './AppHeader.js';
import { getUserRole, getLocalStatus, ROLES, LOCAL_STATUS } from '../utils/roles.js';

export function renderBecomeLocalView(container, { initialMode = 'landing' } = {}) {
  let mode = initialMode;
  let currentStep = 1;

  let applicationData = {
    bio: '',
    story: '',
    neighborhood: 'Trastevere',
    languages: ['Italian (Native)', 'English (Fluent)'],
    experienceTitle: 'Historic Trastevere Alleys & Secret Bakeries',
    duration: '3 hours',
    ratePerHour: 32,
    meetingHub: 'Piazza Santa Maria in Trastevere Fountain',
    idUploaded: false,
    quizPassed: false
  };

  const user = Storage.get('travgod_user', null);

  // ── Role/status-based redirects ──────────────────────────────────────────
  if (user && user.role === 'guide') {
    const localStatus = getLocalStatus();
    // Verified → go to host dashboard
    if (localStatus === LOCAL_STATUS.VERIFIED) {
      window.location.hash = '/host';
      return;
    }
    // Submitted or in_review → cannot edit, send to dashboard (shows locked banner)
    if (localStatus === LOCAL_STATUS.SUBMITTED || localStatus === LOCAL_STATUS.IN_REVIEW) {
      window.location.hash = '/host';
      return;
    }
    // Paused → already verified, go to host
    if (localStatus === LOCAL_STATUS.PAUSED) {
      window.location.hash = '/host';
      return;
    }
    // Suspended → go to host (limited view)
    if (localStatus === LOCAL_STATUS.SUSPENDED) {
      window.location.hash = '/host';
      return;
    }
    // Draft, needs_info, rejected → can access the application wizard
    mode = 'apply';
  }

  function render() {
    container.innerHTML = `
      <div id="become-local-page" style="min-height: 100vh; background: var(--bg-gray, #f8fafc); color: var(--text-primary, #0f172a); font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- Standard Fixed Header -->
        ${getAppHeaderHtml({ activeNav: '', isSolid: true })}

        <!-- Main Body (with 72px top offset) -->
        <main style="max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; padding-top: calc(72px + 2rem);">
          ${mode === 'landing' ? renderLanding() : mode === 'apply' ? renderWizard() : renderDashboard()}
        </main>

      </div>
    `;

    initAppHeader(container);

    attachHandlers();
  }

  // ── 1. Landing Mode ──
  function renderLanding() {
    return `
      <div>
        <div style="text-align: center; max-width: 760px; margin: 2rem auto 3.5rem;">
          <span style="font-size: 0.82rem; font-weight: 800; color: #0ea5e9; background: #e0f2fe; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">
            Earn From Your Knowledge
          </span>
          <h1 style="font-size: 3rem; font-weight: 900; letter-spacing: -1px; margin: 1rem 0 0.75rem 0;">
            Share Your City. Protect Travelers. Earn on Your Terms.
          </h1>
          <p style="font-size: 1.15rem; color: #475569; line-height: 1.6; margin-bottom: 2rem;">
            Join Rome’s network of verified locals. Show travelers the real Italy, protect them from tourist traps, and receive guaranteed payouts through PayPal.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem;">
            <button id="btn-start-apply" style="padding: 1rem 2.5rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; border-radius: 14px; font-weight: 800; font-size: 1.05rem; cursor: pointer; box-shadow: 0 4px 14px rgba(14,165,233,0.35);">
              Apply to Become a Guide ➔
            </button>
            <button id="btn-demo-host-dash" style="padding: 1rem 2rem; background: white; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 14px; font-weight: 800; font-size: 1.05rem; cursor: pointer;">
              Preview Host Dashboard
            </button>
          </div>
        </div>

        <!-- 3 Pillars for Hosts -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3.5rem;">
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 2rem;">
            <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">💰</div>
            <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0 0 0.5rem 0;">Protected PayPal Payouts</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0;">
              Travelers pay upfront. Funds are held safely in escrow and automatically released to your PayPal account after the experience.
            </p>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 2rem;">
            <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">🛡️</div>
            <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0 0 0.5rem 0;">Legitimate Verification</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0;">
              Clear badge levels (ID Reviewed, Identity Matched, Licensed National Guide). Travelers know you are genuine.
            </p>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 2rem;">
            <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">📍</div>
            <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0 0 0.5rem 0;">Privacy & Safety First</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0;">
              Your home address is never public. All tours meet at public landmarks like Piazza Santa Maria in Trastevere.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // ── 2. 5-Step Application Wizard ──
  function renderWizard() {
    return `
      <div style="max-width: 680px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; border-radius: 24px; padding: 2.5rem; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
        
        <!-- Step progress bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
          <span style="font-size: 0.85rem; font-weight: 800; color: #0ea5e9;">Step ${currentStep} of 5</span>
          <span style="font-size: 0.8rem; font-weight: 700; color: #64748b;">
            ${currentStep === 1 ? 'Bio & Story' : currentStep === 2 ? 'Languages' : currentStep === 3 ? 'Experience' : currentStep === 4 ? 'ID Verification' : 'Safety Quiz'}
          </span>
        </div>

        ${currentStep === 1 ? `
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.5rem 0;">Your Profile & Story</h2>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem;">Tell travelers why you love Rome and which neighborhood you know best.</p>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 800; margin-bottom: 0.35rem;">Primary Rome Neighborhood</label>
                <input type="text" id="wiz-neighborhood" value="${applicationData.neighborhood}" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 800; margin-bottom: 0.35rem;">Your Local Story (Why you guide)</label>
                <textarea id="wiz-story" rows="4" placeholder="e.g. Born in Trastevere, I have spent 15 years discovering secret bakeries and hidden Roman viewpoints..." style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem;">${applicationData.story}</textarea>
              </div>
            </div>
          </div>
        ` : currentStep === 2 ? `
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.5rem 0;">Languages Spoken</h2>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem;">Travelers look for guides who speak their language clearly.</p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <label style="font-size: 0.85rem; font-weight: 700;">Active Languages:</label>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <span style="background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 999px; font-weight: 700; font-size: 0.85rem;">🇮🇹 Italian (Native)</span>
                <span style="background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 999px; font-weight: 700; font-size: 0.85rem;">🇬🇧 English (Fluent)</span>
                <span style="background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 999px; font-weight: 700; font-size: 0.85rem;">+ Add Spanish</span>
              </div>
            </div>
          </div>
        ` : currentStep === 3 ? `
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.5rem 0;">Experience Details & Pricing</h2>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem;">What will you show travelers, and how much will you charge?</p>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 800; margin-bottom: 0.35rem;">Experience Title</label>
                <input type="text" id="wiz-title" value="${applicationData.experienceTitle}" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem;" />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.82rem; font-weight: 800; margin-bottom: 0.35rem;">Hourly Rate (EUR)</label>
                  <input type="number" id="wiz-rate" value="${applicationData.ratePerHour}" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.82rem; font-weight: 800; margin-bottom: 0.35rem;">Public Meeting Hub</label>
                  <input type="text" id="wiz-hub" value="${applicationData.meetingHub}" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem;" />
                </div>
              </div>
            </div>
          </div>
        ` : currentStep === 4 ? `
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.5rem 0;">ID Verification Upload</h2>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem;">Upload an Italian Carta d'Identità or Passport to earn the "Verified Local" badge.</p>
            
            <div style="border: 2px dashed #cbd5e1; border-radius: 16px; padding: 2rem; text-align: center; background: #f8fafc; margin-bottom: 1rem;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🪪</div>
              <strong style="font-size: 0.95rem; color: #0f172a;">Simulate Government ID Upload</strong>
              <p style="font-size: 0.8rem; color: #64748b; margin: 4px 0 1rem 0;">JPG, PNG, or PDF up to 10MB. Files stored in private encrypted storage.</p>
              <button id="btn-sim-upload" style="padding: 8px 18px; background: ${applicationData.idUploaded ? '#10b981' : '#0ea5e9'}; color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 0.85rem; cursor: pointer;">
                ${applicationData.idUploaded ? '✓ ID Verified for Demo' : 'Upload Test ID Document'}
              </button>
            </div>
          </div>
        ` : `
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.5rem 0;">Mandatory Safety Training Quiz</h2>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem;">Pass all 5 questions to ensure traveler trust and safety compliance in Rome.</p>

            <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.85rem;">
              <div style="background: #f8fafc; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0;">
                <strong>1. Where must tour meeting points always be set?</strong>
                <div style="color: #16a34a; font-weight: 700; margin-top: 4px;">✓ Public, well-lit landmarks (e.g. Piazza Santa Maria in Trastevere)</div>
              </div>
              <div style="background: #f8fafc; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0;">
                <strong>2. Can you accept cash payment directly from travelers off-platform?</strong>
                <div style="color: #16a34a; font-weight: 700; margin-top: 4px;">✓ Never; all payments must be processed via protected PayPal checkout</div>
              </div>
              <div style="background: #f8fafc; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0;">
                <strong>3. What should you do if a traveler feels unsafe or needs medical help?</strong>
                <div style="color: #16a34a; font-weight: 700; margin-top: 4px;">✓ Immediately assist to the nearest Pronto Soccorso or dial 112</div>
              </div>
              <div style="background: #f8fafc; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0;">
                <strong>4. Can unlicensed locals lead commercial tours inside paid monuments like Colosseum?</strong>
                <div style="color: #16a34a; font-weight: 700; margin-top: 4px;">✓ No; only certified national licensed guides can enter monuments for commercial tours</div>
              </div>
              <div style="background: #f8fafc; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0;">
                <strong>5. Can you share your home address with travelers?</strong>
                <div style="color: #16a34a; font-weight: 700; margin-top: 4px;">✓ Never; for privacy, use only approximate neighborhood meeting points</div>
              </div>
            </div>
          </div>
        `}

        <!-- Wizard Nav buttons -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; border-top: 1px solid #f1f5f9; padding-top: 1.5rem;">
          ${currentStep > 1 ? `
            <button id="btn-wiz-prev" style="padding: 0.75rem 1.5rem; background: #f1f5f9; color: #475569; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">
              Previous
            </button>
          ` : `<div></div>`}

          ${currentStep < 5 ? `
            <button id="btn-wiz-next" style="padding: 0.75rem 1.75rem; background: #0ea5e9; color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer;">
              Next Step ➔
            </button>
          ` : `
            <button id="btn-wiz-submit" style="padding: 0.75rem 2rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer;">
              Pass Quiz & Go Live 🎉
            </button>
          `}
        </div>

      </div>
    `;
  }

  // ── 3. Host Dashboard Mode ──
  function renderDashboard() {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
              <span style="background: #dcfce7; color: #16a34a; padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 800;">
                ● Active Rome Local Guide
              </span>
              <span style="font-size: 0.75rem; color: #64748b; font-weight: 700;">Level 2: Identity Matched</span>
            </div>
            <h1 style="font-size: 2.4rem; font-weight: 900; margin: 0; color: #0f172a;">Host Command Center</h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 4px 0 0 0;">Manage your upcoming bookings, payouts, and neighborhood spots.</p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button id="btn-switch-traveler" style="padding: 8px 16px; background: white; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer;">
              Switch to Traveler Mode
            </button>
          </div>
        </div>

        <!-- Metrics Row -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.25rem;">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Held in Escrow</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #0ea5e9; margin: 4px 0;">€320.00</div>
            <span style="font-size: 0.72rem; color: #10b981; font-weight: 700;">Releasing after tour check-in</span>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.25rem;">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Payouts Released</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #10b981; margin: 4px 0;">€1,450.00</div>
            <span style="font-size: 0.72rem; color: #64748b; font-weight: 600;">Direct to PayPal Sandbox</span>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.25rem;">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Response Rate</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 4px 0;">98%</div>
            <span style="font-size: 0.72rem; color: #64748b; font-weight: 600;">Avg response: 12 minutes</span>
          </div>
        </div>

        <!-- Upcoming bookings list -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 1.75rem; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800;">Upcoming Bookings</h3>
            <span style="font-size: 0.8rem; font-weight: 700; color: #0ea5e9;">2 Scheduled</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <strong style="font-size: 0.95rem; color: #0f172a;">Aiko Tanaka</strong>
                  <div style="font-size: 0.8rem; color: #64748b;">Trastevere Hidden Bakeries Walk • Tomorrow at 10:00 AM</div>
                </div>
              </div>
              <div style="text-align: right;">
                <span style="background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 800;">€96.00 Paid (Held)</span>
              </div>
            </div>

            <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <strong style="font-size: 0.95rem; color: #0f172a;">Daniel Hayes</strong>
                  <div style="font-size: 0.8rem; color: #64748b;">Aventine Hill & Testaccio Market Crawl • Friday at 02:00 PM</div>
                </div>
              </div>
              <div style="text-align: right;">
                <span style="background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 800;">€130.00 Paid (Held)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // ── Event Handlers ──
  function attachHandlers() {
    const startApply = container.querySelector('#btn-start-apply');
    if (startApply) {
      startApply.addEventListener('click', () => {
        mode = 'apply';
        currentStep = 1;
        render();
      });
    }

    const demoDash = container.querySelector('#btn-demo-host-dash');
    if (demoDash) {
      demoDash.addEventListener('click', () => {
        mode = 'dashboard';
        render();
      });
    }

    const nextBtn = container.querySelector('#btn-wiz-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentStep++;
        render();
      });
    }

    const prevBtn = container.querySelector('#btn-wiz-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentStep--;
        render();
      });
    }

    const simUpload = container.querySelector('#btn-sim-upload');
    if (simUpload) {
      simUpload.addEventListener('click', () => {
        applicationData.idUploaded = true;
        render();
      });
    }

    const submitBtn = container.querySelector('#btn-wiz-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        applicationData.quizPassed = true;
        const curUser = Storage.get('travgod_user', {
          name: 'Marco Rossi',
          email: 'marco.rome.guide@gmail.com'
        });
        curUser.role = 'guide';
        Storage.set('travgod_user', curUser);
        mode = 'dashboard';
        render();
      });
    }

    const switchTraveler = container.querySelector('#btn-switch-traveler');
    if (switchTraveler) {
      switchTraveler.addEventListener('click', () => {
        const curUser = Storage.get('travgod_user', {});
        curUser.role = 'traveler';
        Storage.set('travgod_user', curUser);
        window.location.hash = '/d/rome';
      });
    }
  }

  render();
}
