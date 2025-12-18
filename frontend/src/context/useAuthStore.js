import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isOnline: false,
  isCheckingAuth: true,

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
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Signup failed");
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
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
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
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },
}));
