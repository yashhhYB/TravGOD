/**
 * ChatWindow.js
 * Renders a floating chat window for a specific guide with AI translation.
 */

export function renderChatWindow(container, guide, onClose) {
  let isTranslated = false;
  
  // Simulated responses based on keywords
  const cannedResponses = [
    { keywords: ['hi', 'hello', 'hey', 'bonjour'], original: "Bonjour! Comment puis-je vous aider à planifier votre voyage à Paris?", translated: "Hello! How can I help you plan your trip to Paris?" },
    { keywords: ['price', 'cost', 'rate', 'budget'], original: "Mon tarif est de €" + guide.rate + " par heure. C'est très raisonnable pour une visite privée.", translated: "My rate is €" + guide.rate + " per hour. This is very reasonable for a private tour." },
    { keywords: ['food', 'eat', 'restaurant'], original: "Je connais d'excellents bistrots locaux loin des pièges à touristes!", translated: "I know some excellent local bistros far from the tourist traps!" },
    { keywords: ['scam', 'safe', 'safety'], original: "Ne vous inquiétez pas, je vous montrerai comment éviter les arnaques courantes comme le bracelet.", translated: "Don't worry, I will show you how to avoid common scams like the bracelet trick." },
    { keywords: ['book', 'reserve', 'tour'], original: "Génial ! Vous pouvez réserver directement sur mon profil.", translated: "Great! You can book directly on my profile." }
  ];

  const defaultResponse = {
    original: "C'est intéressant ! Dites-m'en plus sur ce que vous aimeriez voir.",
    translated: "That's interesting! Tell me more about what you'd like to see."
  };

  const thread = [
    { sender: 'guide', original: `Bonjour! Je suis ${guide.name}. Prêt(e) à découvrir Paris avec un local ?`, translated: `Hello! I'm ${guide.name}. Ready to discover Paris with a local?` }
  ];

  function renderThread() {
    const msgsContainer = container.querySelector('.chat-messages');
    msgsContainer.innerHTML = thread.map(msg => {
      if (msg.sender === 'user') {
        return `<div class="chat-bubble sent">${msg.text}</div>`;
      } else {
        const displayText = isTranslated ? msg.translated : msg.original;
        const badge = isTranslated ? `<span class="translation-badge"><svg width="12" height="12" data-lucide="languages" style="display:inline; margin-right:2px; vertical-align:-2px;"></svg>Translated from French</span>` : '';
        return `
          <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
            <img src="${guide.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />
            <div class="chat-bubble received">
              ${badge}
              ${displayText}
            </div>
          </div>
        `;
      }
    }).join('');
    
    if (window.lucide) window.lucide.createIcons();
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  }

  function handleSend() {
    const input = container.querySelector('.chat-input');
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    thread.push({ sender: 'user', text });
    input.value = '';
    renderThread();

    // Simulate typing delay
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let reply = defaultResponse;
      for (const res of cannedResponses) {
        if (res.keywords.some(kw => lowerText.includes(kw))) {
          reply = res;
          break;
        }
      }
      thread.push({ sender: 'guide', original: reply.original, translated: reply.translated });
      renderThread();
    }, 1000);
  }

  container.innerHTML = `
    <div class="chat-overlay open">
      <div class="chat-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <img src="${guide.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2);" />
          <div>
            <h3>${guide.name}</h3>
            <div style="font-size: 0.7rem; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 0.25rem;">
              <div style="width: 6px; height: 6px; background: #34d399; border-radius: 50%;"></div> Online
            </div>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="btn-icon" id="btn-translate" title="Toggle Translation">
            <svg width="18" height="18" data-lucide="languages"></svg>
          </button>
          <button class="btn-icon" id="btn-close-chat">
            <svg width="20" height="20" data-lucide="x"></svg>
          </button>
        </div>
      </div>
      
      <div class="chat-messages">
        <!-- Rendered via JS -->
      </div>
      
      <div class="chat-input-area">
        <input type="text" class="chat-input" placeholder="Type a message..." />
        <button class="btn-send">
          <svg width="18" height="18" data-lucide="send" style="margin-left: -2px;"></svg>
        </button>
      </div>
    </div>
  `;

  // Bind Events
  container.querySelector('#btn-close-chat').addEventListener('click', () => {
    container.querySelector('.chat-overlay').classList.remove('open');
    setTimeout(onClose, 300); // Wait for transition
  });

  const translateBtn = container.querySelector('#btn-translate');
  translateBtn.addEventListener('click', () => {
    isTranslated = !isTranslated;
    translateBtn.style.color = isTranslated ? 'white' : 'rgba(255,255,255,0.8)';
    translateBtn.style.background = isTranslated ? 'rgba(255,255,255,0.2)' : 'none';
    renderThread();
  });

  container.querySelector('.btn-send').addEventListener('click', handleSend);
  container.querySelector('.chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  renderThread();
}
