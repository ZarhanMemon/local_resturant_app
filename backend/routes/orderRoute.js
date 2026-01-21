import express from 'express';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import {placeOrder , getMyOrders , updateOrderStatus} from '../controllers/orderController.js'   

const orderRouter = express.Router();

orderRouter.post('/place-order', protectRoute, placeOrder);
orderRouter.get('/my-orders' , protectRoute , getMyOrders)
orderRouter.put('/update-status' , protectRoute , updateOrderStatus)


export default orderRouter;