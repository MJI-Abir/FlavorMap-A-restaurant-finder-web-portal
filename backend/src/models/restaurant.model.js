const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    place_id: {
      type: String,
      required: true,
      unique: true,
    },
    photos: [
      {
        photo_reference: String,
        width: Number,
        height: Number,
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    user_ratings_total: {
      type: Number,
      default: 0,
    },
    price_level: {
      type: Number,
      min: 0,
      max: 4,
    },
    types: [String],
    cuisine: [String],
    phone_number: String,
    website: String,
    opening_hours: {
      weekday_text: [String],
      open_now: Boolean,
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for geospatial queries
restaurantSchema.index({ location: "2dsphere" });
// Create text index for name and cuisine
restaurantSchema.index({ name: "text", cuisine: "text" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
