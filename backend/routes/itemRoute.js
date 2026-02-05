import express from 'express';
import { addItem , editItem , deleteItem, getAllItems , getItemsByCategory ,getItemById ,getItemByRestName , getItemByName} from '../controllers/itemsController.js';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import upload from '../middleware/upload.js';
  

const itemRouter = express.Router();

itemRouter.post('/add-item', protectRoute, upload.single("image") ,addItem);
itemRouter.put('/edit-item/:itemId', protectRoute, upload.single("image") ,editItem);
itemRouter.delete('/delete-item/:itemId', protectRoute, deleteItem);


// Public, explicit item retrieval endpoints
itemRouter.get('/all-items', getAllItems);
itemRouter.get('/item/:itemId', getItemById);
itemRouter.get('/category/:category', getItemsByCategory);
itemRouter.get('/restaurant/:res_name', getItemByRestName);
itemRouter.get('/search/:name', getItemByName);



export default itemRouter;