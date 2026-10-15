import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    provider: process.env.AI_PROVIDER || "gemini",
    version: "1.0.0",
  });
});
