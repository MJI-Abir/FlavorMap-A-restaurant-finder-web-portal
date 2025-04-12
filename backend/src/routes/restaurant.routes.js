const express = require("express");
const router = express.Router();
const {
  searchRestaurantsByLocation,
  getRestaurantDetails,
} = require("../controllers/restaurant.controller");

// GET /api/restaurants/search?location=Dhaka&radius=5000
router.get("/search", searchRestaurantsByLocation);

// GET /api/restaurants/:placeId
router.get("/:placeId", getRestaurantDetails);

module.exports = router;
