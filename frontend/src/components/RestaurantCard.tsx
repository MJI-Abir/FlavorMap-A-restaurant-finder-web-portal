import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  Stack,
} from "@mui/material";
import { Restaurant } from "@/services/api";
import PlaceIcon from "@mui/icons-material/Place";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

const getPriceLevel = (level?: number) => {
  if (!level && level !== 0) return "N/A";

  return Array(level + 1)
    .fill("$")
    .join("");
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick,
}) => {
  // Format a cuisine tag from the types
  const getCuisineTag = () => {
    const excludedTypes = [
      "restaurant",
      "food",
      "point_of_interest",
      "establishment",
    ];
    const cuisineType = restaurant.types.find(
      (type) => !excludedTypes.includes(type)
    );
    return cuisineType ? cuisineType.replace("_", " ") : "restaurant";
  };

  // Get image URL
  const getImageUrl = () => {
    if (restaurant.photos && restaurant.photos.length > 0) {
      const { photo_reference } = restaurant.photos[0];
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${apiKey}`;
    }
    return "/placeholder-restaurant.jpg"; // Fallback image
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
        "&:hover": {
          transform: onClick ? "scale(1.02)" : "none",
          boxShadow: onClick ? "0 8px 16px rgba(0,0,0,0.1)" : "none",
        },
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="140"
        image={getImageUrl()}
        alt={restaurant.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {restaurant.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating
            value={restaurant.rating || 0}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({restaurant.user_ratings_total || 0})
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <AttachMoneyIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {getPriceLevel(restaurant.price_level)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
          <PlaceIcon
            fontSize="small"
            color="action"
            sx={{ mt: 0.3, mr: 0.5 }}
          />
          <Typography variant="body2" color="text.secondary">
            {restaurant.address}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} mt={2}>
          <Chip
            label={getCuisineTag()}
            size="small"
            color="primary"
            variant="outlined"
          />
          {restaurant.opening_hours?.open_now !== undefined && (
            <Chip
              label={restaurant.opening_hours.open_now ? "Open Now" : "Closed"}
              size="small"
              color={restaurant.opening_hours.open_now ? "success" : "error"}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
