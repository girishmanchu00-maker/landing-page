---
name: langchain-architect
description: >-
  Use this skill when building, modifying, or testing serverless LangChain pipelines,
  Zod structured output schemas, or Indian statutory CA extraction workflows for FinEzy.
---

# LangChain AI Architect (FinEzy CA Practice Edition)

This skill guides the construction of zero-hallucination, serverless LangChain pipelines in Next.js using Google Gemini models and Zod schema enforcement.

## Mandatory Pipeline Conventions

### 1. Model Configuration (`lib/langchain/config.js`)
- Model: `gemini-1.5-flash`
- Temperature: `0.1`
- Max Retries: `3`
- Environment: Reads `GEMINI_API_KEY` or `GOOGLE_API_KEY` from `process.env`.

### 2. Structured Output & Zero Hallucination
- Every prompt uses `StructuredOutputParser.fromZodSchema(Schema)` or direct JSON mode.
- System prompt injects format instructions via `parser.getFormatInstructions()`.
- Pipeline output must be cleanly validated and parsed to JSON before returning to route handlers.

### 3. Indian Statutory Terminology Lexicon
- GST: `CGST Act 2017`, `Section 17(5)(a)-(i) Blocked Credits`, `Rule 42`, `Rule 43`, `GSTR-3B Table 4(A)/(B)`, `GSTR-1`, `GSTR-9/9C`.
- Income Tax: `Income Tax Act 1961`, `Section 44AB (Tax Audit)`, `Section 44AD/ADA (Presumptive)`, `Section 92E (Transfer Pricing)`, `Section 285BA (SFT)`.
- Company Law: `Companies Act 2013`, `Section 135 (CSR)`, `Section 148 (Cost Audit)`, `AOC-4 XBRL`, `MGT-7/7A`.

## Standard Pipeline Implementation Recipe

### Step 1: Define Zod Schema (`lib/langchain/schemas/`)
```javascript
import { z } from 'zod';

export const InvoiceClassificationSchema = z.object({
  invoiceNumber: z.string(),
  hsnSacCode: z.string(),
  taxableValue: z.number(),
  eligibilityStatus: z.enum(['ELIGIBLE', 'INELIGIBLE_BLOCKED_17_5', 'FLAGGED_RCM']),
  statutoryClause: z.string().describe('Exact statutory section like Sec 17(5)(a) or All Other ITC'),
  rationale: z.string().describe('Senior CA legal audit rationale for classification')
});
```

### Step 2: Assemble LangChain Pipeline (`lib/langchain/chains/`)
```javascript
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { getGeminiFlashModel } from '../config.js';

export async function runStatutoryPipeline(inputData, schema, systemPrompt) {
  const model = getGeminiFlashModel();
  const parser = StructuredOutputParser.fromZodSchema(schema);
  
  const prompt = new PromptTemplate({
    template: `${systemPrompt}\n\nFormat Instructions:\n{format_instructions}\n\nInput Data:\n{input}`,
    inputVariables: ['input'],
    partialVariables: { format_instructions: parser.getFormatInstructions() }
  });

  const chain = prompt.pipe(model).pipe(parser);
  return await chain.invoke({ input: JSON.stringify(inputData) });
}
```

### Step 3: Serverless Route Handler (`app/api/statutory/route.js`)
Wrap execution in `try/catch`, return `NextResponse.json({ success: true, data })`, and handle validation errors with proper HTTP status codes.
