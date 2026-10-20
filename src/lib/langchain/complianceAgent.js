/**
 * FinEzy LangChain Architecture: Compliance Agent
 * Analyzes regulatory updates, notifications, and tax articles with Senior CA statutory accuracy.
 */

import { z } from 'zod';
import { executeStatutoryChain } from '../../../lib/langchain/chains/statutoryPipelineRunner.js';
import { SENIOR_CA_SYSTEM_PROMPT } from '../../../lib/langchain/prompts/caPrompts.js';

export const ComplianceUpdateSchema = z.object({
  headline: z.string().describe('Concise headline of the tax/statutory development'),
  taxCategory: z.enum(['DIRECT_TAX', 'INDIRECT_TAX_GST', 'MCA_CORPORATE', 'RBI_FEMA', 'GENERAL_COMPLIANCE']),
  statutoryAct: z.string().describe('Exact statutory act e.g. CGST Act 2017, Income Tax Act 1961, Companies Act 2013'),
  statutorySections: z.array(z.string()).describe('Exact sections/rules affected e.g. Section 17(5), Section 44AB, Rule 42'),
  executiveSummary: z.string().describe('2-sentence Senior CA briefing of the amendment or article'),
  complianceImpact: z.string().describe('Direct impact on Chartered Accountants, taxpayers, or filing workflows'),
  recommendedAction: z.string().describe('Actionable compliance step e.g. Reconcile ITC, file Form 3CD, revise return'),
  urgencyLevel: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'INFORMATIONAL'])
});

/**
 * Processes raw text from regulatory or RSS feeds into structured compliance intelligence.
 * 
 * @param {string} text - Raw text combining title and snippet
 * @param {string} [updateType='ARTICLE'] - Type of update ('ARTICLE', 'NOTIFICATION', 'CIRCULAR')
 * @returns {Promise<Object>} Structured compliance object
 */
export async function processComplianceUpdate(text, updateType = 'ARTICLE') {
  if (!text || typeof text !== 'string') {
    throw new Error('Input text must be a non-empty string');
  }

  // System prompt enforcing Senior Indian CA analysis
  const systemPrompt = `
${SENIOR_CA_SYSTEM_PROMPT}

TASK:
You are analyzing a live tax regulatory update / article (Type: ${updateType}).
Extract and categorize the statutory implications with zero hallucination.
Accurately identify all statutory sections (e.g., Section 17(5) Blocked Credits, Section 44AB Tax Audit, Section 194J TDS).
Output pure parseable JSON adhering strictly to the schema.
  `.trim();

  try {
    // If Gemini API key is configured, run the live LangChain pipeline
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      return await executeStatutoryChain({
        systemPrompt,
        zodSchema: ComplianceUpdateSchema,
        inputData: { rawText: text, updateType },
      });
    }
  } catch (err) {
    console.warn('[ComplianceAgent] LangChain live extraction warning, using deterministic fallback:', err.message);
  }

  // Deterministic Senior CA rule-based fallback when offline or during testing
  const lower = text.toLowerCase();
  let category = 'GENERAL_COMPLIANCE';
  let act = 'Statutory Compliance & Regulatory Updates';
  let sections = [];
  let urgency = 'INFORMATIONAL';

  if (lower.includes('gst') || lower.includes('gstr') || lower.includes('itc') || lower.includes('17(5)')) {
    category = 'INDIRECT_TAX_GST';
    act = 'Central Goods and Services Tax (CGST) Act, 2017';
    if (lower.includes('17(5)') || lower.includes('blocked')) sections.push('Section 17(5)');
    if (lower.includes('3b')) sections.push('GSTR-3B Table 4');
    if (lower.includes('gstr-1')) sections.push('GSTR-1 Rule 59');
    urgency = 'HIGH';
  } else if (lower.includes('income tax') || lower.includes('itr') || lower.includes('44ab') || lower.includes('tds')) {
    category = 'DIRECT_TAX';
    act = 'Income Tax Act, 1961 (Read with Finance Act 2024)';
    if (lower.includes('44ab')) sections.push('Section 44AB');
    if (lower.includes('tds') || lower.includes('194')) sections.push('Section 194C/194J');
    urgency = 'HIGH';
  } else if (lower.includes('mca') || lower.includes('roc') || lower.includes('aoc-4') || lower.includes('mgt-7') || lower.includes('company')) {
    category = 'MCA_CORPORATE';
    act = 'Companies Act, 2013';
    if (lower.includes('csr')) sections.push('Section 135');
    if (lower.includes('audit')) sections.push('Section 143');
    urgency = 'MEDIUM';
  }

  return {
    headline: text.slice(0, 120).trim(),
    taxCategory: category,
    statutoryAct: act,
    statutorySections: sections.length > 0 ? sections : ['General Statutory Provisions'],
    executiveSummary: `Senior CA brief: ${text.slice(0, 220).trim()}...`,
    complianceImpact: `Requires review of active client master records under ${act}.`,
    recommendedAction: 'Verify compliance schedules and update audit checklists accordingly.',
    urgencyLevel: urgency
  };
}
