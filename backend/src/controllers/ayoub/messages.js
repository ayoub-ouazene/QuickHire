const { Conversations, ProfilesWithLastMessage, ProfilesWithMessages } = require("../../services/conversation") ;
const { createMessage, getPaginatedMessages, getRecentMessages, Conversation_Messages } = require("../../services/messages") ; 


const GetConversations = async (req, res) => {
  try {
    const { UserType, UserId } = req.body;
    const conversations = await Conversations(UserType, parseInt(UserId));
    res.status(200).json(conversations);
  } 
  
  catch (error) {
    console.error("Error in GetConversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
}

/**
 * OLD ENDPOINT - Get all messages of a conversation (not recommended for large chats)
 * Keep for backward compatibility
 */
const GetMessagesOfConversation = async (req, res) => {
  try {
    const { ConversationId } = req.params;
    const Messages = await Conversation_Messages(parseInt(ConversationId));
    res.status(200).json(Messages);
  } catch (error) {
    console.error("Error in GetMessagesOfConversation:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}


const GetPaginatedMessages = async (req, res) => {
  try {
    const { ConversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const result = await getPaginatedMessages(parseInt(ConversationId), page, limit);
    
    res.status(200).json({
      messages: result.messages,
      pagination: {
        currentPage: result.currentPage,
        hasMore: result.hasMore,
        totalCount: result.totalCount,
        messagesPerPage: limit
      }
    });
  } catch (error) {
    console.error("Error in GetPaginatedMessages:", error);
    res.status(500).json({ error: "Failed to fetch paginated messages" });
  }
}

/**
 * NEW ENDPOINT - Get recent messages for initial conversation load
 * Query params: limit (default 15)
 * Example: /api/User/Conversations/:id/Messages/recent?limit=15
 */
const GetRecentMessages = async (req, res) => {
  try {
    const { ConversationId } = req.params;
    const limit = parseInt(req.query.limit) || 15;
 
    const messages = await getRecentMessages( parseInt(ConversationId), limit);
     
    res.status(200).json({
      messages: messages,
      count: messages.length
    });
  } catch (error) {
    console.error("Error in GetRecentMessages:", error);
    res.status(500).json({ error: "Failed to fetch recent messages" });
  }
}


const GetProfileWithLastMessage = async (req, res) => {
  try {
    const { UserType, UserId } = req.query;
    const output = await ProfilesWithLastMessage(UserType, parseInt( UserId));
    res.status(200).json(output);
  } catch (error) {
    console.error("Error in GetProfileWithLastMessage:", error);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
}

/**
 * OLD ENDPOINT - Keep for backward compatibility
 * WARNING: This fetches ALL messages for ALL conversations (very slow)
 */
const GetProfileWithMessages = async (req, res) => {
  try {
    const { UserType, UserId } = req.query;
    const output = await ProfilesWithMessages(UserType,parseInt( UserId));
    res.status(200).json(output);
  } catch (error) {
    console.error("Error in GetProfileWithMessages:", error);
    res.status(500).json({ error: "Failed to fetch profiles with messages" });
  }
}

module.exports = {
  GetConversations,
  GetMessagesOfConversation,
  GetPaginatedMessages,         // NEW
  GetRecentMessages,             // NEW
  GetProfileWithLastMessage,     // NEW - USE THIS
  GetProfileWithMessages         // OLD - DEPRECATED
}