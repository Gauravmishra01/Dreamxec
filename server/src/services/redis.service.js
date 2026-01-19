const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

const redisFunction = () => {
    if (process.env.REDIS_URL && process.env.REDIS_URL.startsWith('redis://')) {
        console.log("Redis connecting with URL...");
        return new Redis(process.env.REDIS_URL);
    } 
    
    console.log("Redis connecting to localhost:6379...");
    return new Redis({
        host: '127.0.0.1',
        port: 6379,
    });
};

const redis = redisFunction();

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

module.exports = redis;
