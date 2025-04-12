import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { Restaurant } from "@/services/api";

interface MapViewProps {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  onRestaurantSelect: (restaurant: Restaurant) => void;
  center?: { lat: number; lng: number };
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 23.8103, // Center of Bangladesh (approximately)
  lng: 90.4125,
};

const MapView: React.FC<MapViewProps> = ({
  restaurants,
  selectedRestaurant,
  onRestaurantSelect,
  center,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapCenter = center || defaultCenter;

  if (!isLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
        bgcolor="background.paper"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Restaurant Locations
      </Typography>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={13}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {restaurants.map((restaurant) => {
          // Extract coordinates from restaurant
          const position = {
            lat: restaurant.location.coordinates[1],
            lng: restaurant.location.coordinates[0],
          };

          return (
            <Marker
              key={restaurant.place_id}
              position={position}
              onClick={() => onRestaurantSelect(restaurant)}
              animation={google.maps.Animation.DROP}
            />
          );
        })}

        {selectedRestaurant && (
          <InfoWindow
            position={{
              lat: selectedRestaurant.location.coordinates[1],
              lng: selectedRestaurant.location.coordinates[0],
            }}
            onCloseClick={() => onRestaurantSelect(selectedRestaurant)}
          >
            <Box sx={{ p: 1, maxWidth: 200 }}>
              <Typography variant="subtitle2">
                {selectedRestaurant.name}
              </Typography>
              <Typography variant="body2">
                {selectedRestaurant.address}
              </Typography>
              {selectedRestaurant.rating && (
                <Typography variant="body2">
                  Rating: {selectedRestaurant.rating} (
                  {selectedRestaurant.user_ratings_total} reviews)
                </Typography>
              )}
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
    </Paper>
  );
};

export default MapView;
