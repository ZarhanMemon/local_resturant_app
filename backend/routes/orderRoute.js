import express from 'express';
import { protectRoute } from '../middleware/protectAuth_middleware.js';
import {placeOrder , verifyPayment, getMyOrders , updateOrderStatus,getDeliveryRiderAssignment , acceptOrder , getRiderCurrentOrder , getOrderById} from '../controllers/orderController.js'   

const orderRouter = express.Router();

orderRouter.post('/place-order', protectRoute, placeOrder);
orderRouter.get('/my-orders' , protectRoute , getMyOrders);
orderRouter.put('/update-status' , protectRoute , updateOrderStatus);
orderRouter.get('/get-assignment' , protectRoute , getDeliveryRiderAssignment);
orderRouter.post('/accept-order/:assignmentId' , protectRoute , acceptOrder);
orderRouter.get('/riders-order' , protectRoute , getRiderCurrentOrder)
orderRouter.get('/get-order-by-id/:orderId' , protectRoute , getOrderById);

// Verify payment route
orderRouter.post('/verify-payment/:orderId', protectRoute, verifyPayment);

export default orderRouter;