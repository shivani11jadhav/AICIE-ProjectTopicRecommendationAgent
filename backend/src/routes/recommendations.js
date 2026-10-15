import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  validatePreferences,
  extractValidationErrors,
} from "../validation/preferences.js";
import {
  generateRecommendations,
  generateProjectDetail,
  refineProject,
} from "../services/recommender.js";

export const recommendationsRouter = Router();

// ── POST /api/recommendations ─────────────────────────────────────────────────
recommendationsRouter.post(
  "/",
  validatePreferences,
  async (req, res, next) => {
    if (extractValidationErrors(req, res)) return;

    try {
      const result = await generateRecommendations(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/recommendations/:id/detail ─────────────────────────────────────
recommendationsRouter.post(
  "/:id/detail",
  [
    body("project").isObject().withMessage("project object is required."),
    body("preferences").isObject().withMessage("preferences object is required."),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { project, preferences } = req.body;
      const result = await generateProjectDetail(project, preferences);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/recommendations/:id/refine ─────────────────────────────────────
recommendationsRouter.post(
  "/:id/refine",
  [
    body("project").isObject().withMessage("project object is required."),
    body("preferences").isObject().withMessage("preferences object is required."),
    body("refinementRequest")
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage("refinementRequest must be a string under 500 characters."),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { project, preferences, refinementRequest } = req.body;
      const result = await refineProject(project, preferences, refinementRequest);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);
