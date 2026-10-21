/**
 * Fin2ools LangChain Architecture: Reusable Pipeline Runner
 * Implements StructuredOutputParser, Gemini-1.5-flash invocation, and zero-hallucination parsing.
 */

import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { getGeminiFlashModel } from '../config.js';

/**
 * Executes a deterministic statutory extraction chain.
 * 
 * @param {Object} params
 * @param {string} params.systemPrompt - Senior CA statutory prompt
 * @param {import('zod').ZodType} params.zodSchema - Target Zod schema for structured JSON
 * @param {Object|Array} params.inputData - Data payload to process
 * @param {Object} [params.modelOptions] - Optional model parameters
 * @returns {Promise<any>} Parsed structured JSON adhering to zodSchema
 */
export async function executeStatutoryChain({ systemPrompt, zodSchema, inputData, modelOptions = {} }) {
  const model = getGeminiFlashModel(modelOptions);
  const parser = StructuredOutputParser.fromZodSchema(zodSchema);

  const promptTemplate = new PromptTemplate({
    template: `
{system_prompt}

CRITICAL OUTPUT REQUIREMENT:
You must return ONLY a single, valid JSON object matching the format below.
Do not wrap your response in markdown fences (no \`\`\`json or \`\`\`).
Do not include any greeting, preamble, or commentary outside the JSON structure.

{format_instructions}

INPUT DATA:
{input_data}
    `.trim(),
    inputVariables: ['system_prompt', 'input_data'],
    partialVariables: {
      format_instructions: parser.getFormatInstructions(),
    },
  });

  const chain = promptTemplate.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      system_prompt: systemPrompt,
      input_data: typeof inputData === 'string' ? inputData : JSON.stringify(inputData, null, 2),
    });

    return result;
  } catch (err) {
    // Graceful error logging with statutory diagnostic trail
    console.error('[Fin2ools LangChain Error]: Execution failed in statutory pipeline:', err);
    throw new Error(`Statutory Engine Parse Error: ${err.message}`);
  }
}
