import { body, validationResult } from "express-validator";

// ── Allowed enum values ───────────────────────────────────────────────────────
export const DOMAINS = [
  "AI/ML",
  "Web Development",
  "Healthcare",
  "Education",
  "Cybersecurity",
  "Sustainability",
  "Mobile Development",
  "IoT",
  "Data Science",
  "Other",
];

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
export const TEAM_TYPES = ["Individual", "Team"];

// ── Validation chain ──────────────────────────────────────────────────────────
export const validatePreferences = [
  body("branch")
    .trim()
    .notEmpty()
    .withMessage("Academic branch / course is required.")
    .isLength({ max: 100 })
    .withMessage("Branch must be under 100 characters."),

  body("academicYear")
    .trim()
    .notEmpty()
    .withMessage("Academic year / semester is required.")
    .isLength({ max: 50 }),

  body("skills")
    .isArray({ min: 1 })
    .withMessage("Please provide at least one skill.")
    .custom((arr) => arr.every((s) => typeof s === "string" && s.trim()))
    .withMessage("Each skill must be a non-empty string."),

  body("interests")
    .isArray({ min: 1 })
    .withMessage("Please provide at least one area of interest."),

  body("domain")
    .isIn(DOMAINS)
    .withMessage(`Domain must be one of: ${DOMAINS.join(", ")}.`),

  body("techStack")
    .isArray({ min: 1 })
    .withMessage("Please provide at least one preferred technology."),

  body("difficulty")
    .isIn(DIFFICULTIES)
    .withMessage(`Difficulty must be one of: ${DIFFICULTIES.join(", ")}.`),

  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Project duration is required."),

  body("teamType")
    .isIn(TEAM_TYPES)
    .withMessage(`Team type must be "Individual" or "Team".`),

  body("teamSize")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Team size must be between 1 and 20."),

  body("count")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Recommendation count must be between 1 and 10.")
    .toInt(),
];

// ── Result extractor ──────────────────────────────────────────────────────────
export function extractValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
}
