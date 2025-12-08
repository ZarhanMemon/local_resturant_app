import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected",process.env.MONGO_URI);
  } catch (err) {
    console.log("MongoDB connection error:", err.message);
  }
};

export default connectDB;
