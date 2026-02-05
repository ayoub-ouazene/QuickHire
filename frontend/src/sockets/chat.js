
import { getSocket } from "./socket";

export function listenForMessages(socket, callback) {

if (!socket) 
  {
       console.log("no socket ,heelp");
        return;

  }


  socket.on("receive_message", callback);
}

export function stopListeningForMessages() {
  const socket = getSocket();
  if (!socket) return;

  socket.off("receive_message");
}

export function sendMessage(payload) {
  const socket = getSocket();
  if (!socket) return;

  socket.emit("send_message", payload);
}
