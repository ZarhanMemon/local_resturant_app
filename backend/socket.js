import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  // CORS configuration for socket.io - allow multiple origins
  const allowedOrigins = [
    "https://vingo-local-restaurant-app.onrender.com",
    "https://chindi-backend.onrender.com",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins, // You can pass the array directly to simplified it
      credentials: true,
      methods: ["GET", "POST"],
    },
   
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Join order chat room
    socket.on("joinOrder", (orderId) => {
      socket.join(orderId);
      console.log(`📦 Joined order room: ${orderId}`);
    });


    // MESSAGE TWICE SEE - SOLUTION: make sure to only emit to others in the room, not the sender
     // Send message  -- this will be emitted by the sender and received by everyone else in the room
    socket.on("sendMessage", ({ orderId, sender, text, createdAt }) => {
      // emit to everyone in the room except the sender
      socket.to(orderId).emit("receiveMessage", {
        sender,
        text,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
