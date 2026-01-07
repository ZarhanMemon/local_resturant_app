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
}));
