const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// Middleware to verify JWT token (reuse from auth routes)
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No authentication token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get all conversations for the authenticated user
router.get("/conversations", authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId,
    })
      .populate("participants", "name email")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    // Add unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await conv.getUnreadCount(req.userId);
        return {
          ...conv.toObject(),
          unreadCount,
        };
      })
    );

    res.json(conversationsWithUnread);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

// Get messages for a specific conversation
router.get(
  "/conversations/:conversationId/messages",
  authenticate,
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      // Verify user is part of conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: req.userId,
      });

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = await Message.find({
        conversation: conversationId,
        deleted: false,
      })
        .populate("sender", "name email")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Message.countDocuments({
        conversation: conversationId,
        deleted: false,
      });

      res.json({
        messages: messages.reverse(), // Return in chronological order
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  }
);

// Create a new conversation
router.post("/conversations", authenticate, async (req, res) => {
  try {
    const { participantIds, isGroup, groupName } = req.body;

    // Add current user to participants if not included
    const allParticipants = [...new Set([req.userId, ...participantIds])];

    // Check if conversation already exists (for direct messages)
    if (!isGroup && allParticipants.length === 2) {
      const existingConversation = await Conversation.findOne({
        participants: { $all: allParticipants, $size: 2 },
        isGroup: false,
      }).populate("participants", "name email");

      if (existingConversation) {
        return res.json(existingConversation);
      }
    }

    const conversation = await Conversation.create({
      participants: allParticipants,
      isGroup: isGroup || false,
      groupName: groupName || null,
      groupAdmin: isGroup ? req.userId : null,
    });

    await conversation.populate("participants", "name email");

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Failed to create conversation" });
  }
});

// Search users to start a conversation
router.get("/users/search", authenticate, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: req.userId }, // Exclude current user
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("name email")
      .limit(10);

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
});

// Mark messages as read
router.patch(
  "/conversations/:conversationId/read",
  authenticate,
  async (req, res) => {
    try {
      const { conversationId } = req.params;

      // Get all unread messages in the conversation
      const unreadMessages = await Message.find({
        conversation: conversationId,
        sender: { $ne: req.userId },
        "readBy.user": { $ne: req.userId },
      });

      // Mark them as read
      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: req.userId },
          "readBy.user": { $ne: req.userId },
        },
        {
          $push: {
            readBy: {
              user: req.userId,
              readAt: new Date(),
            },
          },
        }
      );

      res.json({
        message: "Messages marked as read",
        count: unreadMessages.length,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  }
);

// Delete a message (soft delete)
router.delete("/messages/:messageId", authenticate, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      sender: req.userId,
    });

    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found or unauthorized" });
    }

    message.deleted = true;
    message.content = "This message was deleted";
    await message.save();

    res.json({ message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
});

module.exports = router;
