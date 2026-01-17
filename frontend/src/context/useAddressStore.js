import { create } from "zustand";

export const useAddressStore = create((set) => ({
  location: {
    lat: null,
    lng: null,
  },
  address: null,

  setLocation: (lat, lng) =>
    set({
      location: { lat, lng },
    }),

  setAddress: (address) =>
    set({ address }),
}));
