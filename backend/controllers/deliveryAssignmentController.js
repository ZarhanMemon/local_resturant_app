import DeliveryAssignment from "../models/deliveryAssignment.models.js";
import Order from "../models/order.models.js";

export const createDeliveryAssignment = async (req, res) => {
  try {
    const { orderId, restaurantOrderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const restOrder = order.restaurantOrders.id(restaurantOrderId);
    if (!restOrder) {
      return res.status(404).json({ message: "Restaurant order not found" });
    }

    const assignment = await DeliveryAssignment.create({
      order: order._id,
      restaurant: restOrder.restaurant,
      restaurantOrderId,
      deliveredTo: order.user,
    });

    restOrder.assignment = assignment._id;
    restOrder.status = "accepted";

    await order.save();

    res.status(201).json({
      message: "Delivery assignment created",
      assignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Assignment failed" });
  }
};
