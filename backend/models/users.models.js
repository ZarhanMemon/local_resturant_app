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
      minlength: 6, // optional for OAuth users
    },

    phone: {
      type: String,
      maxlength: 10, // corrected - optional for Google auth
    },

    role: {
      type: String,
      enum: ["Customer", "Rider", "Admin"],
      default: "Customer",
      required: true,
    },

    resetOTP: String,
    resetOTPexpiry: Date,

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    //for tracking the Rider user
    location:{
      type:{
        type:String , 
        enum:['Point'],
        default:'Point'
      },
      coordinates:{ 
        type:[Number] , // [lon , lat]
        default:[0,0] 
      }
    }
  },
  {
    timestamps: true,
  }
);

userSchema.index({location:'2dsphere'})

const User = mongoose.model("User", userSchema);
export default User;
