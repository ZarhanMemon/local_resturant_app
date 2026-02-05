import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useCustomerStore = create((set,get) => ({
  allItems: [],

  restByName: [], // not use
  restByCity: [],

  searchItems: [],
  searchActive: false,
  searchQuery: "",

  // unified items array used by UI for all fetch types (all / category / restaurant / search)
  items: [],

 

  cartItems: [],

  // ➕ ADD TO CART (or increase if already exists)
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        return {
          cartItems: state.cartItems.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        };
      }

      return {
        cartItems: [...state.cartItems, { ...item, quantity: 1 }],
      };
    });
  },

  // ➕ INCREASE QTY
  increaseQty: (itemId) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  },

  // ➖ DECREASE QTY (auto remove if qty = 1)
  decreaseQty: (itemId) => {
    set((state) => {
      const item = state.cartItems.find((i) => i._id === itemId);

      if (!item) return state;

      if (item.quantity === 1) {
        return {
          cartItems: state.cartItems.filter((i) => i._id !== itemId),
        };
      }

      return {
        cartItems: state.cartItems.map((i) =>
          i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  },

  // ❌ REMOVE ITEM COMPLETELY
  removeFromCart: (itemId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item._id !== itemId),
    }));
  },

  //delete cART AFTER WE place the order
  deleteCartItems: ()=>{
    set({cartItems:[]})
  },

  // 🧾 GET TOTAL AMOUNT
  getTotalAmount: () => {
    const cartItems = get().cartItems;
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },

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
        items: res.data,
      });
    } catch (error) {
      console.error("allItems data error:", error);
    }
  },

  // restore items from cache (allItems) or fetch if cache empty
  clearItems: async () => {
    const state = get();
    if (!state.allItems || state.allItems.length === 0) {
      await state.getAllItems();
    } else {
      // restore items and clear any active search metadata so UI hides search results
      set({ items: state.allItems, searchActive: false, searchItems: [], searchQuery: "" });
    }
  },

  getRestaurantByCity: async (city) => {
    try {
      const res = await axiosInstance.get(
        `/restuarant/get-rest-by-city/${city}`
      );
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
      const res = await axiosInstance.get(`/items/category/${category}`);
      set({ items: res.data });
    } catch (error) {
      console.error("getItemsByCategory error:", error);
    }
  },

  getItemsByRestName: async (res_name) => {
    try {
      const res = await axiosInstance.get(`/items/restaurant/${res_name}`);
      set({ items: res.data });
    } catch (error) {
      console.error("getItemsByRestName error:", error);
    }
  },

  getItemByName: async (name) => {
    try {
      const res = await axiosInstance.get(`/items/search/${name}?query=${name}&city=${get().location}`); // get.location from getUserLocation.js zustand for city filter
      set({ searchItems: res.data, searchActive: true, searchQuery: name });
    } catch (error) {
      console.error("getItemByName error:", error);
    }
  },

}));
