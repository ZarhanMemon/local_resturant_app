import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrderStore } from "../context/useOrderStore";

function MyOrders() {
  const { orders, fetchMyOrders, loading } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, []);

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

      {loading && <p className="text-center">Loading...</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-xl shadow mb-6 p-4"
        >
          {/* Order Header */}
          <div className="flex justify-between text-sm text-gray-600">
            <div>
              <p className="font-semibold text-black">
                Order #{order._id.slice(-6)}
              </p>
              <p>
                Date:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <p className="uppercase">{order.paymentMethod}</p>
              <p className="text-blue-500">pending</p>
            </div>
          </div>

          <hr className="my-3" />

          {/* Restaurant Orders */}
          {order.restaurantOrders.map((restOrder) => (
            <div key={restOrder._id} className="mb-4">
              {/* Restaurant Name */}
              <h3 className="font-semibold mb-2">
                {restOrder.name}
              </h3>

              {/* Items */}
              <div className="flex gap-3 overflow-x-auto">
                {restOrder.restaurantOrderItems.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-lg p-2 min-w-[120px] max-w-[120px]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-20 object-cover rounded-md mb-1"
                    />

                    <p className="text-sm font-medium truncate">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="flex justify-between mt-2 text-sm">
                <span className="font-medium">
                  Subtotal: ₹{restOrder.subTotal}
                </span>
                <span className="text-blue-500">pending</span>
              </div>

              <hr className="mt-3" />
            </div>
          ))}

          {/* Order Footer */}
          <div className="flex justify-between items-center mt-3">
            <p className="font-bold">
              Total: ₹{order.totalAmount}
            </p>

            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">
              Track Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
