import React, { useEffect, useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { useCustomerStore } from "../context/useCustomerStore";
import { useAddressStore } from "../context/useAddressStore";
import { useOrderStore } from "../context/useOrderStore.js";

import { getUserLocation } from "../libs/getUserLocation.js";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";


import axios from "axios";
const GEO_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;


// 🔁 lat,lng → address
const getAddressByLatLon = async (lat, lon) => {
  const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEO_KEY}`);

  return res.data.features?.[0]?.properties?.formatted;
};

// 🔁 address → lat,lng
const getLatLonByAddress = async (address) => {
  const res = await axios.get(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEO_KEY}`
  );

  const loc = res.data.features?.[0]?.properties;
  if (!loc) return null;

  return { lat: loc.lat, lng: loc.lon };
};


/* ---------------- MAP CENTER HANDLER ---------------- */
function MapUpdater({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.setView([location.lat, location.lng], 16, { animate: true });
    }
  }, [location, map]);

  return null;
}

function CheckOut() {
  const navigate = useNavigate();

  const { cartItems, getTotalAmount, removeFromCart } = useCustomerStore();
  const { location, address, setLocation, setAddress } = useAddressStore();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const subtotal = getTotalAmount();
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;


  /* INITIAL GPS LOCATION */
  const fetchCurrentLocation = async () => {
    try {
      const data = await getUserLocation();
      setLocation(data.latitude, data.longitude);
      setAddress(data.address.address);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);


  /* ADDRESS SEARCH */
  const handleSearchAddress = async () => {
    if (!address) return;

    const coords = await getLatLonByAddress(address);
    if (!coords) return;

    setLocation(coords.lat, coords.lng);
  };

  /* MARKER DRAG */
  const onMarkerDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    setLocation(lat, lng);

    const addr = await getAddressByLatLon(lat, lng);
    if (addr) setAddress(addr);
  };


  const { placeOrder } = useOrderStore();

  const handlePlaceOrder = async () => {
     if (!cartItems.length) return alert("Cart is empty");

  const order = await placeOrder({
    cartItems,
    paymentMethod,
    address,
    location,
    totalAmount: total,
  });

  removeFromCart();
  navigate("/order-done", { state: { order } });
  };

  return (
    <div className="w-screen min-h-screen bg-[#fff9f6] pt-[90px]">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-orange-500"
      >
        <ArrowLeft size={22} />
      </button>

      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Checkout</h1>

        {/* DELIVERY LOCATION */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Delivery Location
          </h2>

          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
            <MapPin className="text-red-500" size={18} />

            <input
              type="text"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter delivery address"
              className="flex-1 outline-none text-sm"
            />

            <button
              onClick={handleSearchAddress}
              className="bg-[#ff4d2d] text-white px-3 py-2 rounded-lg"
            >
              <IoSearchOutline />
            </button>

            <button
              onClick={fetchCurrentLocation}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg"
            >
              <TbCurrentLocation />
            </button>
          </div>

          {/* MAP */}
          <div className="mt-3 h-48 rounded-lg overflow-hidden border">
            {location?.lat && location?.lng ? (
              <MapContainer
                className="w-full h-full"
                center={[location.lat, location.lng]}
                zoom={16}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater location={location} />

                <Marker
                  position={[location.lat, location.lng]}
                  draggable
                  eventHandlers={{ dragend: onMarkerDragEnd }}
                >
                  <Popup>Delivery Location</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Fetching location...
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Payment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`border rounded-lg p-4 text-left transition
              ${paymentMethod === "cod"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
                }`}
            >
              <p className="font-semibold text-sm">Cash on Delivery</p>
              <p className="text-xs text-gray-500">
                Pay when your food arrives
              </p>
            </button>

            <button
              onClick={() => setPaymentMethod("online")}
              className={`border rounded-lg p-4 text-left transition
              ${paymentMethod === "online"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
                }`}
            >
              <p className="font-semibold text-sm">
                UPI / Credit / Debit Card
              </p>
              <p className="text-xs text-gray-500">
                Pay securely online
              </p>
            </button>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-gray-50 p-4 rounded-lg">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-2" />

          <div className="flex justify-between font-medium text-gray-800">
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>

          <div className="flex justify-between   text-gray-700">
            <span>Delivery Fees</span>
            <span>{deliveryFee == 0 ? "Free" : deliveryFee}</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
            <span>Total</span>
            <span className="font-bold text-red-600">₹{total}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600">
          Place Order
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
