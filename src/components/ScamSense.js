/**
 * ScamSense.js
 * Renders the ScamSense panel and Fair Price Guide
 */

export function renderScamSense(container, scams, prices) {
  // Generate Scam Cards
  const scamsHtml = scams.map(scam => {
    const isHighRisk = scam.risk === 'high';
    const bgColor = isHighRisk ? 'rgba(225,29,72,0.1)' : 'rgba(245,158,11,0.1)';
    const borderColor = isHighRisk ? 'rgba(225,29,72,0.3)' : 'rgba(245,158,11,0.3)';
    const textColor = isHighRisk ? '#f43f5e' : '#fbbf24';
    const icon = isHighRisk ? 'alert-octagon' : 'alert-triangle';

    return `
      <div style="background: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          <div style="color: ${textColor}; padding-top: 0.15rem;">
            <svg width="18" height="18" data-lucide="${icon}"></svg>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 0.25rem 0;">${scam.title}</h4>
            <div style="font-size: 0.75rem; color: var(--text-white-70); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.35rem;">
              <svg width="12" height="12" data-lucide="map-pin"></svg> ${scam.location}
            </div>
            
            <div style="margin-bottom: 0.5rem;">
              <strong style="font-size: 0.75rem; color: ${textColor}; display: block; margin-bottom: 0.15rem;">Red Flags:</strong>
              <span style="font-size: 0.8rem; color: var(--text-white-70); line-height: 1.4;">${scam.redFlags}</span>
            </div>
            
            <div>
              <strong style="font-size: 0.75rem; color: #34d399; display: block; margin-bottom: 0.15rem;">How to Avoid:</strong>
              <span style="font-size: 0.8rem; color: var(--text-white-70); line-height: 1.4;">${scam.prevention}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Generate Price Table
  const pricesHtml = prices.map(price => `
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.75rem 0.5rem; font-size: 0.8rem; color: white;">${price.item}</td>
      <td style="padding: 0.75rem 0.5rem; font-size: 0.8rem; color: #f43f5e;">${price.touristPrice}</td>
      <td style="padding: 0.75rem 0.5rem; font-size: 0.8rem; color: #34d399; font-weight: 600;">${price.localPrice}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <!-- Scams Section -->
    <div style="margin-bottom: 2rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <h2 style="color: white; font-size: 1.1rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="18" height="18" data-lucide="shield-alert" style="color: #f43f5e;"></svg> ScamSense
        </h2>
        <span style="font-size: 0.75rem; color: var(--text-white-50);">${scams.length} active alerts</span>
      </div>
      ${scamsHtml}
    </div>

    <!-- Fair Price Guide -->
    <div>
      <div style="display: flex; align-items: center; margin-bottom: 1rem;">
        <h2 style="color: white; font-size: 1.1rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="18" height="18" data-lucide="tag" style="color: #34d399;"></svg> Fair Price Guide
        </h2>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1);">
              <th style="padding: 0.75rem 0.5rem; font-size: 0.75rem; color: var(--text-white-50); font-weight: 600; text-transform: uppercase;">Item</th>
              <th style="padding: 0.75rem 0.5rem; font-size: 0.75rem; color: var(--text-white-50); font-weight: 600; text-transform: uppercase;">Tourist Trap</th>
              <th style="padding: 0.75rem 0.5rem; font-size: 0.75rem; color: var(--text-white-50); font-weight: 600; text-transform: uppercase;">Local Price</th>
            </tr>
          </thead>
          <tbody>
            ${pricesHtml}
          </tbody>
        </table>
      </div>
      <p style="font-size: 0.7rem; color: var(--text-white-50); text-align: center; margin-top: 0.75rem;">Prices are estimates and vary by specific location.</p>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
