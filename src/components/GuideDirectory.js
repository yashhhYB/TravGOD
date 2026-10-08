/**
 * GuideDirectory.js
 * Renders the list of local guides in the sidebar
 */

export function renderGuideDirectory(container, guides, rankedScores = null, onChatClick, onBookClick, fallbackMessage = null) {
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

  const fallbackHtml = fallbackMessage ? `
    <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; display: flex; gap: 0.75rem; align-items: flex-start;">
      <svg width="20" height="20" data-lucide="alert-circle" style="color: #d97706; flex-shrink: 0; margin-top: 0.1rem;"></svg>
      <div style="font-size: 0.85rem; color: #92400e; line-height: 1.4; font-weight: 600;">
        ${fallbackMessage}
      </div>
    </div>
  ` : '';

  container.innerHTML = fallbackHtml + displayGuides.map((guide, index) => {
    const isTopMatch = rankedScores && index === 0 && guide.matchScore > 50;
    
    return `
      <div class="guide-card ${isTopMatch ? 'top-match' : ''}" id="guide-card-${guide.id}">
        ${isTopMatch ? `<div style="font-size: 0.75rem; font-weight: 800; color: var(--blue); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.25rem;"><svg width="14" height="14" data-lucide="star" style="fill: var(--blue);"></svg> Best Match (${guide.matchScore}%)</div>` : ''}
        ${!isTopMatch && rankedScores ? `<div style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.75rem;">Match: ${guide.matchScore}%</div>` : ''}
        
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
          <div style="position: relative;">
            <img src="${guide.avatar}" alt="${guide.name}" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; box-shadow: var(--shadow-sm);" />
            ${guide.verified ? `<div style="position: absolute; bottom: -2px; right: -2px; background: var(--blue); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--bg-white);" title="Verified Local"><svg width="12" height="12" data-lucide="check"></svg></div>` : ''}
          </div>
          <div style="flex: 1;">
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.15rem 0;">${guide.name}</h4>
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
              <svg width="14" height="14" data-lucide="star" style="color: #fbbf24; fill: #fbbf24;"></svg> ${guide.rating} (${guide.reviews})
            </div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">€${guide.rate}<span style="color: var(--text-secondary); font-weight: 500;">/hr</span></div>
          </div>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
          ${guide.bio}
        </div>

        ${rankedScores ? `<div style="font-size: 0.8rem; color: var(--blue-deeper); background: var(--bg-light); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem;"><strong>Why:</strong> ${guide.matchReason}</div>` : ''}

        <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 1rem;">
          ${guide.languages.map(l => `<span style="font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.6rem; background: var(--bg-gray); border: 1px solid var(--border); border-radius: var(--radius-pill); color: var(--text-secondary);">${l}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: auto;">
          <button class="btn-chat" data-guide-id="${guide.id}" style="flex: 1; padding: 0.75rem; background: var(--bg-gray); border: 1px solid var(--border); color: var(--text-primary); border-radius: var(--radius-sm); font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;">
            Message
          </button>
          <button class="btn-book" data-guide-id="${guide.id}" style="flex: 1; padding: 0.75rem; background: var(--blue); border: none; color: white; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-sm);">
            Book Guide
          </button>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();

  container.querySelectorAll('.btn-chat').forEach(btn => {
    btn.addEventListener('click', () => {
      onChatClick(btn.dataset.guideId);
    });
  });

  container.querySelectorAll('.btn-book').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onBookClick) onBookClick(btn.dataset.guideId);
    });
  });
}
