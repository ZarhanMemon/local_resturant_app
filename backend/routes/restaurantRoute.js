import express from 'express';
import { createEditRest } from '../controllers/restaurantController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import upload from '../middleware/upload.js';
 

const restRouter = express.Router();

restRouter.get('/create-edit', protectRoute, upload.single("image") , createEditRest);

export default restRouter;