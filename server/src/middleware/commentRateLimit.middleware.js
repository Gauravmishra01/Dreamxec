const redisClient = require("../services/redis.service");
const AppError = require("../utils/AppError");

const MAX_COMMENTS = 5;
const WINDOW_SECONDS = 60;

const commentRateLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const key = `comment_rate:${userId}`;

    const current = await redisClient.get(key);

    if (current && parseInt(current) >= MAX_COMMENTS) {
      return next(
        new AppError(
          "Too many comments. Please wait before commenting again.",
          429
        )
      );
    }

    if (!current) {
      await redisClient.set(key, 1, { EX: WINDOW_SECONDS });
    } else {
      await redisClient.incr(key);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = commentRateLimit;
