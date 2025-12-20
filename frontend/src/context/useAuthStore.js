import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isOnline: false,
  isCheckingAuth: true,
  isSendingOtp: false,
  isVerifyingOtp: false,
  isResettingPassword: false,

  // ====================
  // Password Reset Form State
  // ====================
  resetFormData: {
    email: "",
    otp: "",
    newPassword: "",
  },

  // ====================
  // Check auth status
  // ====================
  authCheck: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check", {
        withCredentials: true,
      });
      set({
        authUser: res.data,
        isOnline: true, // User is online if the check passes
      });
      
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ authUser: null, isOnline: false }); // User is offline if check fails
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ====================
  // Signup
  // ====================
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({
        authUser: res.data,
        isOnline: true, // User is online after signup
      });
      toast.success("Account created successfully");
      return true;

    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ====================
  // Login
  // ====================
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      set({
        authUser: res.data,
        isOnline: true, // User is online after login
      });
      toast.success("Logged in successfully");
      return true;

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
      return false;

    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ====================
  // Logout
  // ====================
  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({
        authUser: null,
        isOnline: false, // User is offline after logout
      });

      toast.success("Logged out successfully");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
      return false;
    }
  },

  // ====================
  // All logic func for reseting password - simple just calling backed api of it and change the indicater_var (isForgetPassword:true/false)
  // ====================
  forgotPassword: async (email) => {
    set({ isSendingOtp: true });

    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
      return false;
    } finally {
      set({ isSendingOtp: false });
    }
  },

  verifyOtp: async ({ email, otp }) => {
    set({ isVerifyingOtp: true });

    try {
      await axiosInstance.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified");
      return true; // important
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
      return false;
    } finally {
      set({ isVerifyingOtp: false });
    }
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    set({ isResettingPassword: true });

    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success("Password reset successful");
      // Clear form data after successful reset
      set({
        resetFormData: { email: "", otp: "", newPassword: "" },
      });
      return true;

    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed");
      return false;
    } finally {
      set({ isResettingPassword: false });
    }
  },

  // ====================
  // Update Reset Form Data
  // ====================
  setResetFormData: (data) => {
    set((state) => ({
      resetFormData: { ...state.resetFormData, ...data },
    }));
  },

  clearResetFormData: () => {
    set({
      resetFormData: { email: "", otp: "", newPassword: "" },
    });
  },
}));
