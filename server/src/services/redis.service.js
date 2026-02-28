const redis = require("redis");

// If USE_REDIS is explicitly false, export a dummy client that logs warnings
if (process.env.USE_REDIS === "false") {
  const noop = () =>
    Promise.reject(new Error("Redis is disabled (USE_REDIS=false)"));
  const dummyClient = {
    get: noop,
    set: noop,
    del: noop,
    exists: noop,
    expire: noop,
    ttl: noop,
    scan: noop,
    keys: noop,
    ping: noop,
    multi: () => ({
      set: () => ({ exec: noop }),
      del: () => ({ exec: noop }),
      exec: noop,
    }),
    on: () => dummyClient,
    once: () => dummyClient,
    emit: () => false,
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    quit: () => Promise.resolve(),
    isOpen: false,
    isReady: false,
  };
  console.log(
    "ℹ️  Redis client disabled (USE_REDIS=false). OTP/session-Redis features unavailable.",
  );
  module.exports = dummyClient;
} else {
  const MAX_RETRIES = 10;
  const client = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries >= MAX_RETRIES) {
          console.error(
            `❌ Redis max reconnect attempts (${MAX_RETRIES}) reached. Giving up.`,
          );
          return new Error("Redis max retries exceeded");
        }
        const delay = Math.min(retries * 200, 3000);
        console.log(
          `🔁 Redis reconnect attempt #${retries} (retry in ${delay}ms)`,
        );
        return delay;
      },
    },
  });

  client.on("connect", () => console.log("🔄 Redis connecting..."));
  client.on("ready", () => console.log("✅ Redis connected and ready"));
  client.on("error", (err) =>
    console.error("❌ Redis Client Error:", err.message),
  );
  client.on("end", () => console.log("🔌 Redis connection closed"));

  client
    .connect()
    .catch((err) =>
      console.error("❌ Redis initial connect error:", err.message),
    );

  module.exports = client;
}
