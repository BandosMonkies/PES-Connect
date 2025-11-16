const jwt = require("jsonwebtoken");

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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub || decoded.userId || decoded.id;
    const userName = decoded.name || "";

    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = {
      id: userId.toString(),
      name: userName,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authenticateSocket, authenticateToken };

