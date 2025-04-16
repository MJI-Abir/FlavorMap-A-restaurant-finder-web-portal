const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const restaurantRoutes = require("./routes/restaurant.routes");

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Set security headers

// Use the cors package properly
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Remove custom CORS implementation

app.use(morgan("dev")); // HTTP request logger
app.use(express.json()); // Parse JSON bodies

// API Routes
app.use("/api/restaurants", restaurantRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Server error",
  });
});

module.exports = app;
