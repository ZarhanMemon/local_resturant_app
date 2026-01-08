import axios from "axios";


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

    res.status(200).json({
      city: feature.properties.city || "City",
      address: feature.properties.formatted, // 👈 THIS is the real address
      state: feature.properties.state || "State",
      raw: response.data    
    });
  } catch (error) {
    console.error("Geoapify error:", error.message);
    res.status(500).json({ message: "Failed to fetch location" });
  }
};