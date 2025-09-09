import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://realtime-chatsystem-frontend.vercel.app", // ✅ Vercel frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://realtime-chatsystem-frontend.vercel.app", // ✅ Allow frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // ✅ Hybrid: Try WebSocket first, fallback to polling
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Join room
  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`📌 User joined room: ${roomId}`);
  });

  // Leave room
  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    console.log(`❌ User left room: ${roomId}`);
  });

  // Send message
  socket.on("send", (message) => {
    console.log("📨 Message:", message);
    socket.to(message.room).emit("message", message);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("<h1>🚀 Realtime Chat Server Running...</h1>");
});

server.listen(5050, () => {
  console.log("✅ Server running on http://localhost:5050");
});
