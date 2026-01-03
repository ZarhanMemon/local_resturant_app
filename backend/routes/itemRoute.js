import express from 'express';
import { addItem , editItem } from '../controllers/itemsController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import upload from '../middleware/upload.js';
 

const itemRouter = express.Router();

itemRouter.post('/add-item', protectRoute, upload.single("image") ,addItem);
itemRouter.post('/edit-item/:itemId', protectRoute, upload.single("image") ,editItem);


export default itemRouter;