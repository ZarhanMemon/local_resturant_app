import mongoose from "mongoose";

// Schema for items within a restaurant order - Cart items
const restaurantOrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    quantity: Number,
    price: Number,
    name: String,
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Schema for each restaurant's order within a customer's order - Multiple restaurants in one order
const restaurantOrderSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
    },

    subTotal: {
      // subtotal for this restaurant's order items
      type: Number,
      required: true,
    },

    restaurantOrderItems: [restaurantOrderItemSchema],

    status:{
      type:String,
      enum:["pending" , "preparing" ,"delivered","out of delivery"],
      default:"pending"
    },

    assignment:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"DeliveryAssignment",
      default:null
    },

    assignedDeliveryRider :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
      }
    
    
  },
  { timestamps: true },
);

// Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },

    deliveryAddress: {
      address: String,
      latitude: Number,
      longitude: Number,
    },

    totalAmount: {
      // total amount for the entire order = subtotals of all restaurant orders + delivery charges
      type: Number,
      required: true,
    },

    restaurantOrders: [restaurantOrderSchema],
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
