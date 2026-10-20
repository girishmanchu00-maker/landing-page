/**
 * Fintezy LangChain Architecture: Structured Zod Schemas
 * Enforces zero-hallucination, strictly typed outputs for statutory engines.
 */

import { z } from 'zod';

/**
 * GSTR-2B Invoice Reconciliation & Section 17(5) Classification Schema
 */
export const GstrInvoiceClassificationSchema = z.object({
  invoiceNumber: z.string().describe('Supplier invoice number'),
  supplierGstin: z.string().length(15).describe('15-digit GSTIN of supplier'),
  supplierName: z.string().describe('Legal / trade name of supplier'),
  hsnSacCode: z.string().describe('4, 6 or 8-digit HSN / SAC code'),
  taxableValue: z.number().describe('Taxable value in INR'),
  igst: z.number().default(0),
  cgst: z.number().default(0),
  sgst: z.number().default(0),
  classification: z.enum([
    'ELIGIBLE',
    'INELIGIBLE_SEC_17_5',
    'FLAGGED_RCM_REVERSE_CHARGE',
    'FLAGGED_INACTIVE_GSTIN'
  ]).describe('Statutory ITC eligibility status'),
  statutoryReference: z.string().describe('Exact statutory section or rule (e.g. CGST Act Sec 17(5)(a))'),
  auditRationale: z.string().describe('Professional CA audit working paper justification'),
  actionRecommended: z.string().describe('Action required in GSTR-3B Table 4(A) or Table 4(B)')
});

export const GstrReconciliationBatchSchema = z.object({
  clientGstin: z.string().length(15),
  returnPeriod: z.string().describe('Return period e.g. MMYYYY'),
  totalInvoicesProcessed: z.number(),
  totalEligibleItc: z.number(),
  totalBlockedItcSec17_5: z.number(),
  totalFlaggedItc: z.number(),
  invoices: z.array(GstrInvoiceClassificationSchema)
});

/**
 * Tax Audit Section 44AB Applicability Schema
 */
export const TaxAuditEvaluationSchema = z.object({
  pan: z.string().length(10),
  entityType: z.string(),
  annualTurnover: z.number(),
  cashTransactionsPercentage: z.number(),
  taxAuditApplicable: z.boolean().describe('Whether tax audit u/s 44AB is mandatory'),
  applicableAuditLimit: z.number().describe('Applicable threshold in INR (1 Crore or 10 Crores)'),
  applicableAuditForm: z.enum(['FORM_3CA_3CD', 'FORM_3CB_3CD', 'NONE']).describe('Form 3CA if audit under any other law, 3CB otherwise'),
  statutoryDueDates: z.object({
    taxAuditReportDate: z.string().describe('Usually 30th September of Assessment Year'),
    itrFilingDate: z.string().describe('Usually 31st October of Assessment Year')
  }),
  csrApplicable: z.boolean().describe('Section 135 CSR applicability'),
  statutoryAuditObservations: z.array(z.string()).describe('Auditor observations and compliance notes')
});
