import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// ✅ Vercel frontend ka URL
const FRONTEND_URL = "https://realtime-chatsystem-frontend.vercel.app";

// ✅ Normal API requests ke liye CORS enable
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// ✅ Socket.IO Configuration with CORS fix
const io = new Server(server, {
  cors: {
    origin: "https://realtime-chatsystem-frontend.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling"], // ✅ Force polling instead of WebSocket
});


// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`📌 ${socket.id} joined room ${room}`);
  });

  socket.on("leave", (room) => {
    socket.leave(room);
    console.log(`👋 ${socket.id} left room ${room}`);
  });

  socket.on("send", (data) => {
    console.log("📩 Message received:", data);
    socket.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 Real-Time Chat Backend Running Successfully!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

