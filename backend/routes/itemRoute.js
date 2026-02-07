import express from 'express';
import { addItem , editItem , deleteItem, getAllItems , getItemsByCategory ,getItemById ,getItemByRestName , getItemByName} from '../controllers/itemsController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import upload from '../middleware/upload.js';
  

const itemRouter = express.Router();

itemRouter.post('/add-item', protectRoute, upload.single("image") ,addItem);
itemRouter.put('/edit-item/:itemId', protectRoute, upload.single("image") ,editItem);
itemRouter.delete('/delete-item/:itemId', protectRoute, deleteItem);

itemRouter.get('/all-items',protectRoute, getAllItems);
itemRouter.get('/item/:itemId',protectRoute, getItemById);
itemRouter.get('/category/:category',protectRoute, getItemsByCategory);
itemRouter.get('/restaurant/:res_name',protectRoute, getItemByRestName);
itemRouter.get('/search/:name',protectRoute, getItemByName);




export default itemRouter;