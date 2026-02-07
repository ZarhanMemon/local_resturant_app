import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://vingo-local-restaurant-app.onrender.com", // allow any origin in development (adjust for production)
      credentials: true,
      methods:['POST','GET']
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
