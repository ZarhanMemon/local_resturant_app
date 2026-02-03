import DeliveryAssignment from "../models/deliveryAssignment.models.js";
import Order from "../models/order.models.js";
import Restaurant from "../models/restaurant.models.js";
import User from "../models/users.models.js";

import crypto from 'crypto';
import { sendEmail } from "../utils/sentOTP_Mail.js"; // Ensure path is correct

/* ================= PLACE ORDER ================= */
export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

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

    const groupedItems = {};

    cartItems.forEach((item) => {
      if (!item.restaurant) return;

      if (!groupedItems[item.restaurant]) {
        groupedItems[item.restaurant] = [];
      }
      groupedItems[item.restaurant].push(item);
    });

    const restaurantOrders = await Promise.all(
      Object.keys(groupedItems).map(async (restaurantId) => {
        const restaurant =
          await Restaurant.findById(restaurantId).populate("owner");

        if (!restaurant) throw new Error("Restaurant not found");

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
          status: "pending",
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

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      restaurantOrders,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET MY ORDERS ================= */
export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    let orders = [];

    if (user.role === "Customer") {
      orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ "restaurantOrders.owner": req.userId })
        .populate("user", "name phone email").populate("restaurantOrders.assignedDeliveryRider","name phone email")
        .sort({ createdAt: -1 });
    }

    // Dynamic recalculation of free riders
    for (const order of orders) {
      for (const restOrder of order.restaurantOrders) {
        if (restOrder.status === "out of delivery" && !restOrder.assignment) {
          const { longitude, latitude } = order.deliveryAddress;

          const nearByRiders = await User.find({
            role: "Rider",
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [Number(longitude), Number(latitude)],
                },
                $maxDistance: 5000, // 5km radius
              },
            },
          });

          if (nearByRiders.length) {
            const nearByIds = nearByRiders.map((r) => r._id);

            const busyRiders = await DeliveryAssignment.find({
              assignedTo: { $in: nearByIds },
              status: { $in: ["assigned"] },
            }).distinct("assignedTo");

            const busySet = new Set(busyRiders.map(String));

            const freeRiders = nearByRiders.filter(
              (r) => !busySet.has(String(r._id)),
            );

            restOrder.freeRiders = freeRiders.map((r) => ({
              id: r._id,
              name: r.name,
              phone: r.phone,
              email: r.email,
              longitude: r.location.coordinates[0],
              latitude: r.location.coordinates[1],
            }));
          } else {
            restOrder.freeRiders = [];
          }
        }
      }
    }

    res.json(orders);
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Helper for Stateless OTP verification (No DB field needed)
const createOTPHash = (orderId, otp) => {
  const secret = process.env.OTP_SECRET ;
  return crypto.createHmac("sha256", secret)
               .update(`${orderId}${otp}`)
               .digest("hex");
};

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, restaurantOrderId, status, otp, otpHash } = req.body;
    const userRole = req.userId.role;

    if (!orderId || !restaurantOrderId || !status) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const order = await Order.findById(orderId).populate("user", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const restaurantOrder = order.restaurantOrders.id(restaurantOrderId);
    if (!restaurantOrder) return res.status(404).json({ message: "Restaurant order not found" });

    // --- 1. RIDER OTP VERIFICATION ---
    if (userRole === "Rider" && status === "delivered") {
      if (!otp || !otpHash) {
        return res.status(400).json({ message: "Delivery OTP is required to complete this order." });
      }

      const verifiedHash = createOTPHash(orderId, otp);
      if (verifiedHash !== otpHash) {
        return res.status(400).json({ message: "Invalid OTP. Please ask the customer for the correct code." });
      }

      // Mark assignment as completed
      await DeliveryAssignment.findOneAndUpdate(
        { restaurantOrderId: restaurantOrder._id, status: "assigned" },
        { status: "completed" }
      );
    }

    // --- 2. GENERATE & SEND OTP (When moving to "out of delivery") ---
    let newOtpHash = null;
    if (status === "out of delivery") {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      newOtpHash = createOTPHash(orderId, generatedOtp);

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; border-radius: 15px; padding: 20px;">
          <h2 style="color: #f97316; text-align: center;">Order is on the way! 🛵</h2>
          <p>Hi <strong>${order.user?.name}</strong>,</p>
          <p>Your order from <strong>${restaurantOrder.name}</strong> has been picked up.</p>
          <div style="background: #fff7ed; border: 2px dashed #f97316; padding: 20px; text-align: center; border-radius: 10px;">
            <p style="margin: 0; font-size: 10px; color: #f97316; font-weight: bold; text-transform: uppercase;">Share this OTP with Rider</p>
            <h1 style="margin: 10px 0; font-size: 36px; letter-spacing: 8px; color: #111;">${generatedOtp}</h1>
          </div>
          <p style="font-size: 11px; color: #888; text-align: center; margin-top: 15px;">Only share this code once you have received your package.</p>
        </div>
      `;

      // Async send email (don't await if you want faster response, or await for reliability)
      sendEmail(order.user.email, "Your Delivery OTP - Vingo", emailHtml)
      .catch(err => console.error("Email Error:", err));
    }

    // --- 3. ORIGINAL RIDER ASSIGNMENT LOGIC ---

    let freeRidersPayload = [];

    if (status === "out of delivery" && !restaurantOrder.delivery_assignment) {

      const { longitude, latitude } = order.deliveryAddress;

      const nearByRiders = await User.find({
        role: "Rider",
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
            $maxDistance: 5000,
          },
        },
      });

      const busyRiders = await DeliveryAssignment.find({
        status: { $in: ["assigned", "broadcasted"] },
      }).distinct("assignedTo");

      const busySet = new Set(busyRiders.filter(id => id).map(String));
      const freeRiders = nearByRiders.filter((r) => !busySet.has(String(r._id)));

      if (freeRiders.length > 0) {
        const delivery_assignment = await DeliveryAssignment.create({
          order: order._id,
          restaurant: restaurantOrder.restaurant,
          restaurantOrderId: restaurantOrder._id,
          broadcastedTo: freeRiders.map(r => r._id),
          status: "broadcasted",
        });

        restaurantOrder.assignedDeliveryRider = delivery_assignment.assignedTo;
        restaurantOrder.delivery_assignment = delivery_assignment._id;

        freeRidersPayload = freeRiders.map(r => ({ id: r._id, name: r.name, phone: r.phone }));
      }
    }

    // --- 4. SAVE AND RESPOND ---
    restaurantOrder.status = status;
    await order.save();

    await order.populate("restaurantOrders.restaurant", "name");
    await order.populate("restaurantOrders.assignedDeliveryRider", "name email phone");

    const updatedRestOrder = order.restaurantOrders.id(restaurantOrderId);

    return res.json({
      message: "Order status updated successfully",
      restaurantOrder: updatedRestOrder,
      freeRiders: freeRidersPayload,
      otpHash: newOtpHash, // Rider MUST store this in state to verify later
    });

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/*================Get the order_assignment for rider to accept ===============*/
export const getDeliveryRiderAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadcasted",
    })
      .populate("order")
      .populate("restaurant");

    const formated = assignments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      restName: a.restaurant.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.restaurantOrders.find((so) =>
          so._id.equals(a.restaurantOrderId),
        )?.restaurantOrderItems || [],
      subTotal: a.order.restaurantOrders.find((so) =>
        so._id.equals(a.restaurantOrderId),
      )?.subTotal,
    }));

    return res.status(200).json(formated);
  } catch (error) {
    console.error("get delivery assignment ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==================== Accepting order func for rider ====================
export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.body;

    const assignment = await DeliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(201).json({ message: " assignment not founded" });
    }

    if (assignment.status != "broadcasted") {
      return res.status(201).json({ message: " assignment is expired" });
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        message:
          "this assignment is already assigned to another delivery rider , try another accepting",
      });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.assignedRider = req.userID
    assignment.acceptedAt = new Date();

    await assignment.save();

    const acceptedOrder = await Order.findById(assignment.order);
    if (!acceptedOrder) {
      return res.status(400).json({ message: "order not founded" });
    }

    // FIX: Use .toString() or Mongoose's .id() method for subdocuments
    const restaurantOrder = acceptedOrder.restaurantOrders.find(
      (re) => re._id.toString() === assignment.restaurantOrderId.toString(),
    );

    restaurantOrder.assignedDeliveryRider = req.userId;
    restaurantOrder.assignment = assignmentId;

    await acceptedOrder.save();

    return res.status(200).json({ message: "order accepted by you rider" });
  } catch (error) {
    console.error("accepting order assignment ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getRiderCurrentOrder = async (req, res) => {
  try {
    // finding currentOrder of rider that accepted it
    const currentOrder = await Order.findOne({
      "restaurantOrders.assignedDeliveryRider": req.userId,
      "restaurantOrders.status": "out of delivery"
    })
    .populate("user", "name phone email")
    .populate("restaurantOrders.restaurant", "name location address")
    .populate("restaurantOrders.assignedDeliveryRider", "name phone");

    if (!currentOrder) {
      return res.status(200).json({ 
        message: "No active delivery at the moment", 
        order: null 
      });
    }

    const mySubOrder = currentOrder.restaurantOrders.find(
      (ro) => String(ro.assignedDeliveryRider?._id) === String(req.userId) && 
              ro.status === "out of delivery"
    );

    // IMP : Integrated location logic using available variables
    let deliveryBoyLocation = { lat: null, lon: null };

    // Assumption: The rider's location is stored on the User model in the DB
    // We assume req.user is populated from your auth middleware
    if (req.user && req.user.location?.coordinates.length === 2) { 
        // GeoJSON format is [Longitude, Latitude]
        deliveryBoyLocation.lat = req.user.location.coordinates[1]; 
        deliveryBoyLocation.lon = req.user.location.coordinates[0];
    }
    
    let customerLocation = { lat: null, lon: null };
    // The delivery address is on the main currentOrder object
    if (currentOrder.deliveryAddress) {
        customerLocation.lat = currentOrder.deliveryAddress.latitude;
        customerLocation.lon = currentOrder.deliveryAddress.longitude;
    }
    // FIX END

    return res.status(200).json({
      orderId: currentOrder._id,
      customer: currentOrder.user,
      deliveryAddress: currentOrder.deliveryAddress,
      restaurantOrder: mySubOrder,
      // Add the new location objects to the response payload
      deliveryBoyLocation,
      customerLocation
    });

  } catch (error) {
    console.error("GET RIDER ORDER ERROR:", error);
    res.status(500).json({ message: "Server error fetching active order" });
  }
};
