const express = require('express');
const router = express.Router();
const userController = require('../../controllers/ayyoub/userController');
const authMiddleware = require('../../middlewares/ayyoub/authMiddleware');
const uploadMiddleware = require('../../middlewares/ayyoub/uploadMiddleware');

// All user routes require authentication
router.use(authMiddleware.verifyUserToken);

// Profile routes
router.get('/Profile', userController.getProfile);
router.put('/Profile', userController.updateProfile);

// Applications and Invitations
router.get('/Application', userController.getApplications);
router.get('/Invitation', userController.getInvitations);
router.get('/Invitation/:id', userController.getInvitationById);
router.post('/Invitation/:invitationId/accept', userController.acceptInvitation);
router.post('/Invitation/:invitationId/reject', userController.rejectInvitation); // ✅ NEW

// Experience and Skills
router.post('/Profile/Experience', uploadMiddleware.single('Company_logo'), userController.addExperience);
router.post('/Profile/Skill', uploadMiddleware.single('SkillImg') ,userController.addSkill);

module.exports = router;