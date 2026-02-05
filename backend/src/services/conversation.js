const prisma = require("../config/prisma")
const { query } = require("../config/db")
// We don't need getLastMessage inside the loop anymore
// const { getLastMessage } = require("./messages") 

const Conversations = async (type, id) => {
  return await (type === "user" ? prisma.In_Chat.findMany({
    where: { User_id: id }
  })
    :
    prisma.In_Chat.findMany({
      where: { Company_id: id }
    }))
}



const ProfilesWithLastMessage = async (type, id) => {

  const query1 = `
    SELECT
      c."ConversationId",
      c."Status",
      c."Company_id",

      comp."Company_id",
      comp."Name",
      comp."Logo",
      comp."Website"

    FROM "In_Chat" c
    JOIN "Company" comp
      ON comp."Company_id" = c."Company_id"
    WHERE c."User_id" = $1
    ORDER BY c."ConversationId" DESC
  `;

  const query2 = `
    SELECT
      c."ConversationId",
      c."Status",
      c."User_id",

      u."User_id",
      u."FirstName",
      u."LastName",
      u."Photo",
      u."Status"

    FROM "In_Chat" c
    JOIN "User" u
      ON u."User_id" = c."User_id"
    WHERE c."Company_id" = $1
    ORDER BY c."ConversationId" DESC
  `;

  // 1. Fetch Profiles
  const profiles = await (type === "user" ? query(query1, [id]) : query(query2, [id]));

  // 2. Extract all Conversation IDs to fetch messages in BATCH
  const conversationIds = profiles.rows.map(p => p.ConversationId);

  // 3. Fetch Last Messages for ALL conversations in ONE query
  // distinct: ['ConversationId'] with orderBy Date desc gets the latest message per conversation
  let lastMessagesBatch = [];
  if (conversationIds.length > 0) {
    lastMessagesBatch = await prisma.Messages.findMany({
      where: {
        ConversationId: { in: conversationIds }
      },
      orderBy: { Date: 'desc' },
      distinct: ['ConversationId'] 
    });
  }

  // 4. Create a Map for O(1) instant lookup
  const messageMap = new Map();
  lastMessagesBatch.forEach(msg => {
    messageMap.set(msg.ConversationId, msg);
  });

  let profilesWithLastMessage = [];

  // 5. Build the result using memory lookup (No await inside loop)
  for (const profile of profiles.rows) {
    
    // Get message from Map instead of DB
    const lastMessage = messageMap.get(profile.ConversationId);

    let lastMessageFormatted = null;

    if (lastMessage) {
      lastMessageFormatted = {
        "Role": (type === lastMessage.Sender) ? "sender" : "receiver",
        "Content": lastMessage.Content,
        "Date": lastMessage.Date
      }
    }

    let obj = {
      profile,
      LastMessage: lastMessageFormatted
    }

    profilesWithLastMessage.push(obj);
  };

  return profilesWithLastMessage;
}

/**
 * OLD METHOD - Optimized to remove N+1
 */
const ProfilesWithMessages = async (type, id) => {
  // const { Conversation_Messages } = require("./messages"); // Not needed inside loop

  const query1 = `
    SELECT
      c."ConversationId",
      c."Status",
      c."Company_id",

      comp."Company_id",
      comp."Name",
      comp."Logo",
      comp."Website"

    FROM "In_Chat" c
    JOIN "Company" comp
      ON comp."Company_id" = c."Company_id"
    WHERE c."User_id" = $1
    ORDER BY c."ConversationId" DESC
  `;

  const query2 = `
    SELECT
      c."ConversationId",
      c."Status",
      c."User_id",

      u."User_id",
      u."FirstName",
      u."LastName",
      u."Photo",
      u."Status"

    FROM "In_Chat" c
    JOIN "User" u
      ON u."User_id" = c."User_id"
    WHERE c."Company_id" = $1
    ORDER BY c."ConversationId" DESC
  `;

  // 1. Fetch Profiles
  const profiles = await (type === "user" ? query(query1, [id]) : query(query2, [id]));

  // 2. Extract IDs
  const conversationIds = profiles.rows.map(p => p.ConversationId);

  // 3. Fetch ALL messages for these conversations in ONE query
  let allMessagesBatch = [];
  if (conversationIds.length > 0) {
    allMessagesBatch = await prisma.Messages.findMany({
      where: {
        ConversationId: { in: conversationIds }
      },
      orderBy: { Date: "asc" }
    });
  }

  // 4. Group messages by ConversationId
  const messagesGrouped = {};
  allMessagesBatch.forEach(msg => {
    if (!messagesGrouped[msg.ConversationId]) {
      messagesGrouped[msg.ConversationId] = [];
    }
    messagesGrouped[msg.ConversationId].push(msg);
  });

  let profilesWithMessages = [];

  // 5. Build result
  for (const profile of profiles.rows) {
    // Get messages from memory group
    const messages = messagesGrouped[profile.ConversationId] || [];
    
    let MessagesNewFormat = [];

    messages.forEach(msg => {
      let obj = {
        "Role": (type === msg.Sender) ? "sender" : "receiver",
        "Content": msg.Content
      }
      MessagesNewFormat.push(obj);
    });

    let obj = {
      profile,
      Messages: MessagesNewFormat
    }

    profilesWithMessages.push(obj);
  };

  return profilesWithMessages;
}

module.exports = { 
  Conversations, 
  ProfilesWithLastMessage, 
  ProfilesWithMessages
}