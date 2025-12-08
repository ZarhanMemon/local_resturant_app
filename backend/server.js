import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("API working...");
});

app.listen(5000, () => console.log("Server running on port 5000"));
