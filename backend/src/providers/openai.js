import OpenAI from "openai";

let _client = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw Object.assign(
      new Error(
        "OPENAI_API_KEY is not set. Add it to your .env file and restart the server."
      ),
      { status: 503 }
    );
  }
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

/**
 * Send a prompt to OpenAI and return the raw text response.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} [options]
 * @returns {Promise<string>}
 */
export async function generate(systemPrompt, userPrompt, options = {}) {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 8192,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenAI API.");
  return text;
}

/**
 * Multi-turn chat.
 * @param {Array<{role:string, content:string}>} history
 * @param {string} systemPrompt
 * @param {string} newMessage
 * @returns {Promise<string>}
 */
export async function chat(history, systemPrompt, newMessage) {
  const client = getClient();
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: newMessage },
  ];

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.6,
    max_tokens: 2048,
    messages,
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenAI API.");
  return text;
}
