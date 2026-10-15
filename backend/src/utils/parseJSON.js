/**
 * Robustly extract and parse JSON from an AI response string.
 * Models sometimes wrap JSON in markdown code fences.
 */
export function extractJSON(text) {
  if (!text || typeof text !== "string") {
    throw new Error("AI response was empty or not a string.");
  }

  // Try direct parse first
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    // fall through
  }

  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch (_) {
      // fall through
    }
  }

  // Last resort: find first '[' or '{' and last matching bracket
  const start = trimmed.search(/[{[]/);
  if (start !== -1) {
    const sub = trimmed.slice(start);
    const end = sub.lastIndexOf(sub[0] === "{" ? "}" : "]");
    if (end !== -1) {
      try {
        return JSON.parse(sub.slice(0, end + 1));
      } catch (_) {
        // fall through
      }
    }
  }

  throw new Error(
    "Could not parse JSON from AI response. The model may have returned an unexpected format."
  );
}
