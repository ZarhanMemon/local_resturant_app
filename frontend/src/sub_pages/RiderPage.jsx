import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { startTrackingUserLocation } from "../libs/getUserLocation.js";
import { useAuthStore } from "../context/useAuthStore.js";
import { useOrderStore } from "../context/useOrderStore.js";
// 1. Import Recharts components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function RiderPage() {
  const { authUser } = useAuthStore();
  const { getDeliveryRiderAssignment, assignment, acceptAssignment } = useOrderStore();

  // 2. Mock data for the graph (In a real app, fetch this from your backend)
  const deliveryData = [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 7 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 10 },
    { day: 'Fri', count: 8 },
    { day: 'Sat', count: 12 },
    { day: 'Sun', count: 6 },
  ];

  useEffect(() => {
    if (authUser?.role === "Rider") {
      startTrackingUserLocation();
      getDeliveryRiderAssignment();
    }
  }, [getDeliveryRiderAssignment, authUser?.role]); // Removed acceptAssignment to prevent loops

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#fff6f2] pt-24 px-4 pb-10">
        <div className="max-w-xl mx-auto space-y-4">
          
          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 text-center border">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Rider Dashboard</p>
            <h2 className="text-xl font-bold text-orange-500 mt-1">
              {authUser?.name || "Rider"}
            </h2>
            <div className="flex justify-center gap-4 mt-3 text-[10px] text-gray-500 bg-gray-50 py-2 rounded-lg">
              <p>Lat: <span className="font-mono text-gray-700">18.5214</span></p>
              <p>Lng: <span className="font-mono text-gray-700">73.8545</span></p>
            </div>
          </div>

          {/* 3. PERFORMANCE GRAPH CARD */}
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex justify-between items-center">
              Weekly Performance
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
            </h3>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 12}} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#fff7ed'}}
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#f97316" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">Total Deliveries this week: 52</p>
          </div>

          {/* Available Orders Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Available Orders</h3>

            {assignment.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <p className="text-xl">🛵</p>
                </div>
                <p className="text-sm text-gray-400">Searching for nearby orders...</p>
              </div>
            ) : (
              assignment.map((order) => (
                <div key={order.orderId} className="border border-orange-100 bg-orange-50/30 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-gray-800">Order #{order.orderId.slice(-6)}</p>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded uppercase">New</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {order.deliveryAddress.address}
                  </p>

                  <button
                    onClick={() => acceptAssignment(order.assignmentId)}
                    className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white text-sm font-bold py-2.5 rounded-lg shadow-sm"
                  >
                    Accept Delivery
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
