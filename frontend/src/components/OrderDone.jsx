import { CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderDone() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff9f6] px-4">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
        <CheckCircle size={60} className="text-green-500 mx-auto" />

        <h2 className="text-xl font-bold mt-4">
          Order Placed Successfully 🎉
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Order ID: {order._id}
        </p>

        {/* ORDER ITEMS */}
        <div className="bg-gray-50 rounded-lg p-4 mt-4 text-left space-y-3">
          {order.restaurantOrders.map((restOrder, index) => (
            <div key={restOrder._id}>
              <p className="font-semibold text-sm mb-1">
                Restaurant {index + 1}
              </p>

              {restOrder.restaurantOrderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm ml-2"
                >
                  <span>
                    Item × {item.quantity}
                  </span>
                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          ))}

          <hr />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-red-500">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/my-orders")}
          className="mt-6 w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}

export default OrderDone;
