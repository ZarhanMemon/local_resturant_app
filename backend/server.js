import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
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
