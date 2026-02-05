// src/socket/socket.js
import { io } from "socket.io-client";

let socket = null;


export function connectSocket(user) {
  if (socket) return socket;

  socket = io("http://localhost:3000", {
    auth: {
      id: user.id,
      type: user.type
    }
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
