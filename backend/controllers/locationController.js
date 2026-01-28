import axios from "axios";
import User from "../models/users.models.js";

export const getUserLocationFromCoords = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/reverse",
      {
        params: {
          lat,
          lon,
          apiKey: process.env.GEOAPIFY_API_KEY,
        },
      }
    );

    const feature = response.data.features[0];

    return res.status(200).json({
      city: feature.properties.city || "City",
      address: feature.properties.formatted,
      state: feature.properties.state || "State",
    });
  } catch (error) {
    console.error("Geoapify error:", error.message);
    return res.status(500).json({ message: "Failed to fetch location" });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "lat & lon required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude], // 🔥 CORRECT ORDER
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
