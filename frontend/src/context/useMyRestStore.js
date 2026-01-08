import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useMyRestStore = create((set) => ({
  myRestData: null,
  myRestItems: [],

  getRestaurant: async (data) => {
    try {
      const res = await axiosInstance.get("/restuarant/get-my", data);
      set({
        myRestData: res.data,
      });
    } catch (error) {
      console.error("myRest data error:", error);
    }
  },

  createEditRest: async (formData) => {
    try {
      const res = await axiosInstance.post(
        "/restuarant/create-edit",
        formData );

      set({ myRestData: res.data.data });

      return res.data;
    } catch (error) {
      console.error(
        "create/edit rest error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
}));
