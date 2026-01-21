import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";

export const useOrderStore = create((set,get) => ({
  orders: [],
  loading: false,
  error: null,

  /* ---------------- PLACE ORDER ---------------- */
  placeOrder: async ({
    cartItems,
    totalAmount,
    paymentMethod,
    address,
    location,
  }) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.post(
        `/order/place-order`,
        {
          cartItems: cartItems.map((item) => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            restaurant: item.restaurant,
          })),
          totalAmount,
          paymentMethod,
          deliveryAddress: {
            address: address,
            latitude: location?.lat,
            longitude: location?.lng,
          },
        },
        { withCredentials: true },
      );

      set((state) => ({
        orders: [res.data, ...state.orders],
        loading: false,
      }));

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Order failed",
        loading: false,
      });
      throw err;
    }
  },

  /* ---------------- GET MY ORDERS ---------------- */
  fetchMyOrders: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(`/order/my-orders`, {
        withCredentials: true,
      });

      set({ orders: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch orders",
        loading: false,
      });
      throw err;
    }
  },

  updateOrderStatus: async (orderId, restaurantOrderId, status) => {
    await axiosInstance.put("order/update-status", {
      orderId,
      restaurantOrderId,
      status,
    });

    get().fetchMyOrders(); // refresh list
  },

  /* ---------------- CLEAR ORDERS (LOGOUT) ---------------- */
  clearOrders: () => set({ orders: [] }),
}));

// Cart → Checkout
//       ↓
// placeOrder() → order.controller.js
//       ↓
// MongoDB
//       ↓
// OrderDone.jsx
//       ↓
// MyOrders.jsx
