"use client";

import { useState } from "react";
import { Box, Typography, Alert, Snackbar } from "@mui/material";
import LocationSearch from "@/components/LocationSearch";
import RestaurantList from "@/components/RestaurantList";
import MapView from "@/components/MapView";
import { Restaurant } from "@/services/api";

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [mapCenter, setMapCenter] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);

  const handleSearch = async (location: string) => {
    setLoading(true);
    setError(null);
    setRestaurants([]);
    setSelectedRestaurant(null);

    try {
      console.log(
        `Attempting to fetch from: ${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/restaurants/search?location=${encodeURIComponent(location)}`
      );

      // Using Next.js rewrites to avoid CORS
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/restaurants/search?location=${encodeURIComponent(location)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials for CORS
          mode: "cors", // Explicitly set CORS mode
        }
      );
      console.log(" Shawwar Response:", response);
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success && data.data) {
        setRestaurants(data.data);

        // Set map center to the first restaurant or searched location
        if (data.data.length > 0) {
          const firstRestaurant = data.data[0];
          setMapCenter({
            lat: firstRestaurant.location.coordinates[1],
            lng: firstRestaurant.location.coordinates[0],
          });
        }
      }
    } catch (err) {
      console.error("Error searching restaurants:", err);
      setError("Failed to search restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setMapCenter({
      lat: restaurant.location.coordinates[1],
      lng: restaurant.location.coordinates[0],
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        textAlign="center"
      >
        Discover Restaurants in Bangladesh
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 4 }}
      >
        Find the best places to eat near any location in Bangladesh
      </Typography>

      <LocationSearch onSearch={handleSearch} isLoading={loading} />

      {restaurants.length > 0 && (
        <MapView
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          onRestaurantSelect={handleRestaurantSelect}
          center={mapCenter}
        />
      )}

      <RestaurantList
        restaurants={restaurants}
        loading={loading}
        onSelectRestaurant={handleRestaurantSelect}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
