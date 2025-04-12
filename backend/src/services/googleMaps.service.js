const axios = require("axios");
const { redisClient } = require("../config/redis");

const CACHE_EXPIRATION = 60 * 60 * 24; // 24 hours in seconds

/**
 * Search for places using Google Places API
 * @param {string} location - Location to search (e.g., "Dhaka, Bangladesh")
 * @param {string} type - Type of place (e.g., "restaurant")
 * @param {number} radius - Search radius in meters (default: 5000)
 * @returns {Promise<Array>} - Array of places
 */
const searchPlaces = async (location, type = "restaurant", radius = 5000) => {
  try {
    // Check cache first
    const cacheKey = `places:${location}:${type}:${radius}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached places data");
      return JSON.parse(cachedData);
    }

    // Get location coordinates using Geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const geocodeResponse = await axios.get(geocodeUrl);

    if (geocodeResponse.data.status !== "OK") {
      throw new Error(`Geocoding failed: ${geocodeResponse.data.status}`);
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    // Search for places using Places API
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const placesResponse = await axios.get(placesUrl);

    if (placesResponse.data.status !== "OK") {
      throw new Error(`Places search failed: ${placesResponse.data.status}`);
    }

    // Cache the results
    await redisClient.set(
      cacheKey,
      JSON.stringify(placesResponse.data.results),
      {
        EX: CACHE_EXPIRATION,
      }
    );

    return placesResponse.data.results;
  } catch (error) {
    console.error("Error searching places:", error.message);
    throw error;
  }
};

/**
 * Get place details using Google Place Details API
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} - Place details
 */
const getPlaceDetails = async (placeId) => {
  try {
    // Check cache first
    const cacheKey = `place:${placeId}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached place details");
      return JSON.parse(cachedData);
    }

    // Get place details using Place Details API
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,place_id,photos,rating,user_ratings_total,price_level,types,formatted_phone_number,website,opening_hours&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const detailsResponse = await axios.get(detailsUrl);

    if (detailsResponse.data.status !== "OK") {
      throw new Error(
        `Place details request failed: ${detailsResponse.data.status}`
      );
    }

    // Cache the results
    await redisClient.set(
      cacheKey,
      JSON.stringify(detailsResponse.data.result),
      {
        EX: CACHE_EXPIRATION,
      }
    );

    return detailsResponse.data.result;
  } catch (error) {
    console.error("Error getting place details:", error.message);
    throw error;
  }
};

module.exports = {
  searchPlaces,
  getPlaceDetails,
};
