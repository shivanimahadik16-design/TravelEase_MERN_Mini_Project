export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let statusCode = error.statusCode || error.status || 500;
  let message = error.message;
  let details;

  if (error.isJoi) {
    statusCode = 400;
    message = "Request validation failed";
    details = error.details.map((item) => ({
      field: item.path.join("."),
      message: item.message
    }));
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Request validation failed";
    details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));
  } else if (error.name === "CastError" || error instanceof SyntaxError) {
    statusCode = 400;
    message = error instanceof SyntaxError ? "Invalid JSON request body" : "Invalid identifier";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  } else if (statusCode >= 500) {
    console.error("Unhandled API error:", error);
    message = "Internal server error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {})
  });
}
