import express from 'express';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import {placeOrder , getMyCustomerOrders} from '../controllers/orderController.js'   

const orderRouter = express.Router();

orderRouter.post('/place-order', protectRoute, placeOrder);
orderRouter.get('/my-orders' , protectRoute , getMyCustomerOrders)



export default orderRouter;