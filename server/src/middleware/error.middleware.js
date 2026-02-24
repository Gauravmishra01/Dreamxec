const AppError = require('../utils/AppError');
const { publishEvent } = require('../services/eventPublisher.service');
const EVENTS = require('../config/events');

const handlePrismaError = (err) => {
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return new AppError(`A record with this ${field} already exists.`, 400);
  }

  if (err.code === 'P2025') {
    return new AppError('The requested record was not found.', 404);
  }

  return new AppError('A database error occurred.', 500);
};

module.exports = (err, req, res, next) => {
  console.error('ERROR 💥', err);

  let error = err;

  // ===============================
  // HANDLE ZOD VALIDATION ERRORS
  // ===============================
  if (err.name === "ZodError") {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: err.errors.map(e => ({
        field: e.path.join("."),
        message: e.message
      }))
    });
  }

  // ===============================
  // HANDLE PRISMA ERRORS
  // ===============================
  if (err.code && err.code.startsWith('P')) {
    error = handlePrismaError(err);
  }

  // ===============================
  // NORMALIZE ERROR
  // ===============================
  if (!(error instanceof AppError)) {
    error = new AppError(error.message || "Something went wrong", 500);
  }

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // ===============================
  // PUBLISH SYSTEM ERROR
  // ===============================
  if (error.statusCode === 500) {
    publishEvent(EVENTS.SYSTEM_ERROR, {
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method
    }).catch(e =>
      console.error("Failed to publish system error:", e)
    );
  }

  // ===============================
  // DEVELOPMENT RESPONSE
  // ===============================
  if (process.env.NODE_ENV === 'development') {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: error.stack,
      error,
    });
  }

  // ===============================
  // PRODUCTION RESPONSE
  // ===============================
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};