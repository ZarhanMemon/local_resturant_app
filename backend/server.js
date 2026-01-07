import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoute from "./routes/authRoute.js";
import locationRoute from "./routes/locationRoute.js";
import userRoute from "./routes/userRoute.js";
import restRouter from "./routes/restaurantRoute.js";
import itemRouter from "./routes/itemRoute.js";

dotenv.config();


const app = express();

app.use(
  cors({
    // allow both common dev ports (5173/5174) used by Vite dev server
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true, // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser()); // Middleware to parse cookies from the request headers

// Routes come after middleware
app.use("/api/auth", authRoute);
app.use("/api/me",userRoute);
app.use("/api/restuarant",restRouter)
app.use("/api/items" , itemRouter);

app.use("/api/location",locationRoute);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("/*any", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   });
// }

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB(); // DB connect
});
