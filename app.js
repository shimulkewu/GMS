/* ============================================================
   GMS — Garment Management System | app.js
   ============================================================ */

'use strict';

/* ── STATE ── */
const DB = {
  inquiries: [
    { id:'INQ-001', buyer:'H&M Sweden',    country:'Sweden',      product:'Men\'s Polo Shirt',   qty:50000, date:'2024-01-10', status:'active',    value:125000, contact:'erik.larsson@hm.com'       },
    { id:'INQ-002', buyer:'Zara Spain',    country:'Spain',       product:'Women\'s Blazer',     qty:20000, date:'2024-01-15', status:'pending',   value:180000, contact:'maria.garcia@zara.com'     },
    { id:'INQ-003', buyer:'Gap USA',       country:'USA',         product:'Denim Jeans',         qty:80000, date:'2024-01-18', status:'completed', value:320000, contact:'j.smith@gap.com'           },
    { id:'INQ-004', buyer:'Uniqlo Japan',  country:'Japan',       product:'Fleece Hoodie',       qty:40000, date:'2024-01-22', status:'active',    value:200000, contact:'tanaka.k@uniqlo.com'       },
    { id:'INQ-005', buyer:'M&S UK',        country:'UK',          product:'Cotton T-Shirt',      qty:60000, date:'2024-01-28', status:'rejected',  value:90000,  contact:'p.brown@marksandspencer.com'},
  ],
  orders: [
    { id:'ORD-001', inquiryId:'INQ-001', buyer:'H&M Sweden',   product:'Men\'s Polo Shirt', qty:50000, unitPrice:2.50, totalValue:125000, delivery:'2024-04-15', status:'active',    progress:60 },
    { id:'ORD-002', inquiryId:'INQ-003', buyer:'Gap USA',      product:'Denim Jeans',       qty:80000, unitPrice:4.00, totalValue:320000, delivery:'2024-05-01', status:'active',    progress:30 },
    { id:'ORD-003', inquiryId:'INQ-004', buyer:'Uniqlo Japan', product:'Fleece Hoodie',     qty:40000, unitPrice:5.00, totalValue:200000, delivery:'2024-04-30', status:'pending',   progress:10 },
    { id:'ORD-004', inquiryId:'',        buyer:'Primark Ireland','product':'Basic Tee',     qty:100000,unitPrice:1.20, totalValue:120000, delivery:'2024-03-20', status:'completed', progress:100},
  ],
  production: [
    { id:'PROD-001', orderId:'ORD-001', product:'Men\'s Polo Shirt', buyer:'H&M Sweden',   totalQty:50000, cut:50000, sewing:32000, finishing:20000, qcPassed:18000, status:'active'   },
    { id:'PROD-002', orderId:'ORD-002', product:'Denim Jeans',       buyer:'Gap USA',       totalQty:80000, cut:30000, sewing:15000, finishing:8000,  qcPassed:0,     status:'active'   },
    { id:'PROD-003', orderId:'ORD-003', product:'Fleece Hoodie',     buyer:'Uniqlo Japan',  totalQty:40000, cut:5000,  sewing:0,     finishing:0,     qcPassed:0,     status:'pending'  },
    { id:'PROD-004', orderId:'ORD-004', product:'Basic Tee',         buyer:'Primark Ireland',totalQty:100000,cut:100000,sewing:100000,finishing:100000,qcPassed:98000, status:'completed'},
  ],
  fabric: [
    { id:'FAB-001', name:'100% Cotton Pique', type:'Pique', composition:'100% Cotton', color:'White', gsm:180, stock:25000, unit:'kg', supplier:'Mahmud Fabrics', minStock:5000, cost:3.20 },
    { id:'FAB-002', name:'Stretch Denim',     type:'Denim', composition:'98% Cotton 2% Elastane', color:'Indigo', gsm:320, stock:18000, unit:'kg', supplier:'Denim World', minStock:8000, cost:5.50 },
    { id:'FAB-003', name:'Polar Fleece',      type:'Fleece', composition:'100% Polyester', color:'Charcoal', gsm:280, stock:8000, unit:'kg', supplier:'Poly Mills', minStock:3000, cost:4.80 },
    { id:'FAB-004', name:'Single Jersey',     type:'Jersey', composition:'100% Cotton', color:'Various', gsm:160, stock:3200, unit:'kg', supplier:'Mahmud Fabrics', minStock:5000, cost:2.40 },
    { id:'FAB-005', name:'Twill Woven',       type:'Woven', composition:'65% Polyester 35% Cotton', color:'Navy', gsm:240, stock:12000, unit:'kg', supplier:'Global Textile', minStock:4000, cost:3.80 },
  ],
  suppliers: [
    { id:'SUP-001', name:'Mahmud Fabrics Ltd', type:'Fabric',    country:'Bangladesh', contact:'mahmud@mahmudfabrics.com',  phone:'+880-2-9887654', status:'active',  rating:4.8 },
    { id:'SUP-002', name:'Denim World',         type:'Fabric',    country:'Bangladesh', contact:'info@denimworld.com.bd',    phone:'+880-2-8765432', status:'active',  rating:4.5 },
    { id:'SUP-003', name:'Poly Mills',          type:'Fabric',    country:'Bangladesh', contact:'sales@polymills.com',       phone:'+880-2-7654321', status:'active',  rating:4.2 },
    { id:'SUP-004', name:'Global Accessories',  type:'Accessory', country:'China',      contact:'global@accessories.cn',    phone:'+86-21-6543210', status:'active',  rating:3.9 },
    { id:'SUP-005', name:'Zippers & More',      type:'Accessory', country:'Bangladesh', contact:'info@zippersmore.com',     phone:'+880-2-6543210', status:'pending', rating:4.0 },
  ],
  qc: [
    { id:'QC-001', orderId:'ORD-001', product:'Men\'s Polo Shirt', buyer:'H&M Sweden',   inspQty:5000, passed:4900, failed:100, failRate:2.0, date:'2024-02-10', inspector:'Rafiq Ahmed',  status:'active' },
    { id:'QC-002', orderId:'ORD-002', product:'Denim Jeans',       buyer:'Gap USA',       inspQty:3000, passed:2880, failed:120, failRate:4.0, date:'2024-02-12', inspector:'Sumaiya Begum',status:'active' },
    { id:'QC-003', orderId:'ORD-004', product:'Basic Tee',         buyer:'Primark Ireland',inspQty:10000,passed:9800,failed:200, failRate:2.0, date:'2024-01-20', inspector:'Karim Hossain',status:'completed'},
  ],
  shipments: [
    { id:'SHP-001', orderId:'ORD-004', buyer:'Primark Ireland', product:'Basic Tee',       qty:100000, vessel:'MV Endeavour', voyage:'E-204', port:'Chittagong', destination:'Dublin',  etd:'2024-02-01', eta:'2024-03-10', status:'shipped', bl:'BL-2024-001' },
    { id:'SHP-002', orderId:'ORD-001', buyer:'H&M Sweden',      product:'Men\'s Polo Shirt',qty:50000, vessel:'MV Nordic Star',voyage:'NS-301',port:'Chittagong', destination:'Stockholm',etd:'2024-04-20', eta:'2024-05-30', status:'pending', bl:''            },
  ],
  documents: [
    { id:'DOC-001', type:'Commercial Invoice',    orderId:'ORD-004', buyer:'Primark Ireland', date:'2024-01-30', amount:120000, currency:'USD', status:'completed' },
    { id:'DOC-002', type:'Packing List',          orderId:'ORD-004', buyer:'Primark Ireland', date:'2024-01-30', amount:0,      currency:'',    status:'completed' },
    { id:'DOC-003', type:'Bill of Lading',        orderId:'ORD-004', buyer:'Primark Ireland', date:'2024-02-01', amount:0,      currency:'',    status:'completed' },
    { id:'DOC-004', type:'Certificate of Origin', orderId:'ORD-004', buyer:'Primark Ireland', date:'2024-01-31', amount:0,      currency:'',    status:'completed' },
    { id:'DOC-005', type:'Commercial Invoice',    orderId:'ORD-001', buyer:'H&M Sweden',      date:'',           amount:125000, currency:'USD', status:'draft'     },
  ],
};

let nextId = { inquiries:6, orders:5, production:5, fabric:6, suppliers:6, qc:4, shipments:3, documents:6 };

/* ── ROUTER ── */
const pages = {};
let currentPage = 'dashboard';

function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });
  const titles = {
    dashboard:'Dashboard', inquiries:'Buyer Inquiries', orders:'Orders',
    production:'Production Planning', fabric:'Fabric & Materials',
    suppliers:'Suppliers', qc:'Quality Control',
    shipment:'Shipment', documents:'Documentation', reports:'Reports'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  const content = document.getElementById('content');
  content.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'page-enter';
  div.innerHTML = pages[page]();
  content.appendChild(div);
  if (typeof window['init_'+page] === 'function') window['init_'+page]();
}

/* ── HELPERS ── */
const $ = id => document.getElementById(id);
const fmt = n => '$' + (+n).toLocaleString();
const fmtN = n => (+n).toLocaleString();

function statusBadge(s) {
  return `<span class="badge-status s-${s}">${s}</span>`;
}

function openModal(title, bodyHTML, onSave) {
  $('modalTitle').textContent = title;
  $('modalBody').innerHTML = bodyHTML;
  $('modalOverlay').classList.add('open');
  $('modalClose').onclick = closeModal;
  $('modalOverlay').onclick = e => { if(e.target === $('modalOverlay')) closeModal(); };
  if(onSave) {
    const btn = $('modalBody').querySelector('.btn-save');
    if(btn) btn.onclick = onSave;
  }
}
function closeModal() { $('modalOverlay').classList.remove('open'); }

function showAlert(msg, type='success') {
  const a = document.createElement('div');
  a.className = `alert alert-${type}`;
  a.textContent = msg;
  document.querySelector('.content').prepend(a);
  setTimeout(() => a.remove(), 3000);
}

/* ── DATE ── */
document.getElementById('todayDate').textContent =
  new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});

/* ── SIDEBAR TOGGLE ── */
document.getElementById('menuToggle').onclick = () => {
  document.getElementById('sidebar').classList.toggle('open');
};
document.querySelectorAll('.nav-item').forEach(n => {
  n.onclick = e => {
    e.preventDefault();
    navigate(n.dataset.page);
    document.getElementById('sidebar').classList.remove('open');
  };
});

/* ══════════════════════════════════════════
   PAGE: DASHBOARD
══════════════════════════════════════════ */
pages.dashboard = () => {
  const totalOrders   = DB.orders.length;
  const activeOrders  = DB.orders.filter(o=>o.status==='active').length;
  const totalValue    = DB.orders.reduce((s,o)=>s+o.totalValue,0);
  const lowStock      = DB.fabric.filter(f=>f.stock < f.minStock).length;

  const monthlyData = [
    {m:'Aug',v:85000},{m:'Sep',v:120000},{m:'Oct',v:95000},
    {m:'Nov',v:160000},{m:'Dec',v:140000},{m:'Jan',v:195000}
  ];
  const maxV = Math.max(...monthlyData.map(d=>d.v));

  const orderStatus = [
    {label:'Active',   val:DB.orders.filter(o=>o.status==='active').length,    color:'var(--accent)'},
    {label:'Completed',val:DB.orders.filter(o=>o.status==='completed').length,  color:'var(--accent2)'},
    {label:'Pending',  val:DB.orders.filter(o=>o.status==='pending').length,    color:'var(--warn)'},
  ];
  const total = orderStatus.reduce((s,x)=>s+x.val,0) || 1;

  // SVG donut
  let dash = 0;
  const r = 45, circ = 2*Math.PI*r;
  const segments = orderStatus.map(s => {
    const pct = s.val/total;
    const len = circ*pct;
    const seg = `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${s.color}" stroke-width="14"
      stroke-dasharray="${len} ${circ-len}" stroke-dashoffset="${-dash}"
      transform="rotate(-90 60 60)"/>`;
    dash += len;
    return seg;
  }).join('');

  const recentOrders = DB.orders.slice(0,3);
  const alerts = [];
  DB.fabric.filter(f=>f.stock<f.minStock).forEach(f=>
    alerts.push({icon:'⚠',text:`Low stock: ${f.name} (${fmtN(f.stock)} ${f.unit} left)`,type:'warn'}));
  DB.qc.filter(q=>q.failRate>3).forEach(q=>
    alerts.push({icon:'✗',text:`High fail rate in QC-${q.id}: ${q.failRate}%`,type:'danger'}));

  return `
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Total Orders</div>
      <div class="stat-value">${totalOrders}</div>
      <div class="stat-delta delta-up">↑ 2 this month</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Active Orders</div>
      <div class="stat-value">${activeOrders}</div>
      <div class="stat-delta delta-up">↑ Running</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Value</div>
      <div class="stat-value" style="font-size:22px">${fmt(totalValue)}</div>
      <div class="stat-delta delta-up">↑ 12% vs last quarter</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Buyer Inquiries</div>
      <div class="stat-value">${DB.inquiries.length}</div>
      <div class="stat-delta delta-up">↑ ${DB.inquiries.filter(i=>i.status==='active').length} active</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Low Stock Alerts</div>
      <div class="stat-value" style="color:${lowStock>0?'var(--danger)':'var(--accent3)'}">${lowStock}</div>
      <div class="stat-delta ${lowStock>0?'delta-down':'delta-up'}">${lowStock>0?'Action required':'All clear'}</div>
    </div>
  </div>

  <div class="quick-grid">
    ${[
      {icon:'✉', label:'New Inquiry',   page:'inquiries'},
      {icon:'📋', label:'New Order',     page:'orders'},
      {icon:'⚙',  label:'Production',   page:'production'},
      {icon:'✔',  label:'QC Inspection',page:'qc'},
      {icon:'🚢', label:'Shipment',      page:'shipment'},
      {icon:'📄', label:'Documents',     page:'documents'},
    ].map(q=>`
      <div class="quick-card" onclick="navigate('${q.page}')">
        <div class="quick-icon">${q.icon}</div>
        <div class="quick-label">${q.label}</div>
      </div>`).join('')}
  </div>

  <div class="chart-row">
    <div class="chart-card">
      <div class="chart-card-title">Monthly Export Value (USD)</div>
      <div class="bar-chart">
        ${monthlyData.map(d=>`
          <div class="bar-item">
            <div class="bar" style="height:${Math.round((d.v/maxV)*100)}px;background:var(--accent)" title="${fmt(d.v)}"></div>
            <div class="bar-lbl">${d.m}</div>
          </div>`).join('')}
      </div>
    </div>
    <div class="chart-card">
      <div class="chart-card-title">Order Status</div>
      <div class="donut-wrap">
        <svg viewBox="0 0 120 120">${segments}</svg>
        <div class="donut-center">${totalOrders}</div>
      </div>
      ${orderStatus.map(s=>`
        <div class="legend-item">
          <div class="legend-dot" style="background:${s.color}"></div>
          ${s.label}: <strong>${s.val}</strong>
        </div>`).join('')}
    </div>
  </div>

  ${alerts.length ? `
  <div class="page-section">
    <div class="section-header"><div class="section-title">Alerts</div></div>
    ${alerts.map(a=>`<div class="alert alert-${a.type}">${a.icon} ${a.text}</div>`).join('')}
  </div>` : ''}

  <div class="page-section">
    <div class="section-header">
      <div class="section-title">Recent Orders</div>
      <button class="btn btn-secondary btn-sm" onclick="navigate('orders')">View All</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Order ID</th><th>Buyer</th><th>Product</th><th>Value</th><th>Status</th><th>Progress</th>
        </tr></thead>
        <tbody>
          ${recentOrders.map(o=>`<tr>
            <td class="font-mono text-accent">${o.id}</td>
            <td>${o.buyer}</td>
            <td>${o.product}</td>
            <td>${fmt(o.totalValue)}</td>
            <td>${statusBadge(o.status)}</td>
            <td style="min-width:120px">
              <div class="progress-bar"><div class="progress-fill" style="width:${o.progress}%"></div></div>
              <div style="font-size:11px;color:var(--muted);margin-top:3px">${o.progress}%</div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="page-section">
    <div class="section-header"><div class="section-title">Production Timeline</div></div>
    <div class="chart-card">
      <div class="timeline">
        ${[
          {icon:'📦',bg:'rgba(232,160,39,.2)',  color:'var(--accent)',  title:'Order ORD-002 Cut Phase',  meta:'Gap USA — 30,000 pcs cut'},
          {icon:'⚙', bg:'rgba(61,111,239,.2)',  color:'var(--accent2)', title:'QC Inspection QC-001',    meta:'H&M Sweden — 4,900 passed, 100 rejected'},
          {icon:'✔', bg:'rgba(42,191,135,.2)',  color:'var(--accent3)', title:'Shipment SHP-001 Loaded', meta:'Primark Ireland — MV Endeavour'},
          {icon:'📄',bg:'rgba(155,100,255,.2)', color:'#a97cf5',        title:'Documents ready: ORD-004',meta:'Commercial Invoice, B/L generated'},
        ].map(t=>`
          <div class="tl-item">
            <div class="tl-dot" style="background:${t.bg};color:${t.color}">${t.icon}</div>
            <div class="tl-content">
              <div class="tl-title">${t.title}</div>
              <div class="tl-meta">${t.meta}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
};

/* ══════════════════════════════════════════
   PAGE: BUYER INQUIRIES
══════════════════════════════════════════ */
pages.inquiries = () => `
  <div class="page-section">
    <div class="section-header">
      <div class="section-title">Buyer Inquiries</div>
      <button class="btn btn-primary" onclick="openInquiryForm()">+ New Inquiry</button>
    </div>
    <div class="table-wrap">
      <div class="table-toolbar">
        <input type="text" id="inqSearch" placeholder="Search buyer / product…" oninput="filterInquiries()" />
        <select id="inqStatus" onchange="filterInquiries()">
          <option value="">All Status</option>
          <option>active</option><option>pending</option><option>completed</option><option>rejected</option>
        </select>
        <div class="tbl-actions">
          <span style="font-size:12px;color:var(--muted)" id="inqCount">${DB.inquiries.length} records</span>
        </div>
      </div>
      <table id="inqTable">
        <thead><tr>
          <th>ID</th><th>Buyer</th><th>Country</th><th>Product</th>
          <th>Qty</th><th>Value</th><th>Date</th><th>Status</th><th>Action</th>
        </tr></thead>
        <tbody id="inqBody"></tbody>
      </table>
    </div>
  </div>`;

window.init_inquiries = () => renderInquiries(DB.inquiries);

function renderInquiries(data) {
  $('inqBody').innerHTML = data.length ? data.map(i=>`
    <tr>
      <td class="font-mono text-accent">${i.id}</td>
      <td><strong>${i.buyer}</strong></td>
      <td class="muted">${i.country}</td>
      <td>${i.product}</td>
      <td>${fmtN(i.qty)}</td>
      <td>${fmt(i.value)}</td>
      <td class="muted">${i.date}</td>
      <td>${statusBadge(i.status)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="viewInquiry('${i.id}')">View</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRecord('inquiries','${i.id}','init_inquiries')">Del</button>
      </td>
    </tr>`).join('') : '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--muted)">No records found</td></tr>';
  $('inqCount').textContent = data.length + ' records';
}

window.filterInquiries = () => {
  const q = $('inqSearch').value.toLowerCase();
  const s = $('inqStatus').value;
  renderInquiries(DB.inquiries.filter(i =>
    (!q || i.buyer.toLowerCase().includes(q) || i.product.toLowerCase().includes(q)) &&
    (!s || i.status === s)
  ));
};

window.viewInquiry = id => {
  const i = DB.inquiries.find(x=>x.id===id);
  openModal(`Inquiry — ${i.id}`, `
    <div class="detail-grid">
      <div class="detail-item"><div class="detail-key">Buyer</div><div class="detail-value">${i.buyer}</div></div>
      <div class="detail-item"><div class="detail-key">Country</div><div class="detail-value">${i.country}</div></div>
      <div class="detail-item"><div class="detail-key">Status</div><div class="detail-value">${statusBadge(i.status)}</div></div>
      <div class="detail-item"><div class="detail-key">Product</div><div class="detail-value">${i.product}</div></div>
      <div class="detail-item"><div class="detail-key">Quantity</div><div class="detail-value">${fmtN(i.qty)} pcs</div></div>
      <div class="detail-item"><div class="detail-key">Est. Value</div><div class="detail-value">${fmt(i.value)}</div></div>
      <div class="detail-item"><div class="detail-key">Date</div><div class="detail-value">${i.date}</div></div>
      <div class="detail-item"><div class="detail-key">Contact</div><div class="detail-value" style="font-size:12px">${i.contact}</div></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="convertToOrder('${i.id}')">Convert to Order</button>
    </div>`);
};

window.openInquiryForm = () => {
  openModal('New Buyer Inquiry', `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Buyer Name</label><input class="form-control" id="f_buyer" placeholder="e.g. H&M Sweden"/></div>
      <div class="form-group"><label class="form-label">Country</label><input class="form-control" id="f_country" placeholder="e.g. Germany"/></div>
      <div class="form-group"><label class="form-label">Contact Email</label><input class="form-control" id="f_contact" type="email" placeholder="buyer@email.com"/></div>
      <div class="form-group"><label class="form-label">Product</label><input class="form-control" id="f_product" placeholder="e.g. Men's Polo Shirt"/></div>
      <div class="form-group"><label class="form-label">Quantity (pcs)</label><input class="form-control" id="f_qty" type="number" placeholder="50000"/></div>
      <div class="form-group"><label class="form-label">Est. Value (USD)</label><input class="form-control" id="f_value" type="number" placeholder="100000"/></div>
      <div class="form-group"><label class="form-label">Date</label><input class="form-control" id="f_date" type="date"/></div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="f_status">
          <option>pending</option><option>active</option><option>completed</option><option>rejected</option>
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Save Inquiry</button>
    </div>`,
  () => {
    const rec = {
      id:`INQ-00${nextId.inquiries++}`,
      buyer:$('f_buyer').value||'Unknown',
      country:$('f_country').value||'N/A',
      contact:$('f_contact').value||'',
      product:$('f_product').value||'N/A',
      qty:+$('f_qty').value||0,
      value:+$('f_value').value||0,
      date:$('f_date').value||new Date().toISOString().slice(0,10),
      status:$('f_status').value,
    };
    DB.inquiries.unshift(rec);
    closeModal();
    navigate('inquiries');
    showAlert('Inquiry saved successfully!');
  });
};

window.convertToOrder = id => {
  const i = DB.inquiries.find(x=>x.id===id);
  i.status='completed';
  const ord = {
    id:`ORD-00${nextId.orders++}`,
    inquiryId:i.id, buyer:i.buyer, product:i.product,
    qty:i.qty, unitPrice:+(i.value/i.qty).toFixed(2),
    totalValue:i.value, delivery:'', status:'pending', progress:0
  };
  DB.orders.unshift(ord);
  closeModal();
  navigate('orders');
  showAlert(`Order ${ord.id} created from inquiry ${i.id}!`);
};

window.deleteRecord = (table, id, reinit) => {
  if(!confirm('Delete this record?')) return;
  DB[table] = DB[table].filter(r=>r.id!==id);
  if(reinit && typeof window[reinit]==='function') window[reinit]();
  showAlert('Record deleted.');
};

/* ══════════════════════════════════════════
   PAGE: ORDERS
══════════════════════════════════════════ */
pages.orders = () => `
  <div class="page-section">
    <div class="section-header">
      <div class="section-title">Orders</div>
      <button class="btn btn-primary" onclick="openOrderForm()">+ New Order</button>
    </div>
    <div class="table-wrap">
      <div class="table-toolbar">
        <input type="text" id="ordSearch" placeholder="Search buyer / product…" oninput="filterOrders()" />
        <select id="ordStatus" onchange="filterOrders()">
          <option value="">All Status</option>
          <option>active</option><option>pending</option><option>completed</option>
        </select>
      </div>
      <table>
        <thead><tr>
          <th>Order ID</th><th>Buyer</th><th>Product</th><th>Qty</th>
          <th>Unit $</th><th>Total Value</th><th>Delivery</th><th>Status</th><th>Progress</th><th>Action</th>
        </tr></thead>
        <tbody id="ordBody"></tbody>
      </table>
    </div>
  </div>`;

window.init_orders = () => renderOrders(DB.orders);

function renderOrders(data){
  $('ordBody').innerHTML = data.map(o=>`<tr>
    <td class="font-mono text-accent">${o.id}</td>
    <td><strong>${o.buyer}</strong></td>
    <td>${o.product}</td>
    <td>${fmtN(o.qty)}</td>
    <td>$${o.unitPrice}</td>
    <td>${fmt(o.totalValue)}</td>
    <td class="muted">${o.delivery||'TBD'}</td>
    <td>${statusBadge(o.status)}</td>
    <td style="min-width:100px">
      <div class="progress-bar"><div class="progress-fill" style="width:${o.progress}%"></div></div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">${o.progress}%</div>
    </td>
    <td>
      <button class="btn btn-secondary btn-sm" onclick="viewOrder('${o.id}')">View</button>
      <button class="btn btn-danger btn-sm" onclick="deleteRecord('orders','${o.id}','init_orders')">Del</button>
    </td>
  </tr>`).join('');
}

window.filterOrders = () => {
  const q=$('ordSearch').value.toLowerCase(), s=$('ordStatus').value;
  renderOrders(DB.orders.filter(o=>
    (!q||o.buyer.toLowerCase().includes(q)||o.product.toLowerCase().includes(q))&&(!s||o.status===s)));
};

window.viewOrder = id => {
  const o = DB.orders.find(x=>x.id===id);
  openModal(`Order — ${o.id}`, `
    <div class="detail-grid">
      <div class="detail-item"><div class="detail-key">Buyer</div><div class="detail-value">${o.buyer}</div></div>
      <div class="detail-item"><div class="detail-key">Product</div><div class="detail-value">${o.product}</div></div>
      <div class="detail-item"><div class="detail-key">Status</div><div class="detail-value">${statusBadge(o.status)}</div></div>
      <div class="detail-item"><div class="detail-key">Quantity</div><div class="detail-value">${fmtN(o.qty)} pcs</div></div>
      <div class="detail-item"><div class="detail-key">Unit Price</div><div class="detail-value">$${o.unitPrice}</div></div>
      <div class="detail-item"><div class="detail-key">Total Value</div><div class="detail-value">${fmt(o.totalValue)}</div></div>
      <div class="detail-item"><div class="detail-key">Delivery Date</div><div class="detail-value">${o.delivery||'TBD'}</div></div>
      <div class="detail-item"><div class="detail-key">Progress</div><div class="detail-value">${o.progress}%</div></div>
      <div class="detail-item"><div class="detail-key">Inquiry Ref</div><div class="detail-value">${o.inquiryId||'—'}</div></div>
    </div>
    <div class="mt-16">
      <div class="detail-key" style="margin-bottom:8px">Production Progress</div>
      <div class="progress-bar" style="height:10px"><div class="progress-fill" style="width:${o.progress}%"></div></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="updateProgress('${o.id}')">Update Progress</button>
    </div>`);
};

window.updateProgress = id => {
  const p = prompt('Enter progress % (0-100):');
  if(p===null) return;
  const o = DB.orders.find(x=>x.id===id);
  o.progress = Math.min(100, Math.max(0, +p));
  if(o.progress===100) o.status='completed';
  closeModal();
  navigate('orders');
  showAlert('Progress updated!');
};

window.openOrderForm = () => {
  openModal('New Order', `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Buyer</label><input class="form-control" id="of_buyer" placeholder="Buyer name"/></div>
      <div class="form-group"><label class="form-label">Product</label><input class="form-control" id="of_product" placeholder="Product name"/></div>
      <div class="form-group"><label class="form-label">Quantity (pcs)</label><input class="form-control" id="of_qty" type="number" /></div>
      <div class="form-group"><label class="form-label">Unit Price (USD)</label><input class="form-control" id="of_price" type="number" step="0.01"/></div>
      <div class="form-group"><label class="form-label">Delivery Date</label><input class="form-control" id="of_delivery" type="date"/></div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="of_status"><option>pending</option><option>active</option></select></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Create Order</button>
    </div>`,
  () => {
    const qty=+$('of_qty').value||0, price=+$('of_price').value||0;
    DB.orders.unshift({
      id:`ORD-00${nextId.orders++}`,inquiryId:'',
      buyer:$('of_buyer').value||'Unknown',
      product:$('of_product').value||'N/A',
      qty, unitPrice:price, totalValue:qty*price,
      delivery:$('of_delivery').value||'',
      status:$('of_status').value, progress:0
    });
    closeModal(); navigate('orders'); showAlert('Order created!');
  });
};

/* ══════════════════════════════════════════
   PAGE: PRODUCTION
══════════════════════════════════════════ */
pages.production = () => `
  <div class="page-section">
    <div class="section-header">
      <div class="section-title">Production Planning</div>
      <button class="btn btn-primary" onclick="openProductionForm()">+ New Production</button>
    </div>
    ${DB.production.map(p => {
      const cutPct = Math.round((p.cut/p.totalQty)*100);
      const sewPct = Math.round((p.sewing/p.totalQty)*100);
      const finPct = Math.round((p.finishing/p.totalQty)*100);
      const qcPct  = Math.round((p.qcPassed/p.totalQty)*100);
      return `
      <div class="chart-card mb-16" style="margin-bottom:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div>
            <div style="font-weight:600;font-size:14px">${p.id} — ${p.product}</div>
            <div style="color:var(--muted);font-size:12px">${p.buyer} &nbsp;|&nbsp; ${fmtN(p.totalQty)} pcs</div>
          </div>
          ${statusBadge(p.status)}
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
          ${[
            {label:'Cutting',   val:p.cut,       pct:cutPct, color:'var(--accent)'},
            {label:'Sewing',    val:p.sewing,     pct:sewPct, color:'var(--accent2)'},
            {label:'Finishing', val:p.finishing,  pct:finPct, color:'var(--warn)'},
            {label:'QC Passed', val:p.qcPassed,   pct:qcPct,  color:'var(--accent3)'},
          ].map(s=>`
            <div>
              <div style="font-size:11px;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.8px">${s.label}</div>
              <div style="font-size:16px;font-weight:600;color:${s.color}">${fmtN(s.val)}</div>
              <div class="progress-bar mt-8"><div class="progress-fill" style="width:${s.pct}%;background:${s.color}"></div></div>
              <div style="font-size:11px;color:var(--muted);margin-top:3px">${s.pct}%</div>
            </div>`).join('')}
        </div>
        <div style="margin-top:14px;display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" onclick="updateProduction('${p.id}')">Update</button>
          <button class="btn btn-danger btn-sm" onclick="deleteRecord('production','${p.id}','init_production')">Delete</button>
        </div>
      </div>`;
    }).join('')}
  </div>`;

window.init_production = () => {};

window.updateProduction = id => {
  const p = DB.production.find(x=>x.id===id);
  openModal(`Update Production — ${p.id}`, `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Cutting</label><input class="form-control" id="up_cut" type="number" value="${p.cut}"/></div>
      <div class="form-group"><label class="form-label">Sewing</label><input class="form-control" id="up_sew" type="number" value="${p.sewing}"/></div>
      <div class="form-group"><label class="form-label">Finishing</label><input class="form-control" id="up_fin" type="number" value="${p.finishing}"/></div>
      <div class="form-group"><label class="form-label">QC Passed</label><input class="form-control" id="up_qc" type="number" value="${p.qcPassed}"/></div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="up_status">
          <option ${p.status==='pending'?'selected':''}>pending</option>
          <option ${p.status==='active'?'selected':''}>active</option>
          <option ${p.status==='completed'?'selected':''}>completed</option>
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Update</button>
    </div>`,
  () => {
    p.cut=$('up_cut').value|0; p.sewing=$('up_sew').value|0;
    p.finishing=$('up_fin').value|0; p.qcPassed=$('up_qc').value|0;
    p.status=$('up_status').value;
    closeModal(); navigate('production'); showAlert('Production updated!');
  });
};

window.openProductionForm = () => {
  openModal('New Production Entry', `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Order ID</label>
        <select class="form-control" id="pf_order">
          ${DB.orders.filter(o=>o.status!=='completed').map(o=>`<option value="${o.id}">${o.id} — ${o.buyer}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Total Qty</label><input class="form-control" id="pf_qty" type="number"/></div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="pf_status"><option>pending</option><option>active</option></select></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Create</button>
    </div>`,
  () => {
    const ordId=$('pf_order').value;
    const ord=DB.orders.find(o=>o.id===ordId);
    DB.production.unshift({
      id:`PROD-00${nextId.production++}`, orderId:ordId,
      product:ord?.product||'', buyer:ord?.buyer||'',
      totalQty:+$('pf_qty').value||0, cut:0, sewing:0, finishing:0, qcPassed:0,
      status:$('pf_status').value
    });
    closeModal(); navigate('production'); showAlert('Production entry created!');
  });
};

/* ══════════════════════════════════════════
   PAGE: FABRIC
══════════════════════════════════════════ */
pages.fabric = () => `
  <div class="page-section">
    <div class="section-header">
      <div class="section-title">Fabric & Materials</div>
      <button class="btn btn-primary" onclick="openFabricForm()">+ Add Fabric</button>
    </div>
    ${DB.fabric.filter(f=>f.stock<f.minStock).length ? `
      <div class="alert alert-warn">⚠ ${DB.fabric.filter(f=>f.stock<f.minStock).length} fabric(s) below minimum stock level. Please reorder.</div>` : ''}
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>ID</th><th>Name</th><th>Type</th><th>Composition</th><th>GSM</th>
          <th>Stock</th><th>Min Stock</th><th>Cost/kg</th><th>Supplier</th><th>Status</th><th>Action</th>
        </tr></thead>
        <tbody>
          ${DB.fabric.map(f=>{
            const low = f.stock < f.minStock;
            return `<tr>
              <td class="font-mono text-accent">${f.id}</td>
              <td><strong>${f.name}</strong></td>
              <td class="muted">${f.type}</td>
              <td class="muted">${f.composition}</td>
              <td>${f.gsm}</td>
              <td style="color:${low?'var(--danger)':'var(--text)'};font-weight:${low?600:400}">${fmtN(f.stock)} ${f.unit}</td>
              <td class="muted">${fmtN(f.minStock)}</td>
              <td>$${f.cost}</td>
              <td class="muted">${f.supplier}</td>
              <td>${low ? statusBadge('rejected') : statusBadge('active')}</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editFabric('${f.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRecord('fabric','${f.id}','init_fabric')">Del</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

window.init_fabric = () => {};

window.editFabric = id => {
  const f=DB.fabric.find(x=>x.id===id);
  openModal(`Edit Fabric — ${f.id}`, `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Name</label><input class="form-control" id="ff_name" value="${f.name}"/></div>
      <div class="form-group"><label class="form-label">Stock (${f.unit})</label><input class="form-control" id="ff_stock" type="number" value="${f.stock}"/></div>
      <div class="form-group"><label class="form-label">Min Stock</label><input class="form-control" id="ff_min" type="number" value="${f.minStock}"/></div>
      <div class="form-group"><label class="form-label">Cost per kg</label><input class="form-control" id="ff_cost" type="number" step="0.01" value="${f.cost}"/></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Save</button>
    </div>`,
  () => {
    f.name=$('ff_name').value; f.stock=+$('ff_stock').value;
    f.minStock=+$('ff_min').value; f.cost=+$('ff_cost').value;
    closeModal(); navigate('fabric'); showAlert('Fabric updated!');
  });
};

window.openFabricForm = () => {
  openModal('Add Fabric / Material', `
    <div class="form-grid">
      <div class="form-group full"><label class="form-label">Name</label><input class="form-control" id="nf_name" placeholder="e.g. 100% Cotton Pique"/></div>
      <div class="form-group"><label class="form-label">Type</label><input class="form-control" id="nf_type" placeholder="Pique / Denim / Fleece…"/></div>
      <div class="form-group"><label class="form-label">Composition</label><input class="form-control" id="nf_comp" placeholder="100% Cotton"/></div>
      <div class="form-group"><label class="form-label">GSM</label><input class="form-control" id="nf_gsm" type="number"/></div>
      <div class="form-group"><label class="form-label">Color</label><input class="form-control" id="nf_color" placeholder="White / Navy…"/></div>
      <div class="form-group"><label class="form-label">Stock (kg)</label><input class="form-control" id="nf_stock" type="number"/></div>
      <div class="form-group"><label class="form-label">Min Stock</label><input class="form-control" id="nf_min" type="number"/></div>
      <div class="form-group"><label class="form-label">Cost per kg ($)</label><input class="form-control" id="nf_cost" type="number" step="0.01"/></div>
      <div class="form-group"><label class="form-label">Supplier</label><input class="form-control" id="nf_sup" placeholder="Supplier name"/></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Add Fabric</button>
    </div>`,
  () => {
    DB.fabric.unshift({
      id:`FAB-00${nextId.fabric++}`,
      name:$('nf_name').value||'N/A', type:$('nf_type').value||'',
      composition:$('nf_comp').value||'', color:$('nf_color').value||'',
      gsm:+$('nf_gsm').value||0, stock:+$('nf_stock').value||0,
      unit:'kg', minStock:+$('nf_min').value||0,
      cost:+$('nf_cost').value||0, supplier:$('nf_sup').value||''
    });
    closeModal(); navigate('fabric'); showAlert('Fabric added!');
  });
};

/* ══════════════════════════════════════════
   PAGE: SUPPLIERS
══════════════════════════════════════════ */
pages.suppliers = () => `
  <div class="page-section">
    <div class="section-header">
      <div class="section-title">Suppliers</div>
      <button class="btn btn-primary" onclick="openSupplierForm()">+ Add Supplier</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Supplier</th><th>Type</th><th>Country</th><th>Contact</th><th>Phone</th><th>Rating</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${DB.suppliers.map(s=>`<tr>
            <td class="font-mono text-accent">${s.id}</td>
            <td><strong>${s.name}</strong></td>
            <td class="muted">${s.type}</td>
            <td class="muted">${s.country}</td>
            <td class="muted" style="font-size:12px">${s.contact}</td>
            <td class="muted">${s.phone}</td>
            <td><span style="color:var(--accent);font-weight:600">★ ${s.rating}</span></td>
            <td>${statusBadge(s.status)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteRecord('suppliers','${s.id}','init_suppliers')">Del</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

window.init_suppliers = () => {};

window.openSupplierForm = () => {
  openModal('Add Supplier', `
    <div class="form-grid">
      <div class="form-group full"><label class="form-label">Supplier Name</label><input class="form-control" id="sf_name"/></div>
      <div class="form-group"><label class="form-label">Type</label>
        <select class="form-control" id="sf_type"><option>Fabric</option><option>Accessory</option><option>Packaging</option></select></div>
      <div class="form-group"><label class="form-label">Country</label><input class="form-control" id="sf_country"/></div>
      <div class="form-group"><label class="form-label">Contact Email</label><input class="form-control" id="sf_contact" type="email"/></div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-control" id="sf_phone"/></div>
      <div class="form-group"><label class="form-label">Rating (1-5)</label><input class="form-control" id="sf_rating" type="number" min="1" max="5" step="0.1"/></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Add Supplier</button>
    </div>`,
  () => {
    DB.suppliers.unshift({
      id:`SUP-00${nextId.suppliers++}`,
      name:$('sf_name').value||'N/A', type:$('sf_type').value,
      country:$('sf_country').value||'', contact:$('sf_contact').value||'',
      phone:$('sf_phone').value||'', rating:+$('sf_rating').value||4.0, status:'pending'
    });
    closeModal(); navigate('suppliers'); showAlert('Supplier added!');
  });
};

/* ══════════════════════════════════════════
   PAGE: QC
══════════════════════════════════════════ */
pages.qc = () => `
  <div class="page-section">
    <div class="section-header">
      <div class="section-title">Quality Control</div>
      <button class="btn btn-primary" onclick="openQcForm()">+ New Inspection</button>
    </div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-label">Total Inspected</div>
        <div class="stat-value">${fmtN(DB.qc.reduce((s,q)=>s+q.inspQty,0))}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Passed</div>
        <div class="stat-value" style="color:var(--accent3)">${fmtN(DB.qc.reduce((s,q)=>s+q.passed,0))}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Fail Rate</div>
        <div class="stat-value" style="color:var(--danger)">${(DB.qc.reduce((s,q)=>s+q.failRate,0)/DB.qc.length).toFixed(1)}%</div>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>QC ID</th><th>Order</th><th>Product</th><th>Buyer</th><th>Inspected</th><th>Passed</th><th>Failed</th><th>Fail %</th><th>Inspector</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${DB.qc.map(q=>`<tr>
            <td class="font-mono text-accent">${q.id}</td>
            <td class="muted">${q.orderId}</td>
            <td>${q.product}</td>
            <td>${q.buyer}</td>
            <td>${fmtN(q.inspQty)}</td>
            <td style="color:var(--accent3)">${fmtN(q.passed)}</td>
            <td style="color:var(--danger)">${fmtN(q.failed)}</td>
            <td style="color:${q.failRate>3?'var(--danger)':'var(--text)'};font-weight:${q.failRate>3?600:400}">${q.failRate}%</td>
            <td class="muted">${q.inspector}</td>
            <td class="muted">${q.date}</td>
            <td>${statusBadge(q.status)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteRecord('qc','${q.id}','init_qc')">Del</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

window.init_qc = () => {};

window.openQcForm = () => {
  openModal('New QC Inspection', `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Order</label>
        <select class="form-control" id="qf_order">
          ${DB.orders.map(o=>`<option value="${o.id}">${o.id} — ${o.buyer}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Inspector Name</label><input class="form-control" id="qf_insp" placeholder="Inspector name"/></div>
      <div class="form-group"><label class="form-label">Inspected Qty</label><input class="form-control" id="qf_insp_qty" type="number"/></div>
      <div class="form-group"><label class="form-label">Passed Qty</label><input class="form-control" id="qf_pass" type="number"/></div>
      <div class="form-group"><label class="form-label">Date</label><input class="form-control" id="qf_date" type="date"/></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Save Inspection</button>
    </div>`,
  () => {
    const ordId=$('qf_order').value;
    const ord=DB.orders.find(o=>o.id===ordId);
    const insp=+$('qf_insp_qty').value||0, pass=+$('qf_pass').value||0;
    const fail=insp-pass, rate=insp?+((fail/insp)*100).toFixed(1):0;
    DB.qc.unshift({
      id:`QC-00${nextId.qc++}`, orderId:ordId,
      product:ord?.product||'', buyer:ord?.buyer||'',
      inspQty:insp, passed:pass, failed:fail, failRate:rate,
      date:$('qf_date').value||new Date().toISOString().slice(0,10),
      inspector:$('qf_insp').value||'', status:'active'
    });
    closeModal(); navigate('qc'); showAlert('QC inspection saved!');
  });
};

/* ══════════════════════════════════════════
   PAGE: SHIPMENT
══════════════════════════════════════════ */
pages.shipment = () => `
  <div class="page-section">
    <div class="section-header">
      <div class="section-title">Shipment Management</div>
      <button class="btn btn-primary" onclick="openShipmentForm()">+ New Shipment</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>SHP ID</th><th>Order</th><th>Buyer</th><th>Product</th><th>Qty</th><th>Vessel</th><th>Port</th><th>Destination</th><th>ETD</th><th>ETA</th><th>B/L No</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${DB.shipments.map(s=>`<tr>
            <td class="font-mono text-accent">${s.id}</td>
            <td class="muted">${s.orderId}</td>
            <td>${s.buyer}</td>
            <td>${s.product}</td>
            <td>${fmtN(s.qty)}</td>
            <td class="muted">${s.vessel}</td>
            <td class="muted">${s.port}</td>
            <td>${s.destination}</td>
            <td class="muted">${s.etd}</td>
            <td class="muted">${s.eta}</td>
            <td class="font-mono" style="color:var(--accent2)">${s.bl||'—'}</td>
            <td>${statusBadge(s.status)}</td>
            <td><button class="btn btn-secondary btn-sm" onclick="viewShipment('${s.id}')">View</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRecord('shipments','${s.id}','init_shipment')">Del</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

window.init_shipment = () => {};

window.viewShipment = id => {
  const s=DB.shipments.find(x=>x.id===id);
  openModal(`Shipment — ${s.id}`, `
    <div class="detail-grid">
      <div class="detail-item"><div class="detail-key">Buyer</div><div class="detail-value">${s.buyer}</div></div>
      <div class="detail-item"><div class="detail-key">Product</div><div class="detail-value">${s.product}</div></div>
      <div class="detail-item"><div class="detail-key">Quantity</div><div class="detail-value">${fmtN(s.qty)} pcs</div></div>
      <div class="detail-item"><div class="detail-key">Vessel</div><div class="detail-value">${s.vessel}</div></div>
      <div class="detail-item"><div class="detail-key">Voyage</div><div class="detail-value">${s.voyage}</div></div>
      <div class="detail-item"><div class="detail-key">Port of Loading</div><div class="detail-value">${s.port}</div></div>
      <div class="detail-item"><div class="detail-key">Destination</div><div class="detail-value">${s.destination}</div></div>
      <div class="detail-item"><div class="detail-key">ETD</div><div class="detail-value">${s.etd}</div></div>
      <div class="detail-item"><div class="detail-key">ETA</div><div class="detail-value">${s.eta}</div></div>
      <div class="detail-item"><div class="detail-key">B/L Number</div><div class="detail-value">${s.bl||'Pending'}</div></div>
      <div class="detail-item"><div class="detail-key">Status</div><div class="detail-value">${statusBadge(s.status)}</div></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="generateDocument('${s.orderId}')">Generate Documents</button>
    </div>`);
};

window.generateDocument = ordId => {
  closeModal();
  navigate('documents');
  showAlert('Document generation panel opened for ' + ordId, 'success');
};

window.openShipmentForm = () => {
  openModal('New Shipment', `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Order</label>
        <select class="form-control" id="shf_order">
          ${DB.orders.map(o=>`<option value="${o.id}">${o.id} — ${o.buyer}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Quantity</label><input class="form-control" id="shf_qty" type="number"/></div>
      <div class="form-group"><label class="form-label">Vessel Name</label><input class="form-control" id="shf_vessel" placeholder="MV …"/></div>
      <div class="form-group"><label class="form-label">Voyage No</label><input class="form-control" id="shf_voyage"/></div>
      <div class="form-group"><label class="form-label">Port of Loading</label><input class="form-control" id="shf_port" placeholder="Chittagong"/></div>
      <div class="form-group"><label class="form-label">Destination Port</label><input class="form-control" id="shf_dest"/></div>
      <div class="form-group"><label class="form-label">ETD</label><input class="form-control" id="shf_etd" type="date"/></div>
      <div class="form-group"><label class="form-label">ETA</label><input class="form-control" id="shf_eta" type="date"/></div>
      <div class="form-group"><label class="form-label">B/L Number (optional)</label><input class="form-control" id="shf_bl"/></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Create Shipment</button>
    </div>`,
  () => {
    const ordId=$('shf_order').value;
    const ord=DB.orders.find(o=>o.id===ordId);
    DB.shipments.unshift({
      id:`SHP-00${nextId.shipments++}`, orderId:ordId,
      buyer:ord?.buyer||'', product:ord?.product||'',
      qty:+$('shf_qty').value||0, vessel:$('shf_vessel').value||'',
      voyage:$('shf_voyage').value||'', port:$('shf_port').value||'Chittagong',
      destination:$('shf_dest').value||'', etd:$('shf_etd').value||'',
      eta:$('shf_eta').value||'', status:'pending', bl:$('shf_bl').value||''
    });
    closeModal(); navigate('shipment'); showAlert('Shipment created!');
  });
};

/* ══════════════════════════════════════════
   PAGE: DOCUMENTS
══════════════════════════════════════════ */
pages.documents = () => `
  <div class="page-section">
    <div class="section-header">
      <div class="section-title">Export Documentation</div>
      <button class="btn btn-primary" onclick="openDocForm()">+ New Document</button>
    </div>
    <div class="alert alert-info">📄 Documents include Commercial Invoice, Packing List, Bill of Lading, Certificate of Origin, GSP Form-A, and more.</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Doc ID</th><th>Type</th><th>Order Ref</th><th>Buyer</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${DB.documents.map(d=>`<tr>
            <td class="font-mono text-accent">${d.id}</td>
            <td><strong>${d.type}</strong></td>
            <td class="muted">${d.orderId}</td>
            <td>${d.buyer}</td>
            <td class="muted">${d.date||'Pending'}</td>
            <td>${d.amount ? fmt(d.amount) + ' ' + d.currency : '—'}</td>
            <td>${statusBadge(d.status)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="previewDoc('${d.id}')">Preview</button>
              <button class="btn btn-danger btn-sm" onclick="deleteRecord('documents','${d.id}','init_documents')">Del</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

window.init_documents = () => {};

window.previewDoc = id => {
  const d=DB.documents.find(x=>x.id===id);
  const ord=DB.orders.find(o=>o.id===d.orderId)||{buyer:'',product:'',qty:0,totalValue:0,delivery:''};
  openModal(`Preview — ${d.type}`, `
    <div style="background:var(--bg3);border-radius:10px;padding:20px;font-size:13px;line-height:1.8">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-family:var(--font-d);font-size:18px;color:var(--accent)">ABC Garments Ltd.</div>
        <div style="font-size:11px;color:var(--muted)">BGMEA Member | Export-Oriented RMG</div>
        <div style="font-size:14px;font-weight:600;margin-top:10px;text-transform:uppercase;letter-spacing:1px">${d.type}</div>
        <div style="color:var(--muted);font-size:12px">Doc No: ${d.id} | Date: ${d.date||new Date().toLocaleDateString()}</div>
      </div>
      <hr style="border-color:var(--border);margin:12px 0"/>
      <div class="detail-grid">
        <div class="detail-item"><div class="detail-key">Buyer</div><div class="detail-value">${d.buyer}</div></div>
        <div class="detail-item"><div class="detail-key">Order Ref</div><div class="detail-value">${d.orderId}</div></div>
        <div class="detail-item"><div class="detail-key">Product</div><div class="detail-value">${ord.product}</div></div>
        <div class="detail-item"><div class="detail-key">Quantity</div><div class="detail-value">${fmtN(ord.qty)} pcs</div></div>
        ${d.amount ? `<div class="detail-item"><div class="detail-key">Amount</div><div class="detail-value">${fmt(d.amount)} ${d.currency}</div></div>` : ''}
        <div class="detail-item"><div class="detail-key">Delivery</div><div class="detail-value">${ord.delivery||'TBD'}</div></div>
      </div>
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border);font-size:11px;color:var(--muted);text-align:center">
        ✓ Document generated by GMS — Garment Management System
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="alert('PDF export would be implemented with server-side lib.')">Export PDF</button>
    </div>`);
};

window.openDocForm = () => {
  openModal('New Document', `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Document Type</label>
        <select class="form-control" id="df_type">
          <option>Commercial Invoice</option><option>Packing List</option>
          <option>Bill of Lading</option><option>Certificate of Origin</option>
          <option>GSP Form-A</option><option>Inspection Certificate</option>
          <option>Insurance Certificate</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Order Reference</label>
        <select class="form-control" id="df_order">
          ${DB.orders.map(o=>`<option value="${o.id}">${o.id} — ${o.buyer}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Date</label><input class="form-control" id="df_date" type="date"/></div>
      <div class="form-group"><label class="form-label">Amount (if applicable)</label><input class="form-control" id="df_amount" type="number" placeholder="0"/></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-save">Create Document</button>
    </div>`,
  () => {
    const ordId=$('df_order').value;
    const ord=DB.orders.find(o=>o.id===ordId);
    DB.documents.unshift({
      id:`DOC-00${nextId.documents++}`,
      type:$('df_type').value, orderId:ordId,
      buyer:ord?.buyer||'', date:$('df_date').value||'',
      amount:+$('df_amount').value||0, currency:'USD', status:'draft'
    });
    closeModal(); navigate('documents'); showAlert('Document created!');
  });
};

/* ══════════════════════════════════════════
   PAGE: REPORTS
══════════════════════════════════════════ */
pages.reports = () => {
  const totalExport = DB.orders.reduce((s,o)=>s+o.totalValue,0);
  const byBuyer = {};
  DB.orders.forEach(o=>{ byBuyer[o.buyer]=(byBuyer[o.buyer]||0)+o.totalValue; });
  const buyerList = Object.entries(byBuyer).sort((a,b)=>b[1]-a[1]);
  const maxB = buyerList[0]?.[1] || 1;

  const qcAvgFail = DB.qc.length ? (DB.qc.reduce((s,q)=>s+q.failRate,0)/DB.qc.length).toFixed(1) : 0;
  const fabricVal = DB.fabric.reduce((s,f)=>s+(f.stock*f.cost),0);

  return `
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-label">Total Export Value</div><div class="stat-value" style="font-size:20px">${fmt(totalExport)}</div></div>
    <div class="stat-card"><div class="stat-label">Active Orders</div><div class="stat-value">${DB.orders.filter(o=>o.status==='active').length}</div></div>
    <div class="stat-card"><div class="stat-label">Avg QC Fail Rate</div><div class="stat-value" style="color:var(--danger)">${qcAvgFail}%</div></div>
    <div class="stat-card"><div class="stat-label">Fabric Inventory Value</div><div class="stat-value" style="font-size:18px">${fmt(fabricVal)}</div></div>
  </div>

  <div class="chart-row">
    <div class="chart-card">
      <div class="chart-card-title">Export Value by Buyer</div>
      ${buyerList.map(([buyer,val])=>`
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
            <span>${buyer}</span><span style="color:var(--accent)">${fmt(val)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${Math.round((val/maxB)*100)}%"></div></div>
        </div>`).join('')}
    </div>
    <div class="chart-card">
      <div class="chart-card-title">QC Summary</div>
      ${DB.qc.map(q=>`
        <div style="margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border)">
          <div style="font-size:12px;font-weight:500">${q.id} — ${q.product}</div>
          <div style="font-size:11px;color:var(--muted);margin:3px 0">${q.buyer}</div>
          <div style="display:flex;gap:12px;font-size:12px;margin-top:5px">
            <span style="color:var(--accent3)">✓ ${fmtN(q.passed)}</span>
            <span style="color:var(--danger)">✗ ${fmtN(q.failed)}</span>
            <span style="color:${q.failRate>3?'var(--danger)':'var(--muted)'}">Fail: ${q.failRate}%</span>
          </div>
        </div>`).join('')}
    </div>
  </div>

  <div class="page-section">
    <div class="section-header"><div class="section-title">Fabric Stock Status</div></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Fabric</th><th>Stock</th><th>Min</th><th>Value</th><th>Status</th></tr></thead>
        <tbody>
          ${DB.fabric.map(f=>`<tr>
            <td><strong>${f.name}</strong></td>
            <td>${fmtN(f.stock)} ${f.unit}</td>
            <td>${fmtN(f.minStock)}</td>
            <td>${fmt(f.stock*f.cost)}</td>
            <td>${f.stock<f.minStock?statusBadge('rejected'):statusBadge('active')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
};

window.init_reports = () => {};

/* ── GLOBAL SEARCH ── */
document.getElementById('globalSearch').addEventListener('input', e => {
  const q = e.target.value.trim();
  if(!q) return;
  const found = DB.orders.filter(o=>o.buyer.toLowerCase().includes(q.toLowerCase()));
  if(found.length) { navigate('orders'); setTimeout(()=>{ $('ordSearch').value=q; filterOrders(); },100); }
});

/* ── BOOT ── */
navigate('dashboard');
