import express from 'express';
import { signupUser , signinUser , signoutUser ,authCheck , forgotPassword ,verifyOtp ,resetPassword , googleAuth} from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
 

const router = express.Router();


router.post('/signup', signupUser);
router.post('/signin' , signinUser);
router.post('/signout' ,  signoutUser);

// Google OAuth Endpoint
// Unified endpoint that handles both signup and signin
// Frontend sends: { name, email, phone } from Firebase
// Backend: Creates account if new user, logs in if exists
// Returns: User object + JWT cookie
router.post("/google", googleAuth);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);



 router.get('/check',protectRoute, authCheck);


export default router;