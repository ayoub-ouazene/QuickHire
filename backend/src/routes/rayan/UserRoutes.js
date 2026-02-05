const express = require('express');
const router = express.Router();

// Import controllers
const userSettingsController = require('../../controllers/mourad/userSettingsController');
const publicationsController = require('../../controllers/mourad/publicationsController');

// ========================================
// USER SETTINGS ROUTES
// ========================================


router.get( '/Profile/:userId',  userSettingsController.getUserProfile);

// UPDATE user profile (Personal Information page - Save Changes button)
// PATCH /api/User/Profile/:userId
router.patch(  '/Profile/:userId',userSettingsController.updateUserProfile );

// UPDATE social links (Social Links page - Save Changes button)
// PATCH /api/User/Profile/:userId/SocialLinks
router.patch(
  '/Profile/:userId/SocialLinks',
  userSettingsController.updateUserSocialLinks
);

// UPDATE email only (Login Details page - Update Email button)
// PATCH /api/User/Profile/:userId/Email
router.patch(
  '/Profile/:userId/Email',
  userSettingsController.updateUserEmail
);

// UPDATE password (Login Details page - Change Password button)
// PATCH /api/User/Profile/:userId/Password
router.patch(
  '/Profile/:userId/Password',
  userSettingsController.updateUserPassword
);

// ========================================
// USER PUBLIC ACTIONS
// ========================================

// APPLY to job
// POST /api/User/Applications
router.post(
  '/Applications',
  publicationsController.applyToJob
);

// GET all jobs (for user to browse)
// GET /api/User/Jobs?type=&category=&search=
router.get(
  '/Jobs',
  publicationsController.getAllJobs
);


// GET all jobs (for user to browse)
// GET /api/User/Jobs?type=&category=&search=
router.get(
  '/Jobs',
  publicationsController.getAllJobs
);

// GET single job by ID (for job details page)
// GET /api/User/Jobs/:jobId
router.get(
  '/Jobs/:jobId',
  publicationsController.getJobById
);

// GET all users (for networking/browsing)

// GET all users (for networking/browsing)
// GET /api/User/Users?status=&location=&search=
router.get(
  '/Users',
  publicationsController.getAllUsers
);

// POST /api/Company/Notification
router.post('/Notification', async (req, res) => {
  try {
    const { id, type, Notification_Type, Content } = req.body;

    console.log('📬 COMPANY NOTIFICATION ENDPOINT HIT!');

    // ✅ ACTUALLY CREATE NOTIFICATION IN DATABASE
    const notification = await prisma.company_Notifications_History.create({
      data: {
        Company_id: parseInt(id),
        Content: Content,
        Date: new Date(),
        Type: 'New'  // Use 'New' or map Notification_Type to your enum
      }
    });

    console.log('✅ Company notification created in database! ID:', notification.Notification_id);

    res.status(200).json({
      success: true,
      message: '✅ Notification stored in COMPANY database!',
      notificationId: notification.Notification_id
    });

  } catch (error) {
    console.error('❌ ERROR creating company notification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create notification',
      message: error.message 
    });
  }
});

module.exports = router;