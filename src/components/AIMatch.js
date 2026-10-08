/**
 * AIMatch.js
 * Widget for collecting user preferences and running AI LocalMatch
 */

export function renderAIMatchWidget(container, onMatch) {
  container.innerHTML = `
    <div class="widget-card" style="background: var(--bg-light); border-color: #bae6fd;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--blue-dark);">
        <svg width="20" height="20" data-lucide="zap" style="fill: var(--blue); color: var(--blue);"></svg>
        <h3 style="font-size: 1.05rem; font-weight: 800; margin: 0;">AI LocalMatch</h3>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.5;">
        Find your perfect local guide. Tell us what you're looking for.
      </p>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        
        <div>
          <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; display: block; text-transform: uppercase;">Language</label>
          <select id="ai-lang" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); background: var(--bg-white); border: 1px solid var(--border); color: var(--text-primary); font-family: inherit; font-size: 0.9rem; font-weight: 500; outline: none;">
            <option value="">Any Language</option>
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="German">German</option>
          </select>
        </div>

        <div>
          <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; display: block; text-transform: uppercase;">Budget</label>
          <select id="ai-budget" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); background: var(--bg-white); border: 1px solid var(--border); color: var(--text-primary); font-family: inherit; font-size: 0.9rem; font-weight: 500; outline: none;">
            <option value="">Any Budget</option>
            <option value="low">Economy (≤ €20/hr)</option>
            <option value="medium">Standard (€20 - €40/hr)</option>
            <option value="high">Premium (> €40/hr)</option>
          </select>
        </div>

        <div>
          <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; display: block; text-transform: uppercase;">Interests</label>
          <input type="text" id="ai-interests" placeholder="e.g. food, history, vintage" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); background: var(--bg-white); border: 1px solid var(--border); color: var(--text-primary); font-family: inherit; font-size: 0.9rem; font-weight: 500; outline: none;" />
        </div>

        <button id="btn-run-match" style="margin-top: 0.5rem; width: 100%; padding: 0.75rem; background: var(--blue); color: white; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(14,165,233,0.25);">
          <svg width="16" height="16" data-lucide="search"></svg> Find My Match
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
