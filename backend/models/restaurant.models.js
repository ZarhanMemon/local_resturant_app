import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    // 🔹 BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    // 🔹 OWNER
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 🔹 LOCATION
    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    // // 🔹 STATUS
    // isOpen: {
    //   type: Boolean,
    //   default: true,
    // },

    // // 🔹 TIMING (OPTIONAL but useful)
    // openingTime: String, // "10:00 AM"
    // closingTime: String, // "11:00 PM"

    // // 🔹 RATING (future-proof)
    // rating: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    //   max: 5,
    // },

    // totalRatings: {
    //   type: Number,
    //   default: 0,
    // },

    items : [{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Item"
    }]
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
