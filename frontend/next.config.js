/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["maps.googleapis.com"],
  },
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
  },
};

module.exports = nextConfig;
