import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  InputAdornment,
  CircularProgress,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface LocationSearchProps {
  onSearch: (location: string) => void;
  isLoading?: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim()) {
      setError("Please enter a location");
      return;
    }

    setError("");
    onSearch(location);
    console.log("type of location: ", typeof location);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    if (error) setError("");
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Unable to get your current location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Find Restaurants in Bangladesh
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <TextField
          label="Enter location"
          variant="outlined"
          fullWidth
          value={location}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          disabled={isLoading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          placeholder="e.g., Dhaka, Chittagong, Sylhet..."
        />

        <Button
          variant="outlined"
          onClick={handleCurrentLocation}
          disabled={isLoading}
          startIcon={<LocationOnIcon />}
          sx={{ minWidth: { xs: "100%", sm: "auto" } }}
        >
          Current Location
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ minWidth: { xs: "100%", sm: "auto" } }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Search"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default LocationSearch;
