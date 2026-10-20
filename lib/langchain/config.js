/**
 * Fintezy LangChain Architecture: Model Configuration
 * Enforces cost efficiency, deterministic extraction, and Gemini-1.5-flash setup.
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

/**
 * Returns a configured ChatGoogleGenerativeAI instance using gemini-1.5-flash
 * with temperature 0.1 for deterministic, factual statutory data extraction.
 * 
 * @param {Object} options - Override options if needed
 * @returns {ChatGoogleGenerativeAI}
 */
export function getGeminiFlashModel(options = {}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

  return new ChatGoogleGenerativeAI({
    modelName: 'gemini-1.5-flash',
    apiKey: apiKey,
    temperature: 0.1, // Cost-efficient, deterministic, strictly factual
    topP: 0.95,
    maxRetries: 3,
    ...options,
  });
}
