"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Award, Calendar, ArrowRight, AlarmClock, Calculator, Database, 
  GraduationCap, CalendarClock, Wallet, Hourglass, ListChecks, SearchCode, 
  TrendingUp, ChevronRight, Menu, X, ChevronLeft, Percent, Home, ArrowUpRight, 
  Scissors, Info, MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, 
  AlertTriangle, Check, LogIn, LogOut, LayoutDashboard, User, Lock, RefreshCw, 
  Briefcase
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

/* SUPABASE CONFIGURATION */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* CONSTANT DATABASES */
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


export default function Page() {
  // Navigation & Menu States
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Authentication & Dashboard States
  const [user, setUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authLoading, setAuthLoading] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  // Calendar States
  const [calMonth, setCalMonth] = useState(4); // May
  const [calYear, setCalYear] = useState(2026);
  const [activeFilter, setActiveFilter] = useState('all');
  const [calendarItems, setCalendarItems] = useState(calData);

  // Calculators Selection
  const [calcTab, setCalcTab] = useState('it');

  // Income Tax States
  const [itIncome, setItIncome] = useState(1200000);
  const [itStd, setItStd] = useState(75000);
  const [itRegime, setItRegime] = useState('new');
  const [it80c, setIt80c] = useState(150000);
  const [it80d, setIt80d] = useState(25000);

  // HRA States
  const [hraBasic, setHraBasic] = useState(600000);
  const [hraRecv, setHraRecv] = useState(240000);
  const [hraRent, setHraRent] = useState(180000);
  const [hraCity, setHraCity] = useState('metro');

  // Advance Tax States
  const [advIncome, setAdvIncome] = useState(2000000);
  const [advTds, setAdvTds] = useState(100000);
  const [advPaid, setAdvPaid] = useState(0);

  // TDS States
  const [tdsAmt, setTdsAmt] = useState(500000);
  const [tdsNature, setTdsNature] = useState('10'); // Professional Fees (10%)
  const [tdsPan, setTdsPan] = useState('1'); // Has PAN

  // GST Search
  const [gstInput, setGstInput] = useState('');

  // Checklist states
  const [checklistState, setChecklistState] = useState({});

  // Toast Alerts
  const [toasts, setToasts] = useState([]);

  // Form submission loading
  const [savingForm, setSavingForm] = useState(false);


  /* INITIALIZATION */
  useEffect(() => {
    // Sync URL hash router on mount
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'calendar', 'calculator', 'tracker', 'checklist', 'gst', 'budget', 'contact', 'login', 'dashboard'];
    if (hash && validPages.includes(hash)) {
      setActivePage(hash);
    }

    // Bind hash change listener
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && validPages.includes(newHash)) {
        setActivePage(newHash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // Sync Theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Load checklist progress from LocalStorage
    const loadedProgress = {};
    checklists.forEach((_, ci) => {
      const listId = `checklist-${ci}`;
      loadedProgress[ci] = JSON.parse(localStorage.getItem(listId)) || {};
    });
    setChecklistState(loadedProgress);

    // Fetch Google Sheet Calendar if configured
    fetchGoogleSheetCalendar();

    // Auth Session Sync
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchConsultationsData();
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchConsultationsData();
        } else {
          setConsultations([]);
        }
      });

      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        subscription.unsubscribe();
      };
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);


  /* HANDLERS */
  const parseCSV = (text) => {
    if (!text) return [];
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = [];
    const headerLine = lines[0];
    const headerMatches = headerLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || headerLine.split(',');
    headerMatches.forEach(h => {
      headers.push(h.trim().replace(/^["']|["']$/g, ''));
    });

    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const row = [];
      let insideQuote = false;
      let entry = '';
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          row.push(entry.trim().replace(/^["']|["']$/g, ''));
          entry = '';
        } else {
          entry += char;
        }
      }
      row.push(entry.trim().replace(/^["']|["']$/g, ''));

      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || '';
      });

      if (item.date && item.form && item.desc) {
        result.push({
          date: String(item.date).padStart(2, '0'),
          form: item.form,
          desc: item.desc,
          cat: item.cat || 'gst',
          catLabel: item.catLabel || item.cat?.toUpperCase() || 'GST'
        });
      }
    }
    return result;
  };

  const fetchGoogleSheetCalendar = async () => {
    const sheetCsvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL;
    if (!sheetCsvUrl) return;

    try {
      const res = await fetch(sheetCsvUrl);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const text = await res.text();
      const parsedData = parseCSV(text);
      if (parsedData && parsedData.length > 0) {
        setCalendarItems(parsedData);
      }
    } catch (err) {
      console.error('Error fetching calendar from Google Sheets:', err);
      showToast(
        'Google Sheet Sync Error',
        'Could not load live calendar data. Falling back to local data.',
        'error'
      );
    }
  };

  const fetchConsultationsData = async () => {
    if (!supabase) return;
    setLoadingConsultations(true);
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (err) {
      console.error('Error fetching consultations:', err);
    } finally {
      setLoadingConsultations(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!supabase) {
      showToast('Configuration Required', 'Supabase URL and Anon Key are missing.', 'error');
      return;
    }
    if (!authEmail || !authPassword) {
      showToast('Validation Error', 'Email and Password are required.', 'error');
      return;
    }
    
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        showToast('Welcome Back!', `Logged in successfully as ${data.user.email}`, 'success');
        handlePageChange('dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        if (data.session) {
          showToast('Account Created!', `Logged in successfully as ${data.user.email}`, 'success');
          handlePageChange('dashboard');
        } else {
          showToast('Verification Sent!', 'Please check your email inbox to confirm registration.', 'info');
        }
      }
      setAuthPassword('');
    } catch (err) {
      console.error('Authentication error:', err);
      showToast('Authentication Failed', err.message, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showToast('Logged Out', 'You have been signed out successfully.', 'info');
      handlePageChange('home');
    } catch (err) {
      console.error('Sign out error:', err);
      showToast('Error', 'Failed to sign out: ' + err.message, 'error');
    }
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const showToast = (title, message, type = 'info') => {
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleCheckItem = (ci, ii) => {
    const listId = `checklist-${ci}`;
    const currentListState = { ...checklistState[ci] };
    
    currentListState[ii] = !currentListState[ii];
    localStorage.setItem(listId, JSON.stringify(currentListState));

    setChecklistState(prev => ({
      ...prev,
      [ci]: currentListState
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.elements['contact-name'].value;
    const email = e.target.elements['contact-email'].value;
    const phone = e.target.elements['contact-phone'].value;
    const service = e.target.elements['contact-service'].value;
    const message = e.target.elements['contact-msg'].value;

    if (supabase) {
      setSavingForm(true);
      try {
        const { error } = await supabase
          .from('consultations')
          .insert([
            {
              name,
              email,
              phone,
              service,
              message,
              created_at: new Date()
            }
          ]);

        if (error) throw error;

        showToast(
          'Consultation Saved!',
          `Thank you, ${name}. Your request regarding "${service}" has been recorded.`,
          'success'
        );
        e.target.reset();

      } catch (err) {
        console.error('Supabase database error:', err);
        showToast(
          'Database Error',
          'Failed to record consultation: ' + err.message,
          'error'
        );
      } finally {
        setSavingForm(false);
      }
    } else {
      // Demo Fallback
      showToast(
        'Consultation Booked (Demo)!',
        `Thank you, ${name}. Supabase is not configured yet, so this submission runs in demo mode.`,
        'success'
      );
      e.target.reset();
    }
  };


  /* CORE CALCULATIONS (REACTIVE DEFINITIONS) */

  // Currency utility formatter
  const formatCurrency = (val) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  // Calendar rows relative dates math
  const todayDate = new Date(2026, 4, 30); // May 30, 2026
  const calendarRows = calendarItems.filter(r => activeFilter === 'all' || r.cat === activeFilter);
  const calendarCatColors = { gst: 'tag-gst', it: 'tag-it', tds: 'tag-it', mca: 'tag-mca', pf: 'tag-mca' };

  // Income Tax Computations
  const itDeduction = itRegime === 'new' ? itStd : (itStd + Math.min(150000, it80c) + it80d);
  const itTaxable = Math.max(0, itIncome - itDeduction);
  
  let itBasicTax = 0;
  if (itRegime === 'new') {
    // Slabs: Up to 3L: Nil, 3-7L: 5%, 7-10L: 10%, 10-12L: 15%, 12-15L: 20%, Above 15L: 30%
    const slabs = [
      { limit: 300000, rate: 0.00 },
      { limit: 400000, rate: 0.05 },
      { limit: 300000, rate: 0.10 },
      { limit: 200000, rate: 0.15 },
      { limit: 300000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 }
    ];
    let remaining = itTaxable;
    for (const s of slabs) {
      const slice = Math.min(remaining, s.limit);
      itBasicTax += slice * s.rate;
      remaining -= slice;
      if (remaining <= 0) break;
    }
    // Rebate u/s 87A: Income up to 12 Lakhs is completely tax-free
    if (itTaxable <= 1200000) {
      itBasicTax = 0;
    }
  } else {
    // Slabs: Up to 2.5L: Nil, 2.5-5L: 5%, 5-10L: 20%, Above 10L: 30%
    const slabs = [
      { limit: 250000, rate: 0.00 },
      { limit: 250000, rate: 0.05 },
      { limit: 500000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 }
    ];
    let remaining = itTaxable;
    for (const s of slabs) {
      const slice = Math.min(remaining, s.limit);
      itBasicTax += slice * s.rate;
      remaining -= slice;
      if (remaining <= 0) break;
    }
    // Rebate u/s 87A: Taxable income up to 5 Lakhs is exempt
    if (itTaxable <= 500000) {
      itBasicTax = Math.min(itBasicTax, 12500);
      if (itTaxable <= 500000) itBasicTax = 0;
    }
  }
  const itCess = itBasicTax * 0.04;
  const itTotalTax = itBasicTax + itCess;
  const itEffRate = itIncome > 0 ? ((itTotalTax / itIncome) * 100).toFixed(2) + '%' : '0.00%';

  // stacked visual progress percentages
  const itDedPct = itIncome > 0 ? (itDeduction / itIncome) * 100 : 0;
  const itLiabPct = itIncome > 0 ? (itTotalTax / itIncome) * 100 : 0;
  const itTaxablePct = itIncome > 0 ? Math.max(0, 100 - itDedPct - itLiabPct) : 100;

  // HRA Computations
  const hraExcess = Math.max(0, hraRent - (hraBasic * 0.1));
  const hraPctAmt = hraBasic * (hraCity === 'metro' ? 0.5 : 0.4);
  const hraExempt = Math.min(hraRecv, hraExcess, hraPctAmt);
  const hraTaxable = Math.max(0, hraRecv - hraExempt);

  // Advance Tax Computations
  const advDeduction = 75000;
  const advTaxable = Math.max(0, advIncome - advDeduction);
  let advBasicTax = 0;
  const advSlabs = [
    { limit: 300000, rate: 0.00 },
    { limit: 400000, rate: 0.05 },
    { limit: 300000, rate: 0.10 },
    { limit: 200000, rate: 0.15 },
    { limit: 300000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 }
  ];
  let advRemaining = advTaxable;
  for (const s of advSlabs) {
    const slice = Math.min(advRemaining, s.limit);
    advBasicTax += slice * s.rate;
    advRemaining -= slice;
    if (advRemaining <= 0) break;
  }
  if (advTaxable <= 1200000) {
    advBasicTax = 0;
  }
  const advCess = advBasicTax * 0.04;
  const advTotalTax = advBasicTax + advCess;
  const advDueBalance = Math.max(0, advTotalTax - advTds - advPaid);

  // TDS Computations
  const tdsRates = { '0': 0, '1': 0.01, '10': 0.10, '10b': 0.10, '5': 0.05 };
  let tdsBaseRate = tdsRates[tdsNature] || 0.10;
  if (tdsPan === '2') {
    tdsBaseRate = Math.max(tdsBaseRate * 2, 0.20);
  }
  const tdsDeducted = tdsAmt * tdsBaseRate;
  const tdsNetPayable = Math.max(0, tdsAmt - tdsDeducted);

  // GST rates filter
  const filteredGstList = gstInput
    ? gstItems.filter(g => 
        g.desc.toLowerCase().includes(gstInput.toLowerCase().trim()) || 
        g.hsn.includes(gstInput.trim()) || 
        g.cat.toLowerCase().includes(gstInput.toLowerCase().trim())
      )
    : gstItems;

  const gstRateColors = { 0: 'r0', 5: 'r5', 12: 'r12', 18: 'r18', 28: 'r28' };


  return (
    <>
      {/* HEADER / NAVIGATION */}
      <nav className="glass-nav">
        <div className="nav-container">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); handlePageChange('home'); }}>
            <span className="logo-icon"><ShieldCheck /></span>
            <span>Fin<span className="brand-highlight">Ezy</span></span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="nav-links">
            <button className={`nav-btn ${activePage === 'home' ? 'active' : ''}`} onClick={() => handlePageChange('home')}>Home</button>
            <button className={`nav-btn ${activePage === 'calendar' ? 'active' : ''}`} onClick={() => handlePageChange('calendar')}>Calendar</button>
            <button className={`nav-btn ${activePage === 'calculator' ? 'active' : ''}`} onClick={() => handlePageChange('calculator')}>Calculators</button>
            <button className={`nav-btn ${activePage === 'tracker' ? 'active' : ''}`} onClick={() => handlePageChange('tracker')}>Tracker</button>
            <button className={`nav-btn ${activePage === 'checklist' ? 'active' : ''}`} onClick={() => handlePageChange('checklist')}>Checklists</button>
            <button className={`nav-btn ${activePage === 'gst' ? 'active' : ''}`} onClick={() => handlePageChange('gst')}>GST Finder</button>
            <button className={`nav-btn ${activePage === 'budget' ? 'active' : ''}`} onClick={() => handlePageChange('budget')}>Budget 2025</button>
            <button className={`nav-btn ${activePage === 'contact' ? 'active' : ''}`} onClick={() => handlePageChange('contact')}>Contact</button>
            {user && (
              <button className={`nav-btn ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => handlePageChange('dashboard')}>
                <LayoutDashboard size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Dashboard
              </button>
            )}
          </div>

          <div className="nav-actions">
            {/* Theme Toggle */}
            <button className="icon-btn-toggle" onClick={handleToggleTheme} title="Toggle Theme">
              <span className="flex-center-y">
                {theme === 'dark' ? <i data-lucide="sun"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></i> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>}
              </span>
            </button>
            
            {user ? (
              <button className="nav-cta btn-signout" onClick={handleSignOut} style={{ backgroundColor: 'var(--danger)', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)' }}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <button className="nav-btn login-nav-btn" onClick={() => handlePageChange('login')}>
                  <LogIn size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Member Login
                </button>
                <button className="nav-cta" onClick={() => handlePageChange('contact')}>
                  <CalendarClock />
                  <span>Consultation</span>
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button className="mobile-toggle" onClick={handleToggleMobileMenu}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAVIGATION DROPDOWN */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-links">
          <button className={`mobile-nav-btn ${activePage === 'home' ? 'active' : ''}`} onClick={() => { handlePageChange('home'); handleToggleMobileMenu(); }}>Home</button>
          <button className={`mobile-nav-btn ${activePage === 'calendar' ? 'active' : ''}`} onClick={() => { handlePageChange('calendar'); handleToggleMobileMenu(); }}>Compliance Calendar</button>
          <button className={`mobile-nav-btn ${activePage === 'calculator' ? 'active' : ''}`} onClick={() => { handlePageChange('calculator'); handleToggleMobileMenu(); }}>Tax Calculators</button>
          <button className={`mobile-nav-btn ${activePage === 'tracker' ? 'active' : ''}`} onClick={() => { handlePageChange('tracker'); handleToggleMobileMenu(); }}>Due Date Tracker</button>
          <button className={`mobile-nav-btn ${activePage === 'checklist' ? 'active' : ''}`} onClick={() => { handlePageChange('checklist'); handleToggleMobileMenu(); }}>Document Checklist</button>
          <button className={`mobile-nav-btn ${activePage === 'gst' ? 'active' : ''}`} onClick={() => { handlePageChange('gst'); handleToggleMobileMenu(); }}>GST Rate Finder</button>
          <button className={`mobile-nav-btn ${activePage === 'budget' ? 'active' : ''}`} onClick={() => { handlePageChange('budget'); handleToggleMobileMenu(); }}>Union Budget 2025</button>
          <button className={`mobile-nav-btn ${activePage === 'contact' ? 'active' : ''}`} onClick={() => { handlePageChange('contact'); handleToggleMobileMenu(); }}>Contact Us</button>
          {user ? (
            <>
              <button className={`mobile-nav-btn ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => { handlePageChange('dashboard'); handleToggleMobileMenu(); }}>Team Dashboard</button>
              <button className="mobile-nav-cta" onClick={() => { handleSignOut(); handleToggleMobileMenu(); }} style={{ backgroundColor: 'var(--danger)' }}>Sign Out</button>
            </>
          ) : (
            <>
              <button className={`mobile-nav-btn ${activePage === 'login' ? 'active' : ''}`} onClick={() => { handlePageChange('login'); handleToggleMobileMenu(); }}>Member Login</button>
              <button className="mobile-nav-cta" onClick={() => { handlePageChange('contact'); handleToggleMobileMenu(); }}>Book Consultation</button>
            </>
          )}
        </div>
      </div>

      <main className="main-container">
        
        {/* PAGE 1: HOME */}
        <section className={`page ${activePage === 'home' ? 'active' : ''}`}>
          <div className="hero-section">
            <div className="hero-bg-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
            </div>
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-icon"><Award /></span>
                <span>Trusted by 500+ CA Professionals &amp; Finance Students</span>
              </div>
              <h1>Your Intelligent Portal for <span className="gradient-text">Finance &amp; Compliance</span></h1>
              <p>An elegant, unified dashboard packed with real-time tax calculators, compliance tracking, checklist builders, and union budget resources designed to save hours of manual calculation.</p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => handlePageChange('calendar')}>
                  <Calendar />
                  <span>View Deadlines</span>
                </button>
                <button className="btn-secondary" onClick={() => handlePageChange('calculator')}>
                  <span>Try Tax Calculator</span>
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><AlarmClock /></div>
              <div className="stat-info">
                <span className="stat-number">50+</span>
                <span className="stat-desc">Deadlines Tracked</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Calculator /></div>
              <div className="stat-info">
                <span className="stat-number">4</span>
                <span className="stat-desc">Core Tax Calculators</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Database /></div>
              <div className="stat-info">
                <span className="stat-number">20+</span>
                <span className="stat-desc">GST Code Library</span>
              </div>
            </div>
            <div className="stat-card flex-center-y">
              <div className="stat-icon highlight"><GraduationCap /></div>
              <div className="stat-info">
                <span className="stat-number">Free</span>
                <span className="stat-desc">Always Free for Students</span>
              </div>
            </div>
          </div>

          <div className="section-container">
            <div className="section-header text-center">
              <span className="section-badge">Platform Modules</span>
              <h2>Everything a Financial Professional Needs</h2>
              <p className="section-subtitle">Jump straight to any tool to simplify your regulatory compliance workflow.</p>
            </div>

            <div className="features-grid">
              <div className="feature-card" onClick={() => handlePageChange('calendar')}>
                <div className="feat-icon"><CalendarClock /></div>
                <h3>Compliance Calendar</h3>
                <p>GST, Income Tax, MCA, and PF/ESI filing due dates updated for 2026.</p>
                <div className="feat-footer">
                  <span className="feat-tag">Updated Monthly</span>
                  <span className="feat-link">Open <ChevronRight /></span>
                </div>
              </div>

              <div className="feature-card" onClick={() => handlePageChange('calculator')}>
                <div className="feat-icon"><Wallet /></div>
                <h3>Tax Calculators</h3>
                <p>Compute Income Tax under old/new regimes, HRA, Advance Tax, and TDS instantly.</p>
                <div className="feat-footer">
                  <span className="feat-tag">FY 2025-26</span>
                  <span class="feat-link">Open <ChevronRight /></span>
                </div>
              </div>

              <div className="feature-card" onClick={() => handlePageChange('tracker')}>
                <div className="feat-icon"><Hourglass /></div>
                <h3>Due Date Tracker</h3>
                <p>A visual countdown timer alerting you of overdue or impending return dates.</p>
                <div className="feat-footer">
                  <span className="feat-tag">Live countdown</span>
                  <span className="feat-link">Open <ChevronRight /></span>
                </div>
              </div>

              <div className="feature-card" onClick={() => handlePageChange('checklist')}>
                <div className="feat-icon"><ListChecks /></div>
                <h3>Filing Checklists</h3>
                <p>Interactive documents compilation lists for audits, GST, and ITR incorporation.</p>
                <div className="feat-footer">
                  <span className="feat-tag">Auto-saves state</span>
                  <span className="feat-link">Open <ChevronRight /></span>
                </div>
              </div>

              <div className="feature-card" onClick={() => handlePageChange('gst')}>
                <div className="feat-icon"><SearchCode /></div>
                <h3>GST Rate Finder</h3>
                <p>Instantly search rates and identify matching HSN/SAC codes for services &amp; goods.</p>
                <div className="feat-footer">
                  <span className="feat-tag">Instant Lookup</span>
                  <span className="feat-link">Open <ChevronRight /></span>
                </div>
              </div>

              <div className="feature-card" onClick={() => handlePageChange('budget')}>
                <div className="feat-icon"><TrendingUp /></div>
                <h3>Union Budget 2025</h3>
                <p>Quick reference guide outlining direct tax reforms, slabs, and capital gain changes.</p>
                <div className="feat-footer">
                  <span className="feat-tag">Finance Act</span>
                  <span className="feat-link">Open <ChevronRight /></span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-container bg-surface-alt rounded-lg border">
            <div className="section-header">
              <span className="section-badge">Live Feed</span>
              <h2>Tax &amp; Regulatory Alert Board</h2>
              <p className="section-subtitle">Stay informed on extensions, notifications, and directives from tax authorities.</p>
            </div>

            <div className="updates-grid">
              <div className="update-card">
                <div className="update-header">
                  <span className="update-date"><Calendar /> May 20, 2026</span>
                  <span className="category-tag tag-gst">GST Notification</span>
                </div>
                <h3>GSTR-3B filing timeline extended to May 22 for April 2026 returns due to technical glitches on the GSTN portal.</h3>
              </div>

              <div className="update-card">
                <div className="update-header">
                  <span className="update-date"><Calendar /> May 15, 2026</span>
                  <span className="category-tag tag-it">Income Tax</span>
                </div>
                <h3>Quarterly TDS Statements (Form 24Q &amp; 26Q) for Q4 FY 2025-26 must be filed on or before May 31, 2026 to avoid late fees.</h3>
              </div>

              <div className="update-card">
                <div className="update-header">
                  <span className="update-date"><Calendar /> May 10, 2026</span>
                  <span className="category-tag tag-mca">MCA</span>
                </div>
                <h3>Ministry of Corporate Affairs extends AGM filing timeline for companies registering in FY 2025-26 under new digital system.</h3>
              </div>

              <div className="update-card">
                <div className="update-header">
                  <span className="update-date"><Calendar /> May 05, 2026</span>
                  <span className="category-tag tag-sebi">SEBI Circular</span>
                </div>
                <h3>SEBI issues refined periodic reporting schedules for listed firms, enhancing ESG transparency starting June 1.</h3>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 2: COMPLIANCE CALENDAR */}
        <section className={`page ${activePage === 'calendar' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Filing Schedule</span>
              <h1>Compliance Calendar</h1>
              <p className="section-subtitle">Track important compliance deadlines. Toggle filters to isolate categories.</p>
            </div>

            <div className="calendar-panel">
              <div className="cal-controls">
                <div className="month-selector">
                  <button className="control-btn" onClick={() => setCalMonth(prev => (prev - 1 < 0 ? 11 : prev - 1))} aria-label="Previous Month"><ChevronLeft /></button>
                  <h2 className="current-month-lbl">{months[calMonth]} {calYear}</h2>
                  <button className="control-btn" onClick={() => setCalMonth(prev => (prev + 1 > 11 ? 0 : prev + 1))} aria-label="Next Month"><ChevronRight /></button>
                </div>
                <div className="filter-pills-container">
                  {['all', 'gst', 'it', 'tds', 'mca', 'pf'].map((f) => (
                    <button 
                      key={f} 
                      className={`filter-pill ${activeFilter === f ? 'active' : ''}`} 
                      onClick={() => setActiveFilter(f)}
                    >
                      {f === 'all' ? 'All' : f === 'it' ? 'Income Tax' : f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Due Date</th>
                      <th>Compliance &amp; Description</th>
                      <th>Form / Return Code</th>
                      <th>Department</th>
                      <th>Urgency Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendarRows.map((r, idx) => {
                      const due = new Date(calYear, calMonth, parseInt(r.date));
                      const diff = Math.ceil((due - todayDate) / (1000 * 60 * 60 * 24));
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
                        statusText = `${diff} days left`;
                      } else if (diff <= 10) {
                        statusClass = 'soon';
                        statusText = `${diff} days left`;
                      } else {
                        statusClass = 'safe';
                        statusText = `${diff} days left`;
                      }

                      return (
                        <tr key={idx}>
                          <td><strong>{r.date} {months[calMonth].slice(0, 3)}</strong></td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.desc}</div>
                          </td>
                          <td><span className={`category-tag ${calendarCatColors[r.cat] || 'tag-it'}`}>{r.form}</span></td>
                          <td><span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{r.catLabel}</span></td>
                          <td><span className={`status-badge ${statusClass}`}>{statusText}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 3: TAX CALCULATORS */}
        <section className={`page ${activePage === 'calculator' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Interactive Estimators</span>
              <h1>Tax &amp; Compliance Calculators</h1>
              <p className="section-subtitle">Toggle tabs to perform dynamic tax, HRA exemption, advance tax liability, and TDS computations.</p>
            </div>

            <div className="calculator-tabs">
              <button className={`calc-tab-btn ${calcTab === 'it' ? 'active' : ''}`} onClick={() => setCalcTab('it')}><Percent /> Income Tax</button>
              <button className={`calc-tab-btn ${calcTab === 'hra' ? 'active' : ''}`} onClick={() => setCalcTab('hra')}><Home /> HRA Exemption</button>
              <button className={`calc-tab-btn ${calcTab === 'adv' ? 'active' : ''}`} onClick={() => setCalcTab('adv')}><ArrowUpRight /> Advance Tax</button>
              <button className={`calc-tab-btn ${calcTab === 'tds' ? 'active' : ''}`} onClick={() => setCalcTab('tds')}><Scissors /> TDS Calculator</button>
            </div>

            {/* Income Tax Calculator */}
            <div className={`calculator-view ${calcTab === 'it' ? 'active' : ''}`}>
              <div className="calc-grid">
                <div className="calc-inputs-pane">
                  <h3>Financial Details (FY 2025-26)</h3>
                  <div className="input-group">
                    <label>Annual Gross Income (&#8377;)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">&#8377;</span>
                      <input type="number" value={itIncome} onChange={(e) => setItIncome(Math.max(0, +e.target.value))} />
                    </div>
                  </div>
                  
                  <div className="input-group-row">
                    <div className="input-group">
                      <label>Standard Deduction (&#8377;)</label>
                      <input type="number" value={itStd} onChange={(e) => setItStd(Math.max(0, +e.target.value))} />
                    </div>
                    <div className="input-group">
                      <label>Tax Regime Option</label>
                      <select value={itRegime} onChange={(e) => setItRegime(e.target.value)}>
                        <option value="new">New Tax Regime (Default)</option>
                        <option value="old">Old Tax Regime</option>
                      </select>
                    </div>
                  </div>

                  {itRegime === 'old' && (
                    <div className="deductions-toggle-area">
                      <div className="input-group">
                        <label>Section 80C Deductions (PPF, LIC, ELSS) (&#8377;)</label>
                        <input type="number" value={it80c} onChange={(e) => setIt80c(Math.max(0, +e.target.value))} />
                        <span className="input-hint">Maximum limit: &#8377;1,50,000</span>
                      </div>
                      <div className="input-group">
                        <label>Section 80D Deductions (Health Insurance) (&#8377;)</label>
                        <input type="number" value={it80d} onChange={(e) => setIt80d(Math.max(0, +e.target.value))} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="calc-results-pane">
                  <h3>Estimated Tax Liability</h3>
                  
                  <div className="visual-breakdown-bar">
                    <span className="breakdown-title">Deduction vs Taxable vs Net Tax</span>
                    <div className="bar-progress-container">
                      <div className="bar-slice slice-deductions" style={{ width: `${itDedPct}%` }} title="Deductions"></div>
                      <div className="bar-slice slice-taxable" style={{ width: `${itTaxablePct}%` }} title="Taxable Income"></div>
                      <div className="bar-slice slice-liability" style={{ width: `${itLiabPct}%` }} title="Tax Liability"></div>
                    </div>
                    <div className="bar-legend">
                      <span><span className="dot ded"></span> Deductions</span>
                      <span><span class="dot taxable"></span> Taxable</span>
                      <span><span className="dot liability"></span> Tax Due</span>
                    </div>
                  </div>

                  <div className="results-rows">
                    <div className="res-item">
                      <span className="res-lbl">Gross Income</span>
                      <span className="res-val">{formatCurrency(itIncome)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">Eligible Deductions</span>
                      <span className="res-val text-success">{formatCurrency(itDeduction)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">Net Taxable Income</span>
                      <span className="res-val">{formatCurrency(itTaxable)}</span>
                    </div>
                    <div className="res-item border-top">
                      <span className="res-lbl">Basic Income Tax</span>
                      <span className="res-val">{formatCurrency(itBasicTax)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">Health &amp; Education Cess (4%)</span>
                      <span className="res-val">{formatCurrency(itCess)}</span>
                    </div>
                    <div className="res-item total-row">
                      <span className="res-lbl">Total Tax Liability</span>
                      <span className="res-val highlight-value">{formatCurrency(itTotalTax)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">Effective Tax Rate</span>
                      <span className="res-val">{itEffRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HRA Calculator */}
            <div className={`calculator-view ${calcTab === 'hra' ? 'active' : ''}`}>
              <div className="calc-grid">
                <div className="calc-inputs-pane">
                  <h3>Salary &amp; Rent Specifications</h3>
                  <div className="input-group">
                    <label>Basic Salary + DA (Annual &#8377;)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">&#8377;</span>
                      <input type="number" value={hraBasic} onChange={(e) => setHraBasic(Math.max(0, +e.target.value))} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>House Rent Allowance (HRA) Received (Annual &#8377;)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">&#8377;</span>
                      <input type="number" value={hraRecv} onChange={(e) => setHraRecv(Math.max(0, +e.target.value))} />
                    </div>
                  </div>
                  <div className="input-group-row">
                    <div className="input-group">
                      <label>Actual Rent Paid (Annual &#8377;)</label>
                      <input type="number" value={hraRent} onChange={(e) => setHraRent(Math.max(0, +e.target.value))} />
                    </div>
                    <div className="input-group">
                      <label>Residential Location City</label>
                      <select value={hraCity} onChange={(e) => setHraCity(e.target.value)}>
                        <option value="metro">Metro (Mumbai, Delhi, Kolkata, Chennai)</option>
                        <option value="non">Non-Metro Cities</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="calc-results-pane">
                  <h3>HRA Exemption Summary</h3>
                  <div className="results-rows">
                    <div className="res-item">
                      <span className="res-lbl">1. Actual HRA Received</span>
                      <span className="res-val">{formatCurrency(hraRecv)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">2. Rent Paid minus 10% of Basic</span>
                      <span className="res-val">{formatCurrency(hraExcess)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">3. {hraCity === 'metro' ? '50%' : '40%'} of Basic Salary</span>
                      <span className="res-val">{formatCurrency(hraPctAmt)}</span>
                    </div>
                    <div className="res-item total-row">
                      <span className="res-lbl">Tax Exempt HRA (Minimum of above)</span>
                      <span className="res-val text-success">{formatCurrency(hraExempt)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">Taxable HRA portion</span>
                      <span className="res-val text-danger">{formatCurrency(hraTaxable)}</span>
                    </div>
                  </div>
                  <div className="calc-info-note">
                    <Info />
                    <span>HRA exemptions are calculated under Section 10(13A) of the Income Tax Act. Only available under the Old Tax Regime.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Advance Tax Calculator */}
            <div className={`calculator-view ${calcTab === 'adv' ? 'active' : ''}`}>
              <div className="calc-grid">
                <div className="calc-inputs-pane">
                  <h3>Advance Tax Estimator</h3>
                  <div className="input-group">
                    <label>Estimated Annual Taxable Income (&#8377;)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">&#8377;</span>
                      <input type="number" value={advIncome} onChange={(e) => setAdvIncome(Math.max(0, +e.target.value))} />
                    </div>
                  </div>
                  <div className="input-group-row">
                    <div className="input-group">
                      <label>TDS Already Deducted (&#8377;)</label>
                      <input type="number" value={advTds} onChange={(e) => setAdvTds(Math.max(0, +e.target.value))} />
                    </div>
                    <div className="input-group">
                      <label>Advance Tax Paid till date (&#8377;)</label>
                      <input type="number" value={advPaid} onChange={(e) => setAdvPaid(Math.max(0, +e.target.value))} />
                    </div>
                  </div>
                </div>

                <div className="calc-results-pane">
                  <h3>Advance Tax Liability</h3>
                  <div className="results-rows">
                    <div className="res-item">
                      <span className="res-lbl">Estimated Total Income Tax</span>
                      <span className="res-val">{formatCurrency(advTotalTax)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">Less: Total TDS Claimed</span>
                      <span className="res-val text-success">- {formatCurrency(advTds)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">Less: Paid Instalments</span>
                      <span className="res-val text-success">- {formatCurrency(advPaid)}</span>
                    </div>
                    <div className="res-item total-row">
                      <span className="res-lbl">Remaining Balance Due</span>
                      <span className="res-val highlight-value">{formatCurrency(advDueBalance)}</span>
                    </div>
                  </div>
                  
                  <div className="installments-timeline">
                    <h4>Recommended Payment Schedule</h4>
                    <div className="timeline-step">
                      <span className="step-date">15 Jun (15%)</span>
                      <span className="step-amt">{formatCurrency(advDueBalance * 0.15)}</span>
                    </div>
                    <div className="timeline-step">
                      <span className="step-date">15 Sep (45%)</span>
                      <span className="step-amt">{formatCurrency(advDueBalance * 0.45)}</span>
                    </div>
                    <div className="timeline-step">
                      <span className="step-date">15 Dec (75%)</span>
                      <span className="step-amt">{formatCurrency(advDueBalance * 0.75)}</span>
                    </div>
                    <div className="timeline-step">
                      <span className="step-date">15 Mar (100%)</span>
                      <span className="step-amt">{formatCurrency(advDueBalance)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TDS Calculator */}
            <div className={`calculator-view ${calcTab === 'tds' ? 'active' : ''}`}>
              <div className="calc-grid">
                <div className="calc-inputs-pane">
                  <h3>TDS Parameters</h3>
                  <div className="input-group">
                    <label>Base Payment Amount (&#8377;)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">&#8377;</span>
                      <input type="number" value={tdsAmt} onChange={(e) => setTdsAmt(Math.max(0, +e.target.value))} />
                    </div>
                  </div>
                  <div className="input-group-row">
                    <div className="input-group">
                      <label>Nature of Payment</label>
                      <select value={tdsNature} onChange={(e) => setTdsNature(e.target.value)}>
                        <option value="0">Salary (Section 192) – Slab rates apply</option>
                        <option value="1">Payments to Contractor (194C) – 1% / 2%</option>
                        <option value="10">Professional Fees (194J) – 10%</option>
                        <option value="10b">Rent on Land/Building (194I) – 10%</option>
                        <option value="5">Commission / Brokerage (194H) – 5%</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>PAN Card Status of Payee</label>
                      <select value={tdsPan} onChange={(e) => setTdsPan(e.target.value)}>
                        <option value="1">PAN Furnished (Normal Rates)</option>
                        <option value="2">No PAN Furnished (Double rates / Max 20%)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="calc-results-pane">
                  <h3>TDS Calculation Summary</h3>
                  <div className="results-rows">
                    <div className="res-item">
                      <span className="res-lbl">Gross Payable Amount</span>
                      <span className="res-val">{formatCurrency(tdsAmt)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">Applicable TDS Rate</span>
                      <span className="res-val">{(tdsBaseRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="res-item total-row">
                      <span className="res-lbl">TDS to be Deducted</span>
                      <span className="res-val text-danger">{formatCurrency(tdsDeducted)}</span>
                    </div>
                    <div className="res-item">
                      <span className="res-lbl">Net Payable to Vendor</span>
                      <span className="res-val text-success">{formatCurrency(tdsNetPayable)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 4: DUE DATE TRACKER */}
        <section className={`page ${activePage === 'tracker' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Live Counter</span>
              <h1>Due Date Tracker</h1>
              <p className="section-subtitle">Dynamic countdown cards for approaching tax tasks, categorized by remaining days and urgency.</p>
            </div>

            <div className="tracker-grid">
              {trackerItems.map((item, idx) => {
                const diff = Math.ceil((item.dueDate - todayDate) / (1000 * 60 * 60 * 24));
                let urgencyClass = 'safe';
                let urgencyLabel = `${diff} days left`;
                let visualDays = `${diff}d`;

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
                  urgencyLabel = `${diff} days left`;
                } else if (diff <= 15) {
                  urgencyClass = 'soon';
                  urgencyLabel = `${diff} days left`;
                }

                const dateStr = item.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

                return (
                  <div key={idx} className={`tracker-card ${urgencyClass}`}>
                    <div className={`t-days ${urgencyClass}`}>{visualDays}</div>
                    <div className="t-title">{item.title}</div>
                    <div className="t-date"><Calendar size={14} /> Due: {dateStr}</div>
                    <span className="t-form">{item.form}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PAGE 5: DOCUMENT CHECKLIST */}
        <section className={`page ${activePage === 'checklist' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Task Preparation</span>
              <h1>Document Compilation Checklists</h1>
              <p className="section-subtitle">Verify you have collected all required details. Progress saves automatically in your browser.</p>
            </div>

            <div className="checklist-wrap">
              {checklists.map((cl, ci) => {
                const listState = checklistState[ci] || {};
                const total = cl.items.length;
                let doneCount = 0;
                cl.items.forEach((_, ii) => {
                  if (listState[ii] === true) doneCount++;
                });
                const percentage = total > 0 ? (doneCount / total) * 100 : 0;

                return (
                  <div key={ci} className="checklist-card">
                    <h3><span className="ch-icon">{cl.icon}</span> {cl.title}</h3>
                    <div className="checklist-items">
                      {cl.items.map((item, ii) => {
                        const isDone = listState[ii] === true;
                        return (
                          <div 
                            key={ii} 
                            className="check-item" 
                            onClick={() => handleToggleCheckItem(ci, ii)}
                          >
                            <div className={`check-box ${isDone ? 'done' : ''}`}>
                              {isDone && <Check />}
                            </div>
                            <span className={`check-label ${isDone ? 'done' : ''}`}>{item}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <div className="prog-txt">{doneCount}/{total} items completed</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PAGE 6: GST RATE FINDER */}
        <section className={`page ${activePage === 'gst' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">HSN &amp; SAC Directory</span>
              <h1>GST Rate Finder</h1>
              <p className="section-subtitle">Type key terms (e.g. "laptop", "cement") or HSN numbers to find tax slabs instantly.</p>
            </div>

            <div className="finder-layout">
              <div className="search-box-wrapper">
                <SearchCode className="search-icon" />
                <input 
                  type="text" 
                  value={gstInput} 
                  onChange={(e) => setGstInput(e.target.value)} 
                  placeholder="Search goods/services, HSN codes, or sectors..." 
                />
                {gstInput && (
                  <button className="search-clear-btn" onClick={() => setGstInput('')}>
                    <X />
                  </button>
                )}
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>HSN/SAC Code</th>
                      <th>Description of Goods / Services</th>
                      <th>GST Rate</th>
                      <th>Sector Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGstList.map((g, idx) => (
                      <tr key={idx}>
                        <td><strong>{g.hsn}</strong></td>
                        <td>{g.desc}</td>
                        <td><span className={`rate-pill ${gstRateColors[g.rate] || 'r18'}`}>{g.rate}%</span></td>
                        <td><span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{g.cat}</span></td>
                      </tr>
                    ))}
                    {filteredGstList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center" style={{ padding: '24px', color: 'var(--text-secondary)' }}>
                          No matching records found. Try another search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 7: BUDGET 2025 HIGHLIGHTS */}
        <section className={`page ${activePage === 'budget' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Direct Tax Reform</span>
              <h1>Union Budget 2025 Highlights</h1>
              <p className="section-subtitle">A concise brief of the Finance Act adjustments including slabs, exemptions, and corporate duties.</p>
            </div>

            <div className="budget-dashboard">
              <div className="budget-panel-grid">
                <div className="budget-card">
                  <h3><ShieldCheck /> Personal Tax Slabs (New Regime)</h3>
                  <div className="budget-list">
                    <div className="b-list-item"><span>Up to &#8377;3,00,000</span><span className="badge badge-success">Nil</span></div>
                    <div className="b-list-item"><span>&#8377;3,00,001 – &#8377;7,00,000</span><strong>5%</strong></div>
                    <div className="b-list-item"><span>&#8377;7,00,001 – &#8377;10,00,000</span><strong>10%</strong></div>
                    <div className="b-list-item"><span>&#8377;10,00,001 – &#8377;12,00,000</span><strong>15%</strong></div>
                    <div className="b-list-item"><span>&#8377;12,00,001 – &#8377;15,00,000</span><strong>20%</strong></div>
                    <div className="b-list-item"><span>Above &#8377;15,00,000</span><strong>30%</strong></div>
                  </div>
                </div>

                <div className="budget-card">
                  <h3><GraduationCap /> Prominent Deductions</h3>
                  <div className="budget-list">
                    <div className="b-list-item"><span>Standard Deduction (New)</span><strong className="text-success">&#8377;75,000 &#8593;</strong></div>
                    <div className="b-list-item"><span>Rebate Limit u/s 87A</span><strong class="text-success">&#8377;12L Income</strong></div>
                    <div className="b-list-item"><span>NPS Employer Contrib.</span><strong className="text-success">Up to 14%</strong></div>
                    <div className="b-list-item"><span>Section 80C limit</span><strong>&#8377;1,50,000</strong></div>
                    <div className="b-list-item"><span>Section 80D (Self)</span><strong>&#8377;25,000</strong></div>
                    <div className="b-list-item"><span>Home Loan Int. (80EEA)</span><strong>&#8377;2,00,000</strong></div>
                  </div>
                </div>

                <div className="budget-card">
                  <h3><Percent /> Indirect Tax &amp; GST</h3>
                  <div className="budget-list">
                    <div className="b-list-item"><span>Health/Life Insurance Prem.</span><strong className="text-success">Proposed Exempt</strong></div>
                    <div className="b-list-item"><span>EV Battery Components</span><strong className="text-success">5% &#8595;</strong></div>
                    <div className="b-list-item"><span>Online Gaming &amp; Casinos</span><strong className="text-danger">28% Retained</strong></div>
                    <div className="b-list-item"><span>Small Business Composition</span><strong className="text-success">&#8377;2Cr limit &#8593;</strong></div>
                    <div className="b-list-item"><span>Mobile Phones &amp; Parts</span><strong className="text-success">Custom Duty 15%</strong></div>
                  </div>
                </div>

                <div className="budget-card">
                  <h3><Calculator /> Capital Gains &amp; Corporate</h3>
                  <div className="budget-list">
                    <div className="b-list-item"><span>Corporate Tax (Base)</span><strong>22% (Unchanged)</strong></div>
                    <div className="b-list-item"><span>Short-Term CG (Equity)</span><strong className="text-danger">20% &#8593;</strong></div>
                    <div className="b-list-item"><span>Long-Term CG (Exemption)</span><strong className="text-success">&#8377;1.25 Lakhs</strong></div>
                    <div className="b-list-item"><span>Long-Term CG (Equity)</span><strong className="text-danger">12.5% &#8593;</strong></div>
                    <div className="b-list-item"><span>Angel Tax (Startup)</span><strong className="text-success">Abolished</strong></div>
                    <div className="b-list-item"><span>Share Buyback Tax</span><strong className="text-danger">Taxed in hands of investor</strong></div>
                  </div>
                </div>
              </div>

              <div className="budget-summary-panel">
                <div className="panel-icon"><Info /></div>
                <div className="panel-text">
                  <strong>Official Regimen Notice:</strong> The New Tax Regime remains the baseline default choice. Old slabs can be claimed by submitting Form 10-IEA. Note that Rebate Section 87A keeps income up to &#8377;12 Lakhs exempt from taxation (net of standard deductions) under the updated budget parameters.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 8: CONTACT */}
        <section className={`page ${activePage === 'contact' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Get in Touch</span>
              <h1>Book a Free Consultation</h1>
              <p className="section-subtitle">Speak with our chartered experts regarding taxation filings, audit protocols, or GST disputes.</p>
            </div>

            <div className="contact-layout">
              <div className="contact-details-col">
                <div className="contact-item">
                  <span className="c-icon"><MapPin /></span>
                  <div className="c-text">
                    <span className="c-label">Corporate Office</span>
                    <span className="c-val">42, MG Road, Central District, Bengaluru – 560001</span>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="c-icon"><Phone /></span>
                  <div className="c-text">
                    <span className="c-label">Direct Telephone</span>
                    <span className="c-val">+91 98450 12345</span>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="c-icon"><Mail /></span>
                  <div className="c-text">
                    <span className="c-label">Email Inquiries</span>
                    <span className="c-val">hello@finezy.in</span>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="c-icon"><Clock /></span>
                  <div className="c-text">
                    <span className="c-label">Operating Hours</span>
                    <span className="c-val">Monday – Saturday: 9:00 AM – 6:30 PM</span>
                  </div>
                </div>

                <div className="contact-item highlight-whatsapp">
                  <span className="c-icon"><MessageSquare /></span>
                  <div className="c-text">
                    <span className="c-label">Instant WhatsApp Help</span>
                    <span className="c-val">+91 98450 12345</span>
                  </div>
                </div>
              </div>

              <form className="contact-form" id="consultation-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">Full Name</label>
                    <input type="text" id="contact-name" placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address</label>
                    <input type="email" id="contact-email" placeholder="john@example.com" required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-phone">Phone Number</label>
                  <input type="tel" id="contact-phone" placeholder="+91 XXXXX XXXXX" required />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-service">Required Service</label>
                  <select id="contact-service" required>
                    <option value="">Choose consulting category...</option>
                    <option value="ITR Filing">Income Tax Returns Filing</option>
                    <option value="GST Setup">GST Registration &amp; Filing</option>
                    <option value="Statutory Audit">Audit &amp; Assurance Services</option>
                    <option value="Incorporation">Private Limited Company Setup</option>
                    <option value="Bookkeeping">Corporate Accounting &amp; Ledger</option>
                    <option value="Advisory">Financial Strategy &amp; Advisory</option>
                    <option value="TDS Filing">TDS Quarterly Compliance</option>
                    <option value="Other">Other Regulatory Queries</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-msg">Requirement Description</label>
                  <textarea id="contact-msg" placeholder="Summarize your tax context or operational issue..." required></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={savingForm}>
                  <span>{savingForm ? 'Saving...' : 'Book Free Consultation'}</span>
                  <Send />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* PAGE 9: MEMBER LOGIN / SIGN UP */}
        <section className={`page ${activePage === 'login' ? 'active' : ''}`}>
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-logo">
                <span className="logo-icon"><ShieldCheck /></span>
                <h2>Fin<span>Ezy</span> Team</h2>
              </div>
              <p className="auth-subtitle">Access your professional client inquiries, lead analytics, and scheduling logs.</p>
              
              <div className="auth-toggle">
                <button 
                  type="button"
                  className={`auth-toggle-btn ${authMode === 'login' ? 'active' : ''}`} 
                  onClick={() => setAuthMode('login')}
                >
                  Sign In
                </button>
                <button 
                  type="button"
                  className={`auth-toggle-btn ${authMode === 'signup' ? 'active' : ''}`} 
                  onClick={() => setAuthMode('signup')}
                >
                  Register Team
                </button>
              </div>

              <form onSubmit={handleAuth} className="auth-form">
                <div className="form-group">
                  <label htmlFor="auth-email">Team Email</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon"><User size={16} /></span>
                    <input 
                      type="email" 
                      id="auth-email" 
                      placeholder="name@finezy.in" 
                      value={authEmail} 
                      onChange={(e) => setAuthEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="auth-password">Password</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon"><Lock size={16} /></span>
                    <input 
                      type="password" 
                      id="auth-password" 
                      placeholder="••••••••" 
                      value={authPassword} 
                      onChange={(e) => setAuthPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={authLoading}>
                  {authLoading ? (
                    <span className="flex-center-y justify-center gap-2">
                      <RefreshCw className="animate-spin" size={16} style={{ display: 'inline-block', marginRight: '6px' }} />
                      <span>{authMode === 'login' ? 'Signing in...' : 'Registering...'}</span>
                    </span>
                  ) : (
                    <span>{authMode === 'login' ? 'Sign In to Dashboard' : 'Create Team Account'}</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* PAGE 10: TEAM DASHBOARD & ANALYTICS */}
        <section className={`page ${activePage === 'dashboard' ? 'active' : ''}`}>
          {!user ? (
            <div className="unauthorized-card text-center" style={{ padding: '80px 24px' }}>
              <AlertTriangle size={48} className="text-danger" style={{ marginBottom: '16px', display: 'inline-block' }} />
              <h2>Access Restricted</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Please sign in to view the team dashboard and consultation logs.</p>
              <button className="btn-primary" onClick={() => handlePageChange('login')} style={{ display: 'inline-flex' }}>
                Go to Sign In
              </button>
            </div>
          ) : (
            <div className="dashboard-wrapper">
              <div className="dashboard-header-panel">
                <div className="db-header-title">
                  <span className="db-badge">Active Session</span>
                  <h1>Team Portal &amp; Analytics</h1>
                  <p>Welcome back, <strong>{user.email}</strong>. Here is your dashboard overview.</p>
                </div>
                <div className="db-actions">
                  <button className="btn-secondary" onClick={fetchConsultationsData} disabled={loadingConsultations} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <RefreshCw size={14} className={loadingConsultations ? 'animate-spin' : ''} style={{ marginRight: '6px' }} />
                    Sync Data
                  </button>
                  <button className="btn-secondary" onClick={handleSignOut} style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--danger)', borderColor: 'var(--danger-light)' }}>
                    <LogOut size={14} style={{ marginRight: '6px' }} />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Analytics widgets */}
              <div className="dashboard-stats-grid">
                <div className="db-stat-card">
                  <div className="db-stat-icon-wrapper blue">
                    <MessageSquare size={20} />
                  </div>
                  <div className="db-stat-info">
                    <span className="db-stat-number">{consultations.length}</span>
                    <span className="db-stat-label">Total Inquiries</span>
                  </div>
                </div>

                <div className="db-stat-card">
                  <div className="db-stat-icon-wrapper green">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="db-stat-info">
                    <span className="db-stat-number">
                      {consultations.filter(c => c.created_at && new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                    </span>
                    <span className="db-stat-label">New This Week</span>
                  </div>
                </div>

                <div className="db-stat-card">
                  <div className="db-stat-icon-wrapper orange">
                    <Briefcase size={20} />
                  </div>
                  <div className="db-stat-info">
                    {/* Most requested service */}
                    <span className="db-stat-number" style={{ fontSize: '1.15rem', padding: '4px 0' }}>
                      {(() => {
                        if (consultations.length === 0) return 'None';
                        const serviceCounts = {};
                        consultations.forEach(c => {
                          if (c.service) {
                            serviceCounts[c.service] = (serviceCounts[c.service] || 0) + 1;
                          }
                        });
                        let maxService = 'None';
                        let maxCount = 0;
                        Object.entries(serviceCounts).forEach(([svc, count]) => {
                          if (count > maxCount) {
                            maxCount = count;
                            maxService = svc;
                          }
                        });
                        return maxService.length > 18 ? maxService.substring(0, 16) + '...' : maxService;
                      })()}
                    </span>
                    <span className="db-stat-label">Top Service Category</span>
                  </div>
                </div>
              </div>

              {/* Distribution Charts */}
              <div className="dashboard-two-column">
                <div className="dashboard-card chart-card">
                  <h3>Service Request Distribution</h3>
                  <p className="card-subtitle">Inquiry count and percentage breakdown by selected category.</p>
                  
                  <div className="chart-bars-list" style={{ marginTop: '20px' }}>
                    {(() => {
                      if (consultations.length === 0) {
                        return <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '24px 0' }}>No submissions data available.</p>;
                      }
                      
                      const serviceCounts = {};
                      consultations.forEach(c => {
                        if (c.service) {
                          serviceCounts[c.service] = (serviceCounts[c.service] || 0) + 1;
                        }
                      });

                      return Object.entries(serviceCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([svc, count]) => {
                          const pct = ((count / consultations.length) * 100).toFixed(0);
                          return (
                            <div className="chart-bar-item" key={svc}>
                              <div className="chart-bar-info">
                                <span className="chart-bar-name">{svc}</span>
                                <span className="chart-bar-count"><strong>{count}</strong> ({pct}%)</span>
                              </div>
                              <div className="chart-bar-track">
                                <div className="chart-bar-fill" style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        });
                    })()}
                  </div>
                </div>

                <div className="dashboard-card info-summary-card">
                  <h3>Team Operations Guide</h3>
                  <div className="ops-list" style={{ marginTop: '16px' }}>
                    <div className="ops-item">
                      <div className="ops-bullet">1</div>
                      <div className="ops-content">
                        <strong>Review New Inquiries</strong>
                        <p>Acknowledge client consultation submissions within 24 hours of standard submission timestamps.</p>
                      </div>
                    </div>
                    <div className="ops-item">
                      <div className="ops-bullet">2</div>
                      <div className="ops-content">
                        <strong>Verify Details</strong>
                        <p>Before calling, cross-examine the client's preferred filing category (e.g., GST vs Income Tax).</p>
                      </div>
                    </div>
                    <div className="ops-item">
                      <div className="ops-bullet">3</div>
                      <div className="ops-content">
                        <strong>Update Consultation Status</strong>
                        <p>Keep records organized. Direct questions to the primary compliance auditor.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Logs CRM Table */}
              <div className="dashboard-card table-card" style={{ marginTop: '24px' }}>
                <div className="table-card-header">
                  <h3>Recent Consultation Logs</h3>
                  <span className="total-rows-badge">{consultations.length} records</span>
                </div>
                
                {loadingConsultations ? (
                  <div className="table-loading text-center" style={{ padding: '48px 0' }}>
                    <RefreshCw size={24} className="animate-spin text-primary" style={{ margin: '0 auto 12px auto' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Loading submissions from Supabase...</p>
                  </div>
                ) : consultations.length === 0 ? (
                  <div className="table-empty text-center" style={{ padding: '48px 0' }}>
                    <MessageSquare size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 12px auto', display: 'inline-block' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No consultation requests registered in database yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive" style={{ marginTop: '16px' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Contact Info</th>
                          <th>Required Service</th>
                          <th>Requirement Description</th>
                          <th>Submitted At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultations.map((c) => {
                          const dateStr = c.created_at 
                            ? new Date(c.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'N/A';
                          return (
                            <tr key={c.id}>
                              <td><strong>{c.name}</strong></td>
                              <td>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.email}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{c.phone}</div>
                              </td>
                              <td><span className="category-tag tag-it">{c.service}</span></td>
                              <td><span className="table-msg-clamp" title={c.message} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.85rem' }}>{c.message}</span></td>
                              <td><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{dateStr}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon"><ShieldCheck /></span>
              <span>Fin<span className="brand-highlight">Ezy</span></span>
            </div>
            <p>Your comprehensive resource center for direct tax, indirect tax, and corporate compliance metrics.</p>
          </div>

          <div className="footer-links-col">
            <h4>Resources</h4>
            <button onClick={() => handlePageChange('home')}>Home Dashboard</button>
            <button onClick={() => handlePageChange('calendar')}>Due Date Calendar</button>
            <button onClick={() => handlePageChange('calculator')}>Tax Calculators</button>
            <button onClick={() => handlePageChange('gst')}>GST Rates finder</button>
            <button onClick={() => handlePageChange('contact')}>Consulting Booking</button>
          </div>

          <div className="footer-copy-col">
            <p>&copy; 2026 FinEzy. Crafted for CA professionals, students, and businesses.</p>
            <p className="disclaimer">Disclaimer: Calculations provided are estimates. Always cross-verify calculations against official notifications before executing filing returns.</p>
          </div>
        </div>
      </footer>

      {/* CUSTOM TOAST NOTIFICATIONS */}
      <div id="toast-container" className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div className="toast-icon">
              {t.type === 'success' ? <CheckCircle2 /> : t.type === 'error' ? <AlertTriangle /> : <Info />}
            </div>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              <div className="toast-message">{t.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(t.id)}><X size={14} /></button>
          </div>
        ))}
      </div>
    </>
  );
}
