const { createMessage } = require("../services/messages")
const { Conversations } = require("../services/conversation")

const ChatSocket = async (socket, io) => {

    console.log(`User ${socket.user.id} (${socket.user.type}) connected to socket`);

    const conversations = await Conversations(socket.user.type, socket.user.id);

    

    conversations.forEach(conversation => {
        const roomName = `conversation_${conversation.ConversationId}`;
        socket.join(roomName);
      
    });

    socket.on("send_message", async ({ conversationId, content }) => {
        try {
            

            const message = await createMessage({
                conversationId,
                User_id: socket.user.type === "user" ? socket.user.id : null,
                Company_id: socket.user.type === "company" ? socket.user.id : null,
                content,
                senderType: socket.user.type
            });


       

            const roomName = `conversation_${conversationId}`;

            // Format message to match frontend expectations
            const formattedMessage = {
                ConversationId: conversationId,
                Content: message.Content,
                Sender: socket.user.type,
                Date: message.Date,
                id: message.Message_id
            };

            // Emit to ALL users in the conversation room (including sender)
            socket.to(roomName).emit('receive_message', formattedMessage);
        

        } catch (error) {
            console.error("Error in send_message handler:", error);
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    socket.on("disconnect", () => {
        console.log(`User ${socket.user.id} disconnected`);
    });
}

module.exports = { ChatSocket }