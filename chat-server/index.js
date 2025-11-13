const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const { authenticateSocket } = require("./middleware/socketAuth");

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "MiniProject-PES-Connect API" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO authentication and connection handling
io.use(authenticateSocket);

// Store active users
const activeUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  // Store active user
  activeUsers.set(socket.userId, socket.id);

  // Broadcast online status to all users
  io.emit("user:online", { userId: socket.userId });

  // Join user's personal room
  socket.join(socket.userId);

  // Handle joining conversation rooms
  socket.on("conversation:join", async (conversationId) => {
    if (!conversationId) return;

    try {
      const Conversation = require("./models/Conversation");
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId,
      });

      if (!conversation) {
        return socket.emit("conversation:error", { error: "Conversation not found" });
      }

      socket.join(conversationId);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    } catch (error) {
      console.error("Error joining conversation:", error);
      socket.emit("conversation:error", { error: "Failed to join conversation" });
    }
  });

  // Handle leaving conversation rooms
  socket.on("conversation:leave", (conversationId) => {
    if (!conversationId) return;
    socket.leave(conversationId);
  });

  // Handle sending messages
  socket.on("message:send", async (data = {}) => {
    const { conversationId, content, messageType } = data;

    if (!conversationId || !content?.trim()) {
      return socket.emit("message:error", { error: "conversationId and content are required" });
    }

    try {
      const Message = require("./models/Message");
      const Conversation = require("./models/Conversation");

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId,
      });

      if (!conversation) {
        return socket.emit("message:error", { error: "Conversation not found" });
      }

      // Create message
      const message = await Message.create({
        conversation: conversationId,
        sender: socket.userId,
        content: content.trim(),
        messageType: messageType || "text",
      });

      // Update conversation
      conversation.lastMessage = message._id;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      // Populate sender info
      await message.populate("sender", "name email");

      // Emit to conversation room
      io.to(conversationId).emit("message:receive", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message:error", { error: "Failed to send message" });
    }
  });

  // Handle typing indicators
  socket.on("typing:start", ({ conversationId } = {}) => {
    if (!conversationId) return;
    socket.to(conversationId).emit("typing:user", {
      userId: socket.userId,
      isTyping: true,
      conversationId,
    });
  });

  socket.on("typing:stop", ({ conversationId } = {}) => {
    if (!conversationId) return;
    socket.to(conversationId).emit("typing:user", {
      userId: socket.userId,
      isTyping: false,
      conversationId,
    });
  });

  // Handle message read status
  socket.on("message:read", async ({ conversationId, messageIds } = {}) => {
    if (!conversationId || !Array.isArray(messageIds) || messageIds.length === 0) {
      return;
    }

    try {
      const Message = require("./models/Message");
      const Conversation = require("./models/Conversation");

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId,
      });

      if (!conversation) {
        return;
      }

      await Message.updateMany(
        {
          _id: { $in: messageIds },
          "readBy.user": { $ne: socket.userId },
        },
        {
          $push: {
            readBy: {
              user: socket.userId,
              readAt: new Date(),
            },
          },
        }
      );

      // Notify other participants
      socket.to(conversationId).emit("message:read:update", {
        conversationId,
        userId: socket.userId,
        messageIds,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
    activeUsers.delete(socket.userId);

    // Broadcast offline status
    io.emit("user:offline", {
      userId: socket.userId,
      lastSeen: new Date(),
    });
  });
});

// DB connection and server start
const PORT = process.env.PORT || 8000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pes_connect";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Export io for use in routes if needed
module.exports = { io };
