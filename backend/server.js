import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";

import connectDB from "./config/db.js";

import authRoute from "./routes/authRoute.js";
import locationRoute from "./routes/locationRoute.js";
import userRoute from "./routes/userRoute.js";
import restRouter from "./routes/restaurantRoute.js";
import itemRouter from "./routes/itemRoute.js";
import orderRouter from "./routes/orderRoute.js";

import { initSocket } from "./socket.js";

import path from "path";
import { fileURLToPath } from "url";


dotenv.config();


const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Your local Vite dev server
  "https://vingo_local-resturant-app.onrender.com", // Your Render Frontend (if separate)
  "https://vingo-backend-isei.onrender.com" // Your Render Backend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser()); // Middleware to parse cookies from the request headers

// Routes come after middleware
app.use("/api/auth", authRoute);
app.use("/api/me",userRoute);
app.use("/api/restuarant",restRouter)
app.use("/api/items" , itemRouter);
app.use("/api/order" , orderRouter)

app.use("/api/location",locationRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*any", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });

  // app.get("*" , (req, res) => {
  //   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  // });
}



const PORT = process.env.PORT || 5000;

// Create HTTP server and attach socket.io
const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB(); // DB connect
});
