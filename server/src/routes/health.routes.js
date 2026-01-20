const express = require("express");
const { checkRedisHealth } = require("../utils/redisHealth");

const router = express.Router();

router.get("/health", async (req, res) => {
  const redisHealth = await checkRedisHealth();

  res.status(redisHealth.status === "healthy" ? 200 : 503).json({
    status: "ok",
    service: "DreamXec API",
    redis: redisHealth,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
