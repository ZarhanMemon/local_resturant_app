import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrderStore } from "../context/useOrderStore";
import { useAuthStore } from "../context/useAuthStore";

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

  useEffect(() => {
  if (isRider) {
    getRiderCurrentOrder(); // Fetches the specific active order for the rider
  } else {
    fetchMyOrders(); // Fetches history for Customer/Owner
  }
}, []);


  const handleStatusChange = async (orderId, restOrderId, status) => {
    setUpdatingOrderId(restOrderId);
    await updateOrderStatus(orderId, restOrderId, status);
    setUpdatingOrderId(null);
  };

  console.log(currentOrder)

  if (!isRider && (!orders || orders.length === 0 )) {
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
        <div key={order._id} className="bg-white rounded-xl shadow mb-6 p-4">
          <div className="flex justify-between text-sm text-gray-600">
            <div>
              <p className="font-semibold text-black">Order #{order._id.slice(-6)}</p>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="uppercase">{order.paymentMethod}</p>
              <p className="text-blue-500">{order.status}</p>
            </div>
          </div>
          <hr className="my-3" />
          {order.restaurantOrders.map((restOrder) => (
            <div key={restOrder._id} className="mb-4">
              <h3 className="font-semibold mb-2">{restOrder.restaurant?.name}</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {restOrder.restaurantOrderItems.map((item) => (
                  <div key={item._id} className="border rounded-lg p-2 min-w-[120px]">
                    <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded-md" />
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty {item.quantity} × ₹{item.price}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Subtotal: ₹{restOrder.subTotal}</span>
                <span className="text-blue-500">{restOrder.status}</span>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <p className="font-bold text-lg">₹{order.totalAmount}</p>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">Track Order</button>
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
  <div className="space-y-6">
    {currentOrder ? (
      <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-500 overflow-hidden">
        <div className="bg-orange-500 p-3 text-white text-center font-bold text-sm tracking-widest uppercase">
          🚨 Active Delivery Task
        </div>

        <div className="p-4">
          {/* Customer & Address */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Deliver To</p>
              <h2 className="text-lg font-bold text-gray-800 leading-tight">
                {currentOrder.customer?.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1 leading-snug">
                📍 {currentOrder.deliveryAddress?.address}
              </p>
            </div>
            <a 
              href={`tel:${currentOrder.customer?.phone}`} 
              className="bg-green-100 p-3 rounded-full text-green-600 shadow-sm active:scale-95 transition-transform"
            >
              📞
            </a>
          </div>

          {/* Restaurant Info */}
          <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Pick Up From</p>
            <p className="font-semibold text-gray-700">
              {currentOrder.restaurantOrder?.restaurant?.name}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a 
              href={`https://www.google.com{currentOrder.deliveryAddress?.latitude},${currentOrder.deliveryAddress?.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 text-white py-3.5 rounded-xl text-center text-sm font-bold shadow-md active:bg-blue-700"
            >
              Open Maps
            </a>
            
            <button
              disabled={updatingOrderId === currentOrder.restaurantOrder?._id}
              onClick={() => handleStatusChange(currentOrder.orderId, currentOrder.restaurantOrder?._id, "delivered")}
              className="bg-orange-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-md disabled:opacity-50 active:bg-orange-600"
            >
              {updatingOrderId === currentOrder.restaurantOrder?._id ? "Processing..." : "Complete Order"}
            </button>
          </div>
        </div>
      </div>
    ) : (
      /* EMPTY STATE FOR RIDER */
      <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
        <div className="text-5xl mb-4 animate-bounce">🛵</div>
        <h3 className="font-bold text-gray-800 text-lg">No Active Tasks</h3>
        <p className="text-xs text-gray-400 mt-2 max-w-[200px] mx-auto">
          New orders assigned to you will appear here automatically.
        </p>
        <button 
          onClick={() => getRiderCurrentOrder()} 
          className="mt-6 px-6 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100 active:scale-95 transition-all"
        >
          Refresh Status
        </button>
      </div>
    )}
  </div>
)}


    </div>
  );
}

export default MyOrders;
