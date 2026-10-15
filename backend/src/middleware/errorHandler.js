/**
 * Central Express error handler.
 * Never leaks stack traces or secret values to the client.
 */
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;

  // Log full details server-side only
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    status,
    message: err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });

  // Safe client-facing message
  const clientMessage =
    status < 500
      ? err.message
      : "An unexpected error occurred. Please try again.";

  res.status(status).json({ error: clientMessage });
}
