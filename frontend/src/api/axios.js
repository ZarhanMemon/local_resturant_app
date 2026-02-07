import axios from 'axios';

// Ensure the URL matches your Render URL exactly + /api
const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api" 
 : "https://chindi-backend.onrender.com/api";


export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for JWT cookies to work across domains
});

