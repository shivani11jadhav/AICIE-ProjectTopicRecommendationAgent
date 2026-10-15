import { v4 as uuidv4 } from "uuid";
import { generate } from "../providers/index.js";
import { extractJSON } from "../utils/parseJSON.js";
import { rankProjects } from "./scorer.js";
import {
  RECOMMENDATION_SYSTEM_PROMPT,
  DETAIL_SYSTEM_PROMPT,
  buildRecommendationPrompt,
  buildDetailPrompt,
} from "./promptBuilder.js";

/**
 * Generate and rank project recommendations for a student.
 * @param {object} prefs - Validated student preferences
 * @returns {Promise<{recommendations: object[], meta: object}>}
 */
export async function generateRecommendations(prefs) {
  const count = prefs.count ?? 5;
  const prompt = buildRecommendationPrompt(prefs, count);

  const rawText = await generate(RECOMMENDATION_SYSTEM_PROMPT, prompt, {
    temperature: 0.8,
  });

  const parsed = extractJSON(rawText);

  if (!Array.isArray(parsed?.recommendations)) {
    throw Object.assign(
      new Error(
        "AI returned an unexpected format. Please try again."
      ),
      { status: 502 }
    );
  }

  // Ensure every project has a stable ID
  const projects = parsed.recommendations.map((p) => ({
    ...p,
    id: p.id || uuidv4(),
  }));

  const ranked = rankProjects(projects, prefs);

  return {
    recommendations: ranked,
    meta: {
      provider: process.env.AI_PROVIDER || "gemini",
      count: ranked.length,
      generatedAt: new Date().toISOString(),
      disclaimer:
        "Recommendations are AI-generated estimates based on stated preferences. Feasibility and originality scores are not verified.",
    },
  };
}

/**
 * Generate detailed project breakdown for a single selected project.
 * @param {object} project
 * @param {object} prefs
 */
export async function generateProjectDetail(project, prefs) {
  const prompt = buildDetailPrompt(project, prefs);

  const rawText = await generate(DETAIL_SYSTEM_PROMPT, prompt, {
    temperature: 0.5,
    maxTokens: 6000,
  });

  const parsed = extractJSON(rawText);

  return {
    projectId: project.id,
    title: project.title,
    detail: parsed,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate refined / alternative versions of a project.
 * @param {object} project
 * @param {object} prefs
 * @param {string} refinementRequest - e.g. "make it simpler"
 */
export async function refineProject(project, prefs, refinementRequest) {
  const basePrompt = buildRecommendationPrompt(
    { ...prefs, count: 3 },
    3
  );
  const refinePrompt = `${basePrompt}

The student has already seen "${project.title}" and wants alternatives.
Refinement request: ${refinementRequest || "Generate 3 distinct alternatives"}
Do NOT repeat the project titled "${project.title}".`;

  const rawText = await generate(RECOMMENDATION_SYSTEM_PROMPT, refinePrompt, {
    temperature: 0.9,
  });

  const parsed = extractJSON(rawText);

  if (!Array.isArray(parsed?.recommendations)) {
    throw Object.assign(
      new Error("AI returned unexpected format during refinement."),
      { status: 502 }
    );
  }

  const projects = parsed.recommendations.map((p) => ({
    ...p,
    id: p.id || uuidv4(),
  }));

  return {
    alternatives: rankProjects(projects, prefs),
    generatedAt: new Date().toISOString(),
  };
}
