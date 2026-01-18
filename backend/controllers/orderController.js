import Order from "../models/order.models.js";
import Restaurant from "../models/restaurant.models.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      cartItems,
      paymentMethod,
      deliveryAddress,
      totalAmount,
    } = req.body;

    /* ---------------- VALIDATIONS ---------------- */
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !deliveryAddress?.text ||
      !deliveryAddress?.latitude ||
      !deliveryAddress?.longitude
    ) {
      return res
        .status(400)
        .json({ message: "Send complete delivery address" });
    }

    /* ---------------- GROUP ITEMS BY Restaurant ---------------- */
    const groupItemsByRestaurant = {};

    cartItems.forEach((item) => {
      const restaurantId = item.restaurant;

      if (!groupItemsByRestaurant[restaurantId]) {
        groupItemsByRestaurant[restaurantId] = [];
      }

      groupItemsByRestaurant[restaurantId].push(item);
    });

    /*
      Example result:
      {
        RestaurantId1: [item1, item2],
        RestaurantId2: [item3]
      }
    */

    /* ---------------- CREATE Restaurant ORDERS ---------------- */
    const restaurantOrders = await Promise.all(
      Object.keys(groupItemsByRestaurant).map(async (restaurantId) => {
        const restaurant = await Restaurant.findById(restaurantId).populate("owner");

        if (!Restaurant) {
          throw new Error("Restaurant not found");
        }

        const items = groupItemsByRestaurant[restaurantId];

        const subTotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        return {
          restaurant: restaurant._id,
          name : restaurant.name,
          owner: restaurant.owner._id,
          subTotal,
          restaurantOrderItems: items.map((i) => ({
            item: i._id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image
          })),
        };
      })
    );

    /* ---------------- CREATE FINAL ORDER ---------------- */
    const newOrder = await Order.create({
      user: req.userId, // from auth middleware
      paymentMethod,
      deliveryAddress,
      totalAmount,
      restaurantOrders,
    });

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Place order failed", error: error.message });
  }
};



// GET MY ORDERS
export const getMyCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};



//Onwer/REST pending order 
// export const getRestOrder = () =>{

// }