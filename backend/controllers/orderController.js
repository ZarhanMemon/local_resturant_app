import Order from "../models/order.models.js";
import Restaurant from "../models/restaurant.models.js";
import User from "../models/users.models.js";

/* ================= PLACE ORDER ================= */
export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    /* ---------- VALIDATIONS ---------- */
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !deliveryAddress ||
      deliveryAddress.latitude == null ||
      deliveryAddress.longitude == null
    ) {
      return res
        .status(400)
        .json({ message: "Send complete delivery address" });
    }

    /* ---------- GROUP ITEMS BY RESTAURANT ---------- */
    const groupedItems = {};

    cartItems.forEach((item) => {
      const restaurantId = item.restaurant;

      if (!restaurantId) {
        return res.status(400).json({
          message: "Cart item missing restaurant id",
          item,
        });
      }

      if (!groupedItems[restaurantId]) {
        groupedItems[restaurantId] = [];
      }
      groupedItems[restaurantId].push(item);
    });

    /* ---------- CREATE RESTAURANT ORDERS ---------- */
    const restaurantOrders = await Promise.all(
      Object.keys(groupedItems).map(async (restaurantId) => {

        const restaurant =
          await Restaurant.findById(restaurantId).populate("owner");

        if (!restaurant) {
          throw new Error("Restaurant not found");
        }

        const items = groupedItems[restaurantId];

        const subTotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0,
        );

        return {
          restaurant: restaurant._id,
          name: restaurant.name,
          owner: restaurant.owner._id,
          subTotal,
          status:"pending",
          restaurantOrderItems: items.map((i) => ({
            item: i._id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        };
      }),
    );

    /* ---------- CREATE FINAL ORDER ---------- */
    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      restaurantOrders,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({
      message: "Place order failed",
      error: error.message,
    });
  }
};

/* ================= GET MY ORDERS ================= */
export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId || req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let orders = [];

    if (user.role === "Customer") {
      orders = await Order.find({ user: req.userId }).sort({
        createdAt: -1,
      });
    } else if (user.role === "Admin" || user.role === "Owner") {

      orders = await Order.find({
        "restaurantOrders.owner": req.userId,
      }).populate("user" ,"name phone email").sort({ createdAt: -1 });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/*============== Update the STATUS ============*/ 
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, restaurantOrderId, status } = req.body;

    if (!orderId || !restaurantOrderId || !status) {
      return res.status(400).json({
        message: "orderId, restaurantOrderId and status are required",
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find restaurant order
    const restaurantOrder = order.restaurantOrders.id(restaurantOrderId);

    if (!restaurantOrder) {
      return res
        .status(404)
        .json({ message: "Restaurant order not found" });
    }

    // ✅ Update status
    restaurantOrder.status = status;

    await order.save();

    return res.json({
      message: "Order status updated successfully",
      updatedOrder: restaurantOrder,
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    return res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
