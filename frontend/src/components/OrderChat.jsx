import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { useAuthStore } from "../context/useAuthStore";
import { useOrderStore } from "../context/useOrderStore";
import { ArrowLeft } from "lucide-react";

function OrderChat() {
  const { orderId  } = useParams();

  
  const { authUser } = useAuthStore();

  const [ orderData, setOrderData] = useState(null);
  const { getOrderById } = useOrderStore();


  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  // Create a ref for the chat container to handle scrolling
  const chatContainerRef = useRef(null);

   
  // HANDLE SOCKET CONNECTIONS
  useEffect(() => {
    if (!orderId) return;

    const joinRoom = () => {
      console.log("socket joining order room", orderId);
      socket.emit("joinOrder", orderId);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("connect", joinRoom);
    };
  }, [orderId]);

  // HANDLE AUTO-SCROLL
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


useEffect(() => {
  const fetchOrder = async () => {
    if (!orderData && orderId) {
      try {
        const orderData = await getOrderById(orderId);
        setOrderData(orderData);
        console.log("Fetched order data:", orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    }
  };

  fetchOrder();
}, [orderId, orderData, getOrderById]);


 
 
  const sendMessage = () => {
    if (!message.trim()) return;

    const msg = {
      orderId,
      sender: authUser.role.toLowerCase(),
      text: message,
      createdAt: new Date(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, msg]);
    socket.emit("sendMessage", msg);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#fff9f6] p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="text-orange-500" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold">Orders Chat</h1>
      </div>

      {/* Order Info Card */}
      <div className="mb-4">
        {orderData ? (
          <div className="bg-white rounded-lg p-3 shadow-sm text-sm border border-orange-100">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-orange-600">
                  Order #{String(orderData._id || orderId).slice(-6)}
                </div>
                <div className="text-xs text-gray-500">
                  {orderData.user?.name || "Customer"} • {orderData.deliveryAddress?.address || "No address"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase tracking-wide">Assigned Riders</div>
                <div className="text-xs font-medium">
                  {orderData.restaurantOrders?.map(r => r.assignedDeliveryRider?.name).filter(Boolean).join(", ") || "None"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-2 bg-white rounded-lg border border-dashed">
            Loading order details...
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef} // Ref attached here
        className="bg-white rounded-xl p-3 flex-1 overflow-y-auto shadow-inner"
        style={{ maxHeight: '60vh' }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              msg.sender === authUser.role.toLowerCase() ? "justify-end" : "justify-start"
            }`}
          >
            <div className={`px-3 py-2 rounded-2xl max-w-[80%] ${
              msg.sender === authUser.role.toLowerCase() 
                ? "bg-orange-500 text-white rounded-tr-none" 
                : "bg-gray-100 text-gray-800 rounded-tl-none"
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[9px] mt-1 opacity-70 ${
                msg.sender === authUser.role.toLowerCase() ? "text-right" : "text-left"
              }`}>
                {msg.sender.toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex mt-4 gap-2 bg-white p-2 rounded-xl shadow-sm">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 outline-none px-3 py-2 text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default OrderChat;
