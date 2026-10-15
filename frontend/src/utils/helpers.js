/**
 * Return a Tailwind colour class pair for a difficulty label.
 */
export function difficultyColor(level) {
  switch (level) {
    case "Beginner":
      return "bg-green-100 text-green-800";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800";
    case "Advanced":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

/**
 * Return a Tailwind colour class pair based on a 0–100 score.
 */
export function scoreColor(score) {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-500";
}

/**
 * Return a progress-bar colour class based on score.
 */
export function scoreBarColor(score) {
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-400";
}

/**
 * Truncate text to a maximum number of words.
 */
export function truncate(text, maxWords = 25) {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}

/**
 * Format ISO date string to a human-readable form.
 */
export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
