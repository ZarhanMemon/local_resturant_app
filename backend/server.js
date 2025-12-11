import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";


dotenv.config();
const app = express();

const __dirname = path.resolve();



app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(cookieParser()) // Middleware to parse cookies from the request headers




app.use(
  cors({
    origin: "http://localhost:5173", // Remove trailing slash
    credentials: true,
  })
);



// Routes come after middleware
app.use('/api/auth', authRoute)




if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*any", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(process.env.PORT, async () => {
  console.log("Server running on port 5000");
  await connectDB(); // DB connect
});
