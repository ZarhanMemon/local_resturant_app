import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6, // corrected
    },

    phone: {
      type: String,
      required: true,
      maxlength: 10, // corrected
    },

    role: {
      type: String,
      enum: ["Customer", "Rider", "Admin"],
      default: "Customer",
      required: true,
    },

    resetOTP:String,
    resetOTPexpiry:Date,

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
