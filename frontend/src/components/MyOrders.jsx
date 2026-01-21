import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrderStore } from "../context/useOrderStore";
import { useAuthStore } from "../context/useAuthStore";

function MyOrders() {

  const { authUser } = useAuthStore();
  const { orders, fetchMyOrders, updateOrderStatus} = useOrderStore();


  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const isCustomer = authUser?.role === "Customer";
  const isOwner = authUser?.role === "Admin" || authUser?.role === "Owner";

  if (orders.lenght == 0) {
    return (
      <div>
        No orders
      </div>
    )
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

      {isCustomer &&
        orders.map((order) => (
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
                <p className="text-blue-500">{order.status}</p>
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
        ))
      }

      {/* ================= OWNER ORDERS ================= */}
      {isOwner &&
        orders?.map((order) =>
          order.restaurantOrders.map((restOrder) => (
            <div
              key={restOrder._id}
              className="bg-white rounded-xl shadow mb-6 p-4"
            >
              {/* CUSTOMER DETAILS */}
              <div className="flex justify-between">

                <div className="mb-3">
                  <h2 className="font-semibold text-gray-800">
                    {order.user?.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {order.user?.email}
                  </p>

                  {order.user?.phone &&
                    <p className="text-sm text-gray-500">
                      📞 {order.user?.phone}
                    </p>
                  }

                  <p className="text-xs text-gray-400 mt-1">
                    {order.deliveryAddress?.address}
                  </p>
                </div>

                <span className="text-blue-300">{restOrder.status}</span>

              </div>



              <hr className="my-3" />

              {/* ITEMS */}
              <div className="flex gap-3 overflow-x-auto">
                {restOrder.restaurantOrderItems.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-lg p-2 min-w-[120px]"
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

              <hr className="my-3" />

              {/* FOOTER */}
              <div className="flex justify-between items-center">
                {/* STATUS */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>

                  <select
                    value={restOrder.status}
                    onChange={(e) =>
                      updateOrderStatus(
                        order._id,
                        restOrder._id,
                        e.target.value
                      )
                    }
                    className="border rounded-md px-2 py-1 text-sm text-orange-500"
                  >

                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="preparing">Preparing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* TOTAL */}
                <p className="font-semibold text-gray-800">
                  Total: ₹{restOrder.subTotal}
                </p>
              </div>
            </div>
          ))
        )}


    </div>
  );
}

export default MyOrders;
