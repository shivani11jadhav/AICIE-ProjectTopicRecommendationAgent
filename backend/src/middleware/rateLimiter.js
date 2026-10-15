import rateLimit from "express-rate-limit";

/**
 * Factory so each AI route gets its own limiter instance.
 */
export function createAILimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || "20", 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too many requests. Please wait a few minutes before trying again.",
    },
  });
}
