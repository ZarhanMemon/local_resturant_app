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

    res.cookie('jwt_token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });

    return token;
}
