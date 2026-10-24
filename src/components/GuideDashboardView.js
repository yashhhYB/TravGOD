import { createGrid } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export function renderGuideDashboardView(container) {
  container.innerHTML = `
    <header class="app-header">
      <div class="header-content">
        <a href="#/" class="logo">TRAV<span>GOD</span> <span style="font-size: 0.8rem; background: var(--blue-dark); color: white; padding: 2px 6px; border-radius: 4px; margin-left: 8px; vertical-align: middle;">Guide Mode</span></a>
        <nav class="main-nav">
          <ul>
            <li><a href="#/guide-dashboard" class="active">Dashboard</a></li>
            <li><a href="#/" onclick="alert('Viewing earnings (Coming Soon)')">Earnings</a></li>
            <li><a href="#/">Switch to Tourist</a></li>
          </ul>
        </nav>
      </div>
    </header>
    <main style="padding: 100px 5%; max-width: 1200px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">Guide Dashboard</h1>
          <p style="color: var(--text-secondary);">Manage your upcoming bookings, payments, and Qloo-matched tourists.</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Total Earnings</p>
          <h2 style="margin: 0; color: var(--blue-primary); font-size: 2rem;">$1,450.00</h2>
        </div>
      </div>
      
      <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-light); margin-bottom: 2rem;">
        <h3 style="margin-top: 0; margin-bottom: 1rem; color: var(--text-primary);">Upcoming Bookings (Powered by AG Grid)</h3>
        <!-- AG Grid Container -->
        <div id="myGrid" class="ag-theme-alpine" style="height: 400px; width: 100%;"></div>
      </div>
    </main>
  `;
  if (window.lucide) window.lucide.createIcons();

  // ── AG Grid Setup ────────────────────────────────────────────────────────
  const rowData = [
    { orderId: 'TXN-9842', tourist: 'Yash B.', destination: 'Paris, France', date: '2026-10-12', amount: 120, status: 'Confirmed', qlooMatch: '94%' },
    { orderId: 'TXN-9845', tourist: 'Sarah Connor', destination: 'Paris, France', date: '2026-10-14', amount: 80, status: 'Pending', qlooMatch: '88%' },
    { orderId: 'TXN-9850', tourist: 'John Doe', destination: 'Versailles, France', date: '2026-10-18', amount: 150, status: 'Confirmed', qlooMatch: '91%' },
    { orderId: 'TXN-9851', tourist: 'Alice Smith', destination: 'Paris, France', date: '2026-10-22', amount: 100, status: 'Completed', qlooMatch: '82%' },
    { orderId: 'TXN-9854', tourist: 'Bob Johnson', destination: 'Paris, France', date: '2026-10-25', amount: 200, status: 'Confirmed', qlooMatch: '97%' },
  ];

  const columnDefs = [
    { field: 'orderId', headerName: 'Order ID', width: 120 },
    { field: 'tourist', headerName: 'Tourist Name', flex: 1 },
    { field: 'destination', headerName: 'Tour Location', flex: 1 },
    { field: 'date', headerName: 'Date', width: 130 },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 120,
      valueFormatter: params => '$' + params.value.toFixed(2)
    },
    { 
      field: 'qlooMatch', 
      headerName: 'Qloo Match', 
      width: 120,
      cellStyle: params => {
        if (parseInt(params.value) > 90) return { color: '#10b981', fontWeight: 'bold' };
        return null;
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      cellRenderer: params => {
        const color = params.value === 'Confirmed' ? '#10b981' : params.value === 'Pending' ? '#f59e0b' : '#64748b';
        return `<span style="background: ${color}22; color: ${color}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">${params.value}</span>`;
      }
    }
  ];

  const gridOptions = {
    rowData: rowData,
    columnDefs: columnDefs,
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },
    pagination: true,
    paginationPageSize: 10,
    animateRows: true,
  };

  const gridDiv = document.querySelector('#myGrid');
  if (gridDiv) {
    createGrid(gridDiv, gridOptions);
  }
}
