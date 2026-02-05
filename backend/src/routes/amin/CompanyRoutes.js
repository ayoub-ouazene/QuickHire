const { Router } = require('express');
const router = Router();
const jobController = require('../../controllers/amine/jobController');
const dashboardController = require('../../controllers/amine/dashboardController');
const authMiddleware = require('../../middlewares/ayyoub/authMiddleware');

// All company routes require authentication
router.use(authMiddleware.verifyCompanyToken);

// Post Job route
router.post('/PostJob', jobController.createJob);

// Dashboard routes
router.get('/Dashboard', dashboardController.getDashboardStats);
router.get('/Dashboard/Jobs', dashboardController.getCompanyJobs);
router.get('/Dashboard/InChat', dashboardController.getUsersInChat);
router.get('/Dashboard/HiredEmployees', dashboardController.getHiredEmployees);
router.post('/Dashboard/Hire', dashboardController.hireUser);
router.post('/Dashboard/RefuseUser', dashboardController.refuseUser);

// Accept Applicant - adds user to In_Chat
router.post('/Dashboard/AcceptApplicant/:applicationId', dashboardController.acceptApplicant);

module.exports = router;