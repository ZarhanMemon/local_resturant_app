import axios from "axios";

export const getUserLocation = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await axios.get(
            "http://localhost:5000/api/location/reverse",
            {
              params: {
                lat: latitude,
                lon: longitude,
              },
              withCredentials: true,
            }
          );

          resolve(res.data);
        } catch (err) {
          reject(err);
        }
      },
      () => reject("Permission denied")
    );
  });
};
