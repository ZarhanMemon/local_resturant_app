import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useCustomerStore = create((set) => ({
 
  allRest:[],
  allItems:[],

  restByName:[],
  restByCity:[],

  itemsByCategory:[],
  itemsByName:[],

  

 
  getAllRestaurants: async () => {
    try {
      const res = await axiosInstance.get("/restuarant/get-all");
      set({
        allRest: res.data,
      });
    } catch (error) {
      console.error("allRest data error:", error);
    }
  },

  getAllItems: async () => {
    try {
      const res = await axiosInstance.get("/items/all-items");
      set({
        allItems: res.data,
      });
    } catch (error) {
      console.error("allItems data error:", error);
    }
  },

  getRestaurantByCity: async (city) => {
    try {
      const res = await axiosInstance.get(`/restuarant/get-rest-by-city/${city}`);
      set({
        restByCity: res.data,
      });
    } catch (error) {
      console.error("allRest data error:", error);
    }
  },

  getRestaurantByName: async (name) => {
    try {
      const res = await axiosInstance.get(`/restuarant/get-rest/${name}`);
      set({
        restByName: [res.data],
      });
    } catch (error) {
      console.error("allRest data error:", error);
    }
  },

  getItemsByCategory: async (category) => {
    try {
      const res = await axiosInstance.get(`/items/all-items/${category}`);
      set({
        itemsByCategory: res.data,
      });
    } catch (error) {
      console.error("itemsByCategory data error:", error);
    }
  },
  getItemsByName: async (name) => {
    try {
      const res = await axiosInstance.get(`/items/all-items/${name}`);
      set({
        itemsByName: res.data,
      });
    } catch (error) {
      console.error("itemsByName data error:", error);
    }
  },
}));
