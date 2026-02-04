import React, { useEffect, useState } from 'react'
import { useOrderStore } from '../context/useOrderStore.js';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import DeliveryBoyTracking from "./DeliveryBoyTracking.jsx";

function TrackingOrder() {
  

  const navigate = useNavigate();

  const { orderId } = useParams();  
  const { getOrderById} = useOrderStore();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Fetch order details using orderId
    const fetchOrder = async () => {
      try {
        const orderDetails = await getOrderById(orderId);
        setOrderDetails(orderDetails);
        console.log(orderDetails);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  console.log("Order Details:", orderDetails);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-4 bg-white rounded-lg shadow-md"> 
      <div className="flex items-center gap-4 p-4 border-b">
        <button onClick={() => navigate("/")}>
          <ArrowLeft className="text-orange-500" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold">Track Orders</h1>
      </div>

      {orderDetails === null ? (
        <p className="text-center text-gray-500">Loading order details...</p>
      ) : orderDetails.restaurantOrders?.length > 0 ? (
        <div>
          {orderDetails.restaurantOrders.map((restOrder) => {

            const mapData = {
              deliveryAddress: orderDetails.deliveryAddress,

              deliveryBoyLocation: restOrder.assignedDeliveryRider?.location?.coordinates && restOrder.assignedDeliveryRider.location.coordinates.length === 2
                ? { lat: restOrder.assignedDeliveryRider.location.coordinates[1], lon: restOrder.assignedDeliveryRider.location.coordinates[0] }
                : (restOrder.deliveryBoyLocation || null),

              customerLocation: {
                lat: orderDetails.deliveryAddress?.latitude ?? null,
                lon: orderDetails.deliveryAddress?.longitude ?? null,
              },
              restaurantOrder: restOrder,
              customer: orderDetails.user,
            };
            console.log("Map Data for Restaurant Order:", mapData);

            return (
              <div key={restOrder._id} className="bg-white rounded-xl shadow-lg mb-6 p-4">
                <h2 className="text-orange-600 font-semibold text-lg mb-2">{restOrder.restaurant?.name || restOrder.restaurantName || restOrder.name}</h2>

                <p className="text-sm text-gray-600 mb-1">Items: <span className="font-medium text-gray-800">{restOrder.restaurantOrderItems?.map(i => i.name).join(', ')}</span></p>
                <p className="text-sm text-gray-600 mb-1">Subtotal: <span className="font-bold text-gray-800">₹{restOrder.subTotal}</span></p>
                <p className="text-sm text-gray-600 mb-1">Delivery address: <span className="font-bold text-gray-800">{orderDetails.deliveryAddress?.address || 'N/A'}</span></p>
                <p className="text-sm text-gray-600 mb-1">Delivery Boy Name: <span className="font-bold text-gray-800">{restOrder.assignedDeliveryRider?.name || 'Not Assigned'}</span></p>
                <p className="text-sm text-gray-600 mb-3">Delivery Boy contact No.: <span className="font-bold text-gray-800">{restOrder.assignedDeliveryRider?.phone || 'N/A'}</span></p>

                <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border-4 border-gray-50 shadow-inner z-10 min-h-[220px]">
                  <DeliveryBoyTracking data={mapData} />
                </div>

              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No restaurant orders found for this order.</p>
      )}
    </div>
  )
}

export default TrackingOrder;