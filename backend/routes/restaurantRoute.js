import express from 'express';
import { createEditRest, getAllRest, getMyRest , getRestById,getRestaurantBycity } from '../controllers/restaurantController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import upload from '../middleware/upload.js';
 

const restRouter = express.Router();

restRouter.post('/create-edit', protectRoute, upload.single("image") , createEditRest);
restRouter.get('/get-my', protectRoute,getMyRest);

restRouter.get('/get-all', protectRoute, getAllRest);
restRouter.get('/get-rest/:name', protectRoute, getRestById);
restRouter.get('/get-rest-by-city/:city', protectRoute, getRestaurantBycity);

export default restRouter;