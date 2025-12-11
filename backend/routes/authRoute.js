import express from 'express';
import { signupUser , signinUser , signoutUser} from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
 

const router = express.Router();


router.post('/signup', signupUser);
router.post('/signin' , signinUser);
 
router.post('/signout' , protectRoute,  signoutUser);

 

export default router;