const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/ayyoub/companyController');
const authMiddleware = require('../../middlewares/ayyoub/authMiddleware');
const uploadMiddleware = require('../../middlewares/ayyoub/uploadMiddleware');
const { upload }  = require('../../config/cloudinary');

// All company routes require authentication
router.use(authMiddleware.verifyCompanyToken);

// Profile routes
router.get('/Profile', companyController.getProfile);
router.put('/Profile', uploadMiddleware.single('Logo'), companyController.updateProfile);

// Managers
router.get('/Profile/Managers', companyController.getManagers);
router.post("/Manager", upload.single('image'), companyController.addManager);


// Invitations and Applicants
router.post('/Invitation', companyController.createInvitation);
router.get('/Invitations', companyController.getInvitations);
router.delete('/Invitation/:invitationId', companyController.deleteInvitation);

router.get('/Applicants', companyController.getApplicants);
router.get('/Applicants/:id', companyController.getApplicantById);
router.delete('/Application/:applicationId', companyController.deleteApplication);

// ✅ Accept/Reject Applications
router.post('/Application/:applicationId/accept', companyController.acceptApplication);
router.post('/Application/:applicationId/reject', companyController.rejectApplication);

module.exports = router;