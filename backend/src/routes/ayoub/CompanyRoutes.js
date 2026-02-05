const { Router } = require('express');
const router = Router();
const MessagesControllers = require("../../controllers/ayoub/messages")
const NotificationsControllers = require("../../controllers/ayoub/Notifications")

const authentication =  require("../../middlewares/ayyoub/authMiddleware")
const {upload } = require("../../config/cloudinary")
const ImagesControllers = require ("../../controllers/ayoub/Image.js")
const companyController = require("../../controllers/ayyoub/companyController"); // ✅ Added


router.use(authentication.verifyCompanyToken);

// Conversations
router.get("/Conversations", MessagesControllers.GetConversations);


// Messages - NEW OPTIMIZED ENDPOINTS
router.get("/Conversations/:ConversationId/Messages/paginated", MessagesControllers.GetPaginatedMessages); // NEW
router.get("/Conversations/:ConversationId/Messages/recent", MessagesControllers.GetRecentMessages);       // NEW

// Messages - OLD ENDPOINT (kept for compatibility)
router.get("/Conversations/:id/Messages", MessagesControllers.GetMessagesOfConversation);

// Profiles - NEW OPTIMIZED ENDPOINT (use this one!)
router.get("/ConversationsWithLastMessage", MessagesControllers.GetProfileWithLastMessage); // NEW - FAST

// Profiles - OLD ENDPOINT (deprecated, very slow)
router.get("/ConversationsWithProfiles", MessagesControllers.GetProfileWithMessages);

// Notifications
router.delete("/Notification", NotificationsControllers.DeleteAll);
router.delete("/Notification/:notification_id", NotificationsControllers.DeleteNotification);
router.get("/Notification", NotificationsControllers.GetAllNotifications);
router.post("/Notification", NotificationsControllers.AddNotification);
router.patch("/Profile/Image", upload.single('image'), ImagesControllers.UpdateProfileImage);
router.patch("/Notification/AddRating", NotificationsControllers.submitRating);

// ✅ Accept/Reject Applications
router.post('/Application/:applicationId/accept', companyController.acceptApplication);
router.post('/Application/:applicationId/reject', companyController.rejectApplication);



module.exports = router;