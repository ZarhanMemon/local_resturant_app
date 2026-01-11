import express from 'express';
import { addItem , editItem , deleteItem, getAllItems , getItemsByCategory ,getItemById ,getItemByName} from '../controllers/itemsController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import upload from '../middleware/upload.js';
  

const itemRouter = express.Router();

itemRouter.post('/add-item', protectRoute, upload.single("image") ,addItem);
itemRouter.put('/edit-item/:itemId', protectRoute, upload.single("image") ,editItem);
itemRouter.delete('/delete-item/:itemId', protectRoute, deleteItem);


itemRouter.get('/all-items', protectRoute, getAllItems);
itemRouter.get('/all-items/:restId', protectRoute, getItemById);
itemRouter.get('/all-items/:category', protectRoute, getItemsByCategory);
itemRouter.get('/all-items/:name', protectRoute, getItemByName);



export default itemRouter;