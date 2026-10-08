/**
 * ScamSense.js
 * Renders the ScamSense panel and Fair Price Guide
 */

export function renderScamSense(container, scams, prices) {
  // Generate Scam Cards
  const scamsHtml = scams.map(scam => {
    const isHighRisk = scam.risk === 'high';
    const riskClass = isHighRisk ? 'high' : 'medium';
    const textColor = isHighRisk ? '#e11d48' : '#d97706';
    const icon = isHighRisk ? 'alert-octagon' : 'alert-triangle';

    return `
      <div class="scam-card ${riskClass}">
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          <div style="color: ${textColor}; padding-top: 0.15rem;">
            <svg width="18" height="18" data-lucide="${icon}"></svg>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem 0;">${scam.title}</h4>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.35rem;">
              <svg width="12" height="12" data-lucide="map-pin"></svg> ${scam.location}
            </div>
            
            <div style="margin-bottom: 0.5rem;">
              <strong style="font-size: 0.75rem; color: ${textColor}; display: block; margin-bottom: 0.15rem;">Red Flags:</strong>
              <span style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45;">${scam.redFlags}</span>
            </div>
            
            <div>
              <strong style="font-size: 0.75rem; color: #059669; display: block; margin-bottom: 0.15rem;">How to Avoid:</strong>
              <span style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45;">${scam.prevention}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Generate Price Table
  const pricesHtml = prices.map(price => `
    <tr>
      <td style="font-weight: 500;">${price.item}</td>
      <td style="color: #e11d48; font-weight: 600;">${price.touristPrice}</td>
      <td style="color: #059669; font-weight: 700;">${price.localPrice}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <!-- Scams Section -->
    <div style="margin-bottom: 2rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <h2 style="color: var(--text-primary); font-size: 1.15rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="20" height="20" data-lucide="shield-alert" style="color: #e11d48;"></svg> Scam Alerts
        </h2>
        <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary);">${scams.length} active alerts</span>
      </div>
      ${scamsHtml}
    </div>

    <!-- Fair Price Guide -->
    <div>
      <div style="display: flex; align-items: center; margin-bottom: 1rem;">
        <h2 style="color: var(--text-primary); font-size: 1.15rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="20" height="20" data-lucide="tag" style="color: #059669;"></svg> Local Price Guide
        </h2>
      </div>
      <div class="price-table-wrapper">
        <table class="price-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Tourist Trap</th>
              <th>Local Price</th>
            </tr>
          </thead>
          <tbody>
            ${pricesHtml}
          </tbody>
        </table>
      </div>
      <p style="font-size: 0.7rem; color: var(--text-secondary); text-align: center; margin-top: 0.75rem;">Prices are estimates and vary by specific location.</p>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
