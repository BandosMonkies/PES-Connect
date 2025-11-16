const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

// Try to load notes routes with error handling
let notesRoutes;
try {
  notesRoutes = require("./routes/notes");
  console.log("✅ Notes routes loaded successfully");
  console.log("✅ Router type:", typeof notesRoutes);
  console.log("✅ Router is function:", typeof notesRoutes === 'function');
} catch (error) {
  console.error("❌ Error loading notes routes:", error);
  console.error(error.stack);
  process.exit(1);
}

const { authenticateSocket } = require("./middleware/socketAuth");

const app = express();
const server = http.createServer(app);

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: clientOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: clientOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "MiniProject-PES-Connect API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Add direct test route BEFORE router to verify server is working
app.post("/api/notes/test-direct", (req, res) => {
  console.log("✅ Direct POST route hit!");
  res.json({ message: "Direct route works!", body: req.body });
});

app.use("/api/notes", notesRoutes);

// Debug: Log registered routes and verify router
console.log("API Routes registered:");
console.log("- /api/auth", typeof authRoutes);
console.log("- /api/chat", typeof chatRoutes);
console.log("- /api/notes", typeof notesRoutes);
console.log("Notes router is function:", typeof notesRoutes === 'function');

// Test route registration
app.get('/test-routes', (req, res) => {
  res.json({
    routesRegistered: {
      auth: !!authRoutes,
      chat: !!chatRoutes,
      notes: !!notesRoutes
    },
    notesRouterType: typeof notesRoutes
  });
});

io.use(authenticateSocket);

const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);
  activeUsers.set(socket.userId, socket.id);
  io.emit("user:online", { userId: socket.userId });
  socket.join(socket.userId);

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

  socket.on("conversation:leave", (conversationId) => {
    if (!conversationId) return;
    socket.leave(conversationId);
  });

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

      const message = await Message.create({
        conversation: conversationId,
        sender: socket.userId,
        content: content.trim(),
        messageType: messageType || "text",
      });

      conversation.lastMessage = message._id;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      await message.populate("sender", "name email");
      io.to(conversationId).emit("message:receive", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message:error", { error: "Failed to send message" });
    }
  });

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

      socket.to(conversationId).emit("message:read:update", {
        conversationId,
        userId: socket.userId,
        messageIds,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
    activeUsers.delete(socket.userId);
    io.emit("user:offline", {
      userId: socket.userId,
      lastSeen: new Date(),
    });
  });
});

const PORT = 8001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pes_connect";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

module.exports = { io };
