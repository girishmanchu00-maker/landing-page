/* SUPABASE CONFIGURATION (Enter your project details to enable database saving) */
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* APPLICATION STATE */
let calMonth = 4; // May (0-indexed: 4)
let calYear = 2026;
let activeFilter = 'all';
let currentTheme = 'light';

// Raw Compliance deadlines database
const calData = [
  { date: '05', form: 'GSTR-3B', desc: 'GST monthly return for April supplies', cat: 'gst', catLabel: 'GST' },
  { date: '07', form: 'TDS Payment', desc: 'Deposit of TDS/TCS for April filings', cat: 'tds', catLabel: 'TDS' },
  { date: '10', form: 'GSTR-7', desc: 'TDS return under GST regulations', cat: 'gst', catLabel: 'GST' },
  { date: '11', form: 'GSTR-1', desc: 'Outward supplies statement (GSTR-1)', cat: 'gst', catLabel: 'GST' },
  { date: '13', form: 'GSTR-6', desc: 'Input Service Distributor (ISD) return', cat: 'gst', catLabel: 'GST' },
  { date: '15', form: 'PF/ESI Deposit', desc: 'Provident Fund & ESI payments for April', cat: 'pf', catLabel: 'PF/ESI' },
  { date: '15', form: 'Form 24G', desc: 'Government office TDS book entry summary', cat: 'tds', catLabel: 'TDS' },
  { date: '20', form: 'GSTR-5', desc: 'Non-resident foreign taxpayer return filing', cat: 'gst', catLabel: 'GST' },
  { date: '25', form: 'GST PMT-06', desc: 'Challan payment for QRMP quarterly taxpayers', cat: 'gst', catLabel: 'GST' },
  { date: '30', form: 'Form 26QB', desc: 'Challan-cum-statement of TDS on property sale', cat: 'tds', catLabel: 'TDS' },
  { date: '31', form: 'ITR-1 / ITR-4', desc: 'IT Return filing baseline for individuals', cat: 'it', catLabel: 'Income Tax' },
  { date: '31', form: 'Form 26Q', desc: 'Quarterly TDS return statement for Q4 FY 2025-26', cat: 'tds', catLabel: 'TDS' },
  { date: '31', form: 'AOC-4', desc: 'Company annual accounts financial filing with MCA', cat: 'mca', catLabel: 'MCA' },
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// GST Database items
const gstItems = [
  { hsn: '8471', desc: 'Laptops, personal computers, and computing units', rate: 18, cat: 'Electronics' },
  { hsn: '8517', desc: 'Mobile phones and telephone transmitters', rate: 12, cat: 'Electronics' },
  { hsn: '2517', desc: 'Portland cement, aluminous cement, and slag cement', rate: 28, cat: 'Construction' },
  { hsn: '0402', desc: 'Milk, cream, curd, and fresh dairy products', rate: 0, cat: 'Food & Dairy' },
  { hsn: '1001', desc: 'Wheat, meslin, rye, and standard wheat flour', rate: 0, cat: 'Agriculture' },
  { hsn: '2402', desc: 'Cigarettes, cigars, and manufactured tobacco products', rate: 28, cat: 'Tobacco' },
  { hsn: '8703', desc: 'Passenger motor vehicles and hybrid cars', rate: 28, cat: 'Automobiles' },
  { hsn: '8704', desc: 'Commercial motor vehicles and goods transports', rate: 18, cat: 'Automobiles' },
  { hsn: '9983', desc: 'Legal advisory, audit, and tax consulting services', rate: 18, cat: 'Professional Services' },
  { hsn: '9985', desc: 'IT consulting, database, and software support services', rate: 18, cat: 'Professional Services' },
  { hsn: '9954', desc: 'Contract construction, civil engineer services', rate: 12, cat: 'Professional Services' },
  { hsn: '0801', desc: 'Coconuts, cashew nuts, and almond kernels', rate: 5, cat: 'Food & Dairy' },
  { hsn: '3004', desc: 'Medicines, formulations, and pharmaceutical pills', rate: 12, cat: 'Healthcare' },
  { hsn: '3005', desc: 'Surgical bandages, adhesive medical tape, and devices', rate: 12, cat: 'Healthcare' },
  { hsn: '6101', desc: 'Readymade overcoats, jackets, and apparel items', rate: 12, cat: 'Apparel' },
  { hsn: '6109', desc: 'Cotton knitted T-shirts and undergarments', rate: 5, cat: 'Apparel' },
  { hsn: '2710', desc: 'Petroleum crude oil, motor spirit, and diesel fuel', rate: 0, cat: 'Fuel' },
  { hsn: '2711', desc: 'LPG liquefied petroleum gas for households', rate: 5, cat: 'Fuel' },
  { hsn: '8501', desc: 'Electric generators, dynamos, and solar motors', rate: 18, cat: 'Electronics' },
  { hsn: '8507', desc: 'Lithium-ion batteries and EV battery accumulator packs', rate: 5, cat: 'Electronics' }
];

// Document checklists
const checklists = [
  {
    title: 'Individual ITR-1 Filing',
    icon: '📄',
    items: [
      'Form 16 from all employers for the financial year',
      'Bank interest certificate & savings ledger statement',
      'Investment receipts under Section 80C (PPF, LIC, ELSS)',
      'Home loan interest certificate (Form 12BB)',
      'Aadhaar card & PAN card linkage confirmation',
      'Form 26AS & Annual Information Statement (AIS) review'
    ]
  },
  {
    title: 'GST Registration Process',
    icon: '🏢',
    items: [
      'PAN card copy of the business entity or proprietor',
      'Aadhaar card of primary partners or proprietor',
      'Registered office lease agreement or property tax receipt',
      'Cancelled cheque or bank statement with IFSC code',
      'Digital Signature Certificate (DSC) / EVC authorization',
      'NOC from property owner (if rented office premises)'
    ]
  },
  {
    title: 'Private Limited Setup',
    icon: '🏛️',
    items: [
      'PAN & Aadhaar of all proposed directors',
      'Proof of identity (Voter ID, Passport, or Driving License)',
      'Electricity bill or gas utility bill of registered office address',
      'Draft Memorandum (MOA) and Articles of Association (AOA)',
      'DSC (Digital Signature Certificate) for directors',
      'DIR-2 consent form & declaration of non-acceptance of deposits'
    ]
  },
  {
    title: 'Statutory Corporate Audit',
    icon: '📋',
    items: [
      'Final Trial Balance & general ledger accounts dump',
      'Bank Reconciliation Statement (BRS) for all bank entries',
      'Fixed Asset Register (FAR) detailing year depreciation rates',
      'Form 3CD tax audit particulars compilation draft',
      'Board meeting minutes approving draft financial statement schedules',
      'Creditors & Debtors balance confirmation certificates'
    ]
  }
];

// Due date tracker list
const trackerItems = [
  { title: 'GSTR-3B Return Filing', form: 'GST', dueDate: new Date(2026, 4, 20) },
  { title: 'TDS Deposit Payment', form: 'TDS', dueDate: new Date(2026, 5, 7) },
  { title: 'GSTR-1 Outward Supplies', form: 'GST', dueDate: new Date(2026, 4, 11) },
  { title: 'ITR Filing Deadline', form: 'Income Tax', dueDate: new Date(2026, 6, 31) },
  { title: 'Advance Tax Instalment Q1', form: 'Income Tax', dueDate: new Date(2026, 5, 15) },
  { title: 'PF & ESI Monthly Deposit', form: 'PF/ESI', dueDate: new Date(2026, 4, 15) },
  { title: 'Form 26Q TDS Filing', form: 'TDS', dueDate: new Date(2026, 4, 31) },
  { title: 'AOC-4 Corporate Filing', form: 'MCA', dueDate: new Date(2026, 4, 31) }
];


/* ON LOAD INITIALIZATION */
document.addEventListener('DOMContentLoaded', () => {
  // Setup standard routing
  initRouter();
  
  // Theme management initial setup
  initTheme();

  // Render modules
  renderCal();
  renderTracker();
  renderChecklists();
  renderGST(gstItems);

  // Compute default tax calculations
  calcIT();
  calcHRA();
  calcAdv();
  calcTDS();

  // Initialize mobile menu triggers
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // Bind key escape for menus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menu = document.getElementById('mobile-menu');
      if (menu && menu.classList.contains('active')) {
        toggleMobileMenu();
      }
    }
  });

  // Render icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});


/* SINGLE PAGE ROUTER */
function initRouter() {
  const hash = window.location.hash.replace('#', '');
  const validPages = ['home', 'calendar', 'calculator', 'tracker', 'checklist', 'gst', 'budget', 'contact'];
  if (hash && validPages.includes(hash)) {
    showPage(hash);
  } else {
    showPage('home');
  }

  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.replace('#', '');
    if (newHash && validPages.includes(newHash)) {
      showPage(newHash);
    }
  });
}

function showPage(id) {
  const pages = ['home', 'calendar', 'calculator', 'tracker', 'checklist', 'gst', 'budget', 'contact'];
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) {
      el.classList.toggle('active', p === id);
    }
  });

  // Nav buttons highlight
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === 'btn-' + id);
  });

  // Mobile nav buttons highlight
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    const onclickStr = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', onclickStr.includes(`'${id}'`));
  });

  // Sync window URL hash
  if (window.location.hash !== '#' + id) {
    window.location.hash = id;
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  
  if (menu && toggleBtn) {
    const isActive = menu.classList.toggle('active');
    menu.style.display = isActive ? 'block' : 'none';
    
    // Toggle menu icons
    const openIcon = toggleBtn.querySelector('.menu-open');
    const closeIcon = toggleBtn.querySelector('.menu-close');
    
    if (openIcon && closeIcon) {
      openIcon.style.display = isActive ? 'none' : 'block';
      closeIcon.style.display = isActive ? 'block' : 'none';
    }
  }
}


/* THEME SWITCHER */
function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (storedTheme) {
    setTheme(storedTheme);
  } else if (prefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
}

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const sunIcon = themeBtn.querySelector('.theme-icon-light');
    const moonIcon = themeBtn.querySelector('.theme-icon-dark');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
      moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    }
  }
}


/* COMPLIANCE CALENDAR LOGIC */
function renderCal() {
  const label = document.getElementById('cal-month-label');
  if (label) {
    label.textContent = months[calMonth] + ' ' + calYear;
  }
  
  const today = new Date(2026, 4, 30); // Baseline baseline date for relative calculations (matches local time input)
  const rows = calData.filter(r => activeFilter === 'all' || r.cat === activeFilter);
  const catColors = { gst: 'tag-gst', it: 'tag-it', tds: 'tag-it', mca: 'tag-mca', pf: 'tag-mca' };
  const tbody = document.getElementById('cal-body');
  
  if (!tbody) return;

  tbody.innerHTML = rows.map(r => {
    const due = new Date(calYear, calMonth, parseInt(r.date));
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    let statusClass = 'safe';
    let statusText = '';

    if (diff < 0) {
      statusClass = 'urgent';
      statusText = 'Overdue';
    } else if (diff === 0) {
      statusClass = 'urgent';
      statusText = 'Due Today';
    } else if (diff <= 3) {
      statusClass = 'urgent';
      statusText = diff + ' days left';
    } else if (diff <= 10) {
      statusClass = 'soon';
      statusText = diff + ' days left';
    } else {
      statusClass = 'safe';
      statusText = diff + ' days left';
    }

    return `
      <tr>
        <td><strong>${r.date} ${months[calMonth].slice(0, 3)}</strong></td>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${r.desc}</div>
        </td>
        <td><span class="category-tag ${catColors[r.cat] || 'tag-it'}">${r.form}</span></td>
        <td><span style="font-size:0.8rem; font-weight:600; color:var(--text-secondary);">${r.catLabel}</span></td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      </tr>
    `;
  }).join('');
}

function changeMonth(delta) {
  calMonth += delta;
  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  } else if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }
  renderCal();
}

function toggleFilter(btn, filterName) {
  activeFilter = filterName;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCal();
}


/* DUE DATE TRACKER Countdown */
function renderTracker() {
  const grid = document.getElementById('tracker-grid');
  if (!grid) return;

  const today = new Date(2026, 4, 30); // Base date: May 30, 2026

  grid.innerHTML = trackerItems.map(item => {
    const diff = Math.ceil((item.dueDate - today) / (1000 * 60 * 60 * 24));
    let urgencyClass = 'safe';
    let urgencyLabel = diff + ' days left';
    let visualDays = diff + 'd';

    if (diff < 0) {
      urgencyClass = 'urgent';
      urgencyLabel = 'Overdue';
      visualDays = 'Overdue';
    } else if (diff === 0) {
      urgencyClass = 'urgent';
      urgencyLabel = 'Due today';
      visualDays = '0d';
    } else if (diff <= 3) {
      urgencyClass = 'urgent';
      urgencyLabel = diff + ' days left';
    } else if (diff <= 15) {
      urgencyClass = 'soon';
      urgencyLabel = diff + ' days left';
    }

    const dateStr = item.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return `
      <div class="tracker-card ${urgencyClass}">
        <div class="t-days ${urgencyClass}">${visualDays}</div>
        <div class="t-title">${item.title}</div>
        <div class="t-date"><i data-lucide="calendar"></i> Due: ${dateStr}</div>
        <span class="t-form">${item.form}</span>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}


/* DOCUMENT CHECKLIST LOGIC */
function renderChecklists() {
  const container = document.getElementById('checklist-wrap');
  if (!container) return;

  container.innerHTML = checklists.map((cl, ci) => {
    const listId = `checklist-${ci}`;
    const savedState = JSON.parse(localStorage.getItem(listId)) || {};

    const itemsHtml = cl.items.map((item, ii) => {
      const isChecked = savedState[ii] === true;
      const doneClass = isChecked ? 'done' : '';
      const checkIcon = isChecked ? '<i data-lucide="check"></i>' : '';

      return `
        <div class="check-item" onclick="toggleCheckItem(${ci}, ${ii})">
          <div class="check-box ${doneClass}" id="cb-${ci}-${ii}">
            ${checkIcon}
          </div>
          <span class="check-label ${doneClass}" id="cl-${ci}-${ii}">${item}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="checklist-card">
        <h3><span class="ch-icon">${cl.icon}</span> ${cl.title}</h3>
        <div class="checklist-items">
          ${itemsHtml}
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" id="prog-${ci}"></div>
          </div>
          <div class="prog-txt" id="prog-label-${ci}">0/0 completed</div>
        </div>
      </div>
    `;
  }).join('');

  // Re-compute calculations and redraw icons
  checklists.forEach((_, ci) => updateChecklistProgress(ci));
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function toggleCheckItem(ci, ii) {
  const listId = `checklist-${ci}`;
  const savedState = JSON.parse(localStorage.getItem(listId)) || {};
  
  // Toggle state
  savedState[ii] = !savedState[ii];
  localStorage.setItem(listId, JSON.stringify(savedState));

  const box = document.getElementById(`cb-${ci}-${ii}`);
  const lbl = document.getElementById(`cl-${ci}-${ii}`);

  if (box && lbl) {
    const isDone = savedState[ii] === true;
    box.classList.toggle('done', isDone);
    lbl.classList.toggle('done', isDone);

    if (isDone) {
      box.innerHTML = '<i data-lucide="check"></i>';
    } else {
      box.innerHTML = '';
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  updateChecklistProgress(ci);
}

function updateChecklistProgress(ci) {
  const listId = `checklist-${ci}`;
  const savedState = JSON.parse(localStorage.getItem(listId)) || {};
  const total = checklists[ci].items.length;
  
  let count = 0;
  for (let i = 0; i < total; i++) {
    if (savedState[i] === true) count++;
  }

  const fillEl = document.getElementById(`prog-${ci}`);
  const labelEl = document.getElementById(`prog-label-${ci}`);

  if (fillEl && labelEl) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    fillEl.style.width = percentage + '%';
    labelEl.textContent = `${count}/${total} items completed`;
  }
}


/* INCOME TAX CALCULATOR (FY 2025-26 slabs as per Union Budget 2025) */
function calcIT() {
  const inc = Math.max(0, +document.getElementById('it-income').value || 0);
  const std = Math.max(0, +document.getElementById('it-std').value || 0);
  const c80 = Math.max(0, +document.getElementById('it-80c').value || 0);
  const d80 = Math.max(0, +document.getElementById('it-80d').value || 0);
  const regime = document.getElementById('it-regime').value;

  const dedsArea = document.getElementById('old-regime-deductions');
  if (dedsArea) {
    dedsArea.style.display = regime === 'old' ? 'block' : 'none';
  }

  // Calculate deductions
  let ded = regime === 'new' ? std : (std + Math.min(150000, c80) + d80);
  let taxable = Math.max(0, inc - ded);
  let tax = 0;

  if (regime === 'new') {
    // Slabs: Up to 3L: Nil, 3-7L: 5%, 7-10L: 10%, 10-12L: 15%, 12-15L: 20%, Above 15L: 30%
    const slabs = [
      { limit: 300000, rate: 0.00 },
      { limit: 400000, rate: 0.05 }, // 3L to 7L
      { limit: 300000, rate: 0.10 }, // 7L to 10L
      { limit: 200000, rate: 0.15 }, // 10L to 12L
      { limit: 300000, rate: 0.20 }, // 12L to 15L
      { limit: Infinity, rate: 0.30 }  // Above 15L
    ];

    let rem = taxable;
    for (const s of slabs) {
      const taxableSlice = Math.min(rem, s.limit);
      tax += taxableSlice * s.rate;
      rem -= taxableSlice;
      if (rem <= 0) break;
    }

    // New Regime Rebate u/s 87A: Income up to 12 Lakhs is completely tax-free
    if (taxable <= 1200000) {
      tax = 0;
    }
  } else {
    // Old Regime Slabs: Up to 2.5L: Nil, 2.5-5L: 5%, 5-10L: 20%, Above 10L: 30%
    const slabs = [
      { limit: 250000, rate: 0.00 },
      { limit: 250000, rate: 0.05 },
      { limit: 500000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 }
    ];

    let rem = taxable;
    for (const s of slabs) {
      const taxableSlice = Math.min(rem, s.limit);
      tax += taxableSlice * s.rate;
      rem -= taxableSlice;
      if (rem <= 0) break;
    }

    // Old Regime Rebate u/s 87A: Taxable income up to 5 Lakhs is exempt
    if (taxable <= 500000) {
      tax = Math.min(tax, 12500); // Rebate max 12500
      if (taxable <= 500000) tax = 0;
    }
  }

  const cess = tax * 0.04;
  const total = tax + cess;

  // Render values
  document.getElementById('r-gross').textContent = formatCurrency(inc);
  document.getElementById('r-ded').textContent = formatCurrency(ded);
  document.getElementById('r-taxable').textContent = formatCurrency(taxable);
  document.getElementById('r-tax').textContent = formatCurrency(tax);
  document.getElementById('r-cess').textContent = formatCurrency(cess);
  document.getElementById('r-total').textContent = formatCurrency(total);
  document.getElementById('r-eff').textContent = inc > 0 ? ((total / inc) * 100).toFixed(2) + '%' : '0.00%';

  // Update Visual Breakdown Progress Bar
  const sliceDed = document.getElementById('slice-ded-width');
  const sliceTax = document.getElementById('slice-tax-width');
  const sliceLiab = document.getElementById('slice-liab-width');

  if (sliceDed && sliceTax && sliceLiab) {
    if (inc > 0) {
      const dedPct = (ded / inc) * 100;
      const liabPct = (total / inc) * 100;
      const taxablePct = Math.max(0, 100 - dedPct - liabPct);

      sliceDed.style.width = dedPct + '%';
      sliceTax.style.width = taxablePct + '%';
      sliceLiab.style.width = liabPct + '%';
    } else {
      sliceDed.style.width = '0%';
      sliceTax.style.width = '100%';
      sliceLiab.style.width = '0%';
    }
  }
}


/* HOUSE RENT ALLOWANCE (HRA) EXEMPTION CALCULATOR */
function calcHRA() {
  const basic = Math.max(0, +document.getElementById('hra-basic').value || 0);
  const recv = Math.max(0, +document.getElementById('hra-recv').value || 0);
  const rent = Math.max(0, +document.getElementById('hra-rent').value || 0);
  const city = document.getElementById('hra-city').value;

  const excess = Math.max(0, rent - (basic * 0.1));
  const pct = basic * (city === 'metro' ? 0.5 : 0.4);
  const exempt = Math.min(recv, excess, pct);
  const taxable = Math.max(0, recv - exempt);

  document.getElementById('h-recv').textContent = formatCurrency(recv);
  document.getElementById('h-excess').textContent = formatCurrency(excess);
  document.getElementById('h-pct').textContent = formatCurrency(pct);
  document.getElementById('h-exempt').textContent = formatCurrency(exempt);
  document.getElementById('h-taxable').textContent = formatCurrency(taxable);
}


/* ADVANCE TAX ESTIMATOR */
function calcAdv() {
  const inc = Math.max(0, +document.getElementById('adv-income').value || 0);
  const tdsD = Math.max(0, +document.getElementById('adv-tds').value || 0);
  const paid = Math.max(0, +document.getElementById('adv-paid').value || 0);

  // Compute estimated baseline tax (using default New Tax Regime slabs)
  const ded = 75000; // Std deduction
  const taxable = Math.max(0, inc - ded);
  let tax = 0;

  const slabs = [
    { limit: 300000, rate: 0.00 },
    { limit: 400000, rate: 0.05 },
    { limit: 300000, rate: 0.10 },
    { limit: 200000, rate: 0.15 },
    { limit: 300000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 }
  ];

  let rem = taxable;
  for (const s of slabs) {
    const slice = Math.min(rem, s.limit);
    tax += slice * s.rate;
    rem -= slice;
    if (rem <= 0) break;
  }

  // Rebate
  if (taxable <= 1200000) {
    tax = 0;
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;
  const netDue = Math.max(0, totalTax - tdsD - paid);

  document.getElementById('adv-total').textContent = formatCurrency(totalTax);
  document.getElementById('adv-tds-d').textContent = '- ' + formatCurrency(tdsD);
  document.getElementById('adv-paid-d').textContent = '- ' + formatCurrency(paid);
  document.getElementById('adv-due').textContent = formatCurrency(netDue);

  // Installment breakdowns (cumulative schedules)
  document.getElementById('inst-jun').textContent = formatCurrency(netDue * 0.15);
  document.getElementById('inst-sep').textContent = formatCurrency(netDue * 0.45);
  document.getElementById('inst-dec').textContent = formatCurrency(netDue * 0.75);
  document.getElementById('inst-mar').textContent = formatCurrency(netDue);
}


/* TDS DEDUCTIONS CALCULATOR */
function calcTDS() {
  const amt = Math.max(0, +document.getElementById('tds-amt').value || 0);
  const nature = document.getElementById('tds-nature').value;
  const pan = document.getElementById('tds-pan').value;

  // Rate mapping: '0': salary, '1': contractor (1%), '10': professional (10%), '10b': rent (10%), '5': commission (5%)
  const rates = { '0': 0, '1': 0.01, '10': 0.10, '10b': 0.10, '5': 0.05 };
  let rate = rates[nature] || 0.10;

  if (pan === '2') {
    // If no PAN, Section 206AA demands higher penalty rates: 20% max (salary is subject to slab, contract is 20%)
    rate = Math.max(rate * 2, 0.20);
  }

  const tds = amt * rate;
  const net = Math.max(0, amt - tds);

  document.getElementById('tds-base').textContent = formatCurrency(amt);
  document.getElementById('tds-rate-d').textContent = (rate * 100).toFixed(1) + '%';
  document.getElementById('tds-amt-d').textContent = formatCurrency(tds);
  document.getElementById('tds-net').textContent = formatCurrency(net);
}

function switchCalc(id, btn) {
  document.querySelectorAll('.calculator-view').forEach(view => view.classList.remove('active'));
  document.querySelectorAll('.calc-tab-btn').forEach(b => b.classList.remove('active'));
  
  const targetView = document.getElementById('calc-' + id);
  if (targetView && btn) {
    targetView.classList.add('active');
    btn.classList.add('active');
  }
}


/* GST RATE FINDER LOGIC */
function renderGST(items) {
  const tbody = document.getElementById('gst-body');
  if (!tbody) return;

  const rateClass = { 0: 'r0', 5: 'r5', 12: 'r12', 18: 'r18', 28: 'r28' };

  tbody.innerHTML = items.map(g => `
    <tr>
      <td><strong>${g.hsn}</strong></td>
      <td>${g.desc}</td>
      <td><span class="rate-pill ${rateClass[g.rate] || 'r18'}">${g.rate}%</span></td>
      <td><span style="font-weight:600; font-size:0.8rem; color:var(--text-secondary);">${g.cat}</span></td>
    </tr>
  `).join('');
}

function searchGST() {
  const queryInput = document.getElementById('gst-input');
  const clearBtn = document.getElementById('gst-clear-btn');
  
  if (!queryInput) return;

  const q = queryInput.value.toLowerCase().trim();

  if (clearBtn) {
    clearBtn.style.display = q.length > 0 ? 'flex' : 'none';
  }

  const filtered = q 
    ? gstItems.filter(g => 
        g.desc.toLowerCase().includes(q) || 
        g.hsn.includes(q) || 
        g.cat.toLowerCase().includes(q)
      )
    : gstItems;

  renderGST(filtered);
}

function clearGstSearch() {
  const queryInput = document.getElementById('gst-input');
  if (queryInput) {
    queryInput.value = '';
    searchGST();
  }
}


/* CONTACT FORM SUBMISSION */
async function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const phone = document.getElementById('contact-phone').value;
  const service = document.getElementById('contact-service').value;
  const message = document.getElementById('contact-msg').value;

  // If Supabase is initialized, try inserting into the 'consultations' table
  if (supabase) {
    const submitBtn = event.target.querySelector('button[type="submit"]');
    let oldBtnHtml = '';
    if (submitBtn) {
      oldBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Saving...</span>';
    }

    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([
          {
            name: name,
            email: email,
            phone: phone,
            service: service,
            message: message,
            created_at: new Date()
          }
        ]);

      if (error) throw error;

      showToast({
        title: 'Consultation Saved!',
        message: `Thank you, ${name}. Details stored in database. An expert will reach out soon.`,
        type: 'success'
      });

      const form = document.getElementById('consultation-form');
      if (form) form.reset();

    } catch (err) {
      console.error('Supabase error:', err);
      showToast({
        title: 'Database Error',
        message: 'Could not write to Supabase: ' + err.message,
        type: 'error'
      });
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = oldBtnHtml;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  } else {
    // Fallback: Virtual validation & show nice customized success toast
    showToast({
      title: 'Consultation Booked (Demo)!',
      message: `Thank you, ${name}. (Supabase not configured yet - demo mode active).`,
      type: 'success'
    });

    const form = document.getElementById('consultation-form');
    if (form) {
      form.reset();
    }
  }
}


/* DYNAMIC TOAST NOTIFICATIONS */
function showToast({ title, message, type = 'info' }) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: 'check-circle-2',
    error: 'alert-triangle',
    info: 'info'
  };

  toast.innerHTML = `
    <div class="toast-icon">
      <i data-lucide="${icons[type] || 'info'}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()"><i data-lucide="x"></i></button>
  `;

  container.appendChild(toast);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Auto clean toast after animation completes
  setTimeout(() => {
    toast.remove();
  }, 5000);
}


/* HELPERS */
function formatCurrency(num) {
  return '\u20B9' + Math.round(num).toLocaleString('en-IN');
}
