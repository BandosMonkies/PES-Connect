const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const notesRoutes = require("./routes/notes");
const { authenticateSocket } = require("./middleware/socketAuth");

const app = express();
const server = http.createServer(app);

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'notes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "MiniProject-PES-Connect API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notes", notesRoutes(upload));

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
