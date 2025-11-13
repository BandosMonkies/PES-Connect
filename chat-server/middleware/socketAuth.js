const jwt = require("jsonwebtoken");

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;

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

module.exports = { authenticateSocket };
