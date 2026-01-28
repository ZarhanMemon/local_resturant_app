import express from 'express';
import { getUserLocationFromCoords, updateUserLocation } from '../controllers/locationController.js';
import {protectRoute} from "../middleware/protectAuth_middleware.js";

const router = express.Router();

router.get('/reverse',protectRoute, getUserLocationFromCoords);
router.post('/update-location' , protectRoute , updateUserLocation)

export default router;