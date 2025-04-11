const { createClient } = require("redis");

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis client connected");
  } catch (error) {
    console.error(`Redis connection error: ${error.message}`);
  }
};

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = { redisClient, connectRedis };
