import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ Configure Socket.IO properly
const io = new Server(server, {
  cors: {
    origin: "*",  // For production, replace "*" with your Vercel frontend URL
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["polling", "websocket"], // ✅ Add polling first, then websocket
  allowEIO3: true                      // ✅ Fix Engine.IO mismatch
});

// ✅ Handle socket connections
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // Join a room
  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`📌 ${socket.id} joined ${roomId}`);
  });

  // Leave a room
  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    console.log(`👋 ${socket.id} left ${roomId}`);
  });

  // Send a message
  socket.on("send", (data) => {
    console.log("📩 Message:", data);
    socket.to(data.room).emit("message", data);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("✅ Real-Time Chat Backend is Running 🚀");
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
