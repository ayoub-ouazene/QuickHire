const prisma = require("../config/prisma.js") 
const { query } = require("../config/db.js")

// PAGINATION CONSTANTS
const MESSAGES_PER_PAGE = 15; // Recommended: 15 messages per load
const INITIAL_LOAD_COUNT = 15; // Same as per page for consistency


async function createMessage({
  conversationId,
  senderType,       
  User_id,
  Company_id, 
  content
}) {

  if (
    (senderType === "user" && !User_id) ||
    (senderType === "company" && !Company_id)
  ) {
    throw new Error("Invalid sender data");
  }

  const conversation = await prisma.In_Chat.findUnique({
    where: { ConversationId: conversationId }
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return prisma.Messages.create({
    data: {
      ConversationId: conversationId,
      User_id: conversation.User_id,
      Company_id: conversation.Company_id,
      Content: content,
      Sender: senderType,
      Date: new Date()
    }
  });
}


const getPaginatedMessages = async (conversationId, page = 1, limit = MESSAGES_PER_PAGE) => {
  const skip = (page - 1) * limit;
  
  // Get total count for hasMore calculation
  const totalCount = await prisma.Messages.count({
    where: { ConversationId: conversationId }
  });

  // Fetch messages in descending order (newest first), then reverse
  const messages = await prisma.Messages.findMany({
    where: { ConversationId: conversationId },
    orderBy: { Date: "desc" }, // Get newest first
    skip: skip,
    take: limit
  });

  // Reverse to show oldest to newest in UI
  const orderedMessages = messages.reverse();

  return {
    messages: orderedMessages,
    hasMore: skip + messages.length < totalCount,
    totalCount: totalCount,
    currentPage: page
  };
};


const getRecentMessages = async (conversationId, limit = INITIAL_LOAD_COUNT) => {
  
  const messages = await prisma.Messages.findMany({
    where: { ConversationId: conversationId },
    orderBy: { Date: "desc" },
    take: limit
  });

  // Return in chronological order (oldest to newest)
  return messages.reverse();
};



const getLastMessage = async (conversationId) => {
  const lastMessage = await prisma.Messages.findFirst({
    where: { ConversationId: conversationId },
    orderBy: { Date: "desc" }
  });

  return lastMessage;
};

/**
 * Get all conversations messages (old method - kept for compatibility)
 */
const Conversation_Messages = async (conversationID) => {
  return await prisma.Messages.findMany({
    where: { ConversationId: conversationID },
    orderBy: { Date: "asc" }
  });
};

module.exports = {
  createMessage,
  Conversation_Messages,
  getPaginatedMessages,
  getRecentMessages,
  getLastMessage,
  MESSAGES_PER_PAGE,
  INITIAL_LOAD_COUNT
}