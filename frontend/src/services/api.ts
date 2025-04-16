import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with cross-origin requests
});

// Type definitions
export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  place_id: string;
  photos: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
  rating: number;
  user_ratings_total: number;
  price_level?: number;
  types: string[];
  cuisine?: string[];
  phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text?: string[];
    open_now?: boolean;
  };
}

// API functions
export const searchRestaurants = async (
  location: string,
  radius?: number
): Promise<Restaurant[]> => {
  try {
    const params = new URLSearchParams();
    params.append("location", location);
    if (radius) params.append("radius", radius.toString());

    const response = await api.get(
      `/api/restaurants/search?${params.toString()}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
};

export const getRestaurantDetails = async (
  placeId: string
): Promise<Restaurant> => {
  try {
    const response = await api.get(`/api/restaurants/${placeId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error getting restaurant details:", error);
    throw error;
  }
};

export default api;
