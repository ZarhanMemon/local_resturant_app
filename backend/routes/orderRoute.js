import express from 'express';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import {placeOrder , getMyOrders , updateOrderStatus,getDeliveryRiderAssignment} from '../controllers/orderController.js'   

const orderRouter = express.Router();

orderRouter.post('/place-order', protectRoute, placeOrder);
orderRouter.get('/my-orders' , protectRoute , getMyOrders);
orderRouter.put('/update-status' , protectRoute , updateOrderStatus);
orderRouter.get('/get-assignment' , protectRoute , getDeliveryRiderAssignment);


export default orderRouter;