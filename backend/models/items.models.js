import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
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

    description: {
      type: String,
    },

    // 🔹 RELATION
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    // 🔹 CATEGORY
    category: {
      type: String,
      enum: [
        "Snacks",
        "Main Course",
        "Pizza",
        "Burgers",
        "Desserts",
        "Chinese",
        "Beverages",
        "Salads",
        "Sandwiches",
        "Pasta",
        "Vegan",
        "Seafood",
        "Sides",
        "Others",
      ],
      required: true,
    },

    // 🔹 PRICE
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🔹 FOOD TYPE
    isVeg: {
      type: Boolean,
      default: false,
    },


    // ✅ ADD: discount support (future-proof)
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;