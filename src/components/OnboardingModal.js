/**
 * OnboardingModal.js — Local Guide Connect (v3) Sign In & Onboarding Experience
 * Features:
 * - Professional Google Auth demo with 1-click Persona selector (Aiko, Daniel, Marco, or Custom)
 * - Role selection: Traveler vs. Local Guide
 * - Language configuration (primary + secondary)
 * - 60-Second Travel DNA (Interests, Pace, Budget, Party)
 * - Optional Emergency Contact for SOS trip sharing
 */

import { Storage } from '../utils/storage.js';

export const DEMO_PERSONAS = [
  {
    id: 'aiko',
    name: 'Aiko Tanaka',
    email: 'aiko.travel@gmail.com',
    role: 'traveler',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    primaryLang: 'Japanese',
    secondaryLangs: ['English'],
    tagline: 'First-time Rome traveler • Seeks safe & authentic spots',
    dna: {
      interests: ['Food & Wine', 'History & Architecture', 'Art & Culture'],
      pace: 'Balanced',
      budget: 'Moderate (€€)',
      party: 'Solo',
      emergencyContact: { name: 'Kenji Tanaka', phone: '+81 90 1234 5678' }
    }
  },
  {
    id: 'daniel',
    name: 'Daniel Hayes',
    email: 'daniel.explorer@gmail.com',
    role: 'traveler',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    primaryLang: 'English',
    secondaryLangs: ['Spanish'],
    tagline: 'Independent explorer • Hates tourist traps & loves hidden gems',
    dna: {
      interests: ['Food & Wine', 'Nightlife & Hidden Bars', 'Vintage Markets'],
      pace: 'Action-Packed',
      budget: 'Budget (€)',
      party: 'Friends',
      emergencyContact: { name: 'Sarah Hayes', phone: '+1 415 555 2671' }
    }
  },
  {
    id: 'marco',
    name: 'Marco Rossi',
    email: 'marco.rome.guide@gmail.com',
    role: 'guide',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    primaryLang: 'Italian',
    secondaryLangs: ['English', 'Spanish'],
    tagline: 'Verified Rome Local Guide • 8 years resident in Trastevere',
    dna: {
      interests: ['History & Architecture', 'Food & Wine'],
      pace: 'Balanced',
      budget: 'Moderate (€€)',
      party: 'Solo',
      emergencyContact: { name: 'Elena Rossi', phone: '+39 06 6987 1234' }
    }
  }
];

export function renderOnboardingModal(container, { onComplete, onClose } = {}) {
  let currentStep = 1; // Step 1: Sign in / persona, Step 2: Role & Languages, Step 3: Travel DNA
  let selectedUser = Storage.get('travgod_user', DEMO_PERSONAS[0]);
  let selectedDNA = Storage.get('travgod_travel_dna', DEMO_PERSONAS[0].dna);

  function renderStep() {
    container.innerHTML = `
      <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1.25rem; font-family: 'Plus Jakarta Sans', sans-serif;" id="onboard-backdrop">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; padding: 2.25rem; color: #0f172a; position: relative; box-shadow: 0 25px 60px -15px rgba(0,0,0,0.25);">
          
          <!-- Close button -->
          <button id="btn-close-onboard" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #f1f5f9; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: background 0.2s;">
            <svg width="18" height="18" data-lucide="x"></svg>
          </button>

          <!-- Stepper header -->
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <span style="background: ${currentStep >= 1 ? '#0ea5e9' : '#e2e8f0'}; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800;">1</span>
            <div style="flex: 1; height: 3px; background: ${currentStep >= 2 ? '#0ea5e9' : '#e2e8f0'}; border-radius: 2px;"></div>
            <span style="background: ${currentStep >= 2 ? '#0ea5e9' : '#e2e8f0'}; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800;">2</span>
            <div style="flex: 1; height: 3px; background: ${currentStep >= 3 ? '#0ea5e9' : '#e2e8f0'}; border-radius: 2px;"></div>
            <span style="background: ${currentStep >= 3 ? '#0ea5e9' : '#e2e8f0'}; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800;">3</span>
          </div>

          ${currentStep === 1 ? renderStep1() : currentStep === 2 ? renderStep2() : renderStep3()}

        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    attachListeners();
  }

  // ── Step 1: Sign In & Persona Selector ──
  function renderStep1() {
    return `
      <div>
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="width: 48px; height: 48px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; color: #16a34a; margin-bottom: 0.75rem;">
            <svg width="24" height="24" data-lucide="shield-check"></svg>
          </div>
          <h2 style="font-size: 1.6rem; font-weight: 900; margin: 0 0 0.5rem 0; letter-spacing: -0.5px;">Welcome to Local Guide Connect</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Sign in to access verified guides, live scam alerts, and personalized Rome recommendations.</p>
        </div>

        <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0ea5e9; margin-bottom: 0.75rem;">
          1-Click Google Demo Sign-In:
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
          ${DEMO_PERSONAS.map(p => `
            <div class="persona-card" data-id="${p.id}" style="border: 2px solid ${selectedUser.id === p.id ? '#0ea5e9' : '#e2e8f0'}; background: ${selectedUser.id === p.id ? '#f0f9ff' : '#ffffff'}; padding: 0.85rem 1rem; border-radius: 16px; cursor: pointer; display: flex; align-items: center; gap: 0.85rem; transition: all 0.2s;">
              <img src="${p.avatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid ${p.role === 'guide' ? '#10b981' : '#0ea5e9'};" />
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <strong style="font-size: 0.95rem; color: #0f172a;">${p.name}</strong>
                  <span style="font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: ${p.role === 'guide' ? '#dcfce7; color: #16a34a' : '#e0f2fe; color: #0284c7'};">
                    ${p.role === 'guide' ? 'Local Guide' : 'Traveler'}
                  </span>
                </div>
                <div style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">${p.tagline}</div>
              </div>
              <svg width="18" height="18" data-lucide="chevron-right" style="color: #94a3b8;"></svg>
            </div>
          `).join('')}
        </div>

        <div style="position: relative; text-align: center; margin: 1.5rem 0;">
          <div style="position: absolute; inset: 0; display: flex; align-items: center;"><div style="width: 100%; border-top: 1px solid #e2e8f0;"></div></div>
          <span style="position: relative; background: #ffffff; padding: 0 10px; font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;">or custom account</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <input type="text" id="custom-name" placeholder="Your Name (e.g. Alex Smith)" value="${selectedUser.id ? '' : selectedUser.name}" style="padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem;" />
          <input type="email" id="custom-email" placeholder="Your Email (e.g. alex@gmail.com)" value="${selectedUser.id ? '' : selectedUser.email}" style="padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem;" />
        </div>

        <button id="btn-next-step1" style="margin-top: 1.5rem; width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(14,165,233,0.3);">
          Continue to Preferences <svg width="18" height="18" data-lucide="arrow-right"></svg>
        </button>
      </div>
    `;
  }

  // ── Step 2: Role & Languages ──
  function renderStep2() {
    return `
      <div>
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.4rem 0;">Select Your Role & Languages</h2>
          <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Tell us how you want to use the platform in Rome.</p>
        </div>

        <!-- Role Toggle -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 1.5rem;">
          <div class="role-btn ${selectedUser.role === 'traveler' ? 'active' : ''}" data-role="traveler" style="border: 2px solid ${selectedUser.role === 'traveler' ? '#0ea5e9' : '#e2e8f0'}; background: ${selectedUser.role === 'traveler' ? '#f0f9ff' : '#ffffff'}; padding: 1.25rem 1rem; border-radius: 16px; text-align: center; cursor: pointer;">
            <div style="font-size: 1.8rem; margin-bottom: 0.4rem;">🧳</div>
            <strong style="display: block; font-size: 1rem; color: #0f172a;">I am a Traveler</strong>
            <span style="font-size: 0.78rem; color: #64748b;">Discover Rome, avoid scams & book verified locals</span>
          </div>

          <div class="role-btn ${selectedUser.role === 'guide' ? 'active' : ''}" data-role="guide" style="border: 2px solid ${selectedUser.role === 'guide' ? '#10b981' : '#e2e8f0'}; background: ${selectedUser.role === 'guide' ? '#f0fdf4' : '#ffffff'}; padding: 1.25rem 1rem; border-radius: 16px; text-align: center; cursor: pointer;">
            <div style="font-size: 1.8rem; margin-bottom: 0.4rem;">🏛️</div>
            <strong style="display: block; font-size: 1rem; color: #0f172a;">I am a Local Guide</strong>
            <span style="font-size: 0.78rem; color: #64748b;">Guide travelers, share hidden spots & earn securely</span>
          </div>
        </div>

        <!-- Language setup -->
        <div style="margin-bottom: 1.25rem;">
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #334155; margin-bottom: 0.4rem;">Primary Spoken Language</label>
          <select id="primary-lang" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem; background: white;">
            ${['English', 'Italian', 'Spanish', 'Japanese', 'French', 'German', 'Hindi', 'Mandarin'].map(l => `
              <option value="${l}" ${selectedUser.primaryLang === l ? 'selected' : ''}>${l}</option>
            `).join('')}
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #334155; margin-bottom: 0.4rem;">Secondary Languages (optional)</label>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;" id="secondary-langs-wrap">
            ${['English', 'Italian', 'Spanish', 'French', 'German'].map(l => {
              const has = (selectedUser.secondaryLangs || []).includes(l);
              return `
                <button type="button" class="lang-chip ${has ? 'active' : ''}" data-lang="${l}" style="padding: 6px 12px; border-radius: 999px; border: 1px solid ${has ? '#0ea5e9' : '#cbd5e1'}; background: ${has ? '#e0f2fe' : '#ffffff'}; color: ${has ? '#0284c7' : '#475569'}; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
                  ${l} ${has ? '✓' : '+'}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 2rem;">
          <button id="btn-back-step2" style="padding: 0.9rem 1.5rem; background: #f1f5f9; color: #475569; border: none; border-radius: 14px; font-weight: 700; cursor: pointer;">
            Back
          </button>
          <button id="btn-next-step2" style="flex: 1; padding: 0.9rem; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            Continue to Travel DNA <svg width="18" height="18" data-lucide="arrow-right"></svg>
          </button>
        </div>
      </div>
    `;
  }

  // ── Step 3: 60-Second Travel DNA & Emergency Contact ──
  function renderStep3() {
    const allInterests = [
      'Food & Wine', 'History & Architecture', 'Art & Culture',
      'Nightlife & Hidden Bars', 'Nature & Parks', 'Vintage Markets'
    ];
    const curInterests = selectedDNA.interests || [];

    return `
      <div>
        <div style="text-align: center; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.35rem 0;">Your 60-Second Travel DNA</h2>
          <p style="color: #64748b; font-size: 0.85rem; margin: 0;">We tailor Rome map recommendations and local guide matches to your exact taste.</p>
        </div>

        <!-- Interests -->
        <div style="margin-bottom: 1.2rem;">
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #334155; margin-bottom: 0.4rem;">What excites you most in Rome?</label>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${allInterests.map(interest => {
              const active = curInterests.includes(interest);
              return `
                <button type="button" class="interest-chip ${active ? 'active' : ''}" data-interest="${interest}" style="padding: 6px 14px; border-radius: 999px; border: 1px solid ${active ? '#0ea5e9' : '#cbd5e1'}; background: ${active ? '#e0f2fe' : '#ffffff'}; color: ${active ? '#0284c7' : '#475569'}; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s;">
                  ${interest} ${active ? '✓' : '+'}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Travel Pace & Budget -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #334155; margin-bottom: 0.4rem;">Travel Pace</label>
            <select id="dna-pace" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.85rem; background: white;">
              <option value="Slow & Relaxed" ${selectedDNA.pace === 'Slow & Relaxed' ? 'selected' : ''}>🐢 Slow & Relaxed</option>
              <option value="Balanced" ${selectedDNA.pace === 'Balanced' ? 'selected' : ''}>⚖️ Balanced</option>
              <option value="Action-Packed" ${selectedDNA.pace === 'Action-Packed' ? 'selected' : ''}>⚡ Action-Packed</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #334155; margin-bottom: 0.4rem;">Target Budget</label>
            <select id="dna-budget" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.85rem; background: white;">
              <option value="Budget (€)" ${selectedDNA.budget === 'Budget (€)' ? 'selected' : ''}>Budget (€)</option>
              <option value="Moderate (€€)" ${selectedDNA.budget === 'Moderate (€€)' ? 'selected' : ''}>Moderate (€€)</option>
              <option value="Luxury (€€€)" ${selectedDNA.budget === 'Luxury (€€€)' ? 'selected' : ''}>Luxury (€€€)</option>
            </select>
          </div>
        </div>

        <!-- Emergency Contact (Optional) -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-size: 0.82rem; font-weight: 800; color: #0ea5e9; display: flex; align-items: center; gap: 0.35rem;">
              <svg width="14" height="14" data-lucide="heart-pulse"></svg> Emergency Contact (for SOS Share)
            </span>
            <span style="font-size: 0.7rem; font-weight: 700; color: #64748b; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">Private</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <input type="text" id="contact-name" placeholder="Contact Name" value="${selectedDNA.emergencyContact?.name || ''}" style="padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem;" />
            <input type="tel" id="contact-phone" placeholder="Phone with country code" value="${selectedDNA.emergencyContact?.phone || ''}" style="padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem;" />
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button id="btn-back-step3" style="padding: 0.9rem 1.5rem; background: #f1f5f9; color: #475569; border: none; border-radius: 14px; font-weight: 700; cursor: pointer;">
            Back
          </button>
          <button id="btn-finish-onboard" style="flex: 1; padding: 0.9rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 14px rgba(16,185,129,0.3);">
            <svg width="18" height="18" data-lucide="check-circle"></svg> Save & Start Exploring Rome
          </button>
        </div>
      </div>
    `;
  }

  // ── Event Handlers ──
  function attachListeners() {
    const backdrop = container.querySelector('#onboard-backdrop');
    const closeBtn = container.querySelector('#btn-close-onboard');

    const close = () => {
      container.innerHTML = '';
      if (onClose) onClose();
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) close();
      });
    }

    // Step 1: Persona selection
    container.querySelectorAll('.persona-card').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.dataset.id;
        const found = DEMO_PERSONAS.find(p => p.id === pId);
        if (found) {
          selectedUser = { ...found };
          selectedDNA = { ...found.dna };
          renderStep();
        }
      });
    });

    const next1 = container.querySelector('#btn-next-step1');
    if (next1) {
      next1.addEventListener('click', () => {
        const customName = container.querySelector('#custom-name')?.value;
        const customEmail = container.querySelector('#custom-email')?.value;
        if (customName && customEmail) {
          selectedUser = {
            id: 'custom-' + Date.now(),
            name: customName,
            email: customEmail,
            role: 'traveler',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            primaryLang: 'English',
            secondaryLangs: []
          };
        }
        currentStep = 2;
        renderStep();
      });
    }

    // Step 2: Role and Languages
    container.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedUser.role = btn.dataset.role;
        renderStep();
      });
    });

    container.querySelectorAll('.lang-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        selectedUser.secondaryLangs = selectedUser.secondaryLangs || [];
        if (selectedUser.secondaryLangs.includes(lang)) {
          selectedUser.secondaryLangs = selectedUser.secondaryLangs.filter(l => l !== lang);
        } else {
          selectedUser.secondaryLangs.push(lang);
        }
        renderStep();
      });
    });

    const back2 = container.querySelector('#btn-back-step2');
    if (back2) back2.addEventListener('click', () => { currentStep = 1; renderStep(); });

    const next2 = container.querySelector('#btn-next-step2');
    if (next2) {
      next2.addEventListener('click', () => {
        selectedUser.primaryLang = container.querySelector('#primary-lang')?.value || 'English';
        currentStep = 3;
        renderStep();
      });
    }

    // Step 3: Travel DNA
    container.querySelectorAll('.interest-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const interest = btn.dataset.interest;
        selectedDNA.interests = selectedDNA.interests || [];
        if (selectedDNA.interests.includes(interest)) {
          selectedDNA.interests = selectedDNA.interests.filter(i => i !== interest);
        } else {
          selectedDNA.interests.push(interest);
        }
        renderStep();
      });
    });

    const back3 = container.querySelector('#btn-back-step3');
    if (back3) back3.addEventListener('click', () => { currentStep = 2; renderStep(); });

    const finishBtn = container.querySelector('#btn-finish-onboard');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        selectedDNA.pace = container.querySelector('#dna-pace')?.value || 'Balanced';
        selectedDNA.budget = container.querySelector('#dna-budget')?.value || 'Moderate (€€)';
        selectedDNA.emergencyContact = {
          name: container.querySelector('#contact-name')?.value || '',
          phone: container.querySelector('#contact-phone')?.value || ''
        };

        // Persist
        Storage.set('travgod_user', selectedUser);
        Storage.set('travgod_travel_dna', selectedDNA);

        // Update header & route
        close();
        if (onComplete) onComplete(selectedUser, selectedDNA);

        if (selectedUser.role === 'guide') {
          window.location.hash = '/host';
        } else {
          window.location.hash = '/d/rome';
        }
      });
    }
  }

  renderStep();
}
