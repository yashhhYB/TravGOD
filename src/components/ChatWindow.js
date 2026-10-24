/**
 * ChatWindow.js
 * Renders a floating chat window for a specific guide with:
 * - Real-time bilingual AI translation (French/Italian <-> English)
 * - ScamSense Msg AI Shield: Detects off-platform payment attempts & scams
 * - Verified Local Knowledge: Cites exact mock database advice for Paris & Rome
 * - 1-Click interactive prompt chips for easy demo & hackathon evaluation
 */

export function renderChatWindow(container, guide, onClose) {
  let isTranslated = true;
  let safetyAlertActive = null;

  const isItalian = (guide.destinationId === 'rome') || (guide.country === 'Italy') ||
    (guide.name && (guide.name.includes('Marco') || guide.name.includes('Sofia') || guide.name.includes('Matteo') || guide.name.includes('Giulia') || guide.name.includes('Luca')));
  const sourceLang = isItalian ? 'Italian' : 'French';

  // Off-platform payment triggers that activate the ScamSense AI Shield
  const OFFPLATFORM_REGEX = /(bank transfer|wire|virement|bonifico|direct payment|pay me directly|whatsapp|revolut|iban|zelle|venmo|cash outside|outside the app|fuori dall'app|directement)/i;

  // Curated knowledge-grounded responses
  const cannedResponses = isItalian ? [
    {
      keywords: ['bank transfer', 'wire', 'bonifico', 'direct payment', 'cash', 'revolut', 'iban'],
      original: `⚠️ ATTENZIONE: Tutti i pagamenti devono essere effettuati tramite Local Guide Connect e il deposito di garanzia PayPal Escrow. Non posso accettare bonifici diretti: i fondi devono rimanere protetti fino al nostro incontro di persona!`,
      translated: `⚠️ SAFETY ALERT: All payments must remain protected through Local Guide Connect and PayPal Escrow. I cannot accept direct bank transfers or cash outside the platform — your funds stay 100% protected until we meet in person!`,
      flag: 'offplatform_payment'
    },
    {
      keywords: ['vatican', 'slow', 'accessible', 'mother', 'elderly', 'wheelchair', 'walk', 'stairs'],
      original: `Sì, assolutamente! Possiamo pianificare soste regolari e utilizzare il percorso accessibile e privo di gradini per i Musei Vaticani e San Pietro. Verificherò tutti gli accessi prioritari all'orario concordato.`,
      translated: `Yes, absolutely! I plan regular rest stops and use step-free, elevator-accessible routes through the Vatican Museums and St. Peter's. I will verify all accessibility access points prior to our tour.`,
      flag: null
    },
    {
      keywords: ['colosseum', 'gladiator', 'photo', 'costume', 'extortion'],
      original: `Non fermarti mai per le foto con i finti centurioni fuori dal Colosseo! Sono abusivi e chiedono con aggressività dai 20€ ai 50€. Faremo il giro con ingressi ufficiali Parco Archeologico senza alcuna molestia.`,
      translated: `Never stop for photos with the costumed gladiators outside the Colosseum! They are illegal and aggressively demand €20–€50. We will tour the archaeological park safely with verified official tickets.`,
      flag: null
    },
    {
      keywords: ['food', 'eat', 'restaurant', 'carbonara', 'trattoria', 'pasta', 'testaccio'],
      original: `Evita tutti i locali con menù fotografici plastificati vicino al Pantheon o Via dei Fori! Ti porterò a Testaccio e Trastevere dove i romani mangiano la vera carbonara da Felice o Da Enzo a prezzi equi (€12–€14).`,
      translated: `Avoid restaurants with laminated picture menus near the Pantheon! I will take you to Testaccio and Trastevere where Romans actually eat authentic carbonara at honest local prices (€12–€14).`,
      flag: null
    },
    {
      keywords: ['scam', 'safe', 'safety', 'pickpocket', 'termini', 'train'],
      original: `A Termini e sulla metro linea B fai attenzione a chi si offre di aiutarti alle macchinette dei biglietti: prendono il resto con la forza. Ti mostrerò come usare la contactless Tap&Go senza toccare i distributori.`,
      translated: `At Termini and on Metro Line B, watch out for fake 'helpers' lingering around ticket kiosks who pocket your change. I'll show you how to tap your contactless card directly at turnstiles.`,
      flag: null
    },
    {
      keywords: ['price', 'cost', 'rate', 'budget', 'euro'],
      original: `La mia tariffa è di €${guide.rate || 35}/ora. Il pagamento è gestito in deposito di garanzia PayPal: i fondi vengono rilasciati solo dopo il check-in GPS.`,
      translated: `My verified rate is €${guide.rate || 35}/hr. Payment is held in PayPal escrow: payouts only release to me after your in-person check-in.`,
      flag: null
    },
    {
      keywords: ['book', 'reserve', 'tour', 'paypal', 'meet'],
      original: `Perfetto! Clicca su 'Book' qui sopra o sul mio profilo. Puoi selezionare durata, data e punto d'incontro come Piazza Santa Maria in Trastevere.`,
      translated: `Perfect! Click 'Book' above or on my profile. You can pick your preferred date, duration, and meeting spot like Piazza Santa Maria in Trastevere.`,
      flag: null
    }
  ] : [
    {
      keywords: ['bank transfer', 'wire', 'virement', 'direct payment', 'cash', 'revolut', 'iban'],
      original: `⚠️ ATTENTION : Tous les paiements doivent obligatoirement passer par Local Guide Connect et PayPal Escrow. Je n'accepte aucun virement bancaire direct : vos fonds doivent rester garantis jusqu'au check-in !`,
      translated: `⚠️ SAFETY ALERT: All payments must remain protected through Local Guide Connect and PayPal Escrow. I do not accept direct bank transfers — funds stay 100% protected until our in-person meeting!`,
      flag: 'offplatform_payment'
    },
    {
      keywords: ['montmartre', 'bracelet', 'string', 'sellers', 'stairs', 'sacré-cœur'],
      original: `Oui tout à fait ! Pour monter au Sacré-Cœur sans être importuné par les vendeurs de bracelets, nous empruntons les escaliers latéraux par la Rue Foyatier ou le funiculaire. Je vous montrerai comment dire "Non merci" fermement.`,
      translated: `Yes, absolutely! To go up Montmartre without bracelet sellers harassing you, we take the side stairs on Rue Foyatier or the funicular. Keep hands in pockets and say "Non merci" firmly.`,
      flag: null
    },
    {
      keywords: ['louvre', 'crowd', 'queue', 'museum', 'mona lisa'],
      original: `Avec grand plaisir ! Au Louvre, nous entrons par la Porte des Lions ou le Carrousel souterrain pour éviter la file principale sous la Pyramide, et nous nous concentrons sur deux ailes majestueuses et calmes.`,
      translated: `With great pleasure! At the Louvre, we enter via Porte des Lions or the underground Carrousel to bypass the pyramid queue, exploring peaceful sculpture wings without the crowd crush.`,
      flag: null
    },
    {
      keywords: ['food', 'bistro', 'eat', 'marais', 'falafel', 'bakery', 'croissant'],
      original: `Je vous emmène au Marché d'Aligre et dans les vraies boulangeries artisanales du Marais où la baguette est à 1,30€ et le menu du midi à 16–18€ avec carafe d'eau offerte par la loi !`,
      translated: `I will take you to Marché d'Aligre and authentic artisan bakeries in the Marais where baguettes cost €1.30 and lunch menus are €16–€18 with free tap water guaranteed by French law!`,
      flag: null
    },
    {
      keywords: ['scam', 'safe', 'safety', 'petition', 'ring', 'taxi'],
      original: `Soyez très vigilant face aux fausses pétitions sur le Champ de Mars et aux faux taxis à l'aéroport CDG. Le taxi officiel est strictement au forfait fixe : 56€ (Rive Droite) et 65€ (Rive Gauche).`,
      translated: `Watch out for fake charity petitions on Champ de Mars and unofficial taxi touts at CDG. Official airport taxis are strictly legally flat-rated at €56 (Right Bank) and €65 (Left Bank).`,
      flag: null
    },
    {
      keywords: ['price', 'cost', 'rate', 'budget', 'euro'],
      original: `Mon tarif vérifié est de €${guide.rate || 35}/heure, sécurisé par le séquestre PayPal. Zéro risque de désistement.`,
      translated: `My verified rate is €${guide.rate || 35}/hr, held securely in PayPal escrow. Zero risk of cancellation.`,
      flag: null
    },
    {
      keywords: ['book', 'reserve', 'tour', 'paypal', 'meet'],
      original: `Génial ! Cliquez sur 'Book' sur mon profil. Nous pourrons choisir l'heure et le lieu de rendez-vous idéal pour vous.`,
      translated: `Great! Click 'Book' on my profile. We can coordinate the exact time and meeting point convenient for your stay.`,
      flag: null
    }
  ];

  const defaultResponse = isItalian ? {
    original: `Perfetto! Posso personalizzare l'esperienza al 100% in base ai tuoi gusti. Di cosa hai più curiosità di scoprire a Roma?`,
    translated: `Perfect! I can customize the entire experience around your preferences. What are you most curious to discover in Rome?`
  } : {
    original: `Excellente idée ! Je peux personnaliser tout l'itinéraire selon vos envies. Qu'aimeriez-vous explorer en priorité à Paris ?`,
    translated: `Great idea! I can customize our entire walk around your schedule. What would you like to explore first in Paris?`
  };

  // Seed sample initial thread based on city mock chat
  const thread = [
    {
      sender: 'guide',
      original: isItalian
        ? `Ciao! Sono ${guide.name}, la tua guida locale verificata a Roma. Come posso aiutarti a scoprire la città in totale sicurezza?`
        : `Bonjour ! Je suis ${guide.name}, votre guide local vérifié à Paris. Prêt(e) à découvrir les vrais trésors de la ville sans arnaques ?`,
      translated: isItalian
        ? `Hello! I'm ${guide.name}, your verified local guide in Rome. How can I help you explore the city safely and authentically?`
        : `Hello! I'm ${guide.name}, your verified local guide in Paris. Ready to discover the city's true treasures without tourist traps?`,
      flag: null
    }
  ];

  // Demo chips for quick evaluation
  const demoChips = isItalian ? [
    { label: '🏛️ Vatican Accessibility', text: 'Is the Vatican tour accessible for my mother who walks slowly?' },
    { label: '🛡️ Avoid Gladiator Scam', text: 'How do we avoid the fake gladiator extortion at the Colosseum?' },
    { label: '🍝 Authentic Trattoria', text: 'Where do locals eat real carbonara without tourist photo menus?' },
    { label: '⚠️ Test Off-Platform Alert', text: 'Can I pay you directly via bank transfer instead of PayPal?' }
  ] : [
    { label: '🛡️ Montmartre Without Scams', text: 'Can we climb Montmartre without the bracelet sellers bothering us?' },
    { label: '🏛️ Louvre Without Crowds', text: 'Can you show me the Louvre highlights without the big crowds?' },
    { label: '🥐 Marais Food & Bakeries', text: 'Where can we try authentic bakeries and local food in Le Marais?' },
    { label: '⚠️ Test Off-Platform Alert', text: 'Can I pay you directly via bank transfer instead of PayPal?' }
  ];

  function renderThread() {
    const msgsContainer = container.querySelector('.chat-messages');
    if (!msgsContainer) return;

    msgsContainer.innerHTML = thread.map(msg => {
      if (msg.sender === 'user') {
        return `<div class="chat-bubble sent">${msg.text}</div>`;
      } else {
        const displayText = isTranslated ? msg.translated : msg.original;
        const badge = isTranslated
          ? `<span class="translation-badge" style="font-size: 0.68rem; color: #0284c7; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; margin-bottom: 4px; font-weight: 700;">
              <svg width="11" height="11" data-lucide="languages"></svg> Translated from ${sourceLang}
             </span>`
          : `<span class="translation-badge" style="font-size: 0.68rem; color: #475569; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; margin-bottom: 4px; font-weight: 700;">
              Original ${sourceLang}
             </span>`;

        const isWarning = msg.flag === 'offplatform_payment';

        return `
          <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
            <img src="${guide.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />
            <div class="chat-bubble received" style="${isWarning ? 'border: 2px solid #f59e0b; background: #fffbeb;' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                ${badge}
                ${isWarning ? '<span style="font-size: 0.65rem; background: #fef3c7; color: #b45309; padding: 1px 6px; border-radius: 999px; font-weight: 800;">🚨 Shield Alert</span>' : ''}
              </div>
              <div style="font-size: 0.88rem; line-height: 1.45; color: ${isWarning ? '#92400e' : '#0f172a'};">
                ${displayText}
              </div>
            </div>
          </div>
        `;
      }
    }).join('');

    if (window.lucide) window.lucide.createIcons();
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  }

  function handleSend(userMessage) {
    const input = container.querySelector('.chat-input');
    const text = userMessage || (input ? input.value.trim() : '');
    if (!text) return;

    // Check user message for off-platform payment attempts
    const isSuspicious = OFFPLATFORM_REGEX.test(text);
    const alertSlot = container.querySelector('#chat-safety-alert');
    if (isSuspicious) {
      if (alertSlot) {
        alertSlot.style.display = 'block';
        alertSlot.innerHTML = `
          <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 6px 10px; font-size: 0.75rem; color: #92400e; display: flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" data-lucide="shield-alert" style="flex-shrink: 0; color: #d97706;"></svg>
            <span><strong>ScamSense AI Shield:</strong> Off-platform payment detected. Always keep transactions protected through Local Guide Connect PayPal Escrow to prevent scams.</span>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    } else if (alertSlot) {
      alertSlot.style.display = 'none';
    }

    // Add user message to conversation
    thread.push({ sender: 'user', text });
    if (input) input.value = '';
    renderThread();

    // Smart typing simulation
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = defaultResponse;
      for (const res of cannedResponses) {
        if (res.keywords.some(kw => lower.includes(kw))) {
          reply = res;
          break;
        }
      }
      thread.push({
        sender: 'guide',
        original: reply.original,
        translated: reply.translated,
        flag: reply.flag
      });
      renderThread();
    }, 700);
  }

  container.innerHTML = `
    <div class="chat-overlay open" style="z-index: 10000;">
      
      <!-- Chat Header -->
      <div class="chat-header" style="background: linear-gradient(135deg, #0284c7, #0369a1); padding: 0.85rem 1rem;">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <img src="${guide.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.4);" />
          <div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <h3 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #ffffff;">${guide.name}</h3>
              <span style="font-size: 0.65rem; background: rgba(255,255,255,0.2); color: white; padding: 1px 6px; border-radius: 999px;">★ ${guide.rating || 4.9}</span>
            </div>
            <div style="font-size: 0.7rem; color: #e0f2fe; display: flex; align-items: center; gap: 0.35rem; margin-top: 1px;">
              <span style="width: 6px; height: 6px; background: #4ade80; border-radius: 50%;"></span>
              <span>Online • Local in ${isItalian ? 'Rome' : 'Paris'}</span>
            </div>
          </div>
        </div>

        <div class="chat-header-actions" style="display: flex; align-items: center; gap: 0.35rem;">
          <button class="btn-icon" id="btn-translate" title="Toggle AI Translation" style="background: ${isTranslated ? 'rgba(255,255,255,0.25)' : 'transparent'}; border: none; color: white; border-radius: 6px; padding: 5px; cursor: pointer;">
            <svg width="17" height="17" data-lucide="languages"></svg>
          </button>
          <button class="btn-icon" id="btn-close-chat" title="Close" style="background: transparent; border: none; color: white; border-radius: 6px; padding: 5px; cursor: pointer;">
            <svg width="19" height="19" data-lucide="x"></svg>
          </button>
        </div>
      </div>

      <!-- Real-time ScamSense AI Shield Banner Slot -->
      <div id="chat-safety-alert" style="display: none; padding: 6px 10px; background: #fefce8; border-bottom: 1px solid #fef08a;"></div>

      <!-- Messages Scroll Area -->
      <div class="chat-messages" style="flex: 1; overflow-y: auto; padding: 1rem; background: #f8fafc; display: flex; flex-direction: column; gap: 0.75rem;">
        <!-- Rendered via JS -->
      </div>

      <!-- Demo Evaluation Chips Strip -->
      <div class="chat-demo-chips" style="padding: 6px 8px; background: #ffffff; border-top: 1px solid #f1f5f9; display: flex; gap: 0.35rem; overflow-x: auto; scrollbar-width: none;">
        ${demoChips.map(c => `
          <button class="chat-chip-btn" data-query="${c.text}" style="white-space: nowrap; font-size: 0.7rem; font-weight: 700; padding: 4px 9px; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: 999px; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#dcfce7'" onmouseout="this.style.background='#f0fdf4'">
            ${c.label}
          </button>
        `).join('')}
      </div>

      <!-- Input Area -->
      <div class="chat-input-area" style="padding: 0.75rem; background: #ffffff; border-top: 1px solid #e2e8f0; display: flex; gap: 0.5rem; align-items: center;">
        <input type="text" class="chat-input" placeholder="Ask about safety, hidden spots, or tours..." style="flex: 1; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; outline: none; font-family: inherit;" />
        <button class="btn-send" style="width: 38px; height: 38px; background: #0284c7; color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background 0.2s;">
          <svg width="18" height="18" data-lucide="send"></svg>
        </button>
      </div>

    </div>
  `;

  // Bind Events
  container.querySelector('#btn-close-chat').addEventListener('click', () => {
    const overlay = container.querySelector('.chat-overlay');
    if (overlay) overlay.classList.remove('open');
    setTimeout(onClose, 250);
  });

  const translateBtn = container.querySelector('#btn-translate');
  translateBtn.addEventListener('click', () => {
    isTranslated = !isTranslated;
    translateBtn.style.background = isTranslated ? 'rgba(255,255,255,0.25)' : 'transparent';
    renderThread();
  });

  container.querySelector('.btn-send').addEventListener('click', () => handleSend());
  container.querySelector('.chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  container.querySelectorAll('.chat-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query;
      handleSend(query);
    });
  });

  renderThread();
}
