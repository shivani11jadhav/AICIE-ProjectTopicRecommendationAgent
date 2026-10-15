import "dotenv/config";
import express from "express";
import cors from "cors";
import { recommendationsRouter } from "./routes/recommendations.js";
import { chatRouter } from "./routes/chat.js";
import { healthRouter } from "./routes/health.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createAILimiter } from "./middleware/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "50kb" }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/health", healthRouter);
app.use("/api/recommendations", createAILimiter(), recommendationsRouter);
app.use("/api/chat", createAILimiter(), chatRouter);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   AI Provider : ${process.env.AI_PROVIDER || "gemini"}`);
  console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
});

export default app;
