const { Router } = require('express');
const router = Router();
const userDashboardController = require('../../controllers/amine/userDashboardController');
const authMiddleware = require('../../middlewares/ayyoub/authMiddleware');

// All user routes require authentication
router.use(authMiddleware.verifyUserToken);

// Dashboard routes
router.get('/Dashboard', userDashboardController.getDashboardStats);
router.get('/Dashboard/CompaniesWorked', userDashboardController.getCompaniesWorked);

module.exports = router;