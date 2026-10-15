import { Router } from "express";
import { body, validationResult } from "express-validator";
import { chat } from "../providers/index.js";
import { buildChatSystemPrompt } from "../services/promptBuilder.js";

export const chatRouter = Router();

// ── POST /api/chat ────────────────────────────────────────────────────────────
chatRouter.post(
  "/",
  [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("message is required.")
      .isLength({ max: 1000 })
      .withMessage("message must be under 1000 characters."),
    body("project").isObject().withMessage("project context object is required."),
    body("preferences").isObject().withMessage("preferences object is required."),
    body("history")
      .optional()
      .isArray()
      .withMessage("history must be an array."),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { message, project, preferences, history = [] } = req.body;

      // Limit history to last 10 turns to control token usage
      const trimmedHistory = history.slice(-10);

      const systemPrompt = buildChatSystemPrompt(project, preferences);
      const reply = await chat(trimmedHistory, systemPrompt, message);

      res.json({
        reply,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);
