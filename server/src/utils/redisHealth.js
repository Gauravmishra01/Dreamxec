const redis = require("../services/redis.service");

async function checkRedisHealth() {
  try {
    const start = Date.now();
    const pong = await redis.ping();
    const latency = Date.now() - start;

    return {
      status: "healthy",
      pong,
      latencyMs: latency,
    };
  } catch (err) {
    return {
      status: "unhealthy",
      error: err.message,
    };
  }
}

module.exports = { checkRedisHealth };
