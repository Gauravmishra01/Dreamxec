const redis = require('./redis.service');

const CHANNEL_NAME = "dreamxec:events";

const publishEvent = async (eventName, data) => {
    try {
        const message = JSON.stringify({ event: eventName, data });
        await redis.publish(CHANNEL_NAME, message);
        console.log(`[EventPublisher] Published event: ${eventName}`);
    } catch (error) {
        console.error(`[EventPublisher] Failed to publish event ${eventName}:`, error);
    }
};

module.exports = { publishEvent };