/**
 * AI provider router.
 * Reads AI_PROVIDER from environment and delegates to the correct adapter.
 * Adding a new provider = add a new adapter file + a case here.
 */
import * as gemini from "./gemini.js";
import * as openai from "./openai.js";

function getProvider() {
  const name = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (name === "gemini") return gemini;
  if (name === "openai") return openai;
  throw Object.assign(
    new Error(
      `Unknown AI_PROVIDER "${name}". Valid options: gemini, openai.`
    ),
    { status: 500 }
  );
}

export function generate(systemPrompt, userPrompt, options) {
  return getProvider().generate(systemPrompt, userPrompt, options);
}

export function chat(history, systemPrompt, newMessage) {
  return getProvider().chat(history, systemPrompt, newMessage);
}
