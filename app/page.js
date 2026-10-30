"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Award, Calendar, ArrowRight, AlarmClock, Calculator, Database, 
  GraduationCap, CalendarClock, Wallet, Hourglass, ListChecks, SearchCode, 
  TrendingUp, ChevronRight, Menu, X, ChevronLeft, Percent, Home, ArrowUpRight, 
  Scissors, Info, MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, AlertCircle,
  AlertTriangle, Check, LogIn, LogOut, LayoutDashboard, User, Users, Lock, RefreshCw, 
  Briefcase, Download, FileSpreadsheet, UploadCloud, FileCheck, Layers, FileDown, 
  SlidersHorizontal, CheckSquare, Eye, FileText, Printer, Building2,
  Wrench, BookOpen, Bookmark, Search, ExternalLink, Star, ChevronDown, ChevronUp, BookmarkCheck, Globe, Link2, Copy
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import BookConsultationForm from '../components/BookConsultationForm';
import ProtectedRoute from '../components/ProtectedRoute';
import { auth } from '../lib/firebase';
import { 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

/* SUPABASE CONFIGURATION */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Senior CA Compliance Calendar Engine
 * Dynamically generates statutory Indian tax and corporate filing deadlines
 * tailored for any respective month and year.
 */
const getComplianceCalendarForMonth = (year, month) => {
  const prevMonthName = months[(month + 11) % 12];
  
  // Standard recurring statutory deadlines for every month
  const items = [
    {
      date: '07',
      form: 'TDS / TCS Deposit',
      desc: `Deposit of Tax Deducted/Collected at Source for ${prevMonthName} filings u/s 200(1) / 206C`,
      cat: 'tds',
      catLabel: 'TDS / TCS'
    },
    {
      date: '10',
      form: 'GSTR-7 & GSTR-8',
      desc: `GST TDS return (GSTR-7) & TCS statement for E-commerce operators (GSTR-8) for ${prevMonthName}`,
      cat: 'gst',
      catLabel: 'GST'
    },
    {
      date: '11',
      form: 'GSTR-1',
      desc: `Outward supplies return for monthly regular taxpayers for ${prevMonthName} supplies`,
      cat: 'gst',
      catLabel: 'GST'
    },
    {
      date: '13',
      form: 'GSTR-6 / IFF',
      desc: `Input Service Distributor (ISD) return & Invoice Furnishing Facility (IFF) for QRMP taxpayers`,
      cat: 'gst',
      catLabel: 'GST'
    },
    {
      date: '15',
      form: 'PF & ESI Deposit',
      desc: `Monthly statutory remittance of EPF (Provident Fund) & ESIC for ${prevMonthName} payroll`,
      cat: 'pf',
      catLabel: 'PF/ESI'
    },
    {
      date: '15',
      form: 'Form 24G',
      desc: `Government Drawing & Disbursing Officers TDS book entry summary for ${prevMonthName}`,
      cat: 'tds',
      catLabel: 'TDS'
    },
    {
      date: '20',
      form: 'GSTR-3B',
      desc: `Monthly summary return & statutory tax liability discharge for ${prevMonthName} supplies`,
      cat: 'gst',
      catLabel: 'GST'
    },
    {
      date: '20',
      form: 'GSTR-5 / 5A',
      desc: `Summary return for non-resident foreign taxable persons & OIDAR service providers for ${prevMonthName}`,
      cat: 'gst',
      catLabel: 'GST'
    },
    {
      date: '30',
      form: 'Form 26QB / QC / QD',
      desc: `Challan-cum-statement of TDS on property sale (26QB), rent > ₹50,000 (26QC), and contractor payouts (26QD)`,
      cat: 'tds',
      catLabel: 'TDS'
    }
  ];

  // QRMP PMT-06 challan on 25th (only for M1 and M2 of each quarter)
  const isQuarterEndMonth = [2, 5, 8, 11].includes(month); // Mar, Jun, Sep, Dec
  if (!isQuarterEndMonth) {
    items.push({
      date: '25',
      form: 'GST PMT-06',
      desc: `Monthly challan payment under QRMP scheme (Fixed Sum or Self Assessment method)`,
      cat: 'gst',
      catLabel: 'GST'
    });
  }

  // Month-specific & Statutory quarter-end deadlines
  if (month === 0) { // JANUARY
    items.push(
      { date: '15', form: 'Form 15G/15H', desc: 'Quarterly submission of declarations received in Q3 (Oct-Dec)', cat: 'it', catLabel: 'Income Tax' },
      { date: '22', form: 'GSTR-3B (QRMP Q3)', desc: 'Quarterly return for Category 1 States (Southern & Western states)', cat: 'gst', catLabel: 'GST' },
      { date: '24', form: 'GSTR-3B (QRMP Q3)', desc: 'Quarterly return for Category 2 States (Northern & Eastern states)', cat: 'gst', catLabel: 'GST' },
      { date: '31', form: 'Form 26Q / 24Q (Q3)', desc: 'Quarterly TDS return statement for October-December (Q3)', cat: 'tds', catLabel: 'TDS' }
    );
  } else if (month === 2) { // MARCH
    items.push(
      { date: '15', form: 'Advance Tax (Q4)', desc: 'Fourth & final installment of Advance Tax (100% of tax liability) u/s 211', cat: 'it', catLabel: 'Income Tax' },
      { date: '31', form: 'Belated / Revised ITR', desc: 'Final deadline for filing Belated/Revised ITR u/s 139(4)/(5) & Annual Financial Year closing', cat: 'it', catLabel: 'Income Tax' }
    );
  } else if (month === 3) { // APRIL
    items.push(
      { date: '22', form: 'GSTR-3B (QRMP Q4)', desc: 'Quarterly return for Category 1 States (Jan-Mar supplies)', cat: 'gst', catLabel: 'GST' },
      { date: '24', form: 'GSTR-3B (QRMP Q4)', desc: 'Quarterly return for Category 2 States (Jan-Mar supplies)', cat: 'gst', catLabel: 'GST' },
      { date: '30', form: 'TDS Deposit for March', desc: 'Statutory extended due date for deposit of TDS deducted in March u/s 200(1)', cat: 'tds', catLabel: 'TDS' },
      { date: '30', form: 'Form 15G/15H', desc: 'Submission of quarterly declarations received in Q4 (Jan-Mar)', cat: 'it', catLabel: 'Income Tax' }
    );
  } else if (month === 4) { // MAY
    items.push(
      { date: '31', form: 'Form 26Q / 24Q (Q4)', desc: 'Quarterly TDS return statement for January-March (Q4)', cat: 'tds', catLabel: 'TDS' },
      { date: '31', form: 'Form 61A (SFT)', desc: 'Statement of Financial Transactions u/s 285BA for high-value reporting entities', cat: 'it', catLabel: 'Income Tax' }
    );
  } else if (month === 5) { // JUNE
    items.push(
      { date: '15', form: 'Advance Tax (Q1)', desc: 'First installment of Advance Tax (15% of estimated tax liability) u/s 211', cat: 'it', catLabel: 'Income Tax' },
      { date: '15', form: 'Form 16 / 16A', desc: 'Mandatory issuance of annual TDS Certificate (Form 16) to salaried employees u/s 203', cat: 'tds', catLabel: 'TDS' }
    );
  } else if (month === 6) { // JULY
    items.push(
      { date: '15', form: 'Form 15G/15H', desc: 'Submission of quarterly declarations received in Q1 (Apr-Jun)', cat: 'it', catLabel: 'Income Tax' },
      { date: '22', form: 'GSTR-3B (QRMP Q1)', desc: 'Quarterly return for Category 1 States (Apr-Jun supplies)', cat: 'gst', catLabel: 'GST' },
      { date: '24', form: 'GSTR-3B (QRMP Q1)', desc: 'Quarterly return for Category 2 States (Apr-Jun supplies)', cat: 'gst', catLabel: 'GST' },
      { date: '31', form: 'ITR-1 / ITR-2 / ITR-4', desc: 'Income Tax Return statutory deadline for Non-Audit individuals, HUFs, & firms u/s 139(1)', cat: 'it', catLabel: 'Income Tax' },
      { date: '31', form: 'Form 26Q / 24Q (Q1)', desc: 'Quarterly TDS return statement for April-June (Q1)', cat: 'tds', catLabel: 'TDS' }
    );
  } else if (month === 8) { // SEPTEMBER
    items.push(
      { date: '15', form: 'Advance Tax (Q2)', desc: 'Second installment of Advance Tax (45% of estimated tax liability) u/s 211', cat: 'it', catLabel: 'Income Tax' },
      { date: '30', form: 'Tax Audit u/s 44AB', desc: 'Filing of Tax Audit Report (Form 3CA/3CB-3CD) with Income Tax Department', cat: 'it', catLabel: 'Income Tax' },
      { date: '30', form: 'MCA Statutory AGM', desc: 'Mandatory holding of Annual General Meeting for Companies under Companies Act 2013', cat: 'mca', catLabel: 'MCA' }
    );
  } else if (month === 9) { // OCTOBER
    items.push(
      { date: '15', form: 'Form 15G/15H', desc: 'Submission of quarterly declarations received in Q2 (Jul-Sep)', cat: 'it', catLabel: 'Income Tax' },
      { date: '22', form: 'GSTR-3B (QRMP Q2)', desc: 'Quarterly return for Category 1 States (Jul-Sep supplies)', cat: 'gst', catLabel: 'GST' },
      { date: '24', form: 'GSTR-3B (QRMP Q2)', desc: 'Quarterly return for Category 2 States (Jul-Sep supplies)', cat: 'gst', catLabel: 'GST' },
      { date: '29', form: 'AOC-4 (MCA Filing)', desc: 'Annual filing of balance sheet & P&L with ROC (within 30 days of AGM u/s 137)', cat: 'mca', catLabel: 'MCA' },
      { date: '31', form: 'Corporate & Audit ITR', desc: 'IT Return filing for Corporate Assessees & Tax Audit clients u/s 139(1)', cat: 'it', catLabel: 'Income Tax' },
      { date: '31', form: 'Form 26Q / 24Q (Q2)', desc: 'Quarterly TDS return statement for July-September (Q2)', cat: 'tds', catLabel: 'TDS' }
    );
  } else if (month === 10) { // NOVEMBER
    items.push(
      { date: '15', form: 'Form 3CEB', desc: 'Accountant Transfer Pricing Report u/s 92E for international & specified domestic transactions', cat: 'it', catLabel: 'Income Tax' },
      { date: '29', form: 'MGT-7 / 7A (MCA)', desc: 'Filing of Annual Return with ROC (within 60 days of AGM u/s 92)', cat: 'mca', catLabel: 'MCA' },
      { date: '30', form: 'Transfer Pricing ITR', desc: 'ITR filing deadline for taxpayers covered under Transfer Pricing Section 92E', cat: 'it', catLabel: 'Income Tax' }
    );
  } else if (month === 11) { // DECEMBER
    items.push(
      { date: '15', form: 'Advance Tax (Q3)', desc: 'Third installment of Advance Tax (75% of estimated tax liability) u/s 211', cat: 'it', catLabel: 'Income Tax' },
      { date: '31', form: 'GSTR-9 & GSTR-9C', desc: 'GST Annual Return & Reconciliation Statement for the previous Financial Year', cat: 'gst', catLabel: 'GST' }
    );
  }

  // Sort ascending by day of the month
  return items.sort((a, b) => parseInt(a.date, 10) - parseInt(b.date, 10));
};

const calData = getComplianceCalendarForMonth(new Date().getFullYear(), new Date().getMonth());

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

const getDynamicTrackerItems = (baseDate) => {
  const d = baseDate || new Date();
  const y = d.getFullYear();
  const m = d.getMonth();

  const createDate = (day, targetMonthOffset = 0) => {
    return new Date(y, m + targetMonthOffset, day);
  };

  const nextGstr1 = d.getDate() > 11 ? createDate(11, 1) : createDate(11, 0);
  const nextTds = d.getDate() > 7 ? createDate(7, 1) : createDate(7, 0);
  const nextPf = d.getDate() > 15 ? createDate(15, 1) : createDate(15, 0);
  const nextGstr3b = d.getDate() > 20 ? createDate(20, 1) : createDate(20, 0);
  const next26qb = d.getDate() > 30 ? createDate(30, 1) : createDate(30, 0);

  let advTaxDate;
  if (m < 5 || (m === 5 && d.getDate() <= 15)) {
    advTaxDate = new Date(y, 5, 15);
  } else if (m < 8 || (m === 8 && d.getDate() <= 15)) {
    advTaxDate = new Date(y, 8, 15);
  } else if (m < 11 || (m === 11 && d.getDate() <= 15)) {
    advTaxDate = new Date(y, 11, 15);
  } else {
    advTaxDate = new Date(y + 1, 2, 15);
  }

  let itrDate;
  if (m < 6 || (m === 6 && d.getDate() <= 31)) {
    itrDate = new Date(y, 6, 31);
  } else if (m < 9 || (m === 9 && d.getDate() <= 31)) {
    itrDate = new Date(y, 9, 31);
  } else {
    itrDate = new Date(y + 1, 6, 31);
  }

  return [
    { title: 'GSTR-3B Return Filing', form: 'GST', dueDate: nextGstr3b },
    { title: 'TDS Deposit Payment', form: 'TDS', dueDate: nextTds },
    { title: 'GSTR-1 Outward Supplies', form: 'GST', dueDate: nextGstr1 },
    { title: 'PF & ESI Monthly Deposit', form: 'PF/ESI', dueDate: nextPf },
    { title: 'Advance Tax Instalment', form: 'Income Tax', dueDate: advTaxDate },
    { title: 'Form 26QB / QC Statement', form: 'TDS', dueDate: next26qb },
    { title: 'ITR Statutory Filing', form: 'Income Tax', dueDate: itrDate },
    { title: 'ROC / MCA Compliance', form: 'MCA', dueDate: m <= 9 ? new Date(y, 9, 29) : new Date(y + 1, 9, 29) }
  ].sort((a, b) => a.dueDate - b.dueDate);
};

const trackerItems = getDynamicTrackerItems(new Date());

/* GSTR-3B RECONCILIATION DATASET */
const defaultGstrInvoices = [
  {
    id: 'inv-1',
    supplier: 'Tata Motors Commercial Fleet Ltd',
    gstin: '27AAACT2727Q1ZW',
    invNo: 'INV-2026-8821',
    date: '12 May 2026',
    hsn: '8703',
    taxable: 1250000,
    igst: 0,
    cgst: 175000,
    sgst: 175000,
    taxTotal: 350000,
    autoStatus: 'ineligible',
    autoReason: 'Blocked u/s 17(5)(a) - Passenger Motor Vehicle',
    override: 'ineligible',
    remarks: 'Blocked credit under 17(5) - Passenger car purchase'
  },
  {
    id: 'inv-2',
    supplier: 'Infosys Cloud Infrastructure Services',
    gstin: '29AAACI4916K1Z0',
    invNo: 'INF-CLOUD-9014',
    date: '08 May 2026',
    hsn: '9983',
    taxable: 420000,
    igst: 75600,
    cgst: 0,
    sgst: 0,
    taxTotal: 75600,
    autoStatus: 'eligible',
    autoReason: 'All Other ITC - Input Services',
    override: 'eligible',
    remarks: 'Eligible SaaS cloud hosting & software subscription'
  },
  {
    id: 'inv-3',
    supplier: 'Grand Hyatt Banquets & Catering',
    gstin: '27AABCT3312P1ZL',
    invNo: 'CAT-2026-0419',
    date: '15 May 2026',
    hsn: '9963',
    taxable: 180000,
    igst: 0,
    cgst: 16200,
    sgst: 16200,
    taxTotal: 32400,
    autoStatus: 'ineligible',
    autoReason: 'Blocked u/s 17(5)(b) - Food & Outdoor Catering',
    override: 'ineligible',
    remarks: 'Blocked u/s 17(5) - Corporate anniversary catering'
  },
  {
    id: 'inv-4',
    supplier: 'Godrej Office Infrastructure Ltd',
    gstin: '27AAACG0829M1ZF',
    invNo: 'GDJ-77210',
    date: '22 May 2026',
    hsn: '9403',
    taxable: 340000,
    igst: 0,
    cgst: 30600,
    sgst: 30600,
    taxTotal: 61200,
    autoStatus: 'eligible',
    autoReason: 'Capital Goods ITC - Plant/Office',
    override: 'eligible',
    remarks: 'Capitalized office workstations & server racks'
  },
  {
    id: 'inv-5',
    supplier: 'Apex Transfreight Logistics GTA',
    gstin: '24AABCA5512B1ZX',
    invNo: 'APX-TR-3011',
    date: '18 May 2026',
    hsn: '9965',
    taxable: 95000,
    igst: 4750,
    cgst: 0,
    sgst: 0,
    taxTotal: 4750,
    autoStatus: 'flagged',
    autoReason: 'Flagged: Verify RCM vs Forward Charge GTA',
    override: 'eligible',
    remarks: 'Forward charge 5% freight paid on raw materials transport'
  }
];

const digitalLibraryBlueprint = [
  {
    hubId: 'gst',
    hubTitle: 'Goods and Services Tax (GST) Hub',
    hubBadge: 'CBIC & GSTN',
    description: 'Statutory Bare Acts, CGST Rules with amendments, chronological notifications, and GST Returns Compliance Desk.',
    sections: [
      {
        sectionId: 'gst-statutory',
        title: 'Statutory Framework (Central & State)',
        subtitle: 'Direct links to official Bare Acts on CBIC website, categorized rules, and circulars',
        iconName: 'Building2',
        items: [
          {
            id: 'gst-cgst-act',
            title: 'Central Goods and Services Tax (CGST) Act, 2017',
            desc: 'Official bare act provisions on levy, time/value of supply, Input Tax Credit (Sec 16-21), and assessment procedures.',
            url: 'https://taxinformation.cbic.gov.in/content-page/explore-act',
            domain: 'CBIC Portal',
            domainClass: 'domain-cbic',
            tags: ['Central Tax', 'Bare Act', 'Sections 1-174']
          },
          {
            id: 'gst-igst-act',
            title: 'Integrated Goods and Services Tax (IGST) Act, 2017',
            desc: 'Statutory rules governing inter-state supplies, place of supply rules (Sec 10-13), zero-rated export supplies, and refund mechanisms.',
            url: 'https://taxinformation.cbic.gov.in/content-page/explore-act',
            domain: 'CBIC Portal',
            domainClass: 'domain-cbic',
            tags: ['Integrated Tax', 'Bare Act', 'Place of Supply']
          },
          {
            id: 'gst-rules-2017',
            title: 'CGST Rules, 2017 (Categorized with Latest Amendments)',
            desc: 'Comprehensive procedural rules categorized by year: Invoicing rules, E-Way Bill (Rule 138), Rule 37/37A ITC reversal, and Rule 42/43 apportionment.',
            url: 'https://taxinformation.cbic.gov.in/content-page/explore-rules',
            domain: 'CBIC Portal',
            domainClass: 'domain-cbic',
            tags: ['CGST Rules', 'Rule 37A', 'Rule 42/43']
          },
          {
            id: 'gst-utgst-act',
            title: 'Union Territory Goods and Services Tax (UTGST) Act, 2017',
            desc: 'Statutory provisions for levy and collection of tax on intra-UT supplies in Union Territories without legislature.',
            url: 'https://taxinformation.cbic.gov.in/content-page/explore-act',
            domain: 'CBIC Portal',
            domainClass: 'domain-cbic',
            tags: ['UTGST', 'Bare Act']
          },
          {
            id: 'gst-notifs-central',
            title: 'CBIC Notifications — Central Tax',
            desc: 'Chronological repository of official gazette notifications prescribing compliance extensions, threshold changes, and new return mandates.',
            url: 'https://taxinformation.cbic.gov.in/content-page/explore-notification',
            domain: 'CBIC Portal',
            domainClass: 'domain-cbic',
            tags: ['Central Tax', 'Chronological', 'Notifications']
          },
          {
            id: 'gst-notifs-rate',
            title: 'CBIC Notifications — Tax Slabs & Rate Schedules',
            desc: 'Official tariff schedules classifying goods and services under 0%, 5%, 12%, 18%, and 28% brackets with compensation cess rates.',
            url: 'https://taxinformation.cbic.gov.in/content-page/explore-notification',
            domain: 'CBIC Portal',
            domainClass: 'domain-cbic',
            tags: ['Rate', 'Tariff Slabs', 'Exemptions']
          },
          {
            id: 'gst-circulars',
            title: 'CBIC GST Circulars & Clarifications',
            desc: 'Binding administrative guidelines clarifying ITC matching, corporate guarantee valuation (Rule 28(2)), and pre-deposit norms for appellate tribunals.',
            url: 'https://taxinformation.cbic.gov.in/content-page/explore-circulars',
            domain: 'CBIC Portal',
            domainClass: 'domain-cbic',
            tags: ['Circulars', 'Statutory Clarification']
          }
        ]
      },
      {
        sectionId: 'gst-compliance',
        title: 'GST Returns (Compliance Desk)',
        subtitle: 'Direct links to outward supply, ITC reconciliation, and annual filing desks on the GST Portal',
        iconName: 'FileSpreadsheet',
        items: [
          {
            id: 'gst-gstr-1',
            title: 'GSTR-1 — Outward Supplies Statement',
            desc: 'Mandatory monthly/quarterly return for reporting B2B taxable supplies, B2C invoices, exports, debit/credit notes, and nil-rated turnover.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Outward Supplies', 'Monthly / QRMP', 'B2B & B2C']
          },
          {
            id: 'gst-iff',
            title: 'Invoice Furnishing Facility (IFF)',
            desc: 'Quarterly Return Monthly Payment (QRMP) mechanism allowing small taxpayers to upload B2B invoices in Months 1 and 2 for buyer ITC pass-through.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Outward Supplies', 'QRMP Scheme', 'Optional']
          },
          {
            id: 'gst-gstr-2b',
            title: 'GSTR-2B — Static Auto-Drafted ITC Statement',
            desc: 'Crucial for tax reconciliation: static monthly statement frozen on the 14th indicating ITC eligible, ineligible u/s 17(5), and RCM inward supplies.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Input Tax Credit', 'Static Reconciliation', 'Auto-Drafted']
          },
          {
            id: 'gst-gstr-2a',
            title: 'GSTR-2A — Dynamic Inward Supply Statement',
            desc: 'Real-time read-only statement reflecting supplier invoice uploads, amendments, and import data from ICEGATE customs portal.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Input Tax Credit', 'Dynamic View', 'ICEGATE']
          },
          {
            id: 'gst-gstr-3b',
            title: 'GSTR-3B — Summarized Return & Tax Settlement',
            desc: 'Self-assessed monthly summary return for discharging output tax liability through electronic cash/credit ledgers and claiming eligible ITC.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Summarized Return', 'Tax Payment', 'Table 4 ITC']
          },
          {
            id: 'gst-gstr-9',
            title: 'GSTR-9 — Annual GST Return',
            desc: 'Comprehensive annual consolidation of outward supplies, inward supplies received, taxes paid, and ITC reversals for the financial year.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Annual Return', 'Consolidation', 'Regular Taxpayers']
          },
          {
            id: 'gst-gstr-9c',
            title: 'GSTR-9C — Annual Reconciliation Statement',
            desc: 'Statutory reconciliation statement u/s 44 matching audited annual financial statements with GSTR-9 turnover, rate-wise tax, and ITC.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Annual Return', 'Turnover > ₹5 Cr', 'Audit Reconcile']
          },
          {
            id: 'gst-gstr-4',
            title: 'GSTR-4 — Annual Return for Composition Taxpayers',
            desc: 'Simplified annual return for taxpayers enrolled in the composition levy scheme under Section 10 of the CGST Act.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Specialized', 'Composition Scheme', 'Section 10']
          },
          {
            id: 'gst-gstr-7',
            title: 'GSTR-7 — Monthly Return for Tax Deducted at Source (TDS)',
            desc: 'Filing desk for government departments and notified agencies deducting 2% GST TDS under Section 51 on contractual payments exceeding ₹2.5L.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Specialized', 'GST TDS', 'Section 51']
          },
          {
            id: 'gst-gstr-8',
            title: 'GSTR-8 — Statement for Tax Collected at Source (TCS)',
            desc: 'Monthly statement for e-commerce operators reporting net value of taxable supplies made through their platform and TCS collected under Section 52.',
            url: 'https://www.gst.gov.in/',
            domain: 'GSTN Portal',
            domainClass: 'domain-gstn',
            tags: ['Specialized', 'E-Commerce TCS', 'Section 52']
          }
        ]
      }
    ]
  },
  {
    hubId: 'direct_tax',
    hubTitle: 'Direct Tax & PAN Center',
    hubBadge: 'ITD & CBDT',
    description: 'Income Tax Act & Rules framework, assessment year-wise ITR compliance forms, and official PAN application/modification services.',
    sections: [
      {
        sectionId: 'dt-framework',
        title: 'Income Tax Framework & Law',
        subtitle: 'Section-wise bare act index, rule-wise index, and filterable CBDT circulars/notifications',
        iconName: 'Building2',
        items: [
          {
            id: 'dt-act-1961',
            title: 'Income Tax Act, 1961 (Section-wise Bare Act Index)',
            desc: 'Official section-by-section statutory repository: Sec 115BAC (New Tax Regime), Sec 44AB (Tax Audit), Sec 194C/J/Q (TDS), and Capital Gains u/s 111A/112A.',
            url: 'https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx',
            domain: 'Income Tax India',
            domainClass: 'domain-itd',
            tags: ['Bare Act', 'Section Index', 'Direct Tax']
          },
          {
            id: 'dt-rules-1962',
            title: 'Income Tax Rules, 1962 (Rule-wise Bare Rules Index)',
            desc: 'Complete procedural rules covering valuation of perquisites (Rule 3), depreciation schedule (Rule 5), safe harbour margins, and Form 3CD audit reporting.',
            url: 'https://incometaxindia.gov.in/pages/rules/income-tax-rules-1962.aspx',
            domain: 'Income Tax India',
            domainClass: 'domain-itd',
            tags: ['Bare Rules', 'Rule Index', 'Depreciation']
          },
          {
            id: 'dt-circulars',
            title: 'CBDT Circulars & Administrative Instructions',
            desc: 'Filterable by issue date and subject: TDS deduction on salaries, condonation of delay u/s 119(2)(b), and Section 43B(h) MSME payment clarifications.',
            url: 'https://incometaxindia.gov.in/pages/communications/circulars.aspx',
            domain: 'CBDT Portal',
            domainClass: 'domain-itd',
            tags: ['Circulars', 'CBDT Guidance', 'Filterable']
          },
          {
            id: 'dt-notifs',
            title: 'CBDT Statutory Notifications',
            desc: 'Official gazette notifications notifying revised ITR utilities, cost inflation index (CII), safe harbour thresholds, and international tax protocols.',
            url: 'https://incometaxindia.gov.in/pages/communications/notifications.aspx',
            domain: 'CBDT Portal',
            domainClass: 'domain-itd',
            tags: ['Notifications', 'Official Gazette']
          },
          {
            id: 'dt-dtaa',
            title: 'Double Taxation Avoidance Agreements (DTAA Master Index)',
            desc: 'Comprehensive bilateral tax treaties between India and 90+ foreign jurisdictions governing withholding tax rates on royalties, FTS, and dividends.',
            url: 'https://incometaxindia.gov.in/pages/international-taxation/dtaa.aspx',
            domain: 'Income Tax India',
            domainClass: 'domain-itd',
            tags: ['International Tax', 'DTAA Treaties', 'Withholding']
          }
        ]
      },
      {
        sectionId: 'dt-itr',
        title: 'Income Tax Returns (ITR Compliance Desk)',
        subtitle: 'Official e-filing utilities categorized by entity type and assessment year',
        iconName: 'FileText',
        items: [
          {
            id: 'dt-itr-1',
            title: 'ITR-1 (Sahaj) — Salaried Individuals',
            desc: 'For resident individuals having total income up to ₹50 Lakhs from Salaries, one house property, and other sources (interest/dividends).',
            url: 'https://www.incometax.gov.in/iec/foportal/',
            domain: 'ITD e-Filing',
            domainClass: 'domain-itd',
            tags: ['Individuals/HUF', 'Salaried', 'Income < ₹50L']
          },
          {
            id: 'dt-itr-2',
            title: 'ITR-2 — Non-Business Capital Gains & Multiple Properties',
            desc: 'For individuals and HUFs having capital gains, foreign assets, agricultural income > ₹5,000, or multiple house properties, without business income.',
            url: 'https://www.incometax.gov.in/iec/foportal/',
            domain: 'ITD e-Filing',
            domainClass: 'domain-itd',
            tags: ['Individuals/HUF', 'Capital Gains', 'Foreign Assets']
          },
          {
            id: 'dt-itr-3',
            title: 'ITR-3 — Business or Professional Income',
            desc: 'For individuals and HUFs having income from proprietary business, profession, or partnership firm interest/remuneration (including tax audit cases).',
            url: 'https://www.incometax.gov.in/iec/foportal/',
            domain: 'ITD e-Filing',
            domainClass: 'domain-itd',
            tags: ['Individuals/HUF', 'PGBP Business', 'Tax Audit u/s 44AB']
          },
          {
            id: 'dt-itr-4',
            title: 'ITR-4 (Sugam) — Presumptive Taxation Scheme',
            desc: 'For resident individuals, HUFs, and partnership firms (non-LLP) with total income up to ₹50L adopting presumptive taxation u/s 44AD, 44ADA, or 44AE.',
            url: 'https://www.incometax.gov.in/iec/foportal/',
            domain: 'ITD e-Filing',
            domainClass: 'domain-itd',
            tags: ['Individuals/HUF', 'Presumptive', 'Sec 44AD/ADA']
          },
          {
            id: 'dt-itr-5',
            title: 'ITR-5 — Partnership Firms, LLPs, AOPs & BOIs',
            desc: 'For partnership firms, Limited Liability Partnerships (LLPs), Association of Persons, Body of Individuals, and Artificial Juridical Persons.',
            url: 'https://www.incometax.gov.in/iec/foportal/',
            domain: 'ITD e-Filing',
            domainClass: 'domain-itd',
            tags: ['Corporate/Firms', 'LLP & Partnership', 'AOP/BOI']
          },
          {
            id: 'dt-itr-6',
            title: 'ITR-6 — Domestic & Foreign Corporate Entities',
            desc: 'Mandatory electronic filing form for all companies incorporated under Companies Act 2013, other than companies claiming charitable exemption u/s 11.',
            url: 'https://www.incometax.gov.in/iec/foportal/',
            domain: 'ITD e-Filing',
            domainClass: 'domain-itd',
            tags: ['Corporate/Firms', 'Companies Act', 'MAT u/s 115JB']
          },
          {
            id: 'dt-itr-7',
            title: 'ITR-7 — Charitable Trusts, Political Parties & Colleges',
            desc: 'For charitable and religious trusts, universities, scientific institutions, and political parties claiming exemptions under Section 139(4A)-(4D).',
            url: 'https://www.incometax.gov.in/iec/foportal/',
            domain: 'ITD e-Filing',
            domainClass: 'domain-itd',
            tags: ['Trusts/Charities', 'Section 11/12A', 'Political Parties']
          }
        ]
      },
      {
        sectionId: 'dt-pan',
        title: 'PAN & Aadhaar Services Center',
        subtitle: 'Direct links to official NSDL/Protean and UTIITSL portals for application, correction, and verification',
        iconName: 'Award',
        items: [
          {
            id: 'pan-49a-nsdl',
            title: 'Form 49A — New PAN Application (Protean / NSDL)',
            desc: 'Official application portal for Indian citizens, HUFs, and domestic incorporated entities applying for a Permanent Account Number.',
            url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
            domain: 'Protean / NSDL',
            domainClass: 'domain-pan',
            tags: ['Indian Citizens', 'Form 49A', 'Paperless e-KYC']
          },
          {
            id: 'pan-49a-uti',
            title: 'Form 49A — New PAN Application (UTIITSL Portal)',
            desc: 'Alternate official portal by UTI Infrastructure Technology and Services Ltd for physical or digital Aadhaar-based PAN issuance.',
            url: 'https://www.pan.utiitsl.com/PAN/newA.do',
            domain: 'UTIITSL',
            domainClass: 'domain-pan',
            tags: ['Indian Citizens', 'Form 49A', 'UTI Portal']
          },
          {
            id: 'pan-49aa-foreign',
            title: 'Form 49AA — PAN Application for Foreign Citizens & Entities',
            desc: 'Statutory application prescribed for individuals not being citizens of India, foreign companies, and offshore funds registering with SEBI.',
            url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
            domain: 'Protean / NSDL',
            domainClass: 'domain-pan',
            tags: ['Foreign Citizens', 'Form 49AA', 'FPI / NRI']
          },
          {
            id: 'pan-correction',
            title: 'PAN Data Changes, Corrections & Reprint Services',
            desc: 'Official application to update legal name, address, father’s name, or date of birth on existing PAN card records.',
            url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
            domain: 'Protean / NSDL',
            domainClass: 'domain-pan',
            tags: ['Modifications', 'Correction', 'Reprint Card']
          },
          {
            id: 'pan-aadhaar-link',
            title: 'Check Aadhaar — PAN Linkage Status (ITD Portal)',
            desc: 'Instant verification tool to verify whether your PAN is operative and successfully linked with Aadhaar as mandated under Section 139AA.',
            url: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar-status',
            domain: 'ITD e-Filing',
            domainClass: 'domain-itd',
            tags: ['Aadhaar-PAN Link', 'Status Check', 'Section 139AA']
          }
        ]
      }
    ]
  },
  {
    hubId: 'icai',
    hubTitle: 'ICAI Resource Vault',
    hubBadge: 'ICAI & BoS',
    description: 'Statutory auditing compendiums, Accounting Standards (AS & Ind AS), student & member journals, and taxation technical guides.',
    sections: [
      {
        sectionId: 'icai-updates',
        title: 'Updates & Official Publications',
        subtitle: 'Direct feeds and archives of official ICAI announcements and monthly professional journals',
        iconName: 'GraduationCap',
        items: [
          {
            id: 'icai-announcements',
            title: 'ICAI Official Announcements Board',
            desc: 'Real-time council notifications on examination schedules, UDIN compliance mandates, peer review guidelines, and statutory updates.',
            url: 'https://www.icai.org/category/announcements',
            domain: 'ICAI Official',
            domainClass: 'domain-icai',
            tags: ['Official Board', 'Council Directives', 'UDIN']
          },
          {
            id: 'icai-student-journal',
            title: 'The Chartered Accountant Student (Monthly Archives)',
            desc: 'Monthly official magazine published by the Board of Studies (BoS) featuring academic articles, case studies, and exam revision capsules.',
            url: 'https://www.icai.org/post/the-chartered-accountant-student',
            domain: 'BoS Portal',
            domainClass: 'domain-icai',
            tags: ['Student Journals', 'Monthly Archives', 'CA Final & Inter']
          },
          {
            id: 'icai-member-journal',
            title: 'The Chartered Accountant (Member Journal Archives)',
            desc: 'Prestigious monthly peer-reviewed journal featuring in-depth technical analysis on corporate governance, forensic audit, and tax jurisprudence.',
            url: 'https://www.icai.org/category/the-chartered-accountant-journal',
            domain: 'ICAI Official',
            domainClass: 'domain-icai',
            tags: ['Member Journals', 'Research Papers', 'Monthly Editions']
          },
          {
            id: 'icai-bos-portal',
            title: 'ICAI Board of Studies (BoS) Knowledge Portal',
            desc: 'Comprehensive digital repository offering study materials, mock test papers (MTP), revision test papers (RTP), and recorded lectures.',
            url: 'https://boslive.icai.org/',
            domain: 'BoS Live',
            domainClass: 'domain-icai',
            tags: ['Study Material', 'BoS Live', 'RTP & MTP']
          }
        ]
      },
      {
        sectionId: 'icai-standards',
        title: 'Standard Books & Guidance Notes',
        subtitle: 'Direct links to BoS study materials, bare text of standards, and auditing compendiums',
        iconName: 'BookOpen',
        items: [
          {
            id: 'icai-as-compendium',
            title: 'Accounting Standards (AS 1 to AS 29) Bare Text',
            desc: 'Authoritative bare text of Accounting Standards issued by ICAI applicable to Non-Ind AS entities and Micro, Small & Medium Enterprises (SMC).',
            url: 'https://www.icai.org/post/accounting-standards-as',
            domain: 'ICAI Official',
            domainClass: 'domain-icai',
            tags: ['AS Bare Text', 'Non-Ind AS', 'AS 1 to AS 29']
          },
          {
            id: 'icai-indas-compendium',
            title: 'Indian Accounting Standards (Ind AS) Master Compendium',
            desc: 'IFRS-converged Indian Accounting Standards notified under Companies (Ind AS) Rules: Ind AS 115 (Revenue), Ind AS 116 (Leases), and Ind AS 109 (Financial Instruments).',
            url: 'https://www.icai.org/post/indian-accounting-standards-indas',
            domain: 'ICAI Official',
            domainClass: 'domain-icai',
            tags: ['Ind AS Standards', 'IFRS Converged', 'Companies Act']
          },
          {
            id: 'icai-sa-compendium',
            title: 'Standards on Auditing (SA 200 to SA 800 Series)',
            desc: 'Mandatory auditing pronouncements: SA 200 (Overall Objectives), SA 230 (Documentation), SA 315 (Risk Assessment), SA 500 (Audit Evidence), and SA 700 (Audit Reports).',
            url: 'https://www.icai.org/post/standards-on-auditing',
            domain: 'ICAI Official',
            domainClass: 'domain-icai',
            tags: ['Standards on Auditing', 'SA 700 Series', 'SA 230']
          },
          {
            id: 'icai-guidance-notes',
            title: 'ICAI Guidance Notes on Accounting & Auditing',
            desc: 'Authoritative guidance on revenue recognition, audit of banks (LFAR), audit of internal financial controls (IFCoFR), and CARO 2020 reporting.',
            url: 'https://www.icai.org/post/guidance-notes',
            domain: 'ICAI Official',
            domainClass: 'domain-icai',
            tags: ['Guidance Notes', 'CARO 2020', 'Bank Audit LFAR']
          }
        ]
      },
      {
        sectionId: 'icai-taxation',
        title: 'Taxation Modules & Practice Guides',
        subtitle: 'Direct tax reference materials, GST background books, and statutory audit publications',
        iconName: 'Database',
        items: [
          {
            id: 'icai-dtc-modules',
            title: 'Direct Taxes Committee Reference Materials',
            desc: 'Technical publications on Tax Audit under Section 44AB (Form 3CD clause analysis), Transfer Pricing documentation, and Dispute Resolution Schemes.',
            url: 'https://www.icai.org/category/direct-taxes-committee',
            domain: 'ICAI Official',
            domainClass: 'domain-icai',
            tags: ['Direct Tax Modules', 'Form 3CD', 'Section 44AB']
          },
          {
            id: 'icai-idtc-gst',
            title: 'Indirect Taxes Committee (IDTC) — GST Background Materials',
            desc: 'In-depth technical guides covering GST annual return & audit reconciliation (GSTR-9/9C), GST in real estate, and supply chain tax implications.',
            url: 'https://idtc.icai.org/',
            domain: 'ICAI IDTC',
            domainClass: 'domain-icai',
            tags: ['Indirect Tax', 'GST Background', 'Technical Guides']
          },
          {
            id: 'icai-form-3cd-guide',
            title: 'Guidance Note on Tax Audit under Section 44AB of the Income Tax Act',
            desc: 'Exhaustive clause-by-clause commentary issued by ICAI guiding auditors through reporting obligations across all 44 clauses of Form 3CD.',
            url: 'https://www.icai.org/post/guidance-note-on-tax-audit-under-section-44ab',
            domain: 'ICAI Official',
            domainClass: 'domain-icai',
            tags: ['Tax Audit Guide', 'Clause-by-Clause', 'Statutory Working Papers']
          }
        ]
      }
    ]
  }
];

const recentStatutoryNotifications = [
  {
    id: 'notif-1',
    refNo: 'Notification No. 04/2026 – Central Tax',
    date: '14 May 2026',
    subject: 'Waiver of late fee for delayed filing of GSTR-3B for specified class of registered taxpayers.',
    tag: 'Central Tax',
    tagClass: 'tag-central',
    authority: 'CBIC',
    link: 'https://taxinformation.cbic.gov.in/content-page/explore-notification'
  },
  {
    id: 'notif-2',
    refNo: 'Notification No. 02/2026 – Central Tax (Rate)',
    date: '28 April 2026',
    subject: 'Prescribing concessional GST rate of 5% on specified environmental testing instruments & green equipment.',
    tag: 'Rate',
    tagClass: 'tag-rate',
    authority: 'CBIC',
    link: 'https://taxinformation.cbic.gov.in/content-page/explore-notification'
  },
  {
    id: 'notif-3',
    refNo: 'Notification No. 01/2026 – Integrated Tax',
    date: '10 April 2026',
    subject: 'Clarification regarding place of supply in case of supply of transportation services to non-taxable territory.',
    tag: 'Integrated Tax',
    tagClass: 'tag-integrated',
    authority: 'CBIC',
    link: 'https://taxinformation.cbic.gov.in/content-page/explore-notification'
  },
  {
    id: 'notif-4',
    refNo: 'CBDT Circular No. 03/2026',
    date: '22 March 2026',
    subject: 'Guidelines under Section 194R and Section 194S regarding TDS deduction on benefits and virtual digital assets.',
    tag: 'Direct Tax',
    tagClass: 'tag-itr',
    authority: 'CBDT',
    link: 'https://incometaxindia.gov.in/pages/communications/circulars.aspx'
  }
];

const defaultRegulatoryAlerts = [
  {
    id: 'alert-gst-1',
    date: 'May 20, 2026',
    category: 'gst',
    categoryLabel: 'GST Advisory',
    categoryClass: 'tag-gst',
    authority: 'CBIC / GSTN',
    refNo: 'GSTN Advisory • Invoice Management System (IMS)',
    title: 'GSTN Launches Invoice Management System (IMS) with Mandatory Matching Before GSTR-3B Filing',
    summary: 'Taxpayers can accept, reject, or keep pending inward invoices uploaded by suppliers in GSTR-1/IFF to auto-populate Table 4 ITC accurately and prevent scrutiny notices.',
    impact: 'Affects: Inward Supplies & Table 4 Eligible ITC Claims',
    link: 'https://www.gst.gov.in/newsandupdates'
  },
  {
    id: 'alert-it-1',
    date: 'May 16, 2026',
    category: 'it',
    categoryLabel: 'Income Tax',
    categoryClass: 'tag-it',
    authority: 'CBDT / ITD',
    refNo: 'Finance Act 2024 • Section 43B(h) & 112A',
    title: 'Section 43B(h) MSME 45-Day Payment Mandate & Revised Capital Gains Tax Slabs Active',
    summary: 'Disallowance on delayed vendor payments to registered Micro/Small enterprises beyond MSMED Act timelines; revised LTCG tax of 12.5% u/s 112A active for FY 2025-26.',
    impact: 'Affects: Business Profit u/s 28 & Form 3CD Clause 22',
    link: 'https://incometaxindia.gov.in/pages/communications/circulars.aspx'
  },
  {
    id: 'alert-mca-1',
    date: 'May 11, 2026',
    category: 'mca',
    categoryLabel: 'MCA India',
    categoryClass: 'tag-mca',
    authority: 'Ministry of Corporate Affairs',
    refNo: 'Rule 9B Companies (PAS) Rules',
    title: 'Mandatory Dematerialization of Securities for All Private Limited Companies & Web-Form CSR-2',
    summary: 'All private companies (other than small companies) must ensure securities of promoters and directors are in dematerialized form before any share issue or buyback.',
    impact: 'Affects: Private Ltd Secretarial Compliance & ROC Filings',
    link: 'https://www.mca.gov.in/content/mca/global/en/notifications-circulars/circulars.html'
  },
  {
    id: 'alert-sebi-1',
    date: 'May 06, 2026',
    category: 'sebi',
    categoryLabel: 'SEBI Circular',
    categoryClass: 'tag-sebi',
    authority: 'Securities & Exchange Board of India',
    refNo: 'SEBI/HO/CFD/PoD-1/P/CIR/2024/76',
    title: 'SEBI Implements Mandatory BRSR Core Assurance & Streamlined LODR Corporate Governance',
    summary: 'Mandatory reasonable assurance on Business Responsibility & Sustainability Reporting (BRSR Core) for top listed entities with refined ESG disclosure norms.',
    impact: 'Affects: Listed Corporates & Annual Statutory Reporting',
    link: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=7&smid=0'
  },
  {
    id: 'alert-icai-1',
    date: 'April 28, 2026',
    category: 'icai',
    categoryLabel: 'ICAI Mandate',
    categoryClass: 'tag-icai',
    authority: 'ICAI Council',
    refNo: 'ICAI Council UDIN Directive',
    title: 'Mandatory Generation of Unique Document Identification Number (UDIN) for All Audit Reports',
    summary: 'All practicing Chartered Accountants must generate a valid 18-digit UDIN within 60 days of signing Form 3CA/3CB/3CD, certificates, and GST audit working papers.',
    impact: 'Affects: Statutory Tax Audit Form 3CD & CA Certificates',
    link: 'https://udin.icai.org/'
  },
  {
    id: 'alert-gst-2',
    date: 'April 20, 2026',
    category: 'gst',
    categoryLabel: 'GST Notification',
    categoryClass: 'tag-gst',
    authority: 'CBIC / GST Council',
    refNo: 'Circular No. 213/07/2024-GST',
    title: 'CBIC Clarification on Section 128A Waiver of Interest & Penalties for GST Demand Notices',
    summary: 'Statutory waiver of interest and penalties for show cause notices issued under Section 73 for FY 2017-18, 2018-19, and 2019-20 subject to tax payment before deadline.',
    impact: 'Affects: Section 73 Litigation & Amnesty Applications',
    link: 'https://taxinformation.cbic.gov.in/content-page/explore-circulars'
  }
];


export default function Page() {
  // Navigation & Menu States
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Authentication & Dashboard States
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [emailStep, setEmailStep] = useState('email'); // 'email' or 'otp'
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState({ type: null, message: '' });
  const [consultations, setConsultations] = useState([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  // Calendar States dynamically initialized to the current month & year
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [activeFilter, setActiveFilter] = useState('all');
  const [gstListItems, setGstListItems] = useState(gstItems);
  const [checklistItems, setChecklistItems] = useState(checklists);
  const [trackerDateItems, setTrackerDateItems] = useState(() => getDynamicTrackerItems(new Date()));

  // Dynamic state set client-side to prevent Next.js server/client mismatch
  const [todayDate, setTodayDate] = useState(null);

  useEffect(() => {
    // Set the date strictly on the client side after hydration 
    // to prevent Next.js server/client mismatch errors and sync with current month
    const clientNow = new Date();
    setTodayDate(clientNow);
    setCalMonth(clientNow.getMonth());
    setCalYear(clientNow.getFullYear());
    setTrackerDateItems(getDynamicTrackerItems(clientNow));
  }, []);

  const handlePrevMonth = () => {
    setCalMonth(prev => {
      if (prev === 0) {
        setCalYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCalMonth(prev => {
      if (prev === 11) {
        setCalYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleJumpToCurrentMonth = () => {
    const cur = todayDate || new Date();
    setCalMonth(cur.getMonth());
    setCalYear(cur.getFullYear());
  };

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

  // Interest Calculator States
  const [interestMode, setInterestMode] = useState('deposit'); // 'deposit' or 'loan'
  const [depPrincipal, setDepPrincipal] = useState(10000);
  const [depRate, setDepRate] = useState(6.5);
  const [depTime, setDepTime] = useState(3);
  const [depTimeUnit, setDepTimeUnit] = useState('years');
  const [depComp, setDepComp] = useState('12');
  const [depDayCount, setDepDayCount] = useState('actual/365');

  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanRate, setLoanRate] = useState(7.25);
  const [loanTenure, setLoanTenure] = useState(240);
  const [loanTenureUnit, setLoanTenureUnit] = useState('months');
  const [loanPrepay, setLoanPrepay] = useState(0);
  const [loanDayCount, setLoanDayCount] = useState('actual/365');
  const [showAmortization, setShowAmortization] = useState(false);

  // GSTR-3B Preparation Engine States
  const [gstrStep, setGstrStep] = useState(1); // 1: Ingestion, 2: Review Console, 3: Final Draft
  const [clientGstin, setClientGstin] = useState('27AABCU9603R1ZN');
  const [clientTradeName, setClientTradeName] = useState('Zenith Logistics & Consulting Pvt Ltd');
  const [gstr2bUploaded, setGstr2bUploaded] = useState(true);
  const [gstr1Uploaded, setGstr1Uploaded] = useState(true);
  const [gstrOutwardLiability, setGstrOutwardLiability] = useState(485000);
  const [gstrInvoices, setGstrInvoices] = useState(defaultGstrInvoices);

  // Digital Library States (Hierarchical Architecture)
  const [librarySearch, setLibrarySearch] = useState('');
  const [selectedHub, setSelectedHub] = useState('all'); // 'all' | 'gst' | 'direct_tax' | 'icai' | 'bookmarks'
  const [notifTagFilter, setNotifTagFilter] = useState('all'); // 'all' | 'Rate' | 'Central Tax' | 'Integrated Tax' | 'Direct Tax'
  const [openAccordions, setOpenAccordions] = useState({
    'gst-statutory': true,
    'gst-compliance': true,
    'dt-framework': true,
    'dt-itr': true,
    'dt-pan': true,
    'icai-updates': true,
    'icai-standards': true,
    'icai-taxation': true
  });
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fin2ools_library_bookmarks') || localStorage.getItem('fin2ool_library_bookmarks') || localStorage.getItem('fintezy_library_bookmarks');
        return stored ? JSON.parse(stored) : ['gst-gstr-2b', 'gst-gstr-3b', 'dt-itr-1', 'icai-sa-compendium'];
      } catch (e) {
        return ['gst-gstr-2b', 'gst-gstr-3b', 'dt-itr-1', 'icai-sa-compendium'];
      }
    }
    return ['gst-gstr-2b', 'gst-gstr-3b', 'dt-itr-1', 'icai-sa-compendium'];
  });

  const toggleBookmark = (id, title) => {
    setBookmarkedIds(prev => {
      let next;
      const isBookmarked = prev.includes(id);
      if (isBookmarked) {
        next = prev.filter(x => x !== id);
        showToast('Bookmark Removed', `Removed ${title} from pinned resources.`, 'info');
      } else {
        next = [...prev, id];
        showToast('Resource Pinned', `Added ${title} to your Quick Bookmarks!`, 'success');
      }
      try {
        localStorage.setItem('fin2ools_library_bookmarks', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const toggleAccordion = (sectionId) => {
    setOpenAccordions(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleAllAccordions = (expand) => {
    const updated = {};
    digitalLibraryBlueprint.forEach(hub => {
      hub.sections.forEach(sec => {
        updated[sec.sectionId] = expand;
      });
    });
    setOpenAccordions(updated);
  };

  const filteredHubs = useMemo(() => {
    return digitalLibraryBlueprint.map(hub => {
      if (selectedHub !== 'all' && selectedHub !== 'bookmarks' && hub.hubId !== selectedHub) {
        return null;
      }

      const filteredSections = hub.sections.map(sec => {
        const matchingItems = sec.items.filter(item => {
          if (selectedHub === 'bookmarks' && !bookmarkedIds.includes(item.id)) {
            return false;
          }
          if (!librarySearch) return true;
          const q = librarySearch.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.desc.toLowerCase().includes(q);
          const matchTags = item.tags && item.tags.some(t => t.toLowerCase().includes(q));
          const matchDomain = item.domain.toLowerCase().includes(q);
          return matchTitle || matchDesc || matchTags || matchDomain;
        });

        return {
          ...sec,
          items: matchingItems
        };
      }).filter(sec => sec.items.length > 0);

      if (filteredSections.length === 0) return null;

      return {
        ...hub,
        sections: filteredSections
      };
    }).filter(Boolean);
  }, [selectedHub, librarySearch, bookmarkedIds]);

  const totalMatchingResources = useMemo(() => {
    return filteredHubs.reduce((acc, hub) => {
      return acc + hub.sections.reduce((sAcc, sec) => sAcc + sec.items.length, 0);
    }, 0);
  }, [filteredHubs]);

  const filteredNotifications = useMemo(() => {
    return recentStatutoryNotifications.filter(n => {
      if (notifTagFilter === 'all') return true;
      return n.tag === notifTagFilter;
    });
  }, [notifTagFilter]);

  // Live Tax & Regulatory Alert Board States
  const [regulatoryAlerts, setRegulatoryAlerts] = useState(defaultRegulatoryAlerts);
  const [alertsFilter, setAlertsFilter] = useState('all'); // 'all' | 'gst' | 'it' | 'mca' | 'sebi'
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsSyncedTime, setAlertsSyncedTime] = useState('Official Gazette Sync');

  const handleRefreshAlerts = async () => {
    setAlertsLoading(true);
    showToast('Syncing Official Feeds', 'Connecting to regulatory authority news feeds & gazette...', 'info');
    try {
      const res = await fetch('/api/cron/rss-sync');
      const data = await res.json();
      if (data && data.success && data.updates && data.updates.length > 0) {
        const mapped = data.updates.map((u, i) => {
          const cat = (u.taxCategory || '').toLowerCase();
          const isGst = cat.includes('gst');
          const isIt = cat.includes('direct') || cat.includes('income');
          const isMca = cat.includes('mca') || cat.includes('corporate');
          return {
            id: `live-rss-${i}-${Date.now()}`,
            date: u.publishedDate ? new Date(u.publishedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today',
            category: isGst ? 'gst' : isIt ? 'it' : isMca ? 'mca' : 'sebi',
            categoryLabel: isGst ? 'GST Authority' : isIt ? 'Income Tax' : isMca ? 'MCA Directive' : 'Official Feed',
            categoryClass: 'tag-live',
            authority: u.statutoryAct || 'Regulatory Authority',
            refNo: u.statutorySections ? u.statutorySections.slice(0, 2).join(', ') : 'Authority Advisory',
            title: u.headline || u.rawTitle,
            summary: u.executiveSummary || 'Real-time regulatory directive parsed from authoritative gazette notification.',
            impact: `Statutory Act: ${u.statutoryAct || 'Indian Law'}`,
            link: u.sourceLink || 'https://taxguru.in/'
          };
        });

        setRegulatoryAlerts(prev => {
          const existingTitles = new Set(prev.map(p => p.title));
          const uniqueNew = mapped.filter(m => !existingTitles.has(m.title));
          return [...uniqueNew, ...prev];
        });
        setAlertsSyncedTime('Updated Just Now');
        showToast('Feed Updated', `Fetched ${data.updates.length} live statutory updates from authorities.`, 'success');
      } else {
        setAlertsSyncedTime('Active (Verified)');
        showToast('Feed Up-to-Date', 'Latest statutory gazettes and circulars are already up-to-date.', 'success');
      }
    } catch (err) {
      console.warn('Live feed sync fallback:', err);
      setAlertsSyncedTime('Active (Verified)');
      showToast('Feed Active', 'Displaying official statutory alerts from CBIC, CBDT & MCA.', 'info');
    } finally {
      setAlertsLoading(false);
    }
  };

  const filteredAlerts = useMemo(() => {
    return regulatoryAlerts.filter(a => {
      if (alertsFilter === 'all') return true;
      if (alertsFilter === 'sebi') return a.category === 'sebi' || a.category === 'icai';
      return a.category === alertsFilter;
    });
  }, [regulatoryAlerts, alertsFilter]);

  // Dynamic Statutory Compliance Checklist Generator States
  const [statChecklistMode, setStatChecklistMode] = useState('generator'); // 'generator' | 'documents'
  const [statWizardStep, setStatWizardStep] = useState(1); // 1 to 5
  const [isChecklistGenerated, setIsChecklistGenerated] = useState(false);
  const [statFilterCategory, setStatFilterCategory] = useState('all');

  // Sheet 1: Entity Master Data
  const [statClientName, setStatClientName] = useState('Apex Technologies Solutions Private Limited');
  const [statPan, setStatPan] = useState('AABCA1234F');
  const [statGstin, setStatGstin] = useState('27AABCA1234F1Z5');
  const [statTan, setStatTan] = useState('PNEA12345B');
  const [statCin, setStatCin] = useState('U72900MH2021PTC368912');
  const [statTurnover, setStatTurnover] = useState(245000000); // ₹24.5 Cr
  const [statNetWorth, setStatNetWorth] = useState(120000000); // ₹12 Cr
  const [statNetProfit, setStatNetProfit] = useState(38000000); // ₹3.8 Cr
  const [statEntityType, setStatEntityType] = useState('Private Limited');
  const [statNature, setStatNature] = useState('IT/ITES');

  // Sheet 2: Threshold & Trigger Applicability
  const [triggerTaxAudit, setTriggerTaxAudit] = useState(true);
  const [triggerTransferPricing, setTriggerTransferPricing] = useState(false);
  const [triggerEinvoicing, setTriggerEinvoicing] = useState(true);
  const [triggerCsr, setTriggerCsr] = useState(true);
  const [triggerCostRecords, setTriggerCostRecords] = useState(false);
  const [triggerSft, setTriggerSft] = useState(false);

  // Sheet 3: Indirect Tax / GST & Customs
  const [gstGstr1, setGstGstr1] = useState(true);
  const [gstGstr3b, setGstGstr3b] = useState(true);
  const [gstGstr4Cmp08, setGstGstr4Cmp08] = useState(false);
  const [gstGstr6Isd, setGstGstr6Isd] = useState(false);
  const [gstGstr7Tds, setGstGstr7Tds] = useState(false);
  const [gstGstr8Tcs, setGstGstr8Tcs] = useState(false);
  const [gstGstr9, setGstGstr9] = useState(true);
  const [gstGstr9c, setGstGstr9c] = useState(true);
  const [gstItc04, setGstItc04] = useState(false);
  const [gstLutRenewal, setGstLutRenewal] = useState(true);

  // Sheet 4: Direct Tax / Income Tax & TDS
  const [directItrForm, setDirectItrForm] = useState('ITR-6');
  const [directForm3ca3cd, setDirectForm3ca3cd] = useState(true);
  const [directForm3ceb, setDirectForm3ceb] = useState(false);
  const [directForm3ceac, setDirectForm3ceac] = useState(false);
  const [directForm61a, setDirectForm61a] = useState(false);
  const [tdsForm24q, setTdsForm24q] = useState(true);
  const [tdsForm26q, setTdsForm26q] = useState(true);
  const [tdsForm27q, setTdsForm27q] = useState(false);
  const [tdsForm27eq, setTdsForm27eq] = useState(false);
  const [tdsForm15caCb, setTdsForm15caCb] = useState(true);

  // Sheet 5: MCA, Secretarial & Other Laws
  const [mcaStatAuditReport, setMcaStatAuditReport] = useState(true);
  const [mcaAoc4, setMcaAoc4] = useState(true);
  const [mcaAoc4Csr2, setMcaAoc4Csr2] = useState(true);
  const [mcaMgt7, setMcaMgt7] = useState(true);
  const [mcaMsme1, setMcaMsme1] = useState(true);
  const [mcaDpt3, setMcaDpt3] = useState(true);
  const [mcaDir3Kyc, setMcaDir3Kyc] = useState(true);
  const [mcaAdt1, setMcaAdt1] = useState(false);
  const [mcaBen2, setMcaBen2] = useState(false);
  const [mcaMgt14, setMcaMgt14] = useState(true);
  const [femaFlaReturn, setFemaFlaReturn] = useState(false);
  const [labourPfEsiMonthly, setLabourPfEsiMonthly] = useState(true);
  const [labourPtReturns, setLabourPtReturns] = useState(true);

  // Generated Statutory Rows
  const [statutoryTrackerRows, setStatutoryTrackerRows] = useState([]);

  // Form submission loading & feedback
  const [savingForm, setSavingForm] = useState(false);
  const [connectFeedback, setConnectFeedback] = useState({ type: null, message: '' });


  /* INITIALIZATION */
  useEffect(() => {
    // Sync URL hash router on mount
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'calendar', 'calculator', 'interest', 'gstr-3b', 'tracker', 'checklist', 'statutory-checklist', 'gst', 'budget', 'contact', 'connect', 'consultation', 'login', 'dashboard'];
    if (hash && validPages.includes(hash)) {
      if (hash === 'statutory-checklist') {
        setActivePage('checklist');
      } else if (hash === 'contact') {
        setActivePage('connect');
      } else {
        setActivePage(hash);
      }
    }

    // Bind hash change listener
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && validPages.includes(newHash)) {
        if (newHash === 'statutory-checklist') {
          setActivePage('checklist');
        } else if (newHash === 'contact') {
          setActivePage('connect');
        } else {
          setActivePage(newHash);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // Sync Theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Fetch Google Sheet modules if configured
    fetchGoogleSheetCalendar();
    fetchGstSheet();
    fetchChecklistSheet();
    fetchTrackerSheet();

    // 1. Check for active Email OTP session stored in localStorage
    let hasLocalSession = false;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fin2ools_auth_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) {
            setUser(parsed);
            setAuthChecking(false);
            hasLocalSession = true;
            fetchConsultationsData();
          }
        }
      } catch (e) {
        console.warn('Error reading stored auth session:', e);
      }
    }

    // 2. Firebase Auth Session Sync
    let unsubscribeAuth = null;
    if (auth) {
      unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setAuthChecking(false);
          fetchConsultationsData();
        } else if (!hasLocalSession) {
          // Only clear if there is no valid Email OTP session in localStorage
          let currentStored = null;
          try {
            const s = typeof window !== 'undefined' ? localStorage.getItem('fin2ools_auth_user') : null;
            if (s) currentStored = JSON.parse(s);
          } catch (_) {}

          if (currentStored && currentStored.email) {
            setUser(currentStored);
            setAuthChecking(false);
            fetchConsultationsData();
          } else {
            setUser(null);
            setAuthChecking(false);
            setConsultations([]);
          }
        }
      });
    } else if (!hasLocalSession) {
      setAuthChecking(false);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
    };
  }, []);

  // Cooldown timer interval for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Sync checklist checked status reactively from LocalStorage
  useEffect(() => {
    const loadedProgress = {};
    checklistItems.forEach((_, ci) => {
      const listId = `checklist-${ci}`;
      try {
        const stored = localStorage.getItem(listId);
        loadedProgress[ci] = stored ? JSON.parse(stored) : {};
      } catch (e) {
        loadedProgress[ci] = {};
      }
    });
    setChecklistState(loadedProgress);
  }, [checklistItems]);


  /* HANDLERS */
  const parseGstCSV = (text) => {
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

      if (item.hsn && item.desc && item.rate) {
        result.push({
          hsn: String(item.hsn),
          desc: item.desc,
          rate: parseInt(item.rate, 10) || 0,
          cat: item.cat || 'General'
        });
      }
    }
    return result;
  };

  const parseChecklistCSV = (text) => {
    if (!text) return [];
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = [];
    const headerLine = lines[0];
    const headerMatches = headerLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || headerLine.split(',');
    headerMatches.forEach(h => {
      headers.push(h.trim().replace(/^["']|["']$/g, ''));
    });

    const groups = {};
    const orderedKeys = [];

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

      if (item.title && item.item) {
        if (!groups[item.title]) {
          groups[item.title] = {
            title: item.title,
            icon: item.icon || '📄',
            items: []
          };
          orderedKeys.push(item.title);
        }
        groups[item.title].items.push(item.item);
      }
    }

    return orderedKeys.map(k => groups[k]);
  };

  const parseTrackerCSV = (text) => {
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

      if (item.title && item.dueDate) {
        const parsedDate = new Date(item.dueDate);
        if (!isNaN(parsedDate.getTime())) {
          result.push({
            title: item.title,
            form: item.form || 'General',
            dueDate: parsedDate
          });
        }
      }
    }
    return result;
  };

  const fetchGstSheet = async () => {
    const url = process.env.NEXT_PUBLIC_GOOGLE_SHEET_GST_URL;
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const text = await res.text();
      const data = parseGstCSV(text);
      if (data && data.length > 0) setGstListItems(data);
    } catch (err) {
      console.error('Error fetching GST sheet:', err);
    }
  };

  const fetchChecklistSheet = async () => {
    const url = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CHECKLIST_URL;
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const text = await res.text();
      const data = parseChecklistCSV(text);
      if (data && data.length > 0) setChecklistItems(data);
    } catch (err) {
      console.error('Error fetching Checklist sheet:', err);
    }
  };

  const fetchTrackerSheet = async () => {
    const url = process.env.NEXT_PUBLIC_GOOGLE_SHEET_TRACKER_URL;
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const text = await res.text();
      const data = parseTrackerCSV(text);
      if (data && data.length > 0) setTrackerDateItems(data);
    } catch (err) {
      console.error('Error fetching Tracker sheet:', err);
    }
  };

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

  const handleSendEmailOtp = async (e) => {
    if (e) e.preventDefault();
    setAuthFeedback({ type: null, message: '' });

    const cleanEmail = (authEmail || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
      setAuthFeedback({ type: 'error', message: 'Please enter a valid email address.' });
      showToast('Email Required', 'Please enter a valid email address.', 'error');
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to dispatch verification OTP.');
      }

      setEmailStep('otp');
      setOtpCode('');
      setResendCooldown(30);
      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      }
      setAuthFeedback({
        type: 'success',
        message: data.message || `6-digit verification code sent to ${cleanEmail}.`
      });
      showToast('OTP Dispatched!', `6-digit code sent to ${cleanEmail}`, 'success');
    } catch (err) {
      console.error('handleSendEmailOtp error:', err);
      const errorMsg = err.message || 'Could not send verification code. Please retry.';
      setAuthFeedback({ type: 'error', message: errorMsg });
      showToast('Dispatch Error', errorMsg, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e) => {
    if (e) e.preventDefault();
    setAuthFeedback({ type: null, message: '' });

    const cleanOtp = (otpCode || '').replace(/\D/g, '').trim();
    if (cleanOtp.length !== 6) {
      setAuthFeedback({ type: 'error', message: 'Please enter the complete 6-digit verification code.' });
      showToast('Incomplete Code', 'Please enter the 6-digit code.', 'error');
      return;
    }

    setAuthLoading(true);
    try {
      const cleanEmail = (authEmail || '').trim().toLowerCase();
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp: cleanOtp })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid or expired OTP code.');
      }

      const verifiedUser = data.user || {
        email: cleanEmail,
        uid: 'user_' + Date.now(),
        emailVerified: true
      };

      setUser(verifiedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fin2ools_auth_user', JSON.stringify(verifiedUser));
      }

      setAuthFeedback({
        type: 'success',
        message: 'Email successfully verified! Unlocking Fin2ools portal...'
      });
      showToast('Access Granted!', `Authenticated as ${verifiedUser.email}`, 'success');
      handlePageChange('home');
    } catch (err) {
      console.error('handleVerifyEmailOtp error:', err);
      const errorMsg = err.message || 'The verification code entered is incorrect or expired.';
      setAuthFeedback({ type: 'error', message: errorMsg });
      showToast('Verification Failed', errorMsg, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (auth) {
        try { await firebaseSignOut(auth); } catch (_) {}
      }
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fin2ools_auth_user');
      }
      setEmailStep('email');
      setOtpCode('');
      setDevOtpHint('');
      setAuthFeedback({ type: null, message: '' });
      showToast('Website Locked', 'You have been signed out. Security firewall is active.', 'info');
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

  const GOOGLE_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwhTjvOCbUsY8nWj3HE0a7u9EzMnkabUsuDwSLxc7d2RDaK2nIZ7cj1K1AkUd0unof7/exec";

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    setConnectFeedback({ type: null, message: '' });

    const formElement = e.target;
    const name = (formElement.elements['connect-name']?.value || formElement.elements['contact-name']?.value || '').trim();
    const phone = (formElement.elements['connect-phone']?.value || formElement.elements['contact-phone']?.value || '').trim();
    const email = (formElement.elements['connect-email']?.value || formElement.elements['contact-email']?.value || '').trim();
    const userType = formElement.elements['connect-user-type']?.value || formElement.elements['contact-user-type']?.value || '';
    const message = (formElement.elements['connect-msg']?.value || formElement.elements['contact-msg']?.value || '').trim();

    setSavingForm(true);

    // Payload mapped strictly to Google Apps Script requirements
    const payload = {
      formType: "connect",
      fullName: name,
      phoneNumber: phone,
      emailId: email,
      selection: userType,
      description: message,
      // Additional safety aliases
      user: userType,
      userType: userType,
      sheet: 'Connect',
      sheetName: 'Connect',
      name,
      phone,
      email,
      message,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      submittedAt: new Date().toISOString()
    };

    try {
      /**
       * Mandatory CORS bypass:
       * Set headers strictly to "Content-Type": "text/plain;charset=utf-8".
       * Do not use application/json.
       */
      const targetUrl = `${GOOGLE_SCRIPT_WEBHOOK_URL}?sheet=Connect&type=connect`;
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      let responseData = null;
      try {
        responseData = await response.json();
      } catch (parseErr) {
        // Fallback if plain text
      }

      if (responseData && responseData.status === 'success') {
        const successMsg = responseData.message || `Welcome to the Fin2ools family, ${name}! Your request has been recorded.`;
        setConnectFeedback({
          type: 'success',
          message: successMsg
        });
        showToast(
          'Welcome to the Fin2ools Family!',
          successMsg,
          'success'
        );

        // Clear the form fields on success
        formElement.reset();

        // Also log to Supabase if configured
        if (supabase) {
          try {
            await supabase.from('consultations').insert([{
              name,
              email,
              phone,
              user_type: userType,
              service: 'Fin2ools Community Network',
              message,
              created_at: new Date()
            }]);
          } catch (sbErr) {
            console.warn('Supabase logging error:', sbErr);
          }
        }
      } else {
        const errorMsg = (responseData && responseData.message) || (!response.ok ? `Server error (Status: ${response.status})` : 'Unable to complete your request. Please try again.');
        setConnectFeedback({
          type: 'error',
          message: errorMsg
        });
        showToast(
          'Submission Error',
          errorMsg,
          'error'
        );
      }
    } catch (err) {
      console.error('Connect form error:', err);
      const errorMsg = err.message || 'Unable to connect to the server right now. Please check your connection and try again.';
      setConnectFeedback({
        type: 'error',
        message: errorMsg
      });
      showToast(
        'Submission Error',
        errorMsg,
        'error'
      );
    } finally {
      setSavingForm(false);
    }
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.elements['consult-name'].value;
    const phone = e.target.elements['consult-phone'].value;
    const email = e.target.elements['consult-email'].value;
    const service = e.target.elements['consult-service'].value;
    const message = e.target.elements['consult-msg'].value;

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
          'Consultation Booked!',
          `Thank you, ${name}. Your consultation for "${service}" has been recorded.`,
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
        `Thank you, ${name}. Your consultation for "${service}" has been recorded.`,
        'success'
      );
      e.target.reset();
    }
  };

  const handleContactSubmit = handleConnectSubmit;


  /* CORE CALCULATIONS (REACTIVE DEFINITIONS) */

  // Currency utility formatter
  const formatCurrency = (val) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  // Calendar rows relative dates math - dynamically generated for selected month & year
  const currentMonthCalendar = useMemo(() => {
    return getComplianceCalendarForMonth(calYear, calMonth);
  }, [calYear, calMonth]);

  const calendarRows = currentMonthCalendar.filter(r => activeFilter === 'all' || r.cat === activeFilter);
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
    ? gstListItems.filter(g => 
        g.desc.toLowerCase().includes(gstInput.toLowerCase().trim()) || 
        g.hsn.includes(gstInput.trim()) || 
        g.cat.toLowerCase().includes(gstInput.toLowerCase().trim())
      )
    : gstListItems;

  const gstRateColors = { 0: 'r0', 5: 'r5', 12: 'r12', 18: 'r18', 28: 'r28' };

  // Interest Math Computations
  const convertInterestTimeToYears = (value, unit, daycount) => {
    const val = Number(value) || 0;
    if (unit === 'years') return val;
    if (unit === 'months') return val / 12;
    if (unit === 'days') {
      if (daycount === 'actual/360') return val / 360;
      return val / 365;
    }
    return val;
  };

  const depositYears = convertInterestTimeToYears(depTime, depTimeUnit, depDayCount);
  const depositRateDec = (Number(depRate) || 0) / 100;
  let depositInterest = 0;
  let depositMaturity = 0;
  let depositEAR = 0;

  if (depComp === 'simple') {
    depositInterest = (Number(depPrincipal) || 0) * depositRateDec * depositYears;
    depositMaturity = (Number(depPrincipal) || 0) + depositInterest;
    depositEAR = depositRateDec;
  } else {
    const n = Number(depComp) || 12;
    depositMaturity = (Number(depPrincipal) || 0) * Math.pow(1 + depositRateDec / n, n * depositYears);
    depositInterest = depositMaturity - (Number(depPrincipal) || 0);
    depositEAR = Math.pow(1 + depositRateDec / n, n) - 1;
  }

  const effectiveLoanTenureMonths = loanTenureUnit === 'years' ? (Number(loanTenure) || 0) * 12 : (Number(loanTenure) || 0);
  const loanMonthlyRate = ((Number(loanRate) || 0) / 100) / 12;
  
  let loanEmi = 0;
  let loanTotalPayment = 0;
  let loanTotalInterest = 0;

  if (effectiveLoanTenureMonths > 0) {
    if (loanMonthlyRate === 0) {
      loanEmi = (Number(loanAmount) || 0) / effectiveLoanTenureMonths;
      loanTotalPayment = loanEmi * effectiveLoanTenureMonths;
      loanTotalInterest = 0;
    } else {
      const factor = Math.pow(1 + loanMonthlyRate, effectiveLoanTenureMonths);
      loanEmi = (Number(loanAmount) || 0) * (loanMonthlyRate * factor) / (factor - 1);
      loanTotalPayment = loanEmi * effectiveLoanTenureMonths;
      loanTotalInterest = Math.max(0, loanTotalPayment - (Number(loanAmount) || 0));
    }
  }

  const loanAmortizationSchedule = (() => {
    if (!effectiveLoanTenureMonths || effectiveLoanTenureMonths <= 0) return [];
    let balance = Number(loanAmount) || 0;
    const schedule = [];
    const extra = Number(loanPrepay) || 0;
    
    for (let m = 1; m <= effectiveLoanTenureMonths && balance > 0.0001; m++) {
      const interest = balance * loanMonthlyRate;
      const principal = Math.min(balance, (loanEmi + extra) - interest);
      const payment = principal + interest;
      balance = Math.max(0, balance - principal);
      schedule.push({ month: m, payment, principal, interest, balance });
    }
    return schedule;
  })();

  const exportAmortizationCSV = () => {
    if (!loanAmortizationSchedule.length) {
      showToast('No Schedule', 'Please configure valid loan details first.', 'error');
      return;
    }
    const header = ['Month', 'Payment', 'Principal', 'Interest', 'Balance'];
    const rows = loanAmortizationSchedule.map(r => [
      r.month,
      r.payment.toFixed(2),
      r.principal.toFixed(2),
      r.interest.toFixed(2),
      r.balance.toFixed(2)
    ]);
    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'amortization_schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded', 'Amortization schedule exported as CSV.', 'success');
  };

  // GSTR-3B Dynamic Figures & Handlers
  const totalEligibleItc = gstrInvoices
    .filter(inv => inv.override === 'eligible')
    .reduce((sum, inv) => sum + inv.taxTotal, 0);

  const totalIneligibleItc = gstrInvoices
    .filter(inv => inv.override === 'ineligible')
    .reduce((sum, inv) => sum + inv.taxTotal, 0);

  const netGstr3bPayable = Math.max(0, gstrOutwardLiability - totalEligibleItc);
  const itcBalanceCredit = Math.max(0, totalEligibleItc - gstrOutwardLiability);

  const handleInvoiceOverride = (id, newOverride) => {
    setGstrInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          override: newOverride,
          remarks: newOverride === 'ineligible' 
            ? 'Blocked under Section 17(5) by Auditor' 
            : 'Eligible ITC confirmed by Auditor'
        };
      }
      return inv;
    }));
    showToast('Override Updated', `Invoice status set to ${newOverride.toUpperCase()}.`, 'info');
  };

  const handleInvoiceRemarks = (id, newRemarks) => {
    setGstrInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return { ...inv, remarks: newRemarks };
      }
      return inv;
    }));
  };

  const handleDownloadGstr3bJson = () => {
    const payload = {
      gstin: clientGstin,
      fp: '052026',
      filing_type: 'GSTR3B',
      version: 'GSTN_API_v2.4',
      sec_sum: {
        table_3_1: {
          osup_det: {
            txval: Math.round(gstrOutwardLiability / 0.18),
            iamt: Math.round(gstrOutwardLiability * 0.4),
            camt: Math.round(gstrOutwardLiability * 0.3),
            samt: Math.round(gstrOutwardLiability * 0.3),
            csamt: 0
          }
        },
        table_4_itc: {
          itc_avl: [
            {
              ty: 'OTH',
              desc: 'All Other ITC',
              iamt: gstrInvoices.filter(i => i.override === 'eligible').reduce((s, i) => s + i.igst, 0),
              camt: gstrInvoices.filter(i => i.override === 'eligible').reduce((s, i) => s + i.cgst, 0),
              samt: gstrInvoices.filter(i => i.override === 'eligible').reduce((s, i) => s + i.sgst, 0),
              total: totalEligibleItc
            }
          ],
          itc_rev: [
            {
              ty: 'RULE_42_43_OR_17_5',
              desc: 'As per Section 17(5) Blocked Credits',
              iamt: gstrInvoices.filter(i => i.override === 'ineligible').reduce((s, i) => s + i.igst, 0),
              camt: gstrInvoices.filter(i => i.override === 'ineligible').reduce((s, i) => s + i.cgst, 0),
              samt: gstrInvoices.filter(i => i.override === 'ineligible').reduce((s, i) => s + i.sgst, 0),
              total: totalIneligibleItc
            }
          ],
          itc_net: totalEligibleItc
        },
        table_6_1_payment: {
          tax_payable: gstrOutwardLiability,
          itc_paid: Math.min(gstrOutwardLiability, totalEligibleItc),
          cash_payable: netGstr3bPayable
        }
      },
      accountant_comment_log: gstrInvoices.map(i => ({
        invoice: i.invNo,
        supplier: i.supplier,
        gstin: i.gstin,
        hsn: i.hsn,
        auto_status: i.autoStatus,
        auditor_override: i.override,
        rationale: i.remarks
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GSTR3B_${clientGstin}_052026.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('GST Portal JSON Ready', 'Downloaded standard GSTR-3B draft schema for GSTN upload.', 'success');
  };

  /* STATUTORY COMPLIANCE CHECKLIST GENERATOR LOGIC */
  const buildStatutoryComplianceRows = () => {
    const rows = [];
    let counter = 1;

    const addRow = (code, desc, category, dueDate, status = 'Pending', actualDate = '', ack = '', notes = '') => {
      rows.push({
        id: `stat-${counter++}`,
        code,
        description: desc,
        category,
        statutoryDueDate: dueDate,
        filingDate: actualDate,
        complianceStatus: status,
        ackSrn: ack,
        remarks: notes
      });
    };

    // Sheet 2 Triggers
    if (triggerTaxAudit) {
      addRow('SEC-44AB', 'Tax Audit Report u/s 44AB (Form 3CA-3CD / 3CB-3CD)', 'Direct Tax', '30 Sep 2026', 'WIP', '', '', 'Turnover ₹24.5 Cr exceeds statutory limit');
    }
    if (triggerTransferPricing) {
      addRow('SEC-92E', 'Transfer Pricing Audit Report & Form 3CEB', 'Direct Tax', '31 Oct 2026', 'Pending', '', '', 'Domestic / International related party transactions');
    }
    if (triggerEinvoicing) {
      addRow('E-INV', 'E-Invoicing Real-time IRP Generation (Turnover > ₹5Cr)', 'GST', 'Continuous / Immediate', 'Completed', '2026-04-01', 'IRP-LIVE-88402', 'IRN generation enabled via API');
    }
    if (triggerCsr) {
      addRow('SEC-135', 'Corporate Social Responsibility (CSR) Compliance & Form CSR-2', 'MCA', '31 Oct 2026', 'Pending', '', '', 'Net Profit > ₹5Cr CSR committee allocation');
    }
    if (triggerCostRecords) {
      addRow('CRA-1/4', 'Cost Records Maintenance & Cost Audit Report', 'MCA', '30 Sep 2026', 'Pending', '', '', 'Maintenance of cost records mandated');
    }
    if (triggerSft) {
      addRow('SEC-285BA', 'Statement of Financial Transactions (SFT) - Form 61A', 'Direct Tax', '31 May 2026', 'Pending', '', '', 'Specified high-value transactions reported');
    }

    // Sheet 3 Indirect Tax / GST
    if (gstGstr1) {
      addRow('GSTR-1', 'GSTR-1: Outward Supplies Statement (Monthly / QRMP)', 'GST', '11th of succeeding month', 'Completed', '2026-05-11', 'GSTN-2026-88910', 'B2B and B2C outward supply schedules filed');
    }
    if (gstGstr3b) {
      addRow('GSTR-3B', 'GSTR-3B: Monthly Summary Return & Tax Settlement', 'GST', '20th of succeeding month', 'WIP', '', '', 'Auto-drafted ITC reconciliation in progress');
    }
    if (gstGstr4Cmp08) {
      addRow('CMP-08', 'Form CMP-08 & GSTR-4: Composition Quarterly Challan & Annual Return', 'GST', '18th post quarter', 'Pending', '', '', 'Composition scheme quarterly challan-cum-statement');
    }
    if (gstGstr6Isd) {
      addRow('GSTR-6', 'GSTR-6: Input Service Distributor (ISD) Monthly Return', 'GST', '13th of succeeding month', 'Pending', '', '', 'Branch office ITC credit allocation');
    }
    if (gstGstr7Tds) {
      addRow('GSTR-7', 'GSTR-7: Monthly Tax Deducted at Source (GST TDS)', 'GST', '10th of succeeding month', 'Pending', '', '', 'Deductions on contract supplies');
    }
    if (gstGstr8Tcs) {
      addRow('GSTR-8', 'GSTR-8: Electronic Commerce Operator (GST TCS Statement)', 'GST', '10th of succeeding month', 'Pending', '', '', 'Supplies affected through digital marketplace');
    }
    if (gstGstr9) {
      addRow('GSTR-9', 'GSTR-9: Annual Return for Regular Taxpayers', 'GST', '31 Dec 2026', 'Pending', '', '', 'Consolidated FY annual supply figures');
    }
    if (gstGstr9c) {
      addRow('GSTR-9C', 'GSTR-9C: Self-Certified Reconciliation Statement', 'GST', '31 Dec 2026', 'Pending', '', '', 'Reconciliation between audited books and GST returns');
    }
    if (gstItc04) {
      addRow('ITC-04', 'Form GST ITC-04: Goods Sent / Received from Job Workers', 'GST', '25 Oct 2026', 'Pending', '', '', 'Half-yearly job work inventory reconciliation');
    }
    if (gstLutRenewal) {
      addRow('LUT', 'Letter of Undertaking (LUT) Annual Renewal for Zero-Rated Exports', 'GST', '31 Mar 2026', 'Completed', '2026-03-25', 'ARN-AD2703260012', 'Valid for FY 2026-27 exports without IGST payment');
    }

    // Sheet 4 Direct Tax / Income Tax & TDS
    addRow(directItrForm, `Income Tax Return (${directItrForm}) - ${statEntityType}`, 'Direct Tax', '31 Oct 2026', 'Pending', '', '', `Audited corporate return filing for ${statEntityType}`);
    if (directForm3ca3cd) {
      addRow('FORM-3CD', 'Form 3CA-3CD / 3CB-3CD: Tax Audit Annexures & Disclosures', 'Direct Tax', '30 Sep 2026', 'WIP', '', '', 'Clause-by-clause auditor disclosure statements');
    }
    if (directForm3ceb) {
      addRow('FORM-3CEB', 'Form 3CEB: Transfer Pricing Accountant Certificate u/s 92E', 'Direct Tax', '31 Oct 2026', 'Pending', '', '', 'International & specified domestic transactions');
    }
    if (directForm3ceac) {
      addRow('FORM-3CEAC', 'Form 3CEAC: CbCR / Master File Notification to Competent Authority', 'Direct Tax', '30 Nov 2026', 'Pending', '', '', 'Notification of ultimate parent / constituent entity');
    }
    if (directForm61a) {
      addRow('FORM-61A', 'Form 61A: Annual Statement of Financial Transactions (SFT)', 'Direct Tax', '31 May 2026', 'Pending', '', '', 'Banking cash deposits and share issue details');
    }
    if (tdsForm24q) {
      addRow('FORM-24Q', 'Form 24Q: Quarterly TDS Statement for Salary Remuneration', 'TDS', '31 May 2026 (Q4)', 'Completed', '2026-05-28', '24Q-R8890214', 'Form 16 Part A & B generated for employees');
    }
    if (tdsForm26q) {
      addRow('FORM-26Q', 'Form 26Q: Quarterly TDS Statement for Non-Salary Deductions', 'TDS', '31 May 2026 (Q4)', 'Completed', '2026-05-29', '26Q-R8891045', 'Sections 194C, 194J, 194I payment vouchers verified');
    }
    if (tdsForm27q) {
      addRow('FORM-27Q', 'Form 27Q: Quarterly TDS Statement for Non-Resident Payments', 'TDS', '31 May 2026 (Q4)', 'Pending', '', '', 'Section 195 withholding tax on foreign vendors');
    }
    if (tdsForm27eq) {
      addRow('FORM-27EQ', 'Form 27EQ: Quarterly TCS Statement (Tax Collected at Source)', 'TDS', '15 May 2026 (Q4)', 'Pending', '', '', 'Section 206C collection challans matched');
    }
    if (tdsForm15caCb) {
      addRow('15CA/CB', 'Form 15CA & 15CB: Foreign Remittance Certificate & Verification', 'Direct Tax', 'Event-based / Prior to remittance', 'Completed', '2026-05-02', 'ACK-15CB-99410', 'Remittance to software SaaS provider cleared u/s 195');
    }

    // Sheet 5 MCA & FEMA & Labour
    if (mcaStatAuditReport) {
      addRow('STAT-AUDIT', 'Statutory Financial Audit Report & Independent Auditor\'s Opinion', 'MCA', '30 Sep 2026', 'WIP', '', '', 'True and fair view opinion under Section 143');
    }
    if (mcaAoc4) {
      addRow('AOC-4', 'Form AOC-4 / AOC-4 XBRL: Filing Financial Statements with ROC', 'MCA', '30 Oct 2026', 'Pending', '', '', '30 days from Annual General Meeting');
    }
    if (mcaAoc4Csr2) {
      addRow('CSR-2', 'Form CSR-2: Standalone / AOC-4 CSR Spending Report', 'MCA', '30 Oct 2026', 'Pending', '', '', 'Disclosures on ongoing CSR project expenditures');
    }
    if (mcaMgt7) {
      addRow('MGT-7', 'Form MGT-7 / MGT-7A: Annual Return of Company with ROC', 'MCA', '29 Nov 2026', 'Pending', '', '', '60 days from AGM date');
    }
    if (mcaMsme1) {
      addRow('MSME-1', 'MSME Form-1: Half-yearly Return for Vendor Dues > 45 Days', 'MCA', '30 Apr & 31 Oct', 'Completed', '2026-04-28', 'SRN-M9981240', 'Nil report filed - all micro enterprise dues cleared');
    }
    if (mcaDpt3) {
      addRow('DPT-3', 'Form DPT-3: Return of Deposits & Non-Deposit Particulars', 'MCA', '30 Jun 2026', 'WIP', '', '', 'Auditor certificate for exempted deposit transactions');
    }
    if (mcaDir3Kyc) {
      addRow('DIR-3-KYC', 'DIR-3 KYC / DIR-3 KYC WEB: Annual Directors KYC Update', 'MCA', '30 Sep 2026', 'Pending', '', '', 'Director identification numbers active and valid');
    }
    if (mcaAdt1) {
      addRow('ADT-1', 'Form ADT-1: Intimation of Statutory Auditor Appointment', 'MCA', '15 days from AGM', 'Not Applicable', '', '', 'Auditor tenure currently active');
    }
    if (mcaBen2) {
      addRow('BEN-2', 'Form BEN-2: Return of Significant Beneficial Ownership (SBO)', 'MCA', '30 days from declaration', 'Not Applicable', '', '', 'No SBO declaration received in current FY');
    }
    if (mcaMgt14) {
      addRow('MGT-14', 'Form MGT-14: ROC Filing for Board / Special Resolutions', 'MCA', '30 days from passing', 'Completed', '2026-05-04', 'SRN-R778210', 'Board sanction of credit facility resolution registered');
    }
    if (femaFlaReturn) {
      addRow('FLA-RBI', 'Foreign Liabilities & Assets (FLA) Annual Return on RBI FIRMS', 'Labour/FEMA', '15 Jul 2026', 'Pending', '', '', 'Annual FDI investment holding reporting');
    }
    if (labourPfEsiMonthly) {
      addRow('PF/ESI', 'PF Monthly ECR Electronic Challan & ESI Return Deposit', 'Labour/FEMA', '15th of each month', 'Completed', '2026-05-14', 'TRRN-8871923', 'Payroll statutory deductions settled on EPFO / ESIC');
    }
    if (labourPtReturns) {
      addRow('PT-RETURN', 'Professional Tax (PT) Monthly / Annual Deduction Return', 'Labour/FEMA', 'Last day of month', 'Completed', '2026-05-15', 'PTR-MH-99120', 'State tax treasury receipt generated');
    }

    return rows;
  };

  // Sync initial statutory rows if not yet populated
  useEffect(() => {
    if (statutoryTrackerRows.length === 0) {
      const initialRows = buildStatutoryComplianceRows();
      setStatutoryTrackerRows(initialRows);
    }
  }, []);

  const handleStatutoryRowChange = (id, field, value) => {
    setStatutoryTrackerRows(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  const handleGenerateStatutoryChecklist = () => {
    const rows = buildStatutoryComplianceRows();
    setStatutoryTrackerRows(rows);
    setIsChecklistGenerated(true);
    showToast('Statutory Checklist Generated!', `Profile compiled with ${rows.length} compliance obligations for ${statClientName}.`, 'success');
  };

  const handleLoadSampleCorporateProfile = () => {
    setStatClientName('Apex Technologies Solutions Private Limited');
    setStatPan('AABCA1234F');
    setStatGstin('27AABCA1234F1Z5');
    setStatTan('PNEA12345B');
    setStatCin('U72900MH2021PTC368912');
    setStatTurnover(245000000);
    setStatNetWorth(120000000);
    setStatNetProfit(38000000);
    setStatEntityType('Private Limited');
    setStatNature('IT/ITES');
    setTriggerTaxAudit(true);
    setTriggerTransferPricing(true);
    setTriggerEinvoicing(true);
    setTriggerCsr(true);
    setTriggerCostRecords(false);
    setTriggerSft(true);
    setGstGstr1(true);
    setGstGstr3b(true);
    setGstGstr9(true);
    setGstGstr9c(true);
    setGstLutRenewal(true);
    setDirectItrForm('ITR-6');
    setDirectForm3ca3cd(true);
    setDirectForm3ceb(true);
    setDirectForm61a(true);
    setTdsForm24q(true);
    setTdsForm26q(true);
    setTdsForm15caCb(true);
    setMcaStatAuditReport(true);
    setMcaAoc4(true);
    setMcaAoc4Csr2(true);
    setMcaMgt7(true);
    setMcaMsme1(true);
    setMcaDpt3(true);
    setMcaDir3Kyc(true);
    setMcaMgt14(true);
    setLabourPfEsiMonthly(true);
    setLabourPtReturns(true);
    showToast('Sample CA Profile Loaded', 'Pre-filled sample Indian corporate compliance parameters.', 'info');
  };

  const handleExportTrackerCsv = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // Build rich HTML-based Excel spreadsheet (.xls) with portal header and client parameters
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Statutory Compliance Tracker</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          td, th { font-family: Segoe UI, Calibri, Arial, sans-serif; }
          .portal-brand { background-color: #1e3a8a; color: #ffffff; font-size: 16pt; font-weight: bold; text-align: center; height: 38px; }
          .portal-sub { background-color: #0284c7; color: #ffffff; font-size: 10pt; font-weight: bold; text-align: center; height: 22px; }
          .section-head { background-color: #f1f5f9; color: #0f172a; font-size: 11pt; font-weight: bold; }
          .client-lbl { background-color: #f8fafc; color: #475569; font-weight: bold; font-size: 9pt; }
          .client-val { background-color: #ffffff; color: #0f172a; font-weight: 600; font-size: 9pt; }
          .table-header { background-color: #1e293b; color: #ffffff; font-weight: bold; font-size: 9pt; text-align: center; height: 32px; border: 1px solid #475569; }
          .data-cell { font-size: 9pt; border: 1px solid #cbd5e1; padding: 6px; }
          .status-completed { background-color: #dcfce7; color: #166534; font-weight: bold; text-align: center; }
          .status-wip { background-color: #dbeafe; color: #1e40af; font-weight: bold; text-align: center; }
          .status-pending { background-color: #fef3c7; color: #92400e; font-weight: bold; text-align: center; }
          .status-delayed { background-color: #fee2e2; color: #991b1b; font-weight: bold; text-align: center; }
          .status-na { background-color: #f1f5f9; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <table border="1" style="border-collapse: collapse;">
          <!-- Website Name & Portal Branding at Top -->
          <tr>
            <th colspan="8" class="portal-brand">Fin2ools — CA Practice &amp; Statutory Compliance Resource Portal</th>
          </tr>
          <tr>
            <th colspan="8" class="portal-sub">STATUTORY COMPLIANCE CHECKLIST &amp; AUDIT WORKING PAPER</th>
          </tr>
          <tr><td colspan="8" style="height: 10px; background: #ffffff; border: none;"></td></tr>

          <!-- Client Details Block at Top -->
          <tr>
            <td colspan="8" class="section-head" style="height: 24px;">&nbsp;CLIENT IDENTIFICATION &amp; FINANCIAL PARAMETERS</td>
          </tr>
          <tr>
            <td class="client-lbl">Client Legal Name:</td>
            <td colspan="3" class="client-val" style="font-size: 11pt; font-weight: bold; color: #1e3a8a;">${statClientName}</td>
            <td class="client-lbl">Entity Type:</td>
            <td colspan="3" class="client-val"><strong>${statEntityType}</strong></td>
          </tr>
          <tr>
            <td class="client-lbl">Permanent Account No (PAN):</td>
            <td class="client-val">${statPan}</td>
            <td class="client-lbl">Primary GSTIN:</td>
            <td class="client-val">${statGstin}</td>
            <td class="client-lbl">Tax Deduction No (TAN):</td>
            <td class="client-val">${statTan || 'N/A'}</td>
            <td class="client-lbl">CIN / LLPIN:</td>
            <td class="client-val">${statCin || 'N/A'}</td>
          </tr>
          <tr>
            <td class="client-lbl">Previous FY Turnover:</td>
            <td class="client-val">${formatCurrency(statTurnover)}</td>
            <td class="client-lbl">Net Worth:</td>
            <td class="client-val">${formatCurrency(statNetWorth)}</td>
            <td class="client-lbl">Net Profit / (Loss):</td>
            <td class="client-val">${formatCurrency(statNetProfit)}</td>
            <td class="client-lbl">Nature of Business:</td>
            <td class="client-val">${statNature}</td>
          </tr>
          <tr>
            <td class="client-lbl">Assessment Period:</td>
            <td colspan="3" class="client-val">FY 2025-26 (AY 2026-27)</td>
            <td class="client-lbl">Report Export Date:</td>
            <td colspan="3" class="client-val">${formattedDate} at ${formattedTime}</td>
          </tr>
          <tr>
            <td class="client-lbl">Compliance Summary:</td>
            <td colspan="7" class="client-val" style="font-weight: bold;">
              Total Obligations: ${statTotalCount} | Completed: ${statCompletedCount} | Work In Progress (WIP): ${statWipCount} | Pending: ${statPendingCount} | Delayed / Overdue: ${statDelayedCount}
            </td>
          </tr>
          <tr><td colspan="8" style="height: 12px; background: #ffffff; border: none;"></td></tr>

          <!-- Table Column Headers -->
          <tr>
            <th style="width: 40px;" class="table-header">#</th>
            <th style="width: 280px;" class="table-header">Description of Statutory Activity / Form</th>
            <th style="width: 100px;" class="table-header">Category</th>
            <th style="width: 130px;" class="table-header">Statutory Due Date</th>
            <th style="width: 130px;" class="table-header">Actual Filing Date</th>
            <th style="width: 120px;" class="table-header">Compliance Status</th>
            <th style="width: 160px;" class="table-header">ACK / SRN / ARN Number</th>
            <th style="width: 240px;" class="table-header">Remarks / Auditor Notes</th>
          </tr>

          <!-- Data Rows -->
          ${statutoryTrackerRows.map((r, idx) => {
            const statusClass = 
              r.complianceStatus === 'Completed' ? 'status-completed' :
              r.complianceStatus === 'WIP' ? 'status-wip' :
              r.complianceStatus === 'Delayed Filing' ? 'status-delayed' :
              r.complianceStatus === 'Not Applicable' ? 'status-na' : 'status-pending';

            return `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td class="data-cell" style="text-align: center; color: #64748b;">${idx + 1}</td>
                <td class="data-cell"><strong>${r.description}</strong><br/><span style="font-size:7.5pt;color:#64748b;">Code: ${r.code}</span></td>
                <td class="data-cell">${r.category}</td>
                <td class="data-cell" style="font-weight: bold; color: #1e3a8a;">${r.statutoryDueDate}</td>
                <td class="data-cell" style="text-align: center;">${r.filingDate || '—'}</td>
                <td class="data-cell ${statusClass}">${r.complianceStatus}</td>
                <td class="data-cell" style="font-family: Consolas, monospace;">${r.ackSrn || '—'}</td>
                <td class="data-cell">${r.remarks || '—'}</td>
              </tr>
            `;
          }).join('')}

          <tr><td colspan="8" style="height: 12px; background: #ffffff; border: none;"></td></tr>
          <tr style="background-color: #f8fafc;">
            <td colspan="3" class="data-cell" style="height: 32px;"><strong>Audit Prepared By:</strong> Article / Associate</td>
            <td colspan="3" class="data-cell"><strong>Reviewed By:</strong> Chartered Accountant</td>
            <td colspan="2" class="data-cell"><strong>Portal ID:</strong> Fin2ools-STAT-${statPan}</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const cleanFileName = `Statutory_Compliance_Tracker_${statPan}_${statEntityType.replace(/\s+/g, '_')}.xls`;
    link.setAttribute("download", cleanFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Excel Working Paper Exported', `Downloaded spreadsheet with client details & Fin2ools portal branding.`, 'success');
  };

  const handleExportTrackerPdf = () => {
    showToast('Generating PDF Report', 'Preparing professional checklist working paper with client details & watermark...', 'info');

    // Create an invisible iframe for isolated printing (ONLY checklist table is rendered)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const rowsHtml = statutoryTrackerRows.map((r, idx) => {
      let statusStyle = 'background:#fef3c7;color:#92400e;border:1px solid #fde68a;';
      if (r.complianceStatus === 'Completed') statusStyle = 'background:#dcfce7;color:#166534;border:1px solid #bbf7d0;';
      else if (r.complianceStatus === 'WIP') statusStyle = 'background:#dbeafe;color:#1e40af;border:1px solid #bfdbfe;';
      else if (r.complianceStatus === 'Delayed Filing') statusStyle = 'background:#fee2e2;color:#991b1b;border:1px solid #fecaca;';
      else if (r.complianceStatus === 'Not Applicable') statusStyle = 'background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;';

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 7px 8px; font-weight: 600; text-align: center; color: #64748b; font-size: 8pt;">${idx + 1}</td>
          <td style="padding: 7px 8px; font-size: 8.5pt; color: #0f172a;">
            <div style="font-weight: 700;">${r.description}</div>
            <div style="font-size: 7pt; color: #64748b; margin-top: 1px;">Code: <strong>${r.code}</strong></div>
          </td>
          <td style="padding: 7px 8px; font-size: 8pt; font-weight: 600; color: #334155;">${r.category}</td>
          <td style="padding: 7px 8px; font-size: 8pt; font-weight: 700; color: #1e3a8a; white-space: nowrap;">${r.statutoryDueDate}</td>
          <td style="padding: 7px 8px; font-size: 8pt; color: ${r.filingDate ? '#0f172a' : '#94a3b8'}; font-weight: ${r.filingDate ? '600' : '400'}; white-space: nowrap;">
            ${r.filingDate ? r.filingDate : '— Pending —'}
          </td>
          <td style="padding: 7px 8px; text-align: center; white-space: nowrap;">
            <span style="display: inline-block; padding: 2px 7px; border-radius: 9999px; font-size: 7pt; font-weight: 700; ${statusStyle}">
              ${r.complianceStatus}
            </span>
          </td>
          <td style="padding: 7px 8px; font-size: 7.5pt; font-family: monospace; color: #0f172a;">
            ${r.ackSrn ? `<strong>${r.ackSrn}</strong>` : '<span style="color:#94a3b8;">Not Recorded</span>'}
          </td>
          <td style="padding: 7px 8px; font-size: 7.5pt; color: #334155;">
            ${r.remarks ? r.remarks : '<span style="color:#cbd5e1;">—</span>'}
          </td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fin2ools Statutory Compliance Checklist - ${statClientName}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 8mm 10mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #0f172a;
            background: #ffffff;
            position: relative;
          }

          /* Transparent Watermark of Portal Brand */
          .watermark-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-28deg);
            z-index: 0;
            pointer-events: none;
            text-align: center;
            opacity: 0.055;
            user-select: none;
          }
          .watermark-brand-title {
            font-size: 56pt;
            font-weight: 900;
            color: #1e3a8a;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            line-height: 1.1;
          }
          .watermark-subtext {
            font-size: 19pt;
            font-weight: 700;
            color: #0284c7;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            margin-top: 8px;
          }

          /* Content Area */
          .report-content {
            position: relative;
            z-index: 1;
          }

          /* Header Section */
          .portal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 10px;
            margin-bottom: 12px;
          }
          .brand-logo-area {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .brand-name {
            font-size: 19pt;
            font-weight: 900;
            color: #1e3a8a;
            letter-spacing: -0.5px;
          }
          .brand-highlight {
            color: #0284c7;
          }
          .brand-tagline {
            font-size: 7.5pt;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .report-doc-title {
            text-align: right;
          }
          .report-doc-title h1 {
            margin: 0;
            font-size: 13pt;
            font-weight: 800;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .report-doc-title p {
            margin: 2px 0 0 0;
            font-size: 7.5pt;
            color: #64748b;
          }

          /* Client Details Box */
          .client-details-card {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 12px;
          }
          .client-title-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            border-bottom: 1px dashed #cbd5e1;
            padding-bottom: 6px;
            margin-bottom: 8px;
          }
          .client-name-lg {
            font-size: 12pt;
            font-weight: 800;
            color: #0f172a;
          }
          .entity-badge {
            background: #1e3a8a;
            color: #ffffff;
            font-size: 7pt;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .client-info-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px 12px;
            font-size: 8pt;
          }
          .info-cell-lbl {
            color: #64748b;
            font-size: 7pt;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 1px;
          }
          .info-cell-val {
            font-weight: 700;
            color: #0f172a;
          }

          /* KPI summary chips */
          .kpi-summary-row {
            display: flex;
            gap: 10px;
            margin-bottom: 12px;
          }
          .kpi-chip {
            flex: 1;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            padding: 5px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .kpi-chip-title {
            font-size: 7pt;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
          }
          .kpi-chip-count {
            font-size: 10.5pt;
            font-weight: 800;
            color: #0f172a;
          }

          /* Checklist Table */
          table.compliance-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            border: 1px solid #cbd5e1;
          }
          table.compliance-table th {
            background-color: #1e293b;
            color: #ffffff;
            font-weight: 700;
            font-size: 7pt;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 8px 7px;
            border-right: 1px solid #334155;
            text-align: left;
          }
          table.compliance-table td {
            vertical-align: middle;
            border-right: 1px solid #e2e8f0;
          }

          /* Auditor Sign-off Footer */
          .audit-footer-signatures {
            margin-top: 18px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
            font-size: 7.5pt;
            page-break-inside: avoid;
          }
          .sign-box {
            border-top: 1px solid #94a3b8;
            padding-top: 5px;
            color: #475569;
          }
          .sign-box strong {
            display: block;
            color: #0f172a;
            font-size: 8pt;
            margin-bottom: 2px;
          }

          .portal-footer-stamp {
            margin-top: 12px;
            border-top: 1px solid #e2e8f0;
            padding-top: 6px;
            display: flex;
            justify-content: space-between;
            color: #94a3b8;
            font-size: 6.5pt;
          }
        </style>
      </head>
      <body>
        <!-- Portal Watermark in good transparency -->
        <div class="watermark-container">
          <div class="watermark-brand-title">FIN2OOLS PORTAL</div>
          <div class="watermark-subtext">Statutory Compliance &amp; CA Audit</div>
        </div>

        <div class="report-content">
          <!-- Top Header with Portal Name -->
          <div class="portal-header">
            <div class="brand-logo-area">
              <div>
                <div class="brand-name">Fin<span class="brand-highlight">2ools</span></div>
                <div class="brand-tagline">Chartered Accountancy &amp; Statutory Compliance Portal</div>
              </div>
            </div>
            <div class="report-doc-title">
              <h1>Statutory Compliance Checklist &amp; Audit Tracker</h1>
              <p>Generated on: ${formattedDate} at ${formattedTime} | FY 2025-26 (AY 2026-27)</p>
            </div>
          </div>

          <!-- Client Master Details at Top -->
          <div class="client-details-card">
            <div class="client-title-row">
              <div class="client-name-lg">${statClientName}</div>
              <div class="entity-badge">${statEntityType}</div>
            </div>
            <div class="client-info-grid">
              <div>
                <div class="info-cell-lbl">Permanent Account No (PAN)</div>
                <div class="info-cell-val" style="letter-spacing:0.5px;">${statPan}</div>
              </div>
              <div>
                <div class="info-cell-lbl">Primary GSTIN</div>
                <div class="info-cell-val" style="letter-spacing:0.5px;">${statGstin}</div>
              </div>
              <div>
                <div class="info-cell-lbl">Tax Deduction No (TAN)</div>
                <div class="info-cell-val">${statTan || 'Not Registered'}</div>
              </div>
              <div>
                <div class="info-cell-lbl">Corporate ID (CIN / LLPIN)</div>
                <div class="info-cell-val">${statCin || 'N/A'}</div>
              </div>
              <div>
                <div class="info-cell-lbl">Previous FY Turnover</div>
                <div class="info-cell-val">${formatCurrency(statTurnover)}</div>
              </div>
              <div>
                <div class="info-cell-lbl">Net Worth</div>
                <div class="info-cell-val">${formatCurrency(statNetWorth)}</div>
              </div>
              <div>
                <div class="info-cell-lbl">Net Profit / (Loss)</div>
                <div class="info-cell-val">${formatCurrency(statNetProfit)}</div>
              </div>
              <div>
                <div class="info-cell-lbl">Nature of Business</div>
                <div class="info-cell-val">${statNature}</div>
              </div>
            </div>
          </div>

          <!-- KPI Summary Row -->
          <div class="kpi-summary-row">
            <div class="kpi-chip">
              <span class="kpi-chip-title">Total Obligations</span>
              <span class="kpi-chip-count">${statTotalCount}</span>
            </div>
            <div class="kpi-chip" style="border-left: 3px solid #16a34a;">
              <span class="kpi-chip-title" style="color:#16a34a;">Completed</span>
              <span class="kpi-chip-count" style="color:#16a34a;">${statCompletedCount}</span>
            </div>
            <div class="kpi-chip" style="border-left: 3px solid #2563eb;">
              <span class="kpi-chip-title" style="color:#2563eb;">Work in Progress</span>
              <span class="kpi-chip-count" style="color:#2563eb;">${statWipCount}</span>
            </div>
            <div class="kpi-chip" style="border-left: 3px solid #d97706;">
              <span class="kpi-chip-title" style="color:#d97706;">Pending</span>
              <span class="kpi-chip-count" style="color:#d97706;">${statPendingCount}</span>
            </div>
            <div class="kpi-chip" style="border-left: 3px solid #dc2626;">
              <span class="kpi-chip-title" style="color:#dc2626;">Delayed / Overdue</span>
              <span class="kpi-chip-count" style="color:#dc2626;">${statDelayedCount}</span>
            </div>
          </div>

          <!-- Checklist Table ONLY -->
          <table class="compliance-table">
            <thead>
              <tr>
                <th style="width: 3%; text-align: center;">#</th>
                <th style="width: 27%;">Description of Statutory Activity / Form</th>
                <th style="width: 10%;">Category</th>
                <th style="width: 13%;">Statutory Due Date</th>
                <th style="width: 12%;">Actual Filing Date</th>
                <th style="width: 11%; text-align: center;">Compliance Status</th>
                <th style="width: 12%;">ACK / SRN / ARN No.</th>
                <th style="width: 12%;">Auditor Notes &amp; Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <!-- Audit Sign-off Block -->
          <div class="audit-footer-signatures">
            <div class="sign-box">
              <strong>Prepared By:</strong>
              <div>Compliance Associate / Article Assistant</div>
              <div style="margin-top: 12px; font-size: 7pt; color: #94a3b8;">Signature &amp; Date</div>
            </div>
            <div class="sign-box">
              <strong>Reviewed &amp; Certified By:</strong>
              <div>Partner / Chartered Accountant</div>
              <div style="margin-top: 12px; font-size: 7pt; color: #94a3b8;">Signature &amp; Date</div>
            </div>
            <div class="sign-box">
              <strong>Audit Verification:</strong>
              <div>ICAI Membership No: __________________</div>
              <div>UDIN (if applicable): ______________________</div>
              <div style="margin-top: 3px; font-size: 7pt; color: #94a3b8;">CA Practice Seal &amp; Stamp</div>
            </div>
          </div>

          <!-- Document Footer -->
          <div class="portal-footer-stamp">
            <div>Confidential Working Paper • Generated from Fin2ools CA Compliance Portal</div>
            <div>Page 1 of 1 • System Verified Audit Trail</div>
          </div>
        </div>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Trigger print once styles and DOM are ready
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }, 450);
  };

  // Statutory Tracker Counts & Filtering
  const filteredStatutoryRows = statutoryTrackerRows.filter(r => statFilterCategory === 'all' || r.category === statFilterCategory);
  const statTotalCount = statutoryTrackerRows.length;
  const statCompletedCount = statutoryTrackerRows.filter(r => r.complianceStatus === 'Completed').length;
  const statWipCount = statutoryTrackerRows.filter(r => r.complianceStatus === 'WIP').length;
  const statPendingCount = statutoryTrackerRows.filter(r => r.complianceStatus === 'Pending').length;
  const statDelayedCount = statutoryTrackerRows.filter(r => r.complianceStatus === 'Delayed Filing').length;

  // 1. Initial Session Verification Splash
  if (authChecking) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)',
          color: '#f8fafc',
          padding: '2rem',
          fontFamily: 'var(--font-body, system-ui, sans-serif)'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <img 
            src="/fin2ools.png" 
            alt="Fin2ools" 
            width={64} 
            height={64} 
            style={{ borderRadius: '14px', marginBottom: '1.25rem', display: 'inline-block' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#60a5fa', fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>
            <RefreshCw className="animate-spin" size={18} />
            <span>Fin2ools Access Firewall</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
            Verifying statutory security credentials &amp; active session...
          </p>
        </div>
      </div>
    );
  }

  // 2. FIREWALL GATEKEEPER: Strict OTP verification required to enter the website
  if (!user) {
    return (
      <div 
        className="firewall-container"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)',
          color: '#f8fafc',
          padding: '2rem 1rem',
          fontFamily: 'var(--font-body, system-ui, sans-serif)'
        }}
      >
        {/* Top Firewall Header */}
        <header style={{ maxWidth: '1080px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.5rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/fin2ools.png" 
              alt="Fin2ools Logo" 
              width={46} 
              height={46} 
              style={{ borderRadius: '12px' }} 
            />
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.5px', color: '#ffffff' }}>Fin<span style={{ color: '#60a5fa' }}>2ools</span></span>
              <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#94a3b8', fontWeight: 700 }}>Security Firewall</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#fca5a5', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
            <Lock size={14} />
            <span>Portal Locked — Email OTP Required</span>
          </div>
        </header>

        {/* Central Authentication Gatekeeper Card */}
        <main style={{ maxWidth: '460px', width: '100%', margin: '0 auto', background: 'rgba(30, 41, 59, 0.92)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px', padding: '2.25rem 2rem', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.35)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#60a5fa' }}>
              <ShieldCheck size={28} />
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '-0.4px' }}>
              Statutory Security Firewall
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              Verify your identity via Email OTP to unlock Fin2ools compliance portals, calculators, and statutory CA tools.
            </p>
          </div>

          {/* FEEDBACK BANNERS */}
          {authFeedback.type === 'success' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.85rem 1rem', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1.25rem', fontSize: '0.82rem', lineHeight: 1.45 }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{authFeedback.message}</span>
            </div>
          )}

          {authFeedback.type === 'error' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.85rem 1rem', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '1.25rem', fontSize: '0.82rem', lineHeight: 1.45 }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{authFeedback.message}</span>
            </div>
          )}

          {/* EMAIL OTP FLOW */}
          {emailStep === 'email' ? (
            <form onSubmit={handleSendEmailOtp}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="gatekeeper-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
                  Work or Professional Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    id="gatekeeper-email"
                    placeholder="name@company.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border 0.2s ease'
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                  We will dispatch a secure 6-digit statutory verification OTP directly to your email inbox.
                </p>
              </div>

              <button
                type="submit"
                disabled={authLoading || !authEmail.trim()}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  background: 'var(--primary, #1a73e8)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: authLoading || !authEmail.trim() ? 'not-allowed' : 'pointer',
                  opacity: authLoading || !authEmail.trim() ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(26, 115, 232, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Dispatching OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyEmailOtp}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="gatekeeper-otp" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>
                    Enter 6-Digit Email OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailStep('email');
                      setOtpCode('');
                      setAuthFeedback({ type: null, message: '' });
                    }}
                    style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.72rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    Change Email
                  </button>
                </div>

                <input
                  type="text"
                  id="gatekeeper-otp"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f172a',
                    border: '1px solid rgba(96, 165, 250, 0.4)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '1.35rem',
                    letterSpacing: '8px',
                    textAlign: 'center',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Sent to <strong>{authEmail}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={authLoading || resendCooldown > 0}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendCooldown > 0 ? '#64748b' : '#60a5fa',
                      fontSize: '0.72rem',
                      cursor: resendCooldown > 0 ? 'default' : 'pointer',
                      padding: 0,
                      textDecoration: resendCooldown > 0 ? 'none' : 'underline'
                    }}
                  >
                    {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
                  </button>
                </div>

                {devOtpHint && (
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed rgba(59, 130, 246, 0.4)', borderRadius: '8px', fontSize: '0.78rem', color: '#93c5fd', textAlign: 'center' }}>
                    💡 Testing Hint: Your verification code is <strong>{devOtpHint}</strong>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading || otpCode.length !== 6}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  background: 'var(--primary, #1a73e8)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: authLoading || otpCode.length !== 6 ? 'not-allowed' : 'pointer',
                  opacity: authLoading || otpCode.length !== 6 ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(26, 115, 232, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Verify &amp; Enter Website</span>
                    <Check size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Compliance & Security Badge */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={11} /> End-to-end statutory encryption &bull; DPDP Act compliant
            </span>
          </div>
        </main>

        {/* Bottom Footer Note */}
        <footer style={{ textAlign: 'center', padding: '1.5rem 0 0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
          &copy; {new Date().getFullYear()} Fin2ools. Compliant with IT Act 1961 &amp; Digital Personal Data Protection Act.
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
      </div>
    );
  }

  return (
    <>
      {/* HEADER / NAVIGATION */}
      <nav className="glass-nav">
        <div className="nav-container">
          <a 
            href="#" 
            className="logo brand-logo-link" 
            onClick={(e) => { e.preventDefault(); handlePageChange('home'); }}
            title="Fin2ools Homepage"
          >
            <img 
              src="/fin2ools.png" 
              alt="Fin2ools Logo" 
              className="brand-logo-img" 
              width={52} 
              height={52} 
            />
          </a>

          {/* Desktop Navigation */}
          <div className="nav-links">
            <button className={`nav-btn ${activePage === 'home' ? 'active' : ''}`} onClick={() => handlePageChange('home')}>Home</button>

            {/* Tools Dropdown */}
            <div className="nav-dropdown">
              <button 
                type="button"
                className={`nav-btn nav-dropdown-trigger ${['calendar', 'calculator', 'interest', 'tracker', 'checklist', 'tools'].includes(activePage) ? 'active' : ''}`}
                onClick={() => handlePageChange('tools')}
              >
                <span>Tools</span>
                <span className="dropdown-arrow">▾</span>
              </button>
              <div className="nav-dropdown-content">
                <button 
                  type="button"
                  className={`dropdown-item ${activePage === 'tools' ? 'active' : ''}`}
                  onClick={() => handlePageChange('tools')}
                  style={{ fontWeight: 600, color: 'var(--primary)' }}
                >
                  <span>Tools Hub (Overview)</span>
                </button>
                <button 
                  type="button"
                  className={`dropdown-item ${activePage === 'calendar' ? 'active' : ''}`}
                  onClick={() => handlePageChange('calendar')}
                >
                  <span>Calendar</span>
                </button>

                <div className="dropdown-section-label">Calculators</div>
                <button 
                  type="button"
                  className={`dropdown-item sub-item ${activePage === 'interest' ? 'active' : ''}`}
                  onClick={() => handlePageChange('interest')}
                >
                  <span>Interest Calculator</span>
                </button>
                <button 
                  type="button"
                  className={`dropdown-item sub-item ${activePage === 'calculator' ? 'active' : ''}`}
                  onClick={() => handlePageChange('calculator')}
                >
                  <span>Tax &amp; Compliance Calculators</span>
                </button>

                <button 
                  type="button"
                  className={`dropdown-item ${activePage === 'tracker' ? 'active' : ''}`}
                  onClick={() => handlePageChange('tracker')}
                >
                  <span>Tracker</span>
                </button>

                <button 
                  type="button"
                  className={`dropdown-item ${activePage === 'checklist' ? 'active' : ''}`}
                  onClick={() => handlePageChange('checklist')}
                >
                  <span>Checklists</span>
                </button>
              </div>
            </div>

            {/* Returns Dropdown */}
            <div className="nav-dropdown">
              <button 
                type="button"
                className={`nav-btn nav-dropdown-trigger ${activePage === 'gstr-3b' ? 'active' : ''}`}
                onClick={() => handlePageChange('gstr-3b')}
              >
                <span>Returns</span>
                <span className="dropdown-arrow">▾</span>
              </button>
              <div className="nav-dropdown-content">
                <button 
                  type="button"
                  className={`dropdown-item ${activePage === 'gstr-3b' ? 'active' : ''}`}
                  onClick={() => handlePageChange('gstr-3b')}
                >
                  <span>GSTR-3B Prep Engine</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 }}>NEW</span>
                </button>
              </div>
            </div>

            {/* Digital Library */}
            <button 
              type="button"
              className={`nav-btn ${activePage === 'library' ? 'active' : ''}`}
              onClick={() => handlePageChange('library')}
              title="Fin2ools Digital Library & Knowledge Vault"
            >
              <span>Digital Library</span>
            </button>

            {/* Connect (tab) - Normal Button (Only Persons symbol, No text on Button) */}
            <button 
              type="button"
              className={`nav-btn nav-icon-only-btn ${activePage === 'connect' || activePage === 'contact' ? 'active' : ''}`} 
              onClick={() => handlePageChange('connect')}
              title="Connect"
              aria-label="Connect"
            >
              <Users size={18} />
            </button>

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
                {theme === 'dark' ? <i data-lucide="sun"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></i> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z"/></svg>}
              </span>
            </button>
            
            {user && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--bg-surface-alt, rgba(255,255,255,0.08))', border: '1px solid var(--border)', borderRadius: '9999px', fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                <span>{user.phoneNumber || user.email || 'Verified User'}</span>
              </div>
            )}

            <button 
              className="nav-cta btn-signout" 
              onClick={handleSignOut} 
              style={{ backgroundColor: 'var(--danger)', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Lock Website and Sign Out"
            >
              <LogOut size={16} />
              <span>Lock &amp; Exit</span>
            </button>

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

          <div className="mobile-nav-heading">Tools</div>
          <button className={`mobile-nav-sub-btn ${activePage === 'tools' ? 'active' : ''}`} onClick={() => { handlePageChange('tools'); handleToggleMobileMenu(); }}>Tools Hub Overview</button>
          <button className={`mobile-nav-sub-btn ${activePage === 'calendar' ? 'active' : ''}`} onClick={() => { handlePageChange('calendar'); handleToggleMobileMenu(); }}>Calendar</button>
          
          <div className="mobile-nav-sub-heading">Calculators</div>
          <button className={`mobile-nav-nested-btn ${activePage === 'interest' ? 'active' : ''}`} onClick={() => { handlePageChange('interest'); handleToggleMobileMenu(); }}>Interest Calculator</button>
          <button className={`mobile-nav-nested-btn ${activePage === 'calculator' ? 'active' : ''}`} onClick={() => { handlePageChange('calculator'); handleToggleMobileMenu(); }}>Tax &amp; Compliance Calculators</button>

          <button className={`mobile-nav-sub-btn ${activePage === 'tracker' ? 'active' : ''}`} onClick={() => { handlePageChange('tracker'); handleToggleMobileMenu(); }}>Tracker</button>
          <button className={`mobile-nav-sub-btn ${activePage === 'checklist' ? 'active' : ''}`} onClick={() => { handlePageChange('checklist'); handleToggleMobileMenu(); }}>Checklists</button>
          <div className="mobile-nav-heading">Returns</div>
          <button className={`mobile-nav-sub-btn ${activePage === 'gstr-3b' ? 'active' : ''}`} onClick={() => { handlePageChange('gstr-3b'); handleToggleMobileMenu(); }}>GSTR-3B Prep Engine</button>

          <button className={`mobile-nav-btn ${activePage === 'library' ? 'active' : ''}`} onClick={() => { handlePageChange('library'); handleToggleMobileMenu(); }}>
            Digital Library
          </button>

          <button className={`mobile-nav-btn ${activePage === 'connect' || activePage === 'contact' ? 'active' : ''}`} onClick={() => { handlePageChange('connect'); handleToggleMobileMenu(); }}>
            <Users size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Connect
          </button>

          {user && (
            <div style={{ padding: '8px 16px', margin: '8px 0', background: 'var(--bg-surface-alt)', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span><strong>Verified:</strong> {user.phoneNumber || user.email}</span>
            </div>
          )}
          <button className={`mobile-nav-btn ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => { handlePageChange('dashboard'); handleToggleMobileMenu(); }}>Team Dashboard</button>
          <button className="mobile-nav-cta" onClick={() => { handleSignOut(); handleToggleMobileMenu(); }} style={{ backgroundColor: 'var(--danger)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <LogOut size={16} />
            <span>Lock &amp; Exit Website</span>
          </button>
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
                <span className="badge-icon">📈</span>
                <span>Learn, Comply, Build the Economy!</span>
              </div>
              <h1>Finance, Tax &amp; Compliance — <span className="gradient-text">Made Easy</span></h1>
              <p>A fintech solution that makes finance, tax, and compliance easy for students, consultants, and corporates.</p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => handlePageChange('tools')}>
                  <Wrench size={18} />
                  <span>Tools</span>
                </button>
                <button className="btn-secondary" onClick={() => handlePageChange('library')}>
                  <BookOpen size={18} />
                  <span>Digital Library</span>
                  <ArrowRight size={16} />
                </button>
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
                  <span className="feat-link">Open <ChevronRight /></span>
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

              <div className="feature-card" onClick={() => handlePageChange('interest')}>
                <div className="feat-icon"><Percent /></div>
                <h3>Interest &amp; Loan Calculator</h3>
                <p>Compute deposit maturity, compound interest, loan EMI, amortization schedules, and export to CSV.</p>
                <div className="feat-footer">
                  <span className="feat-tag">Amortization &amp; CSV</span>
                  <span className="feat-link">Open <ChevronRight /></span>
                </div>
              </div>

              <div className="feature-card" onClick={() => handlePageChange('gstr-3b')}>
                <div className="feat-icon"><FileCheck /></div>
                <h3>GSTR-3B Prep Engine</h3>
                <p>Automated 2B vs 1 ITC reconciliation, Section 17(5) blocked credit rules engine, and GST portal JSON generator.</p>
                <div className="feat-footer">
                  <span className="feat-tag">Automated Engine</span>
                  <span className="feat-link">Open <ChevronRight /></span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-container bg-surface-alt rounded-lg border">
            <div className="section-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="live-feed-pulse">
                    <span className="pulse-dot"></span>
                    <span>Live Authority Feed</span>
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>• {alertsSyncedTime}</span>
                </div>
                <h2>Tax &amp; Regulatory Alert Board</h2>
                <p className="section-subtitle">Real-time statutory notifications, circulars, and directives directly from CBIC, CBDT, MCA, SEBI &amp; ICAI.</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All Authorities' },
                    { id: 'gst', label: 'GST (CBIC)' },
                    { id: 'it', label: 'Income Tax (CBDT)' },
                    { id: 'mca', label: 'Corporate (MCA)' },
                    { id: 'sebi', label: 'SEBI & ICAI' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`library-pill ${alertsFilter === tab.id ? 'active' : ''}`}
                      onClick={() => setAlertsFilter(tab.id)}
                      style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button 
                  type="button"
                  className="btn-secondary" 
                  onClick={handleRefreshAlerts}
                  disabled={alertsLoading}
                  style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Sync and fetch latest feed from regulatory authorities"
                >
                  <RefreshCw size={14} className={alertsLoading ? 'spin-anim' : ''} />
                  <span>{alertsLoading ? 'Syncing...' : 'Sync Live Feed'}</span>
                </button>
              </div>
            </div>

            <div className="updates-grid" style={{ marginTop: '20px' }}>
              {filteredAlerts.map(alert => (
                <div key={alert.id} className="update-card">
                  <div>
                    <div className="update-header">
                      <span className="update-date"><Calendar size={13} /> {alert.date}</span>
                      <span className={`category-tag ${alert.categoryClass}`}>{alert.categoryLabel}</span>
                    </div>
                    {alert.refNo && (
                      <div className="update-ref-badge">{alert.refNo}</div>
                    )}
                    <h3 style={{ marginTop: '10px' }}>{alert.title}</h3>
                    <p className="update-summary" style={{ marginTop: '8px' }}>{alert.summary}</p>
                    {alert.impact && (
                      <div className="update-impact-tag" style={{ marginTop: '10px' }}>{alert.impact}</div>
                    )}
                  </div>

                  <div className="update-actions">
                    <a 
                      href={alert.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="alert-source-link"
                      title={`Open official publication on ${alert.authority}`}
                    >
                      <span>Official Authority Notification</span>
                      <ExternalLink size={13} />
                    </a>

                    <button 
                      type="button" 
                      className="alert-copy-btn"
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText(`${alert.title} (${alert.refNo}) - Official Source: ${alert.link}`);
                        }
                        showToast('Citation Copied', `Copied official citation for ${alert.refNo} to clipboard.`, 'success');
                      }}
                      title="Copy legal citation"
                    >
                      <Copy size={12} />
                      <span>Cite</span>
                    </button>
                  </div>
                </div>
              ))}
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
                <div className="month-selector" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button className="control-btn" onClick={handlePrevMonth} aria-label="Previous Month" title="Previous Month"><ChevronLeft /></button>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <h2 className="current-month-lbl" style={{ margin: 0 }}>{months[calMonth]} {calYear}</h2>
                    {todayDate && calMonth === todayDate.getMonth() && calYear === todayDate.getFullYear() ? (
                      <span className="category-tag tag-gst" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>Current Month</span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleJumpToCurrentMonth}
                        className="control-btn" 
                        style={{ width: 'auto', padding: '3px 10px', fontSize: '0.74rem', height: '26px', borderRadius: 'var(--radius-full)' }}
                        title="Jump to current month"
                      >
                        Jump to Today
                      </button>
                    )}
                  </div>
                  <button className="control-btn" onClick={handleNextMonth} aria-label="Next Month" title="Next Month"><ChevronRight /></button>
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
                    {todayDate && calendarRows.map((r, idx) => {
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
                      <span><span className="dot taxable"></span> Taxable</span>
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
              {todayDate && trackerDateItems.map((item, idx) => {
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

        {/* PAGE 5: DYNAMIC STATUTORY COMPLIANCE CHECKLIST & TRACKER */}
        <section className={`page ${activePage === 'checklist' ? 'active' : ''}`} id="statutory-checklist">
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">CA Practice Suite</span>
              <h1>Dynamic Statutory Compliance Generator</h1>
              <p className="section-subtitle">
                Automate compliance profiling with Indian statutory triggers, Section 17(5) and 44AB rules, and high-density CA audit trackers.
              </p>

              {/* View Mode Switcher */}
              <div style={{ display: 'inline-flex', gap: '8px', padding: '6px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', marginTop: '16px' }}>
                <button
                  type="button"
                  className={`tracker-filter-btn ${statChecklistMode === 'generator' ? 'active' : ''}`}
                  onClick={() => setStatChecklistMode('generator')}
                >
                  <SlidersHorizontal size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Statutory Checklist Engine
                </button>
                <button
                  type="button"
                  className={`tracker-filter-btn ${statChecklistMode === 'documents' ? 'active' : ''}`}
                  onClick={() => setStatChecklistMode('documents')}
                >
                  <FileText size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Document Compilation Lists
                </button>
              </div>
            </div>

            {/* TAB 1: DYNAMIC STATUTORY CHECKLIST GENERATOR */}
            {statChecklistMode === 'generator' && (
              <div className="statutory-main-card">
                {/* WIZARD VIEW */}
                {!isChecklistGenerated ? (
                  <div>
                    {/* 5-Step Wizard Progress Tabs */}
                    <div className="statutory-wizard-tabs">
                      <button
                        type="button"
                        className={`wizard-step-btn ${statWizardStep === 1 ? 'active' : statWizardStep > 1 ? 'completed' : ''}`}
                        onClick={() => setStatWizardStep(1)}
                      >
                        <div className="step-num-bubble">
                          {statWizardStep > 1 ? <Check size={16} /> : '1'}
                        </div>
                        <div className="step-meta-info">
                          <span className="step-title-text">Sheet 1: Entity Master</span>
                          <span className="step-desc-text">PAN, GSTIN, Turnover</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`wizard-step-btn ${statWizardStep === 2 ? 'active' : statWizardStep > 2 ? 'completed' : ''}`}
                        onClick={() => setStatWizardStep(2)}
                      >
                        <div className="step-num-bubble">
                          {statWizardStep > 2 ? <Check size={16} /> : '2'}
                        </div>
                        <div className="step-meta-info">
                          <span className="step-title-text">Sheet 2: Thresholds</span>
                          <span className="step-desc-text">44AB, CSR, E-Inv</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`wizard-step-btn ${statWizardStep === 3 ? 'active' : statWizardStep > 3 ? 'completed' : ''}`}
                        onClick={() => setStatWizardStep(3)}
                      >
                        <div className="step-num-bubble">
                          {statWizardStep > 3 ? <Check size={16} /> : '3'}
                        </div>
                        <div className="step-meta-info">
                          <span className="step-title-text">Sheet 3: Indirect Tax</span>
                          <span className="step-desc-text">GSTR-1, 3B, 9/9C</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`wizard-step-btn ${statWizardStep === 4 ? 'active' : statWizardStep > 4 ? 'completed' : ''}`}
                        onClick={() => setStatWizardStep(4)}
                      >
                        <div className="step-num-bubble">
                          {statWizardStep > 4 ? <Check size={16} /> : '4'}
                        </div>
                        <div className="step-meta-info">
                          <span className="step-title-text">Sheet 4: Direct Tax</span>
                          <span className="step-desc-text">ITR, 3CD, TDS 24/26Q</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`wizard-step-btn ${statWizardStep === 5 ? 'active' : ''}`}
                        onClick={() => setStatWizardStep(5)}
                      >
                        <div className="step-num-bubble">
                          5
                        </div>
                        <div className="step-meta-info">
                          <span className="step-title-text">Sheet 5: MCA & Laws</span>
                          <span className="step-desc-text">AOC-4, MGT-7, PF/ESI</span>
                        </div>
                      </button>
                    </div>

                    {/* Quick Demo Pre-fill Toolbar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                      <button
                        type="button"
                        className="btn-outline"
                        style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                        onClick={handleLoadSampleCorporateProfile}
                      >
                        <RefreshCw size={14} style={{ marginRight: '6px' }} />
                        Pre-fill Sample Corporate Profile
                      </button>
                    </div>

                    {/* SHEET 1: ENTITY MASTER DATA */}
                    {statWizardStep === 1 && (
                      <div className="wizard-sheet-pane">
                        <div className="wizard-pane-header">
                          <div>
                            <h3><Building2 size={22} color="var(--primary)" /> Sheet 1: Entity Master Data</h3>
                            <p>Define the legal taxpayer identification details and financial baselines for applicability checks.</p>
                          </div>
                        </div>

                        <div className="statutory-form-grid-3">
                          <div className="input-group">
                            <label>Client Legal Name *</label>
                            <input
                              type="text"
                              value={statClientName}
                              onChange={(e) => setStatClientName(e.target.value)}
                              placeholder="e.g. Apex Technologies Solutions Private Limited"
                            />
                          </div>

                          <div className="input-group">
                            <label>Permanent Account Number (PAN) *</label>
                            <input
                              type="text"
                              value={statPan}
                              maxLength={10}
                              style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}
                              onChange={(e) => setStatPan(e.target.value.toUpperCase())}
                              placeholder="ABCDE1234F"
                            />
                          </div>

                          <div className="input-group">
                            <label>Primary GSTIN *</label>
                            <input
                              type="text"
                              value={statGstin}
                              maxLength={15}
                              style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}
                              onChange={(e) => setStatGstin(e.target.value.toUpperCase())}
                              placeholder="27ABCDE1234F1Z5"
                            />
                          </div>

                          <div className="input-group">
                            <label>Tax Deduction Account Number (TAN)</label>
                            <input
                              type="text"
                              value={statTan}
                              maxLength={10}
                              style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                              onChange={(e) => setStatTan(e.target.value.toUpperCase())}
                              placeholder="PNEA12345B"
                            />
                          </div>

                          <div className="input-group">
                            <label>CIN / LLPIN (if Corporate/LLP)</label>
                            <input
                              type="text"
                              value={statCin}
                              style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                              onChange={(e) => setStatCin(e.target.value.toUpperCase())}
                              placeholder="U72900MH2021PTC368912"
                            />
                          </div>

                          <div className="input-group">
                            <label>Entity Type *</label>
                            <select value={statEntityType} onChange={(e) => setStatEntityType(e.target.value)}>
                              <option value="Private Limited">Private Limited Company</option>
                              <option value="Public Limited">Public Limited Company</option>
                              <option value="LLP">Limited Liability Partnership (LLP)</option>
                              <option value="Partnership">Partnership Firm</option>
                              <option value="Proprietorship">Sole Proprietorship</option>
                              <option value="Trust/Section 8">Trust / Section 8 Non-Profit</option>
                            </select>
                          </div>

                          <div className="input-group">
                            <label>Nature of Business *</label>
                            <select value={statNature} onChange={(e) => setStatNature(e.target.value)}>
                              <option value="IT/ITES">IT / ITES & Software Development</option>
                              <option value="Manufacturing">Manufacturing & Production</option>
                              <option value="Services">Services & Consultancy</option>
                              <option value="Trading">Trading & Distribution</option>
                              <option value="Professional">Professional Practice / Healthcare</option>
                            </select>
                          </div>

                          <div className="input-group">
                            <label>Previous FY Turnover (₹) *</label>
                            <div className="input-wrapper">
                              <span className="input-prefix">₹</span>
                              <input
                                type="number"
                                value={statTurnover}
                                onChange={(e) => setStatTurnover(Math.max(0, +e.target.value))}
                              />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              Turnover: {formatCurrency(statTurnover)} (Trigger for 44AB & E-invoicing)
                            </span>
                          </div>

                          <div className="input-group">
                            <label>Net Worth (₹)</label>
                            <div className="input-wrapper">
                              <span className="input-prefix">₹</span>
                              <input
                                type="number"
                                value={statNetWorth}
                                onChange={(e) => setStatNetWorth(Math.max(0, +e.target.value))}
                              />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              Net Worth: {formatCurrency(statNetWorth)}
                            </span>
                          </div>

                          <div className="input-group">
                            <label>Net Profit (₹)</label>
                            <div className="input-wrapper">
                              <span className="input-prefix">₹</span>
                              <input
                                type="number"
                                value={statNetProfit}
                                onChange={(e) => setStatNetProfit(+e.target.value)}
                              />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              Net Profit: {formatCurrency(statNetProfit)} (Trigger for CSR u/s 135)
                            </span>
                          </div>
                        </div>

                        <div className="wizard-footer-actions">
                          <button type="button" className="btn-outline" disabled style={{ opacity: 0.5 }}>
                            <ChevronLeft size={16} /> Previous
                          </button>
                          <button type="button" className="btn-primary" onClick={() => setStatWizardStep(2)}>
                            Next: Threshold Applicability <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SHEET 2: THRESHOLD & TRIGGER APPLICABILITY */}
                    {statWizardStep === 2 && (
                      <div className="wizard-sheet-pane">
                        <div className="wizard-pane-header">
                          <div>
                            <h3><SlidersHorizontal size={22} color="var(--primary)" /> Sheet 2: Threshold & Trigger Applicability</h3>
                            <p>Toggle statutory trigger provisions governing audits, transfer pricing, and special disclosures.</p>
                          </div>
                        </div>

                        <div className="compliance-checkbox-grid">
                          <div 
                            className={`compliance-toggle-card ${triggerTaxAudit ? 'checked' : ''}`}
                            onClick={() => setTriggerTaxAudit(!triggerTaxAudit)}
                          >
                            <div className="compliance-custom-checkbox">
                              {triggerTaxAudit && <Check size={16} />}
                            </div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">Tax Audit Applicable u/s 44AB</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Business turnover exceeding ₹1 Crore (or ₹10 Crore with &lt;5% cash transactions). Requires Form 3CA/3CB-3CD.
                              </span>
                              <span className="compliance-card-badge">Section 44AB • Due 30 Sep</span>
                            </div>
                          </div>

                          <div 
                            className={`compliance-toggle-card ${triggerTransferPricing ? 'checked' : ''}`}
                            onClick={() => setTriggerTransferPricing(!triggerTransferPricing)}
                          >
                            <div className="compliance-custom-checkbox">
                              {triggerTransferPricing && <Check size={16} />}
                            </div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">Transfer Pricing Applicable (Domestic / International)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Cross-border related party transactions or Specified Domestic Transactions exceeding ₹20 Crore.
                              </span>
                              <span className="compliance-card-badge">Section 92E / Form 3CEB • Due 31 Oct</span>
                            </div>
                          </div>

                          <div 
                            className={`compliance-toggle-card ${triggerEinvoicing ? 'checked' : ''}`}
                            onClick={() => setTriggerEinvoicing(!triggerEinvoicing)}
                          >
                            <div className="compliance-custom-checkbox">
                              {triggerEinvoicing && <Check size={16} />}
                            </div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">E-Invoicing Applicable (Turnover &gt; ₹5 Cr)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Mandatory generation of Invoice Reference Number (IRN) and QR code on IRP for all B2B invoices.
                              </span>
                              <span className="compliance-card-badge">Rule 48(4) • Real-time Compliance</span>
                            </div>
                          </div>

                          <div 
                            className={`compliance-toggle-card ${triggerCsr ? 'checked' : ''}`}
                            onClick={() => setTriggerCsr(!triggerCsr)}
                          >
                            <div className="compliance-custom-checkbox">
                              {triggerCsr && <Check size={16} />}
                            </div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">CSR Applicability u/s 135</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Net Worth &gt;= ₹500 Cr, Turnover &gt;= ₹1000 Cr, or Net Profit &gt;= ₹5 Cr. Mandates 2% CSR spending and Form CSR-2.
                              </span>
                              <span className="compliance-card-badge">Companies Act Sec 135 • Form CSR-2</span>
                            </div>
                          </div>

                          <div 
                            className={`compliance-toggle-card ${triggerCostRecords ? 'checked' : ''}`}
                            onClick={() => setTriggerCostRecords(!triggerCostRecords)}
                          >
                            <div className="compliance-custom-checkbox">
                              {triggerCostRecords && <Check size={16} />}
                            </div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">Cost Records &amp; Cost Audit Applicability</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Regulated/non-regulated sectors meeting overall turnover ₹35Cr/₹50Cr thresholds. Requires CRA-1 &amp; CRA-4.
                              </span>
                              <span className="compliance-card-badge">Section 148 • Form CRA-2/4</span>
                            </div>
                          </div>

                          <div 
                            className={`compliance-toggle-card ${triggerSft ? 'checked' : ''}`}
                            onClick={() => setTriggerSft(!triggerSft)}
                          >
                            <div className="compliance-custom-checkbox">
                              {triggerSft && <Check size={16} />}
                            </div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">SFT Applicability (Section 285BA)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Obligation to report high-value specified financial transactions like share allotments, bank deposits, etc.
                              </span>
                              <span className="compliance-card-badge">Form 61A • Due 31 May</span>
                            </div>
                          </div>
                        </div>

                        <div className="wizard-footer-actions">
                          <button type="button" className="btn-outline" onClick={() => setStatWizardStep(1)}>
                            <ChevronLeft size={16} /> Previous: Entity Master
                          </button>
                          <button type="button" className="btn-primary" onClick={() => setStatWizardStep(3)}>
                            Next: Indirect Tax / GST <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SHEET 3: INDIRECT TAX / GST & CUSTOMS */}
                    {statWizardStep === 3 && (
                      <div className="wizard-sheet-pane">
                        <div className="wizard-pane-header">
                          <div>
                            <h3><ShieldCheck size={22} color="var(--primary)" /> Sheet 3: Indirect Tax (GST &amp; Customs)</h3>
                            <p>Select all periodic, quarterly, annual, and transaction-level GST returns applicable to this taxpayer.</p>
                          </div>
                        </div>

                        <div className="compliance-checkbox-grid">
                          <div className={`compliance-toggle-card ${gstGstr1 ? 'checked' : ''}`} onClick={() => setGstGstr1(!gstGstr1)}>
                            <div className="compliance-custom-checkbox">{gstGstr1 && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">GSTR-1 (Monthly / QRMP)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Statement of outward supplies of goods or services.</span>
                              <span className="compliance-card-badge">Due 11th / 13th monthly</span>
                            </div>
                          </div>

                          <div className={`compliance-toggle-card ${gstGstr3b ? 'checked' : ''}`} onClick={() => setGstGstr3b(!gstGstr3b)}>
                            <div className="compliance-custom-checkbox">{gstGstr3b && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">GSTR-3B (Summary Return &amp; ITC Settlement)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly self-declared summary return and cash payment of GST.</span>
                              <span className="compliance-card-badge">Due 20th of succeeding month</span>
                            </div>
                          </div>

                          <div className={`compliance-toggle-card ${gstGstr4Cmp08 ? 'checked' : ''}`} onClick={() => setGstGstr4Cmp08(!gstGstr4Cmp08)}>
                            <div className="compliance-custom-checkbox">{gstGstr4Cmp08 && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">GSTR-4 &amp; CMP-08 (Composition Scheme)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quarterly statement and annual return for composition dealers.</span>
                              <span className="compliance-card-badge">CMP-08 18th quarterly • GSTR-4 30 Apr</span>
                            </div>
                          </div>

                          <div className={`compliance-toggle-card ${gstGstr6Isd ? 'checked' : ''}`} onClick={() => setGstGstr6Isd(!gstGstr6Isd)}>
                            <div className="compliance-custom-checkbox">{gstGstr6Isd && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">GSTR-6 (Input Service Distributor - ISD)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly return for distributing common input service credit to units.</span>
                              <span className="compliance-card-badge">Due 13th of succeeding month</span>
                            </div>
                          </div>

                          <div className={`compliance-toggle-card ${gstGstr7Tds ? 'checked' : ''}`} onClick={() => setGstGstr7Tds(!gstGstr7Tds)}>
                            <div className="compliance-custom-checkbox">{gstGstr7Tds && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">GSTR-7 (TDS under GST)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>For government entities and notified persons deducting tax at source.</span>
                              <span className="compliance-card-badge">Due 10th of succeeding month</span>
                            </div>
                          </div>

                          <div className={`compliance-toggle-card ${gstGstr8Tcs ? 'checked' : ''}`} onClick={() => setGstGstr8Tcs(!gstGstr8Tcs)}>
                            <div className="compliance-custom-checkbox">{gstGstr8Tcs && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">GSTR-8 (TCS by E-Commerce Operators)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Statement of tax collected at source on supplies affected via portal.</span>
                              <span className="compliance-card-badge">Due 10th of succeeding month</span>
                            </div>
                          </div>

                          <div className={`compliance-toggle-card ${gstGstr9 ? 'checked' : ''}`} onClick={() => setGstGstr9(!gstGstr9)}>
                            <div className="compliance-custom-checkbox">{gstGstr9 && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">GSTR-9 (Annual Return)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual return for regular taxpayers with turnover &gt; ₹2 Crore.</span>
                              <span className="compliance-card-badge">Due 31st December following FY</span>
                            </div>
                          </div>

                          <div className={`compliance-toggle-card ${gstGstr9c ? 'checked' : ''}`} onClick={() => setGstGstr9c(!gstGstr9c)}>
                            <div className="compliance-custom-checkbox">{gstGstr9c && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">GSTR-9C (Reconciliation Statement)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Self-certified reconciliation statement for turnover &gt; ₹5 Crore.</span>
                              <span className="compliance-card-badge">Due 31st December following FY</span>
                            </div>
                          </div>

                          <div className={`compliance-toggle-card ${gstItc04 ? 'checked' : ''}`} onClick={() => setGstItc04(!gstItc04)}>
                            <div className="compliance-custom-checkbox">{gstItc04 && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">ITC-04 (Job Work Details)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Details of inputs and capital goods dispatched to and received from job workers.</span>
                              <span className="compliance-card-badge">Due 25th October (Half-Yearly/Annual)</span>
                            </div>
                          </div>

                          <div className={`compliance-toggle-card ${gstLutRenewal ? 'checked' : ''}`} onClick={() => setGstLutRenewal(!gstLutRenewal)}>
                            <div className="compliance-custom-checkbox">{gstLutRenewal && <Check size={16} />}</div>
                            <div className="compliance-card-content">
                              <span className="compliance-card-title">LUT Renewal (Exports without Payment of IGST)</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Letter of Undertaking renewal on GST portal for zero-rated export supplies.</span>
                              <span className="compliance-card-badge">Due 31st March (Prior to FY)</span>
                            </div>
                          </div>
                        </div>

                        <div className="wizard-footer-actions">
                          <button type="button" className="btn-outline" onClick={() => setStatWizardStep(2)}>
                            <ChevronLeft size={16} /> Previous: Thresholds
                          </button>
                          <button type="button" className="btn-primary" onClick={() => setStatWizardStep(4)}>
                            Next: Direct Tax &amp; TDS <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SHEET 4: DIRECT TAX / INCOME TAX & TDS */}
                    {statWizardStep === 4 && (
                      <div className="wizard-sheet-pane">
                        <div className="wizard-pane-header">
                          <div>
                            <h3><Calculator size={22} color="var(--primary)" /> Sheet 4: Direct Tax (Income Tax &amp; TDS)</h3>
                            <p>Configure the applicable ITR return type, statutory audit annexures, and quarterly TDS/TCS filings.</p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                          <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '10px' }}>
                            Select Applicable Income Tax Return (ITR) Form:
                          </label>
                          <div className="itr-radio-grid">
                            {['ITR-3', 'ITR-4', 'ITR-5', 'ITR-6', 'ITR-7'].map(form => (
                              <div
                                key={form}
                                className={`itr-radio-card ${directItrForm === form ? 'active' : ''}`}
                                onClick={() => setDirectItrForm(form)}
                              >
                                <input
                                  type="radio"
                                  name="itr_form_select"
                                  checked={directItrForm === form}
                                  onChange={() => setDirectItrForm(form)}
                                />
                                <div>
                                  <div style={{ fontWeight: 700 }}>{form}</div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                    {form === 'ITR-6' ? 'Companies (Non-exempt)' : form === 'ITR-5' ? 'LLP & Partnerships' : form === 'ITR-7' ? 'Trusts/Charities' : form === 'ITR-4' ? 'Presumptive 44AD/ADA' : 'Individual/HUF Business'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '10px' }}>
                            Statutory Audits &amp; Income Tax Disclosures:
                          </span>
                          <div className="compliance-checkbox-grid">
                            <div className={`compliance-toggle-card ${directForm3ca3cd ? 'checked' : ''}`} onClick={() => setDirectForm3ca3cd(!directForm3ca3cd)}>
                              <div className="compliance-custom-checkbox">{directForm3ca3cd && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Form 3CA-3CD / 3CB-3CD (Tax Audit)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Audit report and detailed statement of particulars under Section 44AB.</span>
                                <span className="compliance-card-badge">Due 30 Sep</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${directForm3ceb ? 'checked' : ''}`} onClick={() => setDirectForm3ceb(!directForm3ceb)}>
                              <div className="compliance-custom-checkbox">{directForm3ceb && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Form 3CEB (Transfer Pricing Audit)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Accountant report relating to international and specified domestic transactions.</span>
                                <span className="compliance-card-badge">Due 31 Oct</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${directForm3ceac ? 'checked' : ''}`} onClick={() => setDirectForm3ceac(!directForm3ceac)}>
                              <div className="compliance-custom-checkbox">{directForm3ceac && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Form 3CEAC (CbCR / Master File Notification)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Intimation by a constituent entity resident in India of an international group.</span>
                                <span className="compliance-card-badge">Due 30 Nov</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${directForm61a ? 'checked' : ''}`} onClick={() => setDirectForm61a(!directForm61a)}>
                              <div className="compliance-custom-checkbox">{directForm61a && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Form 61A (Statement of Financial Transactions - SFT)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual return of reportable financial accounts and high-value transactions.</span>
                                <span className="compliance-card-badge">Due 31 May</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '10px' }}>
                            Quarterly TDS &amp; TCS Statements:
                          </span>
                          <div className="compliance-checkbox-grid">
                            <div className={`compliance-toggle-card ${tdsForm24q ? 'checked' : ''}`} onClick={() => setTdsForm24q(!tdsForm24q)}>
                              <div className="compliance-custom-checkbox">{tdsForm24q && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Form 24Q (Salary TDS)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quarterly return of TDS from salaries u/s 192 (Form 16 generation).</span>
                                <span className="compliance-card-badge">Quarterly • 31st post quarter</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${tdsForm26q ? 'checked' : ''}`} onClick={() => setTdsForm26q(!tdsForm26q)}>
                              <div className="compliance-custom-checkbox">{tdsForm26q && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Form 26Q (Non-Salary Domestic TDS)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quarterly return for payments to contractors, rent, professional fees (194C, 194J, 194I).</span>
                                <span className="compliance-card-badge">Quarterly • 31st post quarter</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${tdsForm27q ? 'checked' : ''}`} onClick={() => setTdsForm27q(!tdsForm27q)}>
                              <div className="compliance-custom-checkbox">{tdsForm27q && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Form 27Q (Non-Resident Remittances TDS)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quarterly return of TDS on payments to non-residents u/s 195.</span>
                                <span className="compliance-card-badge">Quarterly • 31st post quarter</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${tdsForm27eq ? 'checked' : ''}`} onClick={() => setTdsForm27eq(!tdsForm27eq)}>
                              <div className="compliance-custom-checkbox">{tdsForm27eq && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Form 27EQ (TCS Return)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quarterly return for tax collected at source on sale of goods u/s 206C.</span>
                                <span className="compliance-card-badge">Quarterly • 15th post quarter</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${tdsForm15caCb ? 'checked' : ''}`} onClick={() => setTdsForm15caCb(!tdsForm15caCb)}>
                              <div className="compliance-custom-checkbox">{tdsForm15caCb && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Form 15CA / 15CB (Foreign Remittances)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tax declaration and CA certification for outward bank remittances abroad.</span>
                                <span className="compliance-card-badge">Event-based • Prior to remittance</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="wizard-footer-actions">
                          <button type="button" className="btn-outline" onClick={() => setStatWizardStep(3)}>
                            <ChevronLeft size={16} /> Previous: Indirect Tax
                          </button>
                          <button type="button" className="btn-primary" onClick={() => setStatWizardStep(5)}>
                            Next: MCA &amp; Secretarial Laws <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SHEET 5: MCA, SECRETARIAL & OTHER LAWS */}
                    {statWizardStep === 5 && (
                      <div className="wizard-sheet-pane">
                        <div className="wizard-pane-header">
                          <div>
                            <h3><FileCheck size={22} color="var(--primary)" /> Sheet 5: MCA, Secretarial &amp; Other Laws</h3>
                            <p>Configure corporate annual filings with ROC, annual director KYCs, and payroll labor welfare obligations.</p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '10px' }}>
                            MCA / ROC Corporate Filings:
                          </span>
                          <div className="compliance-checkbox-grid">
                            <div className={`compliance-toggle-card ${mcaStatAuditReport ? 'checked' : ''}`} onClick={() => setMcaStatAuditReport(!mcaStatAuditReport)}>
                              <div className="compliance-custom-checkbox">{mcaStatAuditReport && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">Statutory Audit Report</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Auditor's report on balance sheet and profit &amp; loss account under Sec 143.</span>
                                <span className="compliance-card-badge">Before AGM Date</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${mcaAoc4 ? 'checked' : ''}`} onClick={() => setMcaAoc4(!mcaAoc4)}>
                              <div className="compliance-custom-checkbox">{mcaAoc4 && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">AOC-4 / AOC-4 XBRL / AOC-4 NBFC</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual filing of financial statements with ROC (30 days from AGM).</span>
                                <span className="compliance-card-badge">Due 30 Oct</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${mcaAoc4Csr2 ? 'checked' : ''}`} onClick={() => setMcaAoc4Csr2(!mcaAoc4Csr2)}>
                              <div className="compliance-custom-checkbox">{mcaAoc4Csr2 && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">AOC-4 CSR-2</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Report on Corporate Social Responsibility submitted with Form AOC-4.</span>
                                <span className="compliance-card-badge">Along with AOC-4</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${mcaMgt7 ? 'checked' : ''}`} onClick={() => setMcaMgt7(!mcaMgt7)}>
                              <div className="compliance-custom-checkbox">{mcaMgt7 && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">MGT-7 / MGT-7A (Annual Return)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual return containing company shareholding and directorship details.</span>
                                <span className="compliance-card-badge">Due 29 Nov (60 days from AGM)</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${mcaMsme1 ? 'checked' : ''}`} onClick={() => setMcaMsme1(!mcaMsme1)}>
                              <div className="compliance-custom-checkbox">{mcaMsme1 && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">MSME Form-1 (Half-Yearly)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Half-yearly return for outstanding dues to Micro and Small enterprises exceeding 45 days.</span>
                                <span className="compliance-card-badge">Due 30 Apr &amp; 31 Oct</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${mcaDpt3 ? 'checked' : ''}`} onClick={() => setMcaDpt3(!mcaDpt3)}>
                              <div className="compliance-custom-checkbox">{mcaDpt3 && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">DPT-3 (Return of Deposits)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual return of deposits and particulars of transactions not considered as deposits.</span>
                                <span className="compliance-card-badge">Due 30 June</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${mcaDir3Kyc ? 'checked' : ''}`} onClick={() => setMcaDir3Kyc(!mcaDir3Kyc)}>
                              <div className="compliance-custom-checkbox">{mcaDir3Kyc && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">DIR-3 KYC / DIR-3 KYC WEB</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual KYC verification for every Director holding a valid DIN.</span>
                                <span className="compliance-card-badge">Due 30 Sep</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${mcaAdt1 ? 'checked' : ''}`} onClick={() => setMcaAdt1(!mcaAdt1)}>
                              <div className="compliance-custom-checkbox">{mcaAdt1 && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">ADT-1 (Auditor Appointment)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Notice to Registrar of appointment or reappointment of statutory auditor.</span>
                                <span className="compliance-card-badge">15 days from AGM Date</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${mcaBen2 ? 'checked' : ''}`} onClick={() => setMcaBen2(!mcaBen2)}>
                              <div className="compliance-custom-checkbox">{mcaBen2 && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">BEN-2 (Significant Beneficial Ownership - SBO)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Return to Registrar in respect of declaration under Section 90.</span>
                                <span className="compliance-card-badge">30 days from declaration</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${mcaMgt14 ? 'checked' : ''}`} onClick={() => setMcaMgt14(!mcaMgt14)}>
                              <div className="compliance-custom-checkbox">{mcaMgt14 && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">MGT-14 (Filing of Resolutions &amp; Agreements)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Filing special resolutions and board powers approved by company shareholders.</span>
                                <span className="compliance-card-badge">30 days from resolution</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '10px' }}>
                            FEMA &amp; Labour Laws Compliance:
                          </span>
                          <div className="compliance-checkbox-grid">
                            <div className={`compliance-toggle-card ${femaFlaReturn ? 'checked' : ''}`} onClick={() => setFemaFlaReturn(!femaFlaReturn)}>
                              <div className="compliance-custom-checkbox">{femaFlaReturn && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">FLA Return (Foreign Liabilities &amp; Assets - RBI)</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual return on RBI FIRMS portal for entities with FDI or ODI investments.</span>
                                <span className="compliance-card-badge">Due 15 July</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${labourPfEsiMonthly ? 'checked' : ''}`} onClick={() => setLabourPfEsiMonthly(!labourPfEsiMonthly)}>
                              <div className="compliance-custom-checkbox">{labourPfEsiMonthly && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">PF &amp; ESI Monthly Returns</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly Electronic Challan cum Return (ECR) for Provident Fund and ESIC contributions.</span>
                                <span className="compliance-card-badge">Due 15th of each month</span>
                              </div>
                            </div>

                            <div className={`compliance-toggle-card ${labourPtReturns ? 'checked' : ''}`} onClick={() => setLabourPtReturns(!labourPtReturns)}>
                              <div className="compliance-custom-checkbox">{labourPtReturns && <Check size={16} />}</div>
                              <div className="compliance-card-content">
                                <span className="compliance-card-title">PT (Professional Tax) Returns</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly or annual professional tax return and payment under State legislation.</span>
                                <span className="compliance-card-badge">Monthly / Annual schedule</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="wizard-footer-actions">
                          <button type="button" className="btn-outline" onClick={() => setStatWizardStep(4)}>
                            <ChevronLeft size={16} /> Previous: Direct Tax
                          </button>
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                            onClick={handleGenerateStatutoryChecklist}
                          >
                            <Award size={18} /> Generate Statutory Checklist
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* PART 2 & PART 3: OUTPUT COMPLIANCE TRACKER TABLE & ACTIONS */
                  <div className="wizard-sheet-pane">
                    {/* Dashboard Header Profile Banner */}
                    <div className="tracker-dashboard-header">
                      <div className="tracker-client-profile">
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Statutory Audit Profile
                          </span>
                          <h2 className="client-main-name">
                            <Building2 size={26} color="var(--primary)" />
                            {statClientName}
                          </h2>
                          <div className="client-meta-chips">
                            <span className="meta-chip">Entity: <strong>{statEntityType}</strong></span>
                            <span className="meta-chip">PAN: <strong>{statPan}</strong></span>
                            <span className="meta-chip">GSTIN: <strong>{statGstin}</strong></span>
                            {statCin && <span className="meta-chip">CIN: <strong>{statCin}</strong></span>}
                            <span className="meta-chip">Turnover: <strong>{formatCurrency(statTurnover)}</strong></span>
                            <span className="meta-chip">Nature: <strong>{statNature}</strong></span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn-outline"
                          onClick={() => setIsChecklistGenerated(false)}
                          style={{ fontSize: '0.85rem' }}
                        >
                          <SlidersHorizontal size={14} style={{ marginRight: '6px' }} />
                          Reconfigure Profile
                        </button>
                      </div>

                      {/* KPI Chips Bar */}
                      <div className="compliance-kpi-bar">
                        <div className="compliance-kpi-chip">
                          <div className="kpi-chip-icon blue"><Layers size={20} /></div>
                          <div className="kpi-chip-data">
                            <span className="kpi-chip-num">{statTotalCount}</span>
                            <span className="kpi-chip-title">Total Obligations</span>
                          </div>
                        </div>

                        <div className="compliance-kpi-chip">
                          <div className="kpi-chip-icon green"><CheckCircle2 size={20} /></div>
                          <div className="kpi-chip-data">
                            <span className="kpi-chip-num">{statCompletedCount}</span>
                            <span className="kpi-chip-title">Completed</span>
                          </div>
                        </div>

                        <div className="compliance-kpi-chip">
                          <div className="kpi-chip-icon blue"><Clock size={20} /></div>
                          <div className="kpi-chip-data">
                            <span className="kpi-chip-num">{statWipCount}</span>
                            <span className="kpi-chip-title">Work In Progress</span>
                          </div>
                        </div>

                        <div className="compliance-kpi-chip">
                          <div className="kpi-chip-icon amber"><Hourglass size={20} /></div>
                          <div className="kpi-chip-data">
                            <span className="kpi-chip-num">{statPendingCount}</span>
                            <span className="kpi-chip-title">Pending</span>
                          </div>
                        </div>

                        <div className="compliance-kpi-chip">
                          <div className="kpi-chip-icon red"><AlertTriangle size={20} /></div>
                          <div className="kpi-chip-data">
                            <span className="kpi-chip-num">{statDelayedCount}</span>
                            <span className="kpi-chip-title">Delayed / Overdue</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Toolbar: Category Filter & Export Actions */}
                    <div className="tracker-toolbar">
                      <div className="tracker-filter-pills">
                        {['all', 'GST', 'Direct Tax', 'TDS', 'MCA', 'Labour/FEMA'].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            className={`tracker-filter-btn ${statFilterCategory === cat ? 'active' : ''}`}
                            onClick={() => setStatFilterCategory(cat)}
                          >
                            {cat === 'all' ? `All Items (${statTotalCount})` : cat}
                          </button>
                        ))}
                      </div>

                      <div className="tracker-export-btns">
                        <button type="button" className="btn-secondary" onClick={handleExportTrackerPdf}>
                          <Printer size={16} />
                          Export Tracker (PDF)
                        </button>
                        <button type="button" className="btn-secondary" onClick={handleExportTrackerCsv}>
                          <FileSpreadsheet size={16} />
                          Export to Excel
                        </button>
                      </div>
                    </div>

                    {/* Part 2: Interactive Data Table */}
                    <div className="table-responsive statutory-table-container">
                      <table className="statutory-table">
                        <thead>
                          <tr>
                            <th style={{ width: '28%' }}>Description of Statutory Activity / Form</th>
                            <th style={{ width: '14%' }}>Statutory Due Date</th>
                            <th style={{ width: '14%' }}>Completion / Actual Filing Date</th>
                            <th style={{ width: '14%' }}>Compliance Status</th>
                            <th style={{ width: '15%' }}>ACK / SRN No. &amp; Date</th>
                            <th style={{ width: '15%' }}>Remarks / Auditor Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStatutoryRows.map((row) => (
                            <tr key={row.id}>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.description}</span>
                                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.72rem', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                      {row.code}
                                    </span>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>• {row.category}</span>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <span className="due-date-badge">
                                  <Calendar size={13} color="var(--primary)" />
                                  {row.statutoryDueDate}
                                </span>
                              </td>

                              <td>
                                <input
                                  type="date"
                                  className="table-date-input"
                                  value={row.filingDate || ''}
                                  onChange={(e) => handleStatutoryRowChange(row.id, 'filingDate', e.target.value)}
                                />
                              </td>

                              <td>
                                <select
                                  className={`status-select ${
                                    row.complianceStatus === 'Completed' ? 'completed' :
                                    row.complianceStatus === 'WIP' ? 'wip' :
                                    row.complianceStatus === 'Delayed Filing' ? 'delayed' :
                                    row.complianceStatus === 'Not Applicable' ? 'na' : 'pending'
                                  }`}
                                  value={row.complianceStatus}
                                  onChange={(e) => handleStatutoryRowChange(row.id, 'complianceStatus', e.target.value)}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="WIP">WIP</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Delayed Filing">Delayed Filing</option>
                                  <option value="Not Applicable">Not Applicable</option>
                                </select>
                              </td>

                              <td>
                                <input
                                  type="text"
                                  className="table-text-input"
                                  placeholder="e.g. SRN-998201 / ARN"
                                  value={row.ackSrn || ''}
                                  onChange={(e) => handleStatutoryRowChange(row.id, 'ackSrn', e.target.value)}
                                />
                              </td>

                              <td>
                                <input
                                  type="text"
                                  className="table-text-input"
                                  placeholder="Audit working notes..."
                                  value={row.remarks || ''}
                                  onChange={(e) => handleStatutoryRowChange(row.id, 'remarks', e.target.value)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DOCUMENT COMPILATION LISTS (LEGACY VIEW PRESERVED) */}
            {statChecklistMode === 'documents' && (
              <div className="checklist-wrap" style={{ marginTop: '24px' }}>
                {checklistItems.map((cl, ci) => {
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
            )}
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
                    <div className="b-list-item"><span>Rebate Limit u/s 87A</span><strong className="text-success">&#8377;12L Income</strong></div>
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

        {/* PAGE 8: CONNECT */}
        <section className={`page ${activePage === 'connect' || activePage === 'contact' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Join the Network</span>
              <h1>Join the Fin2ools family!</h1>
              <p className="section-subtitle">Join the Fin2ools family. We are building a welcoming network where students, consultants, and organizations collaborate and drive each other's success in finance and compliance.</p>
            </div>

            <div className="contact-layout connect-layout-centered">
              <form className="contact-form" id="connect-form" onSubmit={handleConnectSubmit}>
                {/* SUCCESS FEEDBACK BANNER */}
                {connectFeedback.type === 'success' && (
                  <div 
                    className="form-feedback feedback-success" 
                    role="alert"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      border: '1px solid #a7f3d0',
                      marginBottom: '1.25rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                    <span>{connectFeedback.message}</span>
                  </div>
                )}

                {/* ERROR FEEDBACK BANNER */}
                {connectFeedback.type === 'error' && (
                  <div 
                    className="form-feedback feedback-error" 
                    role="alert"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#fef2f2',
                      color: '#991b1b',
                      border: '1px solid #fecaca',
                      marginBottom: '1.25rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <AlertCircle size={20} style={{ flexShrink: 0 }} />
                    <span>{connectFeedback.message}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="connect-name">Full Name</label>
                    <input type="text" id="connect-name" name="fullName" placeholder="John Doe" required disabled={savingForm} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="connect-phone">Phone Number</label>
                    <input type="tel" id="connect-phone" name="phoneNumber" placeholder="+91 XXXXX XXXXX" required disabled={savingForm} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="connect-email">Email ID</label>
                    <input type="email" id="connect-email" name="emailId" placeholder="john@example.com" required disabled={savingForm} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="connect-user-type">User</label>
                    <select id="connect-user-type" name="selection" required defaultValue="" disabled={savingForm}>
                      <option value="" disabled>Select User Type...</option>
                      <option value="Students">Students</option>
                      <option value="Consultants">Consultants</option>
                      <option value="Organisations">Organisations</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="connect-msg">Description</label>
                  <textarea id="connect-msg" name="description" rows="4" placeholder="Tell us about yourself, your goals, or collaboration ideas..." required disabled={savingForm}></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={savingForm}>
                  <span>{savingForm ? 'Submitting...' : 'Join the Fin2ools family!'}</span>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* PAGE 9: BOOK CONSULTATION */}
        <section className={`page ${activePage === 'consultation' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Expert Consultation</span>
              <h1>Book a Consultation</h1>
              <p className="section-subtitle">Speak with our chartered experts and financial consultants for customized tax filings, advisory, and corporate compliance.</p>
            </div>

            <div className="contact-layout connect-layout-centered">
              <BookConsultationForm 
                onSuccess={async (payload) => {
                  showToast(
                    'Consultation Booked!',
                    `Thank you, ${payload.fullName}. Your request for "${payload.requiredService}" has been sent to our specialists.`,
                    'success'
                  );
                  if (supabase) {
                    try {
                      await supabase.from('consultations').insert([{
                        name: payload.fullName,
                        email: payload.emailId,
                        phone: payload.phoneNumber,
                        service: payload.requiredService,
                        message: payload.description,
                        created_at: new Date()
                      }]);
                    } catch (sbErr) {
                      console.warn('Supabase consultation logging note:', sbErr);
                    }
                  }
                }}
              />
            </div>
          </div>
        </section>

        {/* PAGE 9: MEMBER LOGIN / PASSWORDLESS & OTP */}
        <section className={`page ${activePage === 'login' ? 'active' : ''}`}>
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-logo">
                <span className="logo-icon"><ShieldCheck /></span>
                <h2>Fin<span>2ools</span> Team</h2>
              </div>
              <p className="auth-subtitle">Secure, statutory portal access with Email Verification OTP.</p>
              
              {user && (
                <div style={{ textAlign: 'center', padding: '1rem', margin: '1rem 0', background: 'var(--bg-surface-alt)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    ✅ Currently Authenticated as <strong>{user.email || user.phoneNumber}</strong>
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button type="button" onClick={() => handlePageChange('home')} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                      Go to Homepage
                    </button>
                    <button type="button" onClick={handleSignOut} style={{ background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                      Lock &amp; Exit
                    </button>
                  </div>
                </div>
              )}

              {/* IN-CARD AUTH FEEDBACK BANNERS */}
              {authFeedback.type === 'success' && (
                <div 
                  className="form-feedback feedback-success" 
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    border: '1px solid #a7f3d0',
                    marginBottom: '1rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                  <span>{authFeedback.message}</span>
                </div>
              )}

              {authFeedback.type === 'error' && (
                <div 
                  className="form-feedback feedback-error" 
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#fef2f2',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                    marginBottom: '1rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{authFeedback.message}</span>
                </div>
              )}

              {authFeedback.type === 'info' && (
                <div 
                  className="form-feedback feedback-info" 
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#eff6ff',
                    color: '#1e40af',
                    border: '1px solid #bfdbfe',
                    marginBottom: '1rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <Info size={18} style={{ flexShrink: 0 }} />
                  <span>{authFeedback.message}</span>
                </div>
              )}

              {/* EMAIL OTP FLOW */}
              {!user && (
                <div>
                  {emailStep === 'email' ? (
                    <form onSubmit={handleSendEmailOtp} className="auth-form">
                      <div className="form-group">
                        <label htmlFor="auth-email">Work or Professional Email</label>
                        <div className="auth-input-wrapper">
                          <span className="auth-input-icon"><Mail size={16} /></span>
                          <input 
                            type="email" 
                            id="auth-email" 
                            placeholder="name@company.com" 
                            value={authEmail} 
                            onChange={(e) => setAuthEmail(e.target.value)} 
                            required 
                            autoFocus
                          />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                          We will send a 6-digit statutory verification OTP code directly to your email inbox.
                        </p>
                      </div>

                      <button type="submit" className="auth-submit-btn" disabled={authLoading || !authEmail.trim()}>
                        {authLoading ? (
                          <span className="flex-center-y justify-center gap-2">
                            <RefreshCw className="animate-spin" size={16} style={{ display: 'inline-block', marginRight: '6px' }} />
                            <span>Dispatching OTP...</span>
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span>Send Verification OTP</span>
                            <ArrowRight size={16} />
                          </span>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyEmailOtp} className="auth-form">
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label htmlFor="auth-otp" style={{ margin: 0 }}>Enter 6-Digit Code</label>
                          <button 
                            type="button" 
                            onClick={() => { setEmailStep('email'); setOtpCode(''); setAuthFeedback({ type: null, message: '' }); }}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                          >
                            Change Email
                          </button>
                        </div>
                        <div className="auth-input-wrapper">
                          <span className="auth-input-icon"><ShieldCheck size={16} /></span>
                          <input 
                            type="text" 
                            id="auth-otp" 
                            placeholder="123456" 
                            value={otpCode} 
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                            maxLength={6}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            style={{ fontSize: '1.25rem', letterSpacing: '6px', textAlign: 'center', fontWeight: 'bold' }}
                            required 
                            autoFocus
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Sent to <strong>{authEmail}</strong>
                          </span>
                          <button 
                            type="button" 
                            onClick={handleSendEmailOtp}
                            disabled={authLoading || resendCooldown > 0}
                            style={{ background: 'none', border: 'none', color: resendCooldown > 0 ? 'var(--text-secondary)' : 'var(--primary)', fontSize: '0.75rem', cursor: resendCooldown > 0 ? 'default' : 'pointer', padding: 0, textDecoration: resendCooldown > 0 ? 'none' : 'underline' }}
                          >
                            {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
                          </button>
                        </div>

                        {devOtpHint && (
                          <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed rgba(59, 130, 246, 0.4)', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--primary)', textAlign: 'center' }}>
                            💡 Testing Hint: Your verification code is <strong>{devOtpHint}</strong>
                          </div>
                        )}
                      </div>

                      <button type="submit" className="auth-submit-btn" disabled={authLoading || otpCode.length !== 6}>
                        {authLoading ? (
                          <span className="flex-center-y justify-center gap-2">
                            <RefreshCw className="animate-spin" size={16} style={{ display: 'inline-block', marginRight: '6px' }} />
                            <span>Verifying Code...</span>
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span>Verify &amp; Sign In</span>
                            <Check size={16} />
                          </span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PAGE 10: TEAM DASHBOARD & ANALYTICS */}
        <section className={`page ${activePage === 'dashboard' ? 'active' : ''}`}>
          <ProtectedRoute enabled={activePage === 'dashboard'} onRedirect={() => handlePageChange('login')} redirectTo="/#login">
            <div className="dashboard-wrapper">
              {/* UNVERIFIED EMAIL NOTIFICATION BANNER */}
              {user && user.email && !user.emailVerified && (
                <div 
                  className="unverified-email-banner" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    padding: '14px 18px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    color: '#92400e'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={20} className="text-warning" style={{ color: '#d97706', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem' }}>
                      Email unverified: <strong>{user?.email}</strong>. Check your inbox &amp; spam folder for the activation link.
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleResendVerification} 
                    disabled={authLoading}
                    className="btn-secondary"
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      backgroundColor: '#fff',
                      borderColor: '#d97706',
                      color: '#92400e',
                      cursor: 'pointer'
                    }}
                  >
                    {authLoading ? 'Sending...' : 'Resend Verification Link'}
                  </button>
                </div>
              )}

              <div className="dashboard-header-panel">
                <div className="db-header-title">
                  <span className="db-badge">Active Session</span>
                  <h1>Team Portal &amp; Analytics</h1>
                  <p>Welcome back, <strong>{user?.phoneNumber || user?.email || 'Team Member'}</strong>. Here is your dashboard overview.</p>
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
                              <td>
                                <strong>{c.name}</strong>
                                {c.user_type && (
                                  <span className="category-tag tag-gst" style={{ display: 'inline-block', marginLeft: '6px', fontSize: '0.72rem', padding: '2px 6px' }}>
                                    {c.user_type}
                                  </span>
                                )}
                              </td>
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
          </ProtectedRoute>
        </section>

        {/* PAGE 11: INTEREST & LOAN CALCULATOR */}
        <section className={`page ${activePage === 'interest' ? 'active' : ''}`} id="interest">
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Financial Engineering</span>
              <h2>Advanced Interest &amp; Loan Calculator</h2>
              <p className="section-subtitle">
                Comprehensive deposit maturity, compound growth, loan EMI, amortization schedules, and CSV export.
              </p>
            </div>

            {/* Segmented Mode Selector */}
            <div className="seg-btn-group" role="tablist">
              <button 
                type="button"
                className={`seg-btn ${interestMode === 'deposit' ? 'active' : ''}`}
                onClick={() => setInterestMode('deposit')}
              >
                <Percent size={18} />
                <span>Deposit / Investment Growth</span>
              </button>
              <button 
                type="button"
                className={`seg-btn ${interestMode === 'loan' ? 'active' : ''}`}
                onClick={() => setInterestMode('loan')}
              >
                <Wallet size={18} />
                <span>Loan / EMI &amp; Amortization</span>
              </button>
            </div>

            {interestMode === 'deposit' ? (
              <div className="calc-grid">
                {/* Deposit Inputs */}
                <div className="calc-inputs-pane">
                  <h3>Deposit Parameters</h3>

                  <div className="input-group">
                    <label>Principal Amount (₹)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input 
                        type="number" 
                        min="0" 
                        step="1000"
                        value={depPrincipal} 
                        onChange={(e) => setDepPrincipal(e.target.value)}
                        placeholder="10000"
                      />
                    </div>
                  </div>

                  <div className="input-group-row">
                    <div className="input-group">
                      <label>Annual Interest Rate (%)</label>
                      <input 
                        type="number" 
                        min="0" 
                        step="0.05"
                        value={depRate} 
                        onChange={(e) => setDepRate(e.target.value)}
                        placeholder="6.5"
                      />
                    </div>
                    <div className="input-group">
                      <label>Investment Tenure</label>
                      <input 
                        type="number" 
                        min="0" 
                        step="1"
                        value={depTime} 
                        onChange={(e) => setDepTime(e.target.value)}
                        placeholder="3"
                      />
                    </div>
                  </div>

                  <div className="input-group-row">
                    <div className="input-group">
                      <label>Tenure Unit</label>
                      <select value={depTimeUnit} onChange={(e) => setDepTimeUnit(e.target.value)}>
                        <option value="years">Years</option>
                        <option value="months">Months</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Compounding Frequency</label>
                      <select value={depComp} onChange={(e) => setDepComp(e.target.value)}>
                        <option value="simple">Simple Interest</option>
                        <option value="1">Annually (1/yr)</option>
                        <option value="2">Semiannually (2/yr)</option>
                        <option value="4">Quarterly (4/yr)</option>
                        <option value="12">Monthly (12/yr)</option>
                        <option value="365">Daily (365/yr)</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Day Count Convention</label>
                    <select value={depDayCount} onChange={(e) => setDepDayCount(e.target.value)}>
                      <option value="actual/365">Actual / 365 (Standard)</option>
                      <option value="actual/360">Actual / 360 (Money Market)</option>
                      <option value="30/360">30 / 360 (Bond Basis)</option>
                    </select>
                  </div>

                  <div className="calc-actions-row">
                    <button 
                      type="button"
                      className="btn-secondary" 
                      onClick={() => {
                        setDepPrincipal(10000);
                        setDepRate(6.5);
                        setDepTime(3);
                        setDepTimeUnit('years');
                        setDepComp('12');
                        setDepDayCount('actual/365');
                        showToast('Reset Complete', 'Deposit inputs restored to defaults.', 'info');
                      }}
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>

                {/* Deposit Results */}
                <div className="calc-results-pane">
                  <h3>Investment Yield Summary</h3>

                  <div className="results-rows">
                    <div className="res-item">
                      <span className="res-lbl">Principal Invested</span>
                      <span className="res-val">{formatCurrency(Number(depPrincipal) || 0)}</span>
                    </div>

                    <div className="res-item">
                      <span className="res-lbl">Total Interest Earned</span>
                      <span className="res-val" style={{ color: 'var(--success)' }}>
                        +{formatCurrency(depositInterest)}
                      </span>
                    </div>

                    <div className="res-item">
                      <span className="res-lbl">Effective Annual Rate (EAR)</span>
                      <span className="res-val">{(depositEAR * 100).toFixed(3)}%</span>
                    </div>

                    <div className="res-item total-row">
                      <span className="res-lbl">Maturity Amount</span>
                      <span className="res-val highlight-value">{formatCurrency(depositMaturity)}</span>
                    </div>
                  </div>

                  <div className="calc-info-note">
                    <Info />
                    <span>
                      Interest calculated based on {depComp === 'simple' ? 'Simple Interest' : `${depComp}x annual compounding`} under {depDayCount} day-count methodology.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="calc-grid">
                  {/* Loan Inputs */}
                  <div className="calc-inputs-pane">
                    <h3>Loan Parameters</h3>

                    <div className="input-group">
                      <label>Loan Amount (Principal ₹)</label>
                      <div className="input-wrapper">
                        <span className="input-prefix">₹</span>
                        <input 
                          type="number" 
                          min="0" 
                          step="10000"
                          value={loanAmount} 
                          onChange={(e) => setLoanAmount(e.target.value)}
                          placeholder="500000"
                        />
                      </div>
                    </div>

                    <div className="input-group-row">
                      <div className="input-group">
                        <label>Annual Interest Rate (%)</label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.05"
                          value={loanRate} 
                          onChange={(e) => setLoanRate(e.target.value)}
                          placeholder="7.25"
                        />
                      </div>
                      <div className="input-group">
                        <label>Loan Tenure</label>
                        <input 
                          type="number" 
                          min="1" 
                          step="1"
                          value={loanTenure} 
                          onChange={(e) => setLoanTenure(e.target.value)}
                          placeholder="240"
                        />
                      </div>
                    </div>

                    <div className="input-group-row">
                      <div className="input-group">
                        <label>Tenure Unit</label>
                        <select value={loanTenureUnit} onChange={(e) => setLoanTenureUnit(e.target.value)}>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Extra Monthly Prepayment (₹)</label>
                        <div className="input-wrapper">
                          <span className="input-prefix">₹</span>
                          <input 
                            type="number" 
                            min="0" 
                            step="500"
                            value={loanPrepay} 
                            onChange={(e) => setLoanPrepay(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Day Count Convention</label>
                      <select value={loanDayCount} onChange={(e) => setLoanDayCount(e.target.value)}>
                        <option value="actual/365">Actual / 365 (Standard)</option>
                        <option value="actual/360">Actual / 360 (Commercial)</option>
                        <option value="30/360">30 / 360 (US / Euro)</option>
                      </select>
                    </div>

                    <div className="calc-actions-row">
                      <button 
                        type="button"
                        className="btn-secondary" 
                        onClick={() => {
                          setLoanAmount(500000);
                          setLoanRate(7.25);
                          setLoanTenure(240);
                          setLoanTenureUnit('months');
                          setLoanPrepay(0);
                          setLoanDayCount('actual/365');
                          setShowAmortization(false);
                          showToast('Reset Complete', 'Loan inputs restored to defaults.', 'info');
                        }}
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>

                  {/* Loan Results */}
                  <div className="calc-results-pane">
                    <h3>Loan Repayment Overview</h3>

                    <div className="results-rows">
                      <div className="res-item total-row">
                        <span className="res-lbl">Monthly EMI</span>
                        <span className="res-val highlight-value">{formatCurrency(loanEmi)}</span>
                      </div>

                      <div className="res-item">
                        <span className="res-lbl">Principal Borrowed</span>
                        <span className="res-val">{formatCurrency(Number(loanAmount) || 0)}</span>
                      </div>

                      <div className="res-item">
                        <span className="res-lbl">Total Interest Payable</span>
                        <span className="res-val" style={{ color: 'var(--danger)' }}>
                          {formatCurrency(loanTotalInterest)}
                        </span>
                      </div>

                      <div className="res-item">
                        <span className="res-lbl">Total Payment (Principal + Interest)</span>
                        <span className="res-val">{formatCurrency(loanTotalPayment)}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                      <button 
                        type="button"
                        className="btn-primary" 
                        style={{ fontSize: '0.85rem', padding: '10px 16px' }}
                        onClick={() => setShowAmortization(!showAmortization)}
                      >
                        <FileSpreadsheet size={16} />
                        <span>{showAmortization ? 'Hide Amortization' : 'View Amortization'}</span>
                      </button>

                      <button 
                        type="button"
                        className="btn-secondary" 
                        style={{ fontSize: '0.85rem', padding: '10px 16px' }}
                        onClick={exportAmortizationCSV}
                      >
                        <Download size={16} />
                        <span>Export CSV</span>
                      </button>
                    </div>

                    <div className="calc-info-note">
                      <Info />
                      <span>
                        Calculations use standard reducing balance interest. Prepayments reduce future principal and interest burden.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amortization Table */}
                {showAmortization && (
                  <div className="schedule-container">
                    <div className="schedule-header">
                      <div>
                        <h3 style={{ margin: 0 }}>Monthly Amortization Schedule</h3>
                        <p className="small" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Breakdown of principal repayment, interest portion, and residual balance per installment.
                        </p>
                      </div>
                      <button 
                        type="button"
                        className="btn-secondary" 
                        style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                        onClick={exportAmortizationCSV}
                      >
                        <Download size={15} />
                        <span>Export CSV ({loanAmortizationSchedule.length} Months)</span>
                      </button>
                    </div>

                    <div className="schedule-table-wrap">
                      <table className="schedule-table">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Monthly Payment</th>
                            <th>Principal Paid</th>
                            <th>Interest Paid</th>
                            <th>Remaining Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loanAmortizationSchedule.map((row) => (
                            <tr key={row.month}>
                              <td>{row.month}</td>
                              <td>{formatCurrency(row.payment)}</td>
                              <td>{formatCurrency(row.principal)}</td>
                              <td>{formatCurrency(row.interest)}</td>
                              <td>{formatCurrency(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* PAGE 12: GSTR-3B PREPARATION ENGINE */}
        <section className={`page ${activePage === 'gstr-3b' ? 'active' : ''}`} id="gstr-3b">
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">Automated Compliance Engine</span>
              <h2>GSTR-3B Preparation &amp; Reconciliation Engine</h2>
              <p className="section-subtitle">
                Automate GSTR-2B vs 1 inward reconciliation, cross-examine Section 17(5) blocked credits, apply accountant manual overrides, and generate GSTN portal JSON.
              </p>
            </div>

            {/* Client Context Header */}
            <div className="client-info-card">
              <div className="client-field-group">
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>Client GSTIN</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <input 
                      type="text" 
                      value={clientGstin} 
                      onChange={(e) => setClientGstin(e.target.value.toUpperCase())}
                      style={{ padding: '6px 12px', fontWeight: 700, fontSize: '0.9rem', width: '200px' }}
                    />
                    <span className="taxpayer-status-badge">
                      <CheckCircle2 size={14} />
                      Active (Regular)
                    </span>
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>Taxpayer Legal Name</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px', display: 'block' }}>{clientTradeName}</strong>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>Tax Period</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--primary)', marginTop: '4px', display: 'block' }}>May 2026 (FY 2026-27)</strong>
              </div>
            </div>

            {/* 3-Step Wizard Navigation */}
            <div className="gstr-stepper">
              <button 
                type="button"
                className={`gstr-step-item ${gstrStep === 1 ? 'active' : ''}`}
                onClick={() => setGstrStep(1)}
              >
                <span className="gstr-step-badge">1</span>
                <span>Data Ingestion (Uploads)</span>
              </button>

              <div className="gstr-step-divider"></div>

              <button 
                type="button"
                className={`gstr-step-item ${gstrStep === 2 ? 'active' : ''}`}
                onClick={() => setGstrStep(2)}
              >
                <span className="gstr-step-badge">2</span>
                <span>Accountant Review Console</span>
              </button>

              <div className="gstr-step-divider"></div>

              <button 
                type="button"
                className={`gstr-step-item ${gstrStep === 3 ? 'active' : ''}`}
                onClick={() => setGstrStep(3)}
              >
                <span className="gstr-step-badge">3</span>
                <span>Final Draft &amp; Export</span>
              </button>
            </div>

            {/* STEP 1: DATA INGESTION */}
            {gstrStep === 1 && (
              <div style={{ animation: 'fadeIn var(--transition-normal)' }}>
                <div className="upload-grid">
                  {/* Dropzone 1: GSTR-2B */}
                  <div 
                    className={`dropzone-card ${gstr2bUploaded ? 'uploaded' : ''}`}
                    onClick={() => {
                      setGstr2bUploaded(true);
                      showToast('GSTR-2B Loaded', '5 invoice line items loaded from GSTR-2B JSON.', 'success');
                    }}
                  >
                    <div className="dropzone-icon">
                      {gstr2bUploaded ? <FileCheck size={28} /> : <UploadCloud size={28} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0' }}>Inward Supplies (ITC): GSTR-2B</h4>
                      <p className="small" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        {gstr2bUploaded 
                          ? '✓ GSTR2B_27AABCU9603R1ZN_052026.json (2.4 MB • 5 Invoices ready)'
                          : 'Drag & drop GSTR-2B JSON or Excel portal export here'}
                      </p>
                    </div>
                    <span className="feat-tag" style={{ marginTop: '8px' }}>
                      {gstr2bUploaded ? 'Auto-Parsed Ready' : 'Browse Files'}
                    </span>
                  </div>

                  {/* Dropzone 2: GSTR-1 */}
                  <div 
                    className={`dropzone-card ${gstr1Uploaded ? 'uploaded' : ''}`}
                    onClick={() => {
                      setGstr1Uploaded(true);
                      showToast('GSTR-1 Loaded', 'Filed outward tax liability of ₹4,85,000 detected.', 'success');
                    }}
                  >
                    <div className="dropzone-icon">
                      {gstr1Uploaded ? <FileCheck size={28} /> : <UploadCloud size={28} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0' }}>Outward Supplies: Filed GSTR-1</h4>
                      <p className="small" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        {gstr1Uploaded 
                          ? '✓ GSTR1_FILED_052026.json (1.1 MB • Outward Liability ₹4,85,000)'
                          : 'Drag & drop filed GSTR-1 JSON or PDF summary'}
                      </p>
                    </div>
                    <span className="feat-tag" style={{ marginTop: '8px' }}>
                      {gstr1Uploaded ? 'Tax Liability Locked' : 'Browse Files'}
                    </span>
                  </div>
                </div>

                {/* Liability Adjustment Card */}
                <div className="calc-inputs-pane" style={{ marginBottom: '24px' }}>
                  <h3>Outward Tax Liability Baseline (Table 3.1)</h3>
                  <div className="input-group-row">
                    <div className="input-group">
                      <label>Total Outward Tax Liability from GSTR-1 (₹)</label>
                      <div className="input-wrapper">
                        <span className="input-prefix">₹</span>
                        <input 
                          type="number" 
                          value={gstrOutwardLiability} 
                          onChange={(e) => setGstrOutwardLiability(Number(e.target.value) || 0)}
                          placeholder="485000"
                        />
                      </div>
                      <span className="input-hint">Derived from Table 3.1(a) of filed GSTR-1 outward supplies</span>
                    </div>

                    <div className="input-group">
                      <label>Reconciliation Mode</label>
                      <select defaultValue="strict">
                        <option value="strict">Strict Section 17(5) Auto-Check (Recommended)</option>
                        <option value="lenient">Auditor Manual Verification Only</option>
                      </select>
                      <span className="input-hint">Flags passenger vehicles (8703), food/catering (9963), and works contract</span>
                    </div>
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setGstrInvoices(defaultGstrInvoices);
                      setGstr2bUploaded(true);
                      setGstr1Uploaded(true);
                      setGstrOutwardLiability(485000);
                      showToast('Demo Data Loaded', 'Sample GSTR-2B and GSTR-1 files populated successfully.', 'success');
                    }}
                  >
                    <Layers size={16} />
                    <span>Reset Sample Portal Files</span>
                  </button>

                  <button 
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setGstrStep(2);
                      showToast('Reconciliation Complete', 'Automated rules engine categorized 5 invoice lines.', 'success');
                    }}
                  >
                    <span>Run Automated Rules &amp; Review (Step 2)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ACCOUNTANT REVIEW CONSOLE */}
            {gstrStep === 2 && (
              <div style={{ animation: 'fadeIn var(--transition-normal)' }}>
                {/* Rule Diagnostics Banner */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 600 }}>
                      <CheckCircle2 size={16} /> Supplier GSTIN Active Check
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600 }}>
                      <SlidersHorizontal size={16} /> Section 17(5) HSN Rule Match
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--warning)', fontWeight: 600 }}>
                      <AlertTriangle size={16} /> RCM Supply Verification
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    Eligible ITC: <strong style={{ color: 'var(--success)' }}>{formatCurrency(totalEligibleItc)}</strong>
                    <span style={{ margin: '0 8px', color: 'var(--border)' }}>|</span>
                    Blocked ITC: <strong style={{ color: 'var(--danger)' }}>{formatCurrency(totalIneligibleItc)}</strong>
                  </div>
                </div>

                {/* Accountant Review Table */}
                <div className="table-responsive" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <table className="data-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Supplier Name &amp; GSTIN</th>
                        <th>Invoice No &amp; Date</th>
                        <th>HSN / SAC</th>
                        <th style={{ textAlign: 'right' }}>Taxable Value</th>
                        <th style={{ textAlign: 'right' }}>Tax Amount</th>
                        <th>System Auto-Status</th>
                        <th>Accountant Override</th>
                        <th>Audit Remarks / Rationale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gstrInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td>
                            <strong>{inv.supplier}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{inv.gstin}</div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{inv.invNo}</span>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{inv.date}</div>
                          </td>
                          <td>
                            <span className="feat-tag" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{inv.hsn}</span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(inv.taxable)}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <strong style={{ color: inv.override === 'eligible' ? 'var(--success)' : 'var(--danger)' }}>
                              {formatCurrency(inv.taxTotal)}
                            </strong>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                              {inv.igst > 0 ? `IGST: ${formatCurrency(inv.igst)}` : `C+S: ${formatCurrency(inv.cgst + inv.sgst)}`}
                            </div>
                          </td>
                          <td>
                            {inv.autoStatus === 'eligible' ? (
                              <span className="pill-eligible">
                                <CheckCircle2 size={12} /> Eligible
                              </span>
                            ) : inv.autoStatus === 'ineligible' ? (
                              <span className="pill-ineligible">
                                <AlertTriangle size={12} /> Blocked 17(5)
                              </span>
                            ) : (
                              <span className="pill-flagged">
                                <Info size={12} /> Check RCM
                              </span>
                            )}
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px', maxWidth: '170px' }}>
                              {inv.autoReason}
                            </div>
                          </td>
                          <td>
                            <select 
                              className="table-override-select"
                              value={inv.override}
                              onChange={(e) => handleInvoiceOverride(inv.id, e.target.value)}
                            >
                              <option value="eligible">✓ Accept Eligible</option>
                              <option value="ineligible">✕ Block under 17(5)</option>
                            </select>
                          </td>
                          <td>
                            <input 
                              type="text"
                              className="table-remarks-input"
                              value={inv.remarks}
                              onChange={(e) => handleInvoiceRemarks(inv.id, e.target.value)}
                              placeholder="Enter rationale for audit log..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Step 2 Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => setGstrStep(1)}
                  >
                    <span>← Back to Uploads</span>
                  </button>

                  <button 
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setGstrStep(3);
                      showToast('Draft Finalized', 'Reconciliation figures consolidated for GSTR-3B draft.', 'success');
                    }}
                  >
                    <span>Finalize 3B Draft &amp; Generate Output (Step 3)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUMMARY & FINAL OUTPUT */}
            {gstrStep === 3 && (
              <div style={{ animation: 'fadeIn var(--transition-normal)' }}>
                {/* Financial KPI Dashboard Cards */}
                <div className="summary-kpi-grid">
                  <div className="summary-kpi-card">
                    <div className="kpi-lbl">Total Outward Liability (GSTR-1)</div>
                    <div className="kpi-val">{formatCurrency(gstrOutwardLiability)}</div>
                    <span className="small" style={{ color: 'var(--text-secondary)' }}>From Table 3.1 Outward supplies</span>
                  </div>

                  <div className="summary-kpi-card">
                    <div className="kpi-lbl">Total Eligible ITC (Table 4)</div>
                    <div className="kpi-val" style={{ color: 'var(--success)' }}>{formatCurrency(totalEligibleItc)}</div>
                    <span className="small" style={{ color: 'var(--text-secondary)' }}>After Section 17(5) exclusions</span>
                  </div>

                  <div className="summary-kpi-card">
                    <div className="kpi-lbl">Blocked / Ineligible ITC</div>
                    <div className="kpi-val" style={{ color: 'var(--danger)' }}>{formatCurrency(totalIneligibleItc)}</div>
                    <span className="small" style={{ color: 'var(--text-secondary)' }}>Table 4(B) Reversal applied</span>
                  </div>

                  <div className="summary-kpi-card payable-highlight">
                    <div className="kpi-lbl">Net Tax Payable in Cash</div>
                    <div className="kpi-val" style={{ color: 'var(--primary)' }}>{formatCurrency(netGstr3bPayable)}</div>
                    <span className="small" style={{ color: 'var(--text-secondary)' }}>
                      {netGstr3bPayable === 0 ? 'Fully offset by ITC balance' : 'Challan payment required'}
                    </span>
                  </div>
                </div>

                {/* Final 3B Schedule View */}
                <div className="calc-inputs-pane" style={{ marginBottom: '24px' }}>
                  <h3>GSTR-3B Return Schedule Breakdown</h3>

                  <div className="results-rows">
                    <div className="res-item">
                      <span className="res-lbl">Table 3.1: Tax on Outward and Reverse Charge Inward Supplies</span>
                      <strong className="res-val">{formatCurrency(gstrOutwardLiability)}</strong>
                    </div>

                    <div className="res-item">
                      <span className="res-lbl">Table 4(A)(5): All Other ITC (Eligible Inward Supplies)</span>
                      <strong className="res-val" style={{ color: 'var(--success)' }}>+{formatCurrency(totalEligibleItc)}</strong>
                    </div>

                    <div className="res-item">
                      <span className="res-lbl">Table 4(B)(1): Ineligible ITC as per Section 17(5) Reversals</span>
                      <strong className="res-val" style={{ color: 'var(--danger)' }}>-{formatCurrency(totalIneligibleItc)}</strong>
                    </div>

                    <div className="res-item total-row">
                      <span className="res-lbl">Table 6.1: Net Payment of Tax (Cash Challan)</span>
                      <span className="res-val highlight-value">{formatCurrency(netGstr3bPayable)}</span>
                    </div>

                    {itcBalanceCredit > 0 && (
                      <div className="res-item">
                        <span className="res-lbl">Electronic Credit Ledger Balance Carried Forward</span>
                        <strong className="res-val" style={{ color: 'var(--success)' }}>{formatCurrency(itcBalanceCredit)}</strong>
                      </div>
                    )}
                  </div>

                  <div className="calc-info-note" style={{ marginTop: '16px' }}>
                    <Info />
                    <span>
                      Draft reconciled for Client GSTIN <strong>{clientGstin}</strong> for period May 2026. Audit rationale remarks are permanently appended into the client summary report.
                    </span>
                  </div>
                </div>

                {/* Export Options & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => setGstrStep(2)}
                  >
                    <span>← Back to Review Console</span>
                  </button>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      className="btn-secondary"
                      onClick={() => showToast('Working Paper Saved', 'Reconciliation working paper archived for audit file.', 'success')}
                    >
                      <CheckSquare size={16} />
                      <span>Save Working Paper</span>
                    </button>

                    <button 
                      type="button"
                      className="btn-secondary"
                      onClick={handleExportClientPdf}
                    >
                      <FileDown size={16} />
                      <span>Export Client PDF Report</span>
                    </button>

                    <button 
                      type="button"
                      className="btn-primary"
                      onClick={handleDownloadGstr3bJson}
                    >
                      <Download size={16} />
                      <span>Download GST Portal JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PAGE: TOOLS HUB */}
        <section className={`page ${activePage === 'tools' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header text-center">
              <span className="section-badge">Fin2ools Utility Suite</span>
              <h1>Professional Tools Hub</h1>
              <p className="section-subtitle">Real-time statutory tax calculators, countdown trackers, audit checklists, and reconciliation engines built for students, consultants, and corporates.</p>
            </div>

            <div className="tool-hub-grid">
              <div className="tool-hub-card" onClick={() => handlePageChange('calendar')}>
                <div>
                  <div className="tool-hub-icon"><CalendarClock size={24} /></div>
                  <div className="tool-hub-title">Compliance Calendar</div>
                  <div className="tool-hub-desc">Track all recurring TDS, GST, MCA, and PF/ESI filing due dates. Filter by direct tax, indirect tax, and corporate categories with monthly navigation.</div>
                </div>
                <div className="tool-hub-footer">
                  <span className="tool-hub-badge">Updated Monthly</span>
                  <span className="tool-hub-action">Open Calendar <ChevronRight size={16} /></span>
                </div>
              </div>

              <div className="tool-hub-card" onClick={() => handlePageChange('calculator')}>
                <div>
                  <div className="tool-hub-icon"><Calculator size={24} /></div>
                  <div className="tool-hub-title">Income Tax &amp; HRA Calculator</div>
                  <div className="tool-hub-desc">Compare Old vs New Tax Regime under Section 115BAC for FY 2025-26. Calculate HRA exemptions u/s 10(13A) and marginal tax relief instantly.</div>
                </div>
                <div className="tool-hub-footer">
                  <span className="tool-hub-badge">FY 2025-26</span>
                  <span className="tool-hub-action">Launch Calculator <ChevronRight size={16} /></span>
                </div>
              </div>

              <div className="tool-hub-card" onClick={() => handlePageChange('interest')}>
                <div>
                  <div className="tool-hub-icon"><Percent size={24} /></div>
                  <div className="tool-hub-title">Advance Tax &amp; Interest Calculator</div>
                  <div className="tool-hub-desc">Compute mandatory statutory interest under Sections 234A, 234B, and 234C of the Income Tax Act 1961, plus deposit &amp; loan amortization schedules.</div>
                </div>
                <div className="tool-hub-footer">
                  <span className="tool-hub-badge">Sec 234A/B/C</span>
                  <span className="tool-hub-action">Compute Interest <ChevronRight size={16} /></span>
                </div>
              </div>

              <div className="tool-hub-card" onClick={() => handlePageChange('tracker')}>
                <div>
                  <div className="tool-hub-icon"><Hourglass size={24} /></div>
                  <div className="tool-hub-title">Statutory Due Date Tracker</div>
                  <div className="tool-hub-desc">Interactive live countdown timer tracking impending regulatory deadlines. Visual alerts identify urgent, pending, and upcoming statutory filings.</div>
                </div>
                <div className="tool-hub-footer">
                  <span className="tool-hub-badge">Live Countdown</span>
                  <span className="tool-hub-action">Open Tracker <ChevronRight size={16} /></span>
                </div>
              </div>

              <div className="tool-hub-card" onClick={() => handlePageChange('checklist')}>
                <div>
                  <div className="tool-hub-icon"><ListChecks size={24} /></div>
                  <div className="tool-hub-title">Statutory Audit Checklist Builder</div>
                  <div className="tool-hub-desc">Senior CA audit generator for Form 3CD Tax Audit, Statutory Bank Audit, GST Audits, and Private Limited company incorporation with PDF &amp; Excel export.</div>
                </div>
                <div className="tool-hub-footer">
                  <span className="tool-hub-badge">Export to Excel &amp; PDF</span>
                  <span className="tool-hub-action">Build Checklist <ChevronRight size={16} /></span>
                </div>
              </div>

              <div className="tool-hub-card" onClick={() => handlePageChange('gstr-3b')}>
                <div>
                  <div className="tool-hub-icon"><Briefcase size={24} /></div>
                  <div className="tool-hub-title">GSTR-3B Auto-Preparation Engine</div>
                  <div className="tool-hub-desc">Match GSTR-2B purchase invoices, auto-detect blocked credits u/s 17(5), compute Table 3.1 &amp; Table 4 ITC, and generate official GST portal JSON payloads.</div>
                </div>
                <div className="tool-hub-footer">
                  <span className="tool-hub-badge">GSTN JSON Export</span>
                  <span className="tool-hub-action">Open Engine <ChevronRight size={16} /></span>
                </div>
              </div>

              <div className="tool-hub-card" onClick={() => handlePageChange('gst')}>
                <div>
                  <div className="tool-hub-icon"><SearchCode size={24} /></div>
                  <div className="tool-hub-title">GST Rate &amp; HSN/SAC Finder</div>
                  <div className="tool-hub-desc">Search applicable GST tariff rates, compensation cess, and 4/6/8-digit HSN codes for goods and SAC codes for services with real-time keyword filtering.</div>
                </div>
                <div className="tool-hub-footer">
                  <span className="tool-hub-badge">Instant Lookup</span>
                  <span className="tool-hub-action">Find Rates <ChevronRight size={16} /></span>
                </div>
              </div>

              <div className="tool-hub-card" onClick={() => handlePageChange('library')}>
                <div>
                  <div className="tool-hub-icon"><BookOpen size={24} /></div>
                  <div className="tool-hub-title">Fin2ools Digital Library</div>
                  <div className="tool-hub-desc">Authoritative statutory Bare Acts, CBDT/CBIC circulars, ICAI Standards on Auditing (SA), CARO 2020 checklists, and free CA student revision digests.</div>
                </div>
                <div className="tool-hub-footer">
                  <span className="tool-hub-badge">Knowledge Vault</span>
                  <span className="tool-hub-action">Browse Library <ChevronRight size={16} /></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE: DIGITAL LIBRARY (HIERARCHICAL ARCHITECTURE BLUEPRINT) */}
        <section className={`page ${activePage === 'library' ? 'active' : ''}`}>
          <div className="section-container">
            <div className="section-header text-center">
              <span className="section-badge">Authoritative CA &amp; Tax Repository</span>
              <h1>Fin2ools Digital Library</h1>
              <p className="section-subtitle">A clean, hierarchical statutory vault designed for Chartered Accountants, tax practitioners, students, and corporate compliance teams.</p>
            </div>

            {/* TOP HUB NAVIGATION TABS */}
            <div className="library-hub-nav">
              <button 
                type="button"
                className={`library-hub-tab ${selectedHub === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedHub('all')}
              >
                <Layers size={16} />
                <span>All Repositories</span>
                <span className="hub-badge">3 Hubs</span>
              </button>

              <button 
                type="button"
                className={`library-hub-tab ${selectedHub === 'gst' ? 'active' : ''}`}
                onClick={() => setSelectedHub('gst')}
              >
                <Building2 size={16} />
                <span>1. GST Hub</span>
                <span className="hub-badge">CBIC / GSTN</span>
              </button>

              <button 
                type="button"
                className={`library-hub-tab ${selectedHub === 'direct_tax' ? 'active' : ''}`}
                onClick={() => setSelectedHub('direct_tax')}
              >
                <Award size={16} />
                <span>2. Direct Tax &amp; PAN Center</span>
                <span className="hub-badge">ITD / CBDT</span>
              </button>

              <button 
                type="button"
                className={`library-hub-tab ${selectedHub === 'icai' ? 'active' : ''}`}
                onClick={() => setSelectedHub('icai')}
              >
                <GraduationCap size={16} />
                <span>3. ICAI Resource Vault</span>
                <span className="hub-badge">BoS / Standards</span>
              </button>

              <button 
                type="button"
                className={`library-hub-tab ${selectedHub === 'bookmarks' ? 'active' : ''}`}
                onClick={() => setSelectedHub('bookmarks')}
                style={{ marginLeft: 'auto' }}
              >
                <Star size={16} style={{ fill: selectedHub === 'bookmarks' ? '#fff' : '#f59e0b', color: selectedHub === 'bookmarks' ? '#fff' : '#f59e0b' }} />
                <span>Quick Bookmarks</span>
                <span className="hub-badge">{bookmarkedIds.length} Pinned</span>
              </button>
            </div>

            {/* SEARCH & ACCORDION CONTROLS TOOLBAR */}
            <div className="library-toolbar">
              <div className="library-search-full">
                <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
                <input 
                  type="text"
                  placeholder="Global Search across all hubs: type 'GSTR-3B', 'SA 240', '115BAC', 'Form 49A', 'Ind AS 115'..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                />
                {librarySearch && (
                  <button 
                    type="button"
                    onClick={() => setLibrarySearch('')} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', fontSize: '0.82rem', cursor: 'pointer', padding: '4px 8px' }}
                  >
                    Clear Search
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button"
                  className="btn-secondary" 
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  onClick={() => toggleAllAccordions(true)}
                >
                  Expand All
                </button>
                <button 
                  type="button"
                  className="btn-secondary" 
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  onClick={() => toggleAllAccordions(false)}
                >
                  Collapse All
                </button>
              </div>
            </div>

            {librarySearch && (
              <div style={{ marginBottom: '18px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Found <strong>{totalMatchingResources}</strong> statutory resources matching "<strong>{librarySearch}</strong>"
              </div>
            )}

            {/* HIERARCHICAL HUBS & ACCORDION SECTIONS */}
            {filteredHubs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <BookOpen size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '14px' }} />
                <h3 style={{ margin: '0 0 8px 0' }}>No Statutory Resources Found</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 18px 0' }}>
                  {selectedHub === 'bookmarks' ? 'You have no pinned bookmarks yet. Click the star icon on any statutory link to save it here!' : `No links match your search "${librarySearch}".`}
                </p>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={() => { setLibrarySearch(''); setSelectedHub('all'); }} 
                  style={{ margin: '0 auto' }}
                >
                  Reset Library Filters
                </button>
              </div>
            ) : (
              <div className="library-accordion-group">
                {filteredHubs.map(hub => (
                  <div key={hub.hubId} style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid var(--border)' }}>
                      <div>
                        <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{hub.hubTitle}</span>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 }}>{hub.hubBadge}</span>
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{hub.description}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {hub.sections.map(section => {
                        const isOpen = Boolean(openAccordions[section.sectionId]);
                        return (
                          <div key={section.sectionId} className="library-accordion-card">
                            <button
                              type="button"
                              className="library-accordion-header"
                              onClick={() => toggleAccordion(section.sectionId)}
                              aria-expanded={isOpen}
                            >
                              <div className="accordion-title-wrap">
                                <div className="accordion-icon-box">
                                  {section.sectionId.includes('statutory') || section.sectionId.includes('framework') ? <Building2 size={20} /> :
                                   section.sectionId.includes('compliance') || section.sectionId.includes('itr') ? <FileSpreadsheet size={20} /> :
                                   section.sectionId.includes('pan') ? <Award size={20} /> :
                                   section.sectionId.includes('standards') ? <BookOpen size={20} /> :
                                   section.sectionId.includes('taxation') ? <Database size={20} /> : <GraduationCap size={20} />}
                                </div>
                                <div className="accordion-title-text">
                                  <h3>{section.title}</h3>
                                  <p>{section.subtitle}</p>
                                </div>
                              </div>
                              <div className="accordion-meta-wrap">
                                <span className="accordion-item-count">{section.items.length} Official Links</span>
                                <span className={`accordion-chevron ${isOpen ? 'expanded' : ''}`}>
                                  <ChevronDown size={20} />
                                </span>
                              </div>
                            </button>

                            {isOpen && (
                              <div className="library-accordion-content">
                                <div className="library-links-grid">
                                  {section.items.map(item => {
                                    const isPinned = bookmarkedIds.includes(item.id);
                                    return (
                                      <div key={item.id} className="resource-link-card">
                                        <div>
                                          <div className="resource-card-top">
                                            <span className={`resource-domain-badge ${item.domainClass}`}>{item.domain}</span>
                                            <button 
                                              type="button" 
                                              className={`bookmark-star-btn ${isPinned ? 'bookmarked' : ''}`}
                                              onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id, item.title); }}
                                              title={isPinned ? 'Remove bookmark' : 'Pin to Quick Bookmarks'}
                                            >
                                              <Star size={16} />
                                            </button>
                                          </div>
                                          <div className="resource-card-body">
                                            <h4>{item.title}</h4>
                                            <p>{item.desc}</p>
                                            {item.tags && item.tags.length > 0 && (
                                              <div className="resource-tags">
                                                {item.tags.map(t => (
                                                  <span key={t} className="resource-tag">{t}</span>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="resource-card-actions">
                                          <a 
                                            href={item.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="resource-open-link"
                                            title={`Open ${item.title} on ${item.domain}`}
                                          >
                                            <span>Open Official Portal</span>
                                            <ExternalLink size={14} />
                                          </a>
                                          <button 
                                            type="button" 
                                            className="resource-copy-btn"
                                            onClick={() => {
                                              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                                navigator.clipboard.writeText(item.url);
                                              }
                                              showToast('Link Copied', `Official link for ${item.title} copied to clipboard.`, 'success');
                                            }}
                                            title="Copy direct URL"
                                          >
                                            <Copy size={13} />
                                            <span>Copy URL</span>
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CHRONOLOGICAL STATUTORY NOTIFICATIONS & CIRCULARS TABLE */}
            <div style={{ marginTop: '36px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlarmClock size={20} style={{ color: 'var(--primary)' }} />
                    <span>Statutory Notifications &amp; Circulars (Chronological Desk)</span>
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Filter official gazette notifications and circulars by Rate, Central Tax, Integrated Tax, and Direct Tax.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All Updates' },
                    { id: 'Rate', label: 'Rate' },
                    { id: 'Central Tax', label: 'Central Tax' },
                    { id: 'Integrated Tax', label: 'Integrated Tax' },
                    { id: 'Direct Tax', label: 'Direct Tax' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`library-pill ${notifTagFilter === tab.id ? 'active' : ''}`}
                      onClick={() => setNotifTagFilter(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="notif-table-container">
                <table className="notif-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Date</th>
                      <th style={{ width: '220px' }}>Notification / Circular</th>
                      <th>Subject &amp; Statutory Scope</th>
                      <th style={{ width: '130px', textAlign: 'center' }}>Tag</th>
                      <th style={{ width: '100px', textAlign: 'right' }}>Official Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotifications.map(n => (
                      <tr key={n.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{n.date}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{n.refNo}</td>
                        <td style={{ color: 'var(--text-primary)', lineHeight: 1.45 }}>{n.subject}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`resource-tag ${n.tagClass}`}>{n.tag}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <a 
                            href={n.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="resource-open-link"
                            style={{ fontSize: '0.78rem' }}
                          >
                            <span>View</span>
                            <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo brand-logo-link" onClick={() => handlePageChange('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/fin2ools.png" 
                alt="Fin2ools Logo" 
                className="brand-logo-img" 
                width={40} 
                height={40} 
              />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, marginLeft: '8px' }}>Fin<span className="brand-highlight">2ools</span></span>
            </div>
            <p>A fintech solution that makes finance, tax, and compliance easy for students, consultants, and corporates.</p>
          </div>

          <div className="footer-links-col">
            <h4>Resources</h4>
            <button onClick={() => handlePageChange('home')}>Home Dashboard</button>
            <button onClick={() => handlePageChange('tools')}>Tools Hub</button>
            <button onClick={() => handlePageChange('calendar')}>Due Date Calendar</button>
            <button onClick={() => handlePageChange('calculator')}>Tax Calculators</button>
            <button onClick={() => handlePageChange('library')}>Digital Library</button>
            <button onClick={() => handlePageChange('connect')}>Connect</button>
            <button onClick={() => handlePageChange('consultation')}>Book Consultation</button>
          </div>

          <div className="footer-copy-col">
            <p>&copy; 2026 Fin2ools. Crafted for CA professionals, students, and businesses.</p>
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
