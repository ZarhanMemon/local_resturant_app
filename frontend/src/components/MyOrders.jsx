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
    fetchMyOrders,
    updateOrderStatus,
  } = useOrderStore();

  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const isCustomer = authUser?.role === "Customer";
  const isOwner = authUser?.role === "Admin" || authUser?.role === "Owner";

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleStatusChange = async (orderId, restOrderId, status) => {
    setUpdatingOrderId(restOrderId);
    await updateOrderStatus(orderId, restOrderId, status);
    setUpdatingOrderId(null);
  };

  if (!orders || orders.length === 0) {
    return <div className="pt-24 text-center">No orders found</div>;
  }

  return (
    <div className="min-h-screen bg-[#fff9f6] pt-20 px-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate("/")}>
          <ArrowLeft className="text-orange-500" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold">
          My Orders
        </h1>
      </div>

      {/* ================= CUSTOMER VIEW ================= */}
      {isCustomer &&
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow mb-6 p-4"
          >
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                <p className="font-semibold text-black">
                  Order #{order._id.slice(-6)}
                </p>
                <p>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="uppercase">{order.paymentMethod}</p>
                <p className="text-blue-500">{order.status}</p>
              </div>
            </div>

            <hr className="my-3" />

            {order.restaurantOrders.map((restOrder) => (
              <div key={restOrder._id} className="mb-4">
                <h3 className="font-semibold mb-2">
                  {restOrder.restaurant?.name}
                </h3>

                <div className="flex gap-3 overflow-x-auto">
                  {restOrder.restaurantOrderItems.map((item) => (
                    <div
                      key={item._id}
                      className="border rounded-lg p-2 min-w-[120px]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <p className="text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-2 text-sm">
                  <span>Subtotal: ₹{restOrder.subTotal}</span>
                  <span className="text-blue-500">
                    {restOrder.status}
                  </span>
                </div>

                <hr className="mt-3" />
              </div>
            ))}

            <div className="flex justify-between items-center">
              <p className="font-bold">₹{order.totalAmount}</p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">
                Track Order
              </button>
            </div>
          </div>
        ))}

      {/* ================= OWNER VIEW ================= */}
      {isOwner &&
        orders.map((order) =>
          order.restaurantOrders.map((restOrder) => (
            <div
              key={restOrder._id}
              className="bg-white rounded-xl shadow mb-6 p-4"
            >
              {/* Customer Info */}
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-semibold">
                    {order.user?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.user?.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.deliveryAddress?.address}
                  </p>
                </div>

                <span className="text-blue-400 text-sm">
                  {restOrder.status}
                </span>
              </div>

              <hr className="my-3" />

              {/* Items */}
              <div className="flex gap-3 overflow-x-auto">
                {restOrder.restaurantOrderItems.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-lg p-2 min-w-[120px]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-20 object-cover rounded-md"
                    />
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-3" />

              {/* Footer */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Status:</span>
                    <select
                      value={restOrder.status}
                      disabled={updatingOrderId === restOrder._id}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          restOrder._id,
                          e.target.value
                        )
                      }
                      className="border rounded px-2 py-1 text-sm text-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="out of delivery">
                        Out of delivery
                      </option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <p className="font-semibold">
                    ₹{restOrder.subTotal}
                  </p>
                </div>

                {/* ================= FREE RIDERS UI ================= */}
                {restOrder.status === "out of delivery" &&
                  freeRiders?.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold mb-3">
                        🛵 Available Riders
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {freeRiders.map((rider) => (
                          <div
                            key={rider.id}
                            className="flex justify-between items-center bg-orange-50 border border-orange-200 rounded-lg p-3"
                          >
                            <div>
                              <p className="font-medium">
                                {rider.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                📞 {rider.phone}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                ✉️ {rider.email}
                              </p>
                            </div>

                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Free
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )),
        )}
    </div>
  );
}

export default MyOrders;
