import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useMyRestStore = create((set) => ({
  myRestData: null,

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
      const res = await axiosInstance.post("/restuarant/create-edit", formData);

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

  createItem: async (formData) => {
    try {
      const res = await axiosInstance.post("/items/add-item", formData);

      return res.data;
    } catch (error) {
      console.error(
        "create/edit item error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  editItems: async (itemId, formData) => {
    try {
      const res = await axiosInstance.put(
        `/items/edit-item/${itemId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      set((state) => ({
        myRestData: {
          ...state.myRestData,
          items: state.myRestData.items.map((it) =>
            it._id === itemId ? res.data : it
          ),
        },
      }));
      return res.data;
    } catch (error) {
      console.error("myRest items error:", error);
      return null;
    }
  },

  deleteItem: async (itemId) => {
    try {
      await axiosInstance.delete(`/items/delete-item/${itemId}`);

      set((state) => ({
        myRestData: {
          ...state.myRestData,
          items: state.myRestData.items.filter((it) => it._id !== itemId),
        },
      }));

      console.log("Item deleted successfully");
    } catch (error) {
      console.error("delete item error:", error);
    }
  },
}));
