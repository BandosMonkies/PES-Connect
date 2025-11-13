import { io } from "socket.io-client";
import { getAuth } from "./auth";

let socket = null;

// Socket server URL - should match your backend
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/**
 * Initialize socket connection with authentication
 * @returns {Socket} Socket.io client instance
 */
export const initializeSocket = () => {
  if (socket && socket.connected) {
    console.log("Socket already connected");
    return socket;
  }

  const { token } = getAuth();

  if (!token) {
    console.error("No authentication token found");
    return null;
  }

  try {
    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return socket;
  } catch (error) {
    console.error("Failed to initialize socket:", error);
    return null;
  }
};

/**
 * Get existing socket instance
 * @returns {Socket|null} Socket.io client instance or null
 */
export const getSocket = () => {
  if (!socket || !socket.connected) {
    console.warn("Socket not connected. Call initializeSocket() first.");
    return initializeSocket();
  }
  return socket;
};

/**
 * Disconnect socket connection
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};

/**
 * Check if socket is connected
 * @returns {boolean}
 */
export const isSocketConnected = () => {
  return socket && socket.connected;
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  isSocketConnected,
};
