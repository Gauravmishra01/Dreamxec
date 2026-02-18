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

  // Handle Prisma errors
  if (err.code && err.code.startsWith('P')) {
    error = handlePrismaError(err);
  }

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (error.statusCode === 500) {
      publishEvent(EVENTS.SYSTEM_ERROR, {
          message: error.message,
          stack: error.stack,
          path: req.originalUrl,
          method: req.method
      }).catch(e => console.error("Failed to publish system error:", e));
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: error.stack,
      error,
    });
  } else {
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  }
};
