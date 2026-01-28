/* eslint-disable no-unused-vars */
import { axiosInstance } from "../api/axios.js";

export const getUserLocation = async (lat, lon) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await axiosInstance.get("/location/reverse", {
            params: {
              lat: lat || latitude,
              lon: lon || longitude,
            },
            withCredentials: true,
          });

          resolve({
            latitude: lat || latitude,
            longitude: lon || longitude,
            address: res.data,
          });
        } catch (err) {
          reject(err);
        }
      },
      () => reject("Permission denied"),
    );
  });
};

let watchId = null;

export const startTrackingUserLocation = () => {
  if (!navigator.geolocation) return;

  watchId = navigator.geolocation.watchPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        await axiosInstance.post(
          "/location/update-location",
          {
             
               latitude,
               longitude,
           
          },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Location update failed", err);
      }
    },
    (err) => console.error("GPS error", err),
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    }
  );
};

export const stopTrackingUserLocation = (watchId) => {
  navigator.geolocation.clearWatch(watchId);
};
