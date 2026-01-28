import mongoose from "mongoose";


const deliveryAssignmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    restaurantOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null,
    },

    //brodcasting list mean availabe rider list
    broadcastedTo:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    //final accepted rider
    assignedRider:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      default:null
    },

    status: {
      type: String,
      enum: ["broadcasted", "assigned", "completed"],
      default: "broadcasted",
    },

    acceptedAt: {
      type: Date,
      default: null, // ✅ FIX
    },
  },
  { timestamps: true }
);

const DeliveryAssignment = mongoose.model(
  "DeliveryAssignment",
  deliveryAssignmentSchema
);

export default DeliveryAssignment;

// Delivery assignment logic

// Owner → Accept Order
//   ↓
// Create DeliveryAssignment
//   ↓
// Broadcast to Riders (nearby)
//   ↓
// Rider Accepts
//   ↓
// Assign rider + acceptedAt
