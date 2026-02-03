import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrderStore } from "../context/useOrderStore.js";
import { useAuthStore } from "../context/useAuthStore.js";
import DeliveryBoyTracking from "./DeliveryBoyTracking.jsx";

function MyOrders() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    orders,
    freeRiders,
    currentOrder,
    fetchMyOrders,
    updateOrderStatus,
    getRiderCurrentOrder
  } = useOrderStore();

  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [freeRider, setFreeRiders] = useState(freeRiders);

  useEffect(() => {
    setFreeRiders(freeRiders);
  }, [freeRiders]);

  const isCustomer = authUser?.role === "Customer";
  const isOwner = authUser?.role === "Admin" || authUser?.role === "Owner";
  const isRider = authUser?.role === "Rider";


  // if delivery is completed for verification
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState("");
  const [activeOtpHash, setActiveOtpHash] = useState(null);


  useEffect(() => {
    if (isRider) {
      getRiderCurrentOrder(); // Fetches the specific active order for the rider
    } else {
      fetchMyOrders(); // Fetches history for Customer/Owner
    }
  }, [orders, currentOrder]);


  const handleStatusChange = async (orderId, restOrderId, status, otp = null) => {
    setUpdatingOrderId(restOrderId);

    try {
      // Pass the otp AND the currently stored activeOtpHash
      const response = await updateOrderStatus(orderId, restOrderId, status, otp, activeOtpHash);

      // If the server sends back a new otpHash (happens when status becomes "out of delivery")
      // we store it so the rider can use it later to verify the delivery.
      if (response?.otpHash) {
        setActiveOtpHash(response.otpHash);
      }

      // Reset UI on success
      setUpdatingOrderId(null);
      setShowOtpInput(false);
      setDeliveryOtp("");
    } catch (error) {
      console.error("Failed to update status:", error);
      setUpdatingOrderId(null);
    }
  };




  if (!isRider && (!orders || orders.length === 0)) {
    return (
      <div className="pt-24 text-center">
        <div className="flex items-center mb-6 px-4">
          <button onClick={() => navigate("/")}><ArrowLeft className="text-orange-500" /></button>
          <h1 className="flex-1 text-center text-lg font-semibold">My Orders</h1>
        </div>
        No order available
      </div>
    );
  }





  return (
    <div className="min-h-screen bg-[#fff9f6] pt-20 px-4 pb-10">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate("/")}><ArrowLeft className="text-orange-500" /></button>
        <h1 className="flex-1 text-center text-lg font-semibold">My Orders</h1>
      </div>

      {/* ================= CUSTOMER VIEW ================= */}
      {isCustomer && orders.map((order) => (
        <div key={order._id} className="bg-white rounded-xl shadow-lg mb-6 p-4">

          {/* Header: Order ID, Date, Payment Method */}
          <div className="flex justify-between text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900">Order #{order._id.slice(-6)}</p>
              <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="uppercase font-medium">{order.paymentMethod}</p>
            </div>
          </div>

          <hr className="my-3" />

          {/* Restaurant Orders (Inner Loop) */}
          {order.restaurantOrders.map((restOrder) => (
            <div key={restOrder._id} className="mb-4 pb-4 border-b border-gray-100 last:mb-0 last:pb-0 last:border-b-0">
              <h3 className="font-bold mb-2 text-gray-800">{restOrder.restaurant?.name}</h3>

              {/* Items List (Horizontal Scroll) */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {restOrder.restaurantOrderItems.map((item) => (
                  <div key={item._id} className="border rounded-lg p-2 min-w-[120px] bg-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded-md" />
                    <p className="text-sm truncate mt-1 font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty {item.quantity} × ₹{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Subtotal & Status Line */}
              <div className="flex justify-between mt-3 text-sm items-center">
                <span className="text-gray-500 font-medium">Subtotal: ₹{restOrder.subTotal}</span>
                <span className="text-orange-500 font-semibold capitalize">{restOrder.status}</span>
              </div>

              {/* Track Order Button for this specific sub-order */}
              {restOrder.status !== "delivered" ? (
                <button
                  className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold w-full transition-colors active:scale-95"
                >
                  Track Order
                </button>
              ) : null }
            </div>
          ))}

          {/* Final Total Amount Footer */}
          <div className="flex justify-between items-center mt-4">
            <p className="font-bold text-xl">₹{order.totalAmount}</p>
          </div>
        </div>
      ))}


      {/* ================= OWNER VIEW ================= */}
      {isOwner && orders.map((order) =>
        order.restaurantOrders.map((restOrder) => (
          <div key={restOrder._id} className="bg-white rounded-xl shadow mb-6 p-4">
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{order.user?.name}</p>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
                <p className="text-xs text-gray-400">{order.deliveryAddress?.address}</p>
              </div>
              <span className="text-blue-400 text-sm font-medium">{restOrder.status}</span>
            </div>
            <hr className="my-3" />
            <div className="flex gap-3 overflow-x-auto pb-2">
              {restOrder.restaurantOrderItems.map((item) => (
                <div key={item._id} className="border rounded-lg p-2 min-w-[120px]">
                  <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded-md" />
                  <p className="text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty {item.quantity} × ₹{item.price}</p>
                </div>
              ))}
            </div>
            <hr className="my-3" />
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <select
                  value={restOrder.status}
                  disabled={updatingOrderId === restOrder._id}
                  onChange={(e) => handleStatusChange(order._id, restOrder._id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm text-orange-500"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="out of delivery">Out of delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <p className="font-semibold">₹{restOrder.subTotal}</p>
            </div>

            {/* Rider Info logic for Owner */}
            <div className="border-t pt-4">
              {restOrder.assignedDeliveryRider ? (
                <div className={`p-3 rounded-lg border ${restOrder.status === 'delivered' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                  <p className="text-xs font-bold text-gray-500 uppercase">Assigned Rider</p>
                  <p className="font-semibold">{restOrder.assignedDeliveryRider.name}</p>
                  <p className="text-xs text-gray-500">📞 {restOrder.assignedDeliveryRider.phone}</p>
                </div>
              ) : restOrder.status === "out of delivery" && (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                  <p className="text-xs font-bold text-orange-700">Waiting for Rider...</p>
                  {freeRider?.length === 0 && <p className="text-[10px] text-red-500 mt-1">All riders currently busy.</p>}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* ================= RIDER VIEW (Active Task) ================= */}
      {isRider && (
        <div className="max-w-xl mx-auto pb-10">
          {currentOrder ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mx-2 sm:mx-0">
              <div className="bg-orange-500 p-4 text-white flex justify-between items-center">
                <span className="font-bold text-xs tracking-widest uppercase">🚨 Active Task</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white">#{currentOrder.orderId?.slice(-6)}</span>
              </div>

              <div className="p-5">
                {/* Customer Detail Section */}
                <div className="flex justify-between items-center mb-5">
                  <div className="flex-1 pr-4">
                    <p className="text-[10px] text-gray-400 uppercase font-black">Deliver To</p>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                      {currentOrder.customer?.name}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium leading-tight mt-1">
                      📍 {currentOrder.deliveryAddress?.address}
                    </p>
                  </div>
                  <a
                    href={`tel:${currentOrder.customer?.phone}`}
                    className="bg-green-500 w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg shadow-green-100 active:scale-90 transition-transform"
                  >
                    <span className="text-white text-xl">📞</span>
                  </a>
                </div>

                {/* Map */}
                <div className="mb-6">
                  <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border-4 border-gray-50 shadow-inner z-10">
                    <DeliveryBoyTracking data={currentOrder} />
                  </div>
                </div>

                {/* Order Content  */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-3">Order Items</p>

                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">

                    <p className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded inline-block mb-1">
                      {currentOrder.restaurantOrder?.name}
                    </p>

                    {currentOrder.restaurantOrder?.restaurantOrderItems?.map((item) => (
                      <div key={item._id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {/* Quantity Box */}
                          <span className="flex items-center justify-center bg-white border border-orange-200 text-orange-600 text-xs font-bold w-6 h-6 rounded-md shadow-sm">
                            {item.quantity}
                          </span>

                          {/* Item Details */}
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-700">{item.name}</span>
                            <span className="text-[10px] text-gray-400">₹{item.price} per unit</span>
                          </div>
                        </div>

                        {/* Item Total */}
                        <span className="text-sm font-semibold text-gray-500">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">Total Payout</span>
                    <span className="text-xl font-black text-orange-600 tracking-tighter">₹{currentOrder.restaurantOrder?.subTotal}</span>
                  </div>
                </div>

                {/*  Action Area */}
                <div className="mt-6">
                  {!showOtpInput ? (
                    /* Step 1: Initial "Complete" Button */
                    <button
                      onClick={() => setShowOtpInput(true)}
                      className="w-full bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      COMPLETE DELIVERY
                    </button>
                  ) : (
                    /* Step 2: OTP Input Field after clicking */
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
                        <label className="text-[10px] text-orange-600 font-black uppercase mb-2 block text-center">
                          Enter Customer OTP to Confirm
                        </label>
                        <input
                          type="text"
                          maxLength="6"
                          value={deliveryOtp}
                          onChange={(e) => setDeliveryOtp(e.target.value.replace(/\D/g, ""))} // Only numbers
                          placeholder="· · · · · ·"
                          className="w-full text-center text-3xl font-black tracking-[1rem] bg-white border-2 border-orange-100 rounded-xl py-3 focus:border-orange-500 focus:outline-none placeholder-gray-300"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowOtpInput(false)}
                          className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-xl text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={deliveryOtp.length < 4} // adjust length as needed
                          onClick={() => handleStatusChange(currentOrder.orderId, currentOrder.restaurantOrder?._id, "delivered", deliveryOtp)}
                          className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg disabled:opacity-50"
                        >
                          VERIFY & DELIVER ✅
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">😴</p>
              <p className="font-bold">No active orders</p>
            </div>
          )}
        </div>
      )}





    </div>
  );
}

export default MyOrders;
