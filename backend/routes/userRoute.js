import express from 'express';
import { } from '../controllers/userController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';


const router = express.Router();


router.post('/' ,(req,res)=>{console.log("user hello")} )

export default router;