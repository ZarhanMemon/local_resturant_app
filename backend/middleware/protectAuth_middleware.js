import jwt from 'jsonwebtoken';
import User from '../models/users.models.js';

export const protectRoute = async (req, res, next) => {
    try {
        // 1. Get token from cookies
        const token = req.cookies.jwt_token;

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // 2. Verify token (process.env.JWT_SECRET is already loaded in server.js)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }

        // 3. Find User
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, no user found' });
        }

        // 4. Attach to Request
        req.userId = decoded.userId; 
        req.user = user;
        
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
