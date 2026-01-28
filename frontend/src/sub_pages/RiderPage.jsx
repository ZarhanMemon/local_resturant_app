import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { startTrackingUserLocation } from "../libs/getUserLocation.js";
import { useAuthStore } from "../context/useAuthStore.js";
import { useOrderStore } from "../context/useOrderStore.js";

function RiderPage() {

  const { authUser } = useAuthStore();

  const { getDeliveryRiderAssignment , assignment } = useOrderStore()

  useEffect(() => {
    if (authUser?.role === "Rider") {
      startTrackingUserLocation();
      getDeliveryRiderAssignment()
    }
  }, [authUser]);

  console.log(assignment)
  
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#fff6f2] pt-24 px-4">
        <div className="max-w-xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border mb-4">
            <p className="text-sm text-gray-500">Welcome,</p>
            <h2 className="text-lg font-semibold text-orange-500">
              {authUser?.name || "Rider"}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Latitude: <span className="font-medium">18.5214</span>, Longitude:{" "}
              <span className="font-medium">73.8545</span>
            </p>
          </div>

          {/* Available Orders Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Available Orders
            </h3>

            {assignment.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No Available Orders
              </p>
            ) : (
              assignment.map((order) => (
                <div
                  key={order.orderId}
                  className="border rounded-md p-3 mb-3"
                >
                  <p className="text-sm font-medium">
                    Order #{order.orderId.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.deliveryAddress.address}
                  </p>

                  <button className="mt-2 w-full bg-orange-500 text-white text-sm py-1.5 rounded-md">
                    Accept Order
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RiderPage;
