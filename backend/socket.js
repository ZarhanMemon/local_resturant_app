import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  const allowedOrigins = [
    "https://chindi-local-restaurant-app.onrender.com",
    "http://localhost:5173",
    "http://localhost:5174",
  ];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinOrder", (orderId) => {
      socket.join(orderId);
      console.log(`📦 Joined order room: ${orderId}`);
    });

    socket.on("sendMessage", ({ orderId, sender, text, createdAt }) => {
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
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};