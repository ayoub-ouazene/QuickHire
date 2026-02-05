const { Router } = require('express');
const router = Router();
const chatbotController = require('../../controllers/amine/chatbotController');

// Chatbot routes - no authentication required for basic chat
// Users can chat without being logged in

// Send a message to the chatbot
router.post('/message', chatbotController.sendMessage);

// Get suggested prompts
router.get('/suggestions', chatbotController.getSuggestions);

module.exports = router;
