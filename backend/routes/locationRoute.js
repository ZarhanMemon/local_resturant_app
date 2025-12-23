import express from 'express';
import { getUserLocationFromCoords } from '../controllers/locationController.js';
 

const router = express.Router();


 
router.get('/reverse', getUserLocationFromCoords);
 


  


export default router;