import { GoogleGenerativeAI } from "@google/generative-ai";

let _client = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw Object.assign(
      new Error(
        "GEMINI_API_KEY is not set. Add it to your .env file and restart the server."
      ),
      { status: 503 }
    );
  }
  if (!_client) {
    _client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _client;
}

/**
 * Send a prompt to Gemini and return the raw text response.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} [options]
 * @returns {Promise<string>}
 */
export async function generate(systemPrompt, userPrompt, options = {}) {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 8192,
    },
  });

  const result = await model.generateContent(userPrompt);
  const response = result.response;

  if (!response) throw new Error("Empty response from Gemini API.");
  return response.text();
}

/**
 * Multi-turn chat session for the assistant.
 * @param {Array<{role:string, content:string}>} history
 * @param {string} systemPrompt
 * @param {string} newMessage
 * @returns {Promise<string>}
 */
export async function chat(history, systemPrompt, newMessage) {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
    systemInstruction: systemPrompt,
    generationConfig: { temperature: 0.6, maxOutputTokens: 2048 },
  });

  // Gemini history format: [{role, parts:[{text}]}]
  const geminiHistory = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const chatSession = model.startChat({ history: geminiHistory });
  const result = await chatSession.sendMessage(newMessage);
  return result.response.text();
}
