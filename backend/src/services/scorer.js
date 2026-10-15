/**
 * Scoring engine — evaluates and ranks AI-generated project candidates.
 *
 * All scores are estimates based on the student's stated preferences.
 * They are NOT objective measures of a project's real-world feasibility.
 */

// Configurable weights (must sum to 1.0)
const WEIGHTS = {
  skillMatch: 0.25,
  interestMatch: 0.25,
  feasibility: 0.20,
  difficultyFit: 0.15,
  techCompatibility: 0.15,
};

/**
 * Normalise a string for comparison.
 * @param {string} s
 */
function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Simple token overlap ratio between two string arrays.
 * Returns 0–1.
 */
function overlapScore(aList, bList) {
  if (!aList?.length || !bList?.length) return 0.3; // neutral when unknown
  const aNorm = aList.map(norm);
  const bNorm = bList.map(norm);
  const matches = aNorm.filter((a) =>
    bNorm.some((b) => b.includes(a) || a.includes(b))
  );
  return Math.min(1, matches.length / Math.max(aNorm.length, 1));
}

/**
 * Score how well the project's required skills match the student's skills.
 */
function scoreSkillMatch(project, prefs) {
  return overlapScore(prefs.skills, project.requiredSkills ?? []);
}

/**
 * Score interest alignment.
 */
function scoreInterestMatch(project, prefs) {
  const projectTokens = [
    ...(project.tags ?? []),
    project.domain ?? "",
    project.title ?? "",
  ];
  return overlapScore(prefs.interests, projectTokens);
}

/**
 * Feasibility based on duration and team size signals from the project.
 * Projects that explicitly match the student's duration get a boost.
 */
function scoreFeasibility(project, prefs) {
  // The AI provides a feasibilityScore 0–100; normalise it.
  const aiScore = (project.feasibilityScore ?? 70) / 100;

  // Duration proximity heuristic
  let durationBonus = 0;
  const dur = (prefs.duration || "").toLowerCase();
  const projDur = (project.estimatedDuration || "").toLowerCase();
  if (dur && projDur && (dur.includes(projDur) || projDur.includes(dur))) {
    durationBonus = 0.1;
  }

  return Math.min(1, aiScore + durationBonus);
}

/**
 * Penalise if difficulty is mismatched.
 */
function scoreDifficultyFit(project, prefs) {
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const prefIdx = levels.indexOf(prefs.difficulty);
  const projIdx = levels.indexOf(project.difficulty);
  if (prefIdx === -1 || projIdx === -1) return 0.6;
  const diff = Math.abs(prefIdx - projIdx);
  return [1.0, 0.6, 0.2][diff] ?? 0.2;
}

/**
 * Tech stack compatibility.
 */
function scoreTechCompatibility(project, prefs) {
  return overlapScore(
    prefs.techStack,
    project.recommendedTechStack ?? []
  );
}

/**
 * Compute a composite suitability score (0–100) for a project.
 * Returns the project object augmented with scoring details.
 */
export function scoreProject(project, prefs) {
  const components = {
    skillMatch: scoreSkillMatch(project, prefs),
    interestMatch: scoreInterestMatch(project, prefs),
    feasibility: scoreFeasibility(project, prefs),
    difficultyFit: scoreDifficultyFit(project, prefs),
    techCompatibility: scoreTechCompatibility(project, prefs),
  };

  const composite = Object.entries(WEIGHTS).reduce(
    (sum, [key, w]) => sum + (components[key] ?? 0) * w,
    0
  );

  const suitabilityScore = Math.round(composite * 100);

  return {
    ...project,
    suitabilityScore,
    scoreBreakdown: {
      skillMatch: Math.round(components.skillMatch * 100),
      interestMatch: Math.round(components.interestMatch * 100),
      feasibility: Math.round(components.feasibility * 100),
      difficultyFit: Math.round(components.difficultyFit * 100),
      techCompatibility: Math.round(components.techCompatibility * 100),
      weights: WEIGHTS,
      note: "Scores are estimates based on stated preferences, not objective measurements.",
    },
  };
}

/**
 * Score and rank an array of projects. Highest score first.
 */
export function rankProjects(projects, prefs) {
  return projects
    .map((p) => scoreProject(p, prefs))
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
