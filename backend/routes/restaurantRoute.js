import express from 'express';
import { createEditRest, getMyRest } from '../controllers/restaurantController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import upload from '../middleware/upload.js';
 

const restRouter = express.Router();

restRouter.post('/create-edit', protectRoute, upload.single("image") , createEditRest);
restRouter.get('/get-my', protectRoute,getMyRest);


export default restRouter;