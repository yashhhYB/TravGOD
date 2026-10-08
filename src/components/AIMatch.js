/**
 * AIMatch.js
 * Widget for collecting user preferences and running AI LocalMatch
 */

export function renderAIMatchWidget(container, onMatch) {
  container.innerHTML = `
    <div style="background: rgba(14,165,233,0.1); border: 1px solid rgba(14,165,233,0.3); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: #38bdf8;">
        <svg width="18" height="18" data-lucide="zap"></svg>
        <h3 style="font-size: 1rem; font-weight: 700; margin: 0;">AI LocalMatch</h3>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-white-70); margin-bottom: 1rem; line-height: 1.4;">
        Find your perfect local guide. Tell us what you're looking for.
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        
        <div>
          <label style="font-size: 0.75rem; color: var(--text-white-50); margin-bottom: 0.25rem; display: block;">Language</label>
          <select id="ai-lang" style="width: 100%; padding: 0.5rem; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; font-family: inherit; font-size: 0.85rem;">
            <option value="" style="color: black;">Any Language</option>
            <option value="English" style="color: black;">English</option>
            <option value="French" style="color: black;">French</option>
            <option value="Spanish" style="color: black;">Spanish</option>
            <option value="German" style="color: black;">German</option>
          </select>
        </div>

        <div>
          <label style="font-size: 0.75rem; color: var(--text-white-50); margin-bottom: 0.25rem; display: block;">Budget</label>
          <select id="ai-budget" style="width: 100%; padding: 0.5rem; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; font-family: inherit; font-size: 0.85rem;">
            <option value="" style="color: black;">Any Budget</option>
            <option value="low" style="color: black;">Economy (≤ €20/hr)</option>
            <option value="medium" style="color: black;">Standard (€20 - €40/hr)</option>
            <option value="high" style="color: black;">Premium (> €40/hr)</option>
          </select>
        </div>

        <div>
          <label style="font-size: 0.75rem; color: var(--text-white-50); margin-bottom: 0.25rem; display: block;">Interests (comma separated)</label>
          <input type="text" id="ai-interests" placeholder="e.g. food, history, vintage" style="width: 100%; padding: 0.5rem; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; font-family: inherit; font-size: 0.85rem;" />
        </div>

        <button id="btn-run-match" style="margin-top: 0.5rem; width: 100%; padding: 0.6rem; background: var(--blue); color: white; border-radius: 6px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
          <svg width="14" height="14" data-lucide="search"></svg> Find My Match
        </button>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  container.querySelector('#btn-run-match').addEventListener('click', () => {
    const lang = container.querySelector('#ai-lang').value;
    const budget = container.querySelector('#ai-budget').value;
    const interestsStr = container.querySelector('#ai-interests').value;
    
    const interests = interestsStr ? interestsStr.split(',').map(i => i.trim().toLowerCase()).filter(i => i) : [];

    onMatch({ language: lang, budget, interests });
  });
}
