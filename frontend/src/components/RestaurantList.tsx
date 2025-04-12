import React from "react";
import { Grid, Box, Typography, CircularProgress, Paper } from "@mui/material";
import RestaurantCard from "./RestaurantCard";
import { Restaurant } from "@/services/api";

interface RestaurantListProps {
  restaurants: Restaurant[];
  loading: boolean;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  loading,
  onSelectRestaurant,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">No restaurants found</Typography>
        <Typography variant="body2" color="text.secondary">
          Try searching in a different location or adjust your search criteria
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Found {restaurants.length} restaurants
      </Typography>
      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid key={restaurant.place_id}>
            <RestaurantCard
              restaurant={restaurant}
              onClick={() => onSelectRestaurant(restaurant)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RestaurantList;
