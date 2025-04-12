const Restaurant = require("../models/restaurant.model");
const {
  searchPlaces,
  getPlaceDetails,
} = require("../services/googleMaps.service");
const { redisClient } = require("../config/redis");

const CACHE_EXPIRATION = 60 * 30; // 30 minutes in seconds

/**
 * Search restaurants by location
 * @route GET /api/restaurants/search
 */
const searchRestaurantsByLocation = async (req, res) => {
  try {
    const { location, radius = 5000 } = req.query;

    if (!location) {
      return res
        .status(400)
        .json({ success: false, message: "Location is required" });
    }

    // Check cache first
    const cacheKey = `restaurants:${location}:${radius}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached restaurant search results");
      return res.json({ success: true, data: JSON.parse(cachedData) });
    }

    // Search restaurants using Google Places API
    const places = await searchPlaces(location, "restaurant", radius);

    // Map places to our restaurant schema format
    const restaurants = places.map((place) => ({
      name: place.name,
      address: place.vicinity,
      location: {
        type: "Point",
        coordinates: [place.geometry.location.lng, place.geometry.location.lat],
      },
      place_id: place.place_id,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      types: place.types,
      photos: place.photos
        ? place.photos.map((photo) => ({
            photo_reference: photo.photo_reference,
            height: photo.height,
            width: photo.width,
          }))
        : [],
      opening_hours: {
        open_now: place.opening_hours ? place.opening_hours.open_now : null,
      },
    }));

    // Cache the results
    await redisClient.set(cacheKey, JSON.stringify(restaurants), {
      EX: CACHE_EXPIRATION,
    });

    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error("Error searching restaurants:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Get restaurant details by place ID
 * @route GET /api/restaurants/:placeId
 */
const getRestaurantDetails = async (req, res) => {
  try {
    const { placeId } = req.params;

    // Check if we have it in the database
    let restaurant = await Restaurant.findOne({ place_id: placeId });

    // If not in DB or was updated more than a day ago, fetch from Google
    if (
      !restaurant ||
      Date.now() - restaurant.last_updated.getTime() > 86400000
    ) {
      const placeDetails = await getPlaceDetails(placeId);

      // Format data according to our schema
      const restaurantData = {
        name: placeDetails.name,
        address: placeDetails.formatted_address,
        location: {
          type: "Point",
          coordinates: [
            placeDetails.geometry.location.lng,
            placeDetails.geometry.location.lat,
          ],
        },
        place_id: placeDetails.place_id,
        photos: placeDetails.photos
          ? placeDetails.photos.map((photo) => ({
              photo_reference: photo.photo_reference,
              height: photo.height,
              width: photo.width,
            }))
          : [],
        rating: placeDetails.rating,
        user_ratings_total: placeDetails.user_ratings_total,
        price_level: placeDetails.price_level,
        types: placeDetails.types,
        cuisine: placeDetails.types.filter(
          (type) =>
            ![
              "restaurant",
              "food",
              "point_of_interest",
              "establishment",
            ].includes(type)
        ),
        phone_number: placeDetails.formatted_phone_number,
        website: placeDetails.website,
        opening_hours: placeDetails.opening_hours
          ? {
              weekday_text: placeDetails.opening_hours.weekday_text,
              open_now: placeDetails.opening_hours.open_now,
            }
          : undefined,
        last_updated: new Date(),
      };

      // Update or insert restaurant
      if (restaurant) {
        restaurant = await Restaurant.findOneAndUpdate(
          { place_id: placeId },
          restaurantData,
          { new: true }
        );
      } else {
        restaurant = await Restaurant.create(restaurantData);
      }
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error getting restaurant details:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  searchRestaurantsByLocation,
  getRestaurantDetails,
};
