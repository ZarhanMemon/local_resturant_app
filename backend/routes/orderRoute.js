import express from 'express';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import {placeOrder , getMyOrders , updateOrderStatus,getDeliveryRiderAssignment , acceptOrder , getRiderCurrentOrder} from '../controllers/orderController.js'   

const orderRouter = express.Router();

orderRouter.post('/place-order', protectRoute, placeOrder);
orderRouter.get('/my-orders' , protectRoute , getMyOrders);
orderRouter.put('/update-status' , protectRoute , updateOrderStatus);
orderRouter.get('/get-assignment' , protectRoute , getDeliveryRiderAssignment);
orderRouter.post('/accept-order/:assignmentId' , protectRoute , acceptOrder);
orderRouter.get('/riders-order' , protectRoute , getRiderCurrentOrder)

export default orderRouter;