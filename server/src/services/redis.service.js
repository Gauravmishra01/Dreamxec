const { createClient } = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✅ Redis connected");
  }
})();

module.exports = redisClient;
