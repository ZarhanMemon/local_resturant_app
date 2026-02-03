import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";

export const useOrderStore = create((set) => ({
  orders: [],

  freeRiders: [],

  assignment: [],
  currentOrder: null,

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
            address,
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

  /* ---------------- UPDATE ORDER STATUS ---------------- */
  updateOrderStatus: async (orderId, restaurantOrderId, status, otp , otpHash=null) => {
    try {
      const payload = { status };
      if (otp) payload.otp = otp; // Only add OTP if it exists

      const res = await axiosInstance.put(
        "/order/update-status",
        { orderId, restaurantOrderId, status, otp , otpHash  },
        { withCredentials: true },
      );

      const { restaurantOrder, freeRiders } = res.data;

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                restaurantOrders: order.restaurantOrders.map((ro) =>
                  ro._id === restaurantOrder._id ? restaurantOrder : ro,
                ),
              }
            : order,
        ),
        freeRiders: freeRiders || [],
        loading: false,
      }));

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update order status",
        loading: true,
      });
    }
  },

  getDeliveryRiderAssignment: async () => {
    try {
      const res = await axiosInstance.get("/order/get-assignment", {
        withCredentials: true,
      });

      set({ assignment: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch orders",
        loading: false,
      });
      throw err;
    }
  },

  acceptAssignment: async (assignmentId) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.post(
        `/order/accept-order/${assignmentId}`,
        { assignmentId },
        { withCredentials: true },
      );
      set({
        loading: false,
      });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Order failed",
        loading: false,
      });
      throw err;
    }
  },

  getRiderCurrentOrder: async () => {
    set({ loading: true });
    try {
      // Direct call to your new controller endpoint
      const res = await axiosInstance.get("/order/riders-order", {
        withCredentials: true,
      });

      // Update state with the specific restaurantOrder and customer data
      set({ currentOrder: res.data.restaurantOrder ? res.data : null });
    } catch (error) {
      console.error("Error fetching rider order:", error);
      // Don't toast 404s/nulls if it's just "no active order"
      if (error.response?.status !== 200) {
        console.log(
          error.response?.data?.message || "Failed to load current order",
        );
      }
      set({ currentOrder: null });
    } finally {
      set({ loading: false });
    }
  },
  /* ---------------- CLEAR ORDERS (LOGOUT) ---------------- */
  clearOrders: () => set({ orders: [] }),
}));
