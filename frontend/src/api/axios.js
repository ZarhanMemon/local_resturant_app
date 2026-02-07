import axios from 'axios';

// 1. Point this to your ACTUAL Render Backend URL
const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api" 
  : "https://vingo-backend-isei.onrender.com"; // Your Render URL from the screenshot

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});
