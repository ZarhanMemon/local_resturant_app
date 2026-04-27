import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';    
dotenv.config(); // Load environment variables from .env file

export const generateToken = (userId,res) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set in environment');
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

 // Auto detect environment
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt_token", token, {
    httpOnly: true,

    // localhost → false
    // deployed/live → true
    secure: isProduction,

    // localhost → "lax"
    // deployed/live → "none"
    sameSite: isProduction ? "none" : "lax",

    maxAge: 7 * 24 * 60 * 60 * 1000,
  });


    return token;
}
