/**
 * Centralized Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  console.error(`[Server Error] ${req.method} ${req.url}:`, err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
}

module.exports = errorHandler;
