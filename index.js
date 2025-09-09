import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// ✅ Enable CORS for all for now (later we can restrict to frontend URL)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ Configure Socket.IO for WebSocket + Polling
const io = new Server(server, {
  cors: {
    origin: "*", // For production, replace with Vercel/Netlify frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // ✅ Important: Force fallback
  allowEIO3: true, // ✅ Allow older Engine.IO version compatibility
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Join room
  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`📌 User ${socket.id} joined room ${roomId}`);
  });

  // Leave room
  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    console.log(`👋 User ${socket.id} left room ${roomId}`);
  });

  // Send message
  socket.on("send", (message) => {
    console.log("📩 Message:", message);
    socket.to(message.room).emit("message", message);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("<h1>✅ Real-Time Chat Backend Running</h1>");
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
