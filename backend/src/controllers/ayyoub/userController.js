require('dotenv').config()
const prisma = require("../../config/prisma.js") 
const redis = require("../../config/redis.js"); // ✅ Redis Import


// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentDate = new Date();

    // ✅ 1. CACHE: Check Redis
    const cacheKey = `user:profile:${userId}`;
    const cachedData = await redis.get(cacheKey);

    if(cachedData) {
        return res.status(200).json({
            success: true,
            data: JSON.parse(cachedData),
            source: 'cache'
        });
    }

    // Get user and active job in parallel for better performance
    const [user, currentJob] = await Promise.all([
      prisma.user.findUnique({
        where: { User_id: userId },
        include: {
          User_Experience: { orderBy: { Start_date: 'desc' } },
          User_Skills: true
        }
      }),

      
      prisma.job_Hiring_History.findFirst({
        where: {
          User_id: userId,
          End_Date: { gt: currentDate }
        },
        include: {
          company: {
            select: { Name: true }
          }
        },
        orderBy: { End_Date: 'desc' }
      })
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const { Password, ...userWithoutPassword } = user;

    const responseData = {
      ...userWithoutPassword,
      CompanyName: currentJob ? currentJob.company.Name : null  
    }

    // ✅ 2. CACHE: Save to Redis (10 mins)
    await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 600);

    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = { ...req.body };

    // Handle file upload (if multipart/form-data)
    if (req.file) {
      updateData.Photo = req.file.path; // Cloudinary URL from upload
    }

    if (req.body.Photo) {
      updateData.Photo = req.body.Photo;
    }
    // OR accept Photo URL from JSON body (if already a URL)
    // Photo field will be included in updateData from req.body

    delete updateData.Password;
    delete updateData.User_id;

    const updatedUser = await prisma.user.update({
      where: { User_id: userId },
      data: updateData,
      include: {
        User_Experience: true,
        User_Skills: true
      }
    });

    // ✅ INVALIDATE CACHE
    await redis.del(`user:profile:${userId}`);

    const { Password, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get User Applications with pagination
exports.getApplications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [applications, totalCount] = await Promise.all([
      prisma.job_Applications.findMany({
        where: { User_id: userId },
        include: {
          job: {
            include: {
              company: {
                select: {
                  Company_id: true,
                  Name: true,
                  Logo: true,
                  Industry: true,
                  MainLocation: true
                }
              },
              Job_Skills: true
            }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      prisma.job_Applications.count({
        where: { User_id: userId }
      })
    ]);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Get Applications Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get User Invitations with pagination
exports.getInvitations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [invitations, totalCount] = await Promise.all([
      prisma.invitations.findMany({
        where: { User_id: userId },
        include: {
          company: {
            select: {
              Company_id: true,
              Name: true,
              Logo: true,
              Industry: true,
              MainLocation: true,
              Rating: true
            }
          }
        },
        orderBy: { Date: 'desc' },
        skip,
        take: limit
      }),
      prisma.invitations.count({
        where: { User_id: userId }
      })
    ]);

    res.status(200).json({
      success: true,
      data: invitations,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Get Invitations Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invitations',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get Invitation by ID
exports.getInvitationById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const invitationId = parseInt(req.params.id);

    const invitation = await prisma.invitations.findFirst({
      where: {
        Invitation_id: invitationId,
        User_id: userId
      },
      include: {
        company: {
          select: {
            Company_id: true,
            Name: true,
            Logo: true,
            Industry: true,
            MainLocation: true,
            Rating: true,
            Description: true,
            Website: true,
            LinkedInLink: true,
            Employees_Number: true,
            FoundationDate: true
          }
        }
      }
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: invitation
    });

  } catch (error) {
    console.error('Get Invitation By ID Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invitation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add Experience
exports.addExperience = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      Title,
      Description,
      Start_date,
      End_date,
      Company_Name,
      Company_location,
      Job_type
    } = req.body;


      const experienceData = {
      User_id: userId,
      Title,
      Description,
      Company_Name,
      Company_location,
      Job_type,
      Start_date: Start_date ? new Date(Start_date) : null,
      End_date: End_date ? new Date(End_date) : null,
    };

    
    // Handle file upload (Company_logo)
    if (req.file) {
      experienceData.Company_logo = req.file.path; // Cloudinary URL
    }

    // Convert dates to DateTime
    if (experienceData.Start_date) {
      experienceData.Start_date = new Date(experienceData.Start_date);
    }
    if (experienceData.End_date) {
      experienceData.End_date = new Date(experienceData.End_date);
    }

    const experience = await prisma.user_Experience.create({
      data: experienceData
    });

    // ✅ INVALIDATE PROFILE CACHE
    await redis.del(`user:profile:${userId}`);

    res.status(201).json({
      success: true,
      message: 'Experience added successfully',
      data: experience
    });

  } catch (error) {
    console.error('Add Experience Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add experience',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add Skill
exports.addSkill = async (req, res) => {
  try {
    const userId = req.user.userId;

    const skillData = {
      User_id: userId,
      Title: req.body.Title,
      Description: req.body.Description,
    };

    // Priority 1: uploaded file (Cloudinary / Multer)
    if (req.file?.path) {
      skillData.Skill_Certification = req.file.path;
    }
    // Priority 2: image URL from body
    else if (req.body.SkillImg) {
      skillData.Skill_Certification = req.body.SkillImg;
    }

    const skill = await prisma.user_Skills.create({
      data: skillData,
    });

    // ✅ INVALIDATE PROFILE CACHE
    await redis.del(`user:profile:${userId}`);

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: skill,
    });

  } catch (error) {
    console.error('Add Skill Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add skill',
      details:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    });
  }
};

// Accept Invitation
// (Consolidated logic: Delete Invite -> Notify Company -> Create Chat)
exports.acceptInvitation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { invitationId } = req.params;



    // Get invitation details before deleting
    const invitation = await prisma.invitations.findUnique({
      where: { Invitation_id: parseInt(invitationId) },
      include: {
        user: {
          select: {
            User_id: true,
            FirstName: true,
            LastName: true
          }
        }
      }
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found'
      });
    }

    // Verify this invitation belongs to the logged-in user
    if (invitation.User_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Check if chat already exists
    const existingChat = await prisma.in_Chat.findFirst({
      where: {
        User_id: userId,
        Company_id: invitation.Company_id
      }
    });

    // Use transaction for atomic operation
    await prisma.$transaction(async (tx) => {
      // 1. Delete the invitation
      await tx.invitations.delete({
        where: { Invitation_id: parseInt(invitationId) }
      });

      // 2. Create notification for the company
      await tx.company_Notifications_History.create({
        data: {
          Company_id: invitation.Company_id,
          Type: 'New_Contact',
          Content: `${invitation.user.FirstName} ${invitation.user.LastName} accepted your invitation. You can now start chatting!`,
          Date: new Date()
        }
      });

      // 3. Create chat conversation (if it doesn't exist)
      if (!existingChat) {
        await tx.in_Chat.create({
          data: {
            User_id: userId,
            Company_id: invitation.Company_id,
            Status: 'Active'
          }
        });
      }
    });

    // ✅ INVALIDATE CACHE (Multi-side)
    // 1. User Stats (Invitations Count decreases)
    await redis.del(`dashboard:user:stats:${userId}`);
    
    // 2. Company Stats (Chat Count increases)
    await redis.del(`dashboard:company:stats:${invitation.Company_id}`);
    
    // 3. Company Chat List (New user appears)
    await redis.del(`dashboard:company:user_inchat:${invitation.Company_id}`);

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully',
      chatCreated: !existingChat
    });

  } catch (error) {
    console.error('Accept Invitation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to accept invitation',
      details: error.message
    });
  }

};

// ✅ Reject Invitation - Completely deletes from database
exports.rejectInvitation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { invitationId } = req.params;



    // Get invitation details
    const invitation = await prisma.invitations.findUnique({
      where: { Invitation_id: parseInt(invitationId) }
    });

    if (!invitation) {
      console.error('❌ Invitation not found:', invitationId);
      return res.status(404).json({
        success: false,
        error: 'Invitation not found'
      });
    }

    // Verify this invitation belongs to the logged-in user
    if (invitation.User_id !== userId) {
      console.error('❌ Unauthorized: Invitation belongs to different user');
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // ✅ DELETE invitation completely from database
    await prisma.invitations.delete({
      where: { Invitation_id: parseInt(invitationId) }
    });



    res.status(200).json({
      success: true,
      message: 'Invitation rejected and removed successfully'
    });

  } catch (error) {
    console.error('💥 Reject Invitation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject invitation',
      details: error.message
    });
  }
};

// Reject Application
exports.rejectApplication = async (req, res) => {
  try {
    const companyId = req.company.companyId;
    const { applicationId } = req.params;

    // Get application details
    const application = await prisma.job_Applications.findUnique({
      where: { Application_id: parseInt(applicationId) },
      include: {
        user: {
          select: {
            User_id: true,
            FirstName: true,
            LastName: true
          }
        },
        job: {
          select: {
            Job_role: true,
            Company_id: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Verify this application belongs to the company's job
    if (application.job.Company_id !== companyId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Update application status to Rejected
    await prisma.job_Applications.update({
      where: { Application_id: parseInt(applicationId) },
      data: { Status: 'Rejected' }
    });

    // Create notification for the user  
    await prisma.user_Notifications_History.create({
      data: {
        User_id: application.User_id,
        Type: 'Completed', // ✅ FIXED: Use valid enum value
        Content: `Your application for ${application.job.Job_role} has been declined.`,
        Date: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Application rejected successfully'
    });

  } catch (error) {
    console.error('Reject Application Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject application'
    });
  }

};