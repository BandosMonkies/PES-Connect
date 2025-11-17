const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub || decoded.userId || decoded.id;

    if (!userId) {
      return next(new Error("Authentication error: Invalid token payload"));
    }

    socket.userId = userId.toString();
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub || decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // Fetch user from database to ensure we have current data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: userId.toString(),
      name: user.name,
      email: user.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authenticateSocket, authenticateToken };

