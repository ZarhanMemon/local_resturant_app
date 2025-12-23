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

    const city =
      feature.properties.city ||
      feature.properties.county ||
      feature.properties.state;

    res.status(200).json({
      city:city || "City",
      formatted: feature.properties.formatted,
    });
  } catch (error) {
    console.error("Geoapify error:", error.message);
    res.status(500).json({ message: "Failed to fetch location" });
  }
};