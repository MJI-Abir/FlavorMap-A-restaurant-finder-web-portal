require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Connect to Redis
connectRedis();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
