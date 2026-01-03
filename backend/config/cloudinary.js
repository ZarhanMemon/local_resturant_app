import {v2 as cloudinary} from 'cloudinary';
import {config} from 'dotenv';
config(); // Load environment variables from .env file




// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ Cloudinary config (only once)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload function
const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Delete file from local server after upload
    fs.unlinkSync(filePath);

    return result.secure_url; // ✅ URL to save in DB
  } catch (error) {
    // Delete file even if upload fails
    fs.unlinkSync(filePath);
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export default uploadOnCloudinary;


