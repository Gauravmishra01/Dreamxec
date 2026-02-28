const express = require("express");
const { checkRedisHealth } = require("../utils/redisHealth");

const router = express.Router();

router.get("/health", async (req, res) => {
  const redisDisabled = process.env.USE_REDIS === "false";
  const redisHealth = redisDisabled
    ? {
        status: "disabled",
        message: "Redis disabled for local dev (USE_REDIS=false)",
      }
    : await checkRedisHealth();

  const httpStatus = redisHealth.status === "unhealthy" ? 503 : 200;

  res.status(httpStatus).json({
    status: "ok",
    service: "DreamXec API",
    redis: redisHealth,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
