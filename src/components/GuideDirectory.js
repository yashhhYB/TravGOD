/**
 * GuideDirectory.js
 * Renders the list of local guides in the sidebar
 */

export function renderGuideDirectory(container, guides, rankedScores = null, onChatClick) {
  let displayGuides = [...guides];

  // If we have AI Match scores, attach them and sort by score descending
  if (rankedScores) {
    displayGuides = displayGuides.map(g => ({
      ...g,
      matchScore: rankedScores[g.id].score,
      matchReason: rankedScores[g.id].explanation
    })).sort((a, b) => b.matchScore - a.matchScore);
  }

  if (displayGuides.length === 0) {
    container.innerHTML = `<div style="color: var(--text-white-50); text-align: center; padding: 2rem;">No guides found.</div>`;
    return;
  }

  container.innerHTML = displayGuides.map((guide, index) => {
    const isTopMatch = rankedScores && index === 0 && guide.matchScore > 50;
    
    return `
      <div class="guide-card ${isTopMatch ? 'top-match' : ''}" id="guide-card-${guide.id}" style="
        background: rgba(255,255,255,0.05);
        border: 1px solid ${isTopMatch ? '#38bdf8' : 'rgba(255,255,255,0.1)'};
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
        transition: all 0.2s;
        box-shadow: ${isTopMatch ? '0 0 15px rgba(14,165,233,0.3)' : 'none'};
      ">
        ${isTopMatch ? `<div style="font-size: 0.7rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.25rem;"><svg width="12" height="12" data-lucide="star"></svg> Best Match (${guide.matchScore}%)</div>` : ''}
        ${!isTopMatch && rankedScores ? `<div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.5rem;">Match: ${guide.matchScore}%</div>` : ''}
        
        <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem;">
          <div style="position: relative;">
            <img src="${guide.avatar}" alt="${guide.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />
            ${guide.verified ? `<div style="position: absolute; bottom: 0; right: 0; background: var(--blue); color: white; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center;" title="Verified Local"><svg width="10" height="10" data-lucide="check"></svg></div>` : ''}
          </div>
          <div style="flex: 1;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 0.15rem 0;">${guide.name}</h4>
            <div style="font-size: 0.75rem; color: var(--text-white-50); display: flex; align-items: center; gap: 0.4rem;">
              <svg width="12" height="12" data-lucide="star" style="color: #fbbf24;"></svg> ${guide.rating} (${guide.reviews})
            </div>
            <div style="font-size: 0.75rem; color: var(--text-white-70); margin-top: 0.15rem;">€${guide.rate}/hr</div>
          </div>
        </div>

        <div style="font-size: 0.8rem; color: var(--text-white-70); line-height: 1.4; margin-bottom: 0.75rem;">
          ${guide.bio}
        </div>

        ${rankedScores ? `<div style="font-size: 0.75rem; color: #bae6fd; background: rgba(14,165,233,0.1); padding: 0.5rem; border-radius: 6px; margin-bottom: 0.75rem;"><strong>Why:</strong> ${guide.matchReason}</div>` : ''}

        <div style="display: flex; gap: 0.25rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
          ${guide.languages.map(l => `<span style="font-size: 0.65rem; padding: 0.15rem 0.4rem; background: rgba(255,255,255,0.1); border-radius: 4px; color: var(--text-white-70);">${l}</span>`).join('')}
        </div>

        <button class="btn-chat" data-guide-id="${guide.id}" style="width: 100%; padding: 0.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 6px; font-weight: 600; font-size: 0.8rem; transition: all 0.2s;">
          Free Chat
        </button>

      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();

  container.querySelectorAll('.btn-chat').forEach(btn => {
    btn.addEventListener('click', () => {
      onChatClick(btn.dataset.guideId);
    });
  });
}
