import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// ✅ Allowed frontend URL (Vercel)
const FRONTEND_URL = "https://realtime-chatsystem-frontend.vercel.app";

// ✅ Enable CORS for API routes
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Configure Socket.IO with proper CORS
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling", "websocket"], // ✅ Fallback added
  allowEIO3: true,
});

// ✅ Socket.IO connection events
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // Join room
  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`📌 ${socket.id} joined ${roomId}`);
  });

  // Leave room
  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    console.log(`👋 ${socket.id} left ${roomId}`);
  });

  // Send message
  socket.on("send", (data) => {
    console.log("📩 Message:", data);
    socket.to(data.room).emit("message", data);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Root endpoint for testing
app.get("/", (req, res) => {
  res.send("✅ Real-Time Chat Backend is Running 🚀");
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
