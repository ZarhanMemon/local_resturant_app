import User from "../models/users.models.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // 1. Check  fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password atleast 6 characters" });
    }
    if (phone.length != 10) {
      return res.status(400).json({ message: "Phone_no not have 10 digit" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "Customer",
    });

    // 5. Generate JWT token and set cookie
    generateToken(newUser._id, res);

    // 6. Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sign Up -> Server Error", error: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    // 1. take the eamil , password from login page
    const { email, password } = req.body;

    // 2. find the account from the email ; if existed -> check that password matches or not
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credential" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // 3. Save the user db again for security
    await user.save();

    // 4. Generate JWT token and set cookie ;for further accessings
    generateToken(user._id, res);

    // 5. Response
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: "Sign IN -> Server Error", error: error.message });
  }
};

export const signoutUser = async (req, res) => {
  try {
    // 1. Delete the jwt token , from which user was in app
    res.clearCookie("jwt");

    // 2. Response If no token , user logged out found
    return res.status(200).json({ message: "Sign out successfully." });

  } catch (error) {
    res.status(500).json({ message: "Sign out -> Server Error", error: error.message });
  }
};


// ===============================
// Auth Check Controller
// ===============================
export const authCheck = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        return res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in authCheck controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};