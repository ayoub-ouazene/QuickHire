require('dotenv').config();
const prisma = require("../../config/prisma.js");
const redis = require('../../config/redis.js');

/**
 * Get Dashboard Statistics for Company
 * GET /Company/Dashboard
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const companyId = req.company.companyId;
        const redisKey = `dashboard:company:stats:${companyId}`;

        const cachedData = await redis.get(redisKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedData),
                source: 'cache'
            });
        }

        // Get counts for dashboard stats using Prisma (SQL injection safe)
        const [jobsCount, applicantsResult, usersInChatCount, hiredEmployeesCount] = await Promise.all([
            prisma.job.count({ where: { Company_id: companyId } }),
            prisma.job_Applications.count({
                where: { job: { Company_id: companyId } }
            }),
            prisma.in_Chat.count({ where: { Company_id: companyId } }),
            prisma.job_Hiring_History.count({ where: { Company_id: companyId } })
        ]);

        const responseData = {
            activeJobs: jobsCount,
            totalApplicants: applicantsResult,
            usersInChat: usersInChatCount,
            hiredEmployees: hiredEmployeesCount
        };

        await redis.set(redisKey, JSON.stringify(responseData), 'EX', 400);

        res.status(200).json({
            success: true,
            data: responseData,
            source: 'database'
        });

    } catch (error) {
        console.error('Get Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard statistics',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get Company's Job Posts
 * GET /Company/Dashboard/Jobs
 */
exports.getCompanyJobs = async (req, res) => {
    try {
        const companyId = req.company.companyId;
        const redisKey = `dashboard:company:jobs:${companyId}`;

        const cachedData = await redis.get(redisKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedData),
                source: 'cache'
            });
        }

        const jobs = await prisma.job.findMany({
            where: { Company_id: companyId },
            include: {
                Job_Skills: true,
                Job_Applications: {
                    select: { Application_id: true }
                }
            },
            orderBy: { Job_id: 'desc' }
        });

        const jobsWithApplicantsCount = jobs.map(job => ({
            id: job.Job_id,
            title: job.Job_role,
            type: job.Type,
            category: job.Category,
            description: job.Description,
            skills: job.Job_Skills.map(s => s.Name),
            applicantsCount: job.Job_Applications.length,
            postedDate: `Posted recently`
        }));

        await redis.set(redisKey, JSON.stringify(jobsWithApplicantsCount), 'EX', 300);

        res.status(200).json({
            success: true,
            data: jobsWithApplicantsCount,
            source: 'database'
        });

    } catch (error) {
        console.error('Get Company Jobs Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch company jobs',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get Users in Chat with the Company
 * GET /Company/Dashboard/InChat
 * Returns unique users with their accepted (InContact) job applications
 */
exports.getUsersInChat = async (req, res) => {
    try {
        const companyId = req.company.companyId;
        const redisKey = `dashboard:company:user_inchat:${companyId}`;

        const cachedData = await redis.get(redisKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedData),
                source: 'cache'
            });
        }

        const usersInChat = await prisma.in_Chat.findMany({
            where: { Company_id: companyId },
            include: {
                user: {
                    select: {
                        User_id: true,
                        FirstName: true,
                        LastName: true,
                        Email: true,
                        Photo: true,
                        Status: true,
                        Location: true,
                        // Include accepted applications for this company
                        Job_Applications: {
                            where: {
                                job: { Company_id: companyId },
                                Status: 'InContact'
                            },
                            select: {
                                Application_id: true,
                                Job_id: true,
                                job: {
                                    select: {
                                        Job_role: true,
                                        Type: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { ConversationId: 'desc' }
        });

        // Transform and ensure unique users (deduplicate by User_id)
        const seenUserIds = new Set();
        const transformedUsers = [];

        for (const chat of usersInChat) {
            if (seenUserIds.has(chat.user.User_id)) continue;
            seenUserIds.add(chat.user.User_id);

            transformedUsers.push({
                id: chat.user.User_id,
                conversationId: chat.ConversationId,
                name: `${chat.user.FirstName || ''} ${chat.user.LastName || ''}`.trim() || 'Unknown User',
                position: chat.user.Status || 'Job Seeker',
                email: chat.user.Email,
                photo: chat.user.Photo,
                location: chat.user.Location,
                chatStatus: chat.Status,
                message: `User is available for hire`,
                // Include all accepted applications for this user
                applications: chat.user.Job_Applications.map(app => ({
                    applicationId: app.Application_id,
                    jobId: app.Job_id,
                    jobRole: app.job?.Job_role || 'Unknown Role',
                    jobType: app.job?.Type || 'Unknown Type'
                }))
            });
        }

        await redis.set(redisKey, JSON.stringify(transformedUsers), 'EX', 500);

        res.status(200).json({
            success: true,
            data: transformedUsers,
            source: 'database'
        });

    } catch (error) {
        console.error('Get Users In Chat Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users in chat',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get Hired Employees
 * GET /Company/Dashboard/HiredEmployees
 */
exports.getHiredEmployees = async (req, res) => {
    try {
        const companyId = req.company.companyId;
        const redisKey = `dashboard:company:hired_employees:${companyId}`;

        const cachedData = await redis.get(redisKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedData),
                source: 'cache'
            });
        }

        const hiredEmployees = await prisma.job_Hiring_History.findMany({
            where: { Company_id: companyId },
            include: {
                user: {
                    select: {
                        User_id: true,
                        FirstName: true,
                        LastName: true,
                        Email: true,
                        Photo: true,
                        Status: true
                    }
                }
            },
            orderBy: { Start_Date: 'desc' }
        });

        const transformedEmployees = hiredEmployees.map(hire => {
            let status = 'Active';
            if (hire.End_Date && new Date(hire.End_Date) < new Date()) {
                status = 'Completed';
            } else if (hire.Start_Date && new Date(hire.Start_Date) > new Date()) {
                status = 'Onboarding';
            }

            return {
                id: hire.id,
                userId: hire.User_id,
                name: `${hire.user.FirstName || ''} ${hire.user.LastName || ''}`.trim() || 'Unknown User',
                position: hire.Job_Name || 'Employee',
                email: hire.user.Email,
                photo: hire.user.Photo,
                hireDate: hire.Start_Date ? `Hired ${formatRelativeDate(hire.Start_Date)}` : 'Recently',
                startDate: hire.Start_Date,
                endDate: hire.End_Date,
                status: status,
                userRating: hire.UserRating,
                companyRating: hire.CompanyRating
            };
        });

        await redis.set(redisKey, JSON.stringify(transformedEmployees), 'EX', 500);

        res.status(200).json({
            success: true,
            data: transformedEmployees,
            source: 'database'
        });

    } catch (error) {
        console.error('Get Hired Employees Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hired employees',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Hire a User (Create Job Hiring History)
 * POST /Company/Dashboard/Hire
 */
exports.hireUser = async (req, res) => {
    try {
        const companyId = req.company.companyId;
        const { userId, jobName, startDate, endDate } = req.body;

        if (!userId || !jobName || !startDate) {
            return res.status(400).json({ success: false, error: 'userId, jobName, and startDate are required' });
        }

        const userIdInt = parseInt(userId);
        if (isNaN(userIdInt)) return res.status(400).json({ success: false, error: 'Invalid userId format' });

        const userExists = await prisma.user.findUnique({ where: { User_id: userIdInt } });
        if (!userExists) return res.status(404).json({ success: false, error: 'User not found' });

        // Validate startDate - must be today or in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today

        let validStartDate = new Date(startDate);
        validStartDate.setHours(0, 0, 0, 0); // Normalize to start of day

        if (validStartDate < today) {
            // If start date is in the past, set it to today
            validStartDate = today;
        }

        // Create job hiring history
        const hiringRecord = await prisma.job_Hiring_History.create({
            data: {
                Company_id: companyId,
                User_id: userIdInt,
                Job_Name: jobName,
                Start_Date: validStartDate,
                End_Date: endDate ? new Date(endDate) : null
            },
            include: { user: true, company: true }
        });

        // If an applicationId was provided, validate it belongs to this user and company then delete that specific application
        if (req.body.applicationId !== undefined && req.body.applicationId !== null) {
            const appIdInt = parseInt(req.body.applicationId);
            if (isNaN(appIdInt)) return res.status(400).json({ success: false, error: 'Invalid applicationId format' });

            const application = await prisma.job_Applications.findUnique({
                where: { Application_id: appIdInt },
                include: { job: { select: { Company_id: true } } }
            });

            if (!application) return res.status(404).json({ success: false, error: 'Application not found' });
            if (application.User_id !== userIdInt) return res.status(400).json({ success: false, error: 'Application does not belong to the provided userId' });
            if (application.job.Company_id !== companyId) return res.status(403).json({ success: false, error: 'Unauthorized to delete this application' });

            await prisma.job_Applications.delete({ where: { Application_id: appIdInt } });

            // Invalidate company jobs cache since an applicant was removed
            await redis.del(`dashboard:company:jobs:${companyId}`);
        }

        // Remove from In_Chat only if user has no other accepted ('InContact') applications for this company
        const remainingAcceptedApps = await prisma.job_Applications.count({
            where: {
                User_id: userIdInt,
                job: { Company_id: companyId },
                Status: 'InContact'
            }
        });

        if (remainingAcceptedApps === 0) {
            await prisma.in_Chat.deleteMany({
                where: { Company_id: companyId, User_id: userIdInt }
            });
            // Invalidate chat cache for company since user was removed
            await redis.del(`dashboard:company:user_inchat:${companyId}`);
        } else {
            // Keep the user in chat because they have other accepted applications.
        }

        // ✅ INVALIDATE CACHE (User + Company)
        await redis.del(`dashboard:companies_worked:user:${userIdInt}`);
        await redis.del(`dashboard:user:stats:${userIdInt}`);
        await redis.del(`dashboard:company:stats:${companyId}`);
        await redis.del(`dashboard:company:hired_employees:${companyId}`);
        await redis.del(`dashboard:company:user_inchat:${companyId}`);

        res.status(201).json({
            success: true,
            message: 'User hired successfully',
            data: hiringRecord
        });

    } catch (error) {
        console.error('Hire User Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to hire user',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Refuse User - Delete specific job application
 * POST /Company/Dashboard/RefuseUser
 * Body: { userId, applicationId }
 */
exports.refuseUser = async (req, res) => {
    try {
        const companyId = req.company.companyId;
        const { userId, applicationId } = req.body;

        if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });

        const userIdInt = parseInt(userId);
        if (isNaN(userIdInt)) return res.status(400).json({ success: false, error: 'Invalid userId format' });

        // If applicationId provided, delete that specific application
        if (applicationId !== undefined && applicationId !== null) {
            const appIdInt = parseInt(applicationId);
            if (isNaN(appIdInt)) return res.status(400).json({ success: false, error: 'Invalid applicationId format' });

            // Validate the application belongs to this user and company
            const application = await prisma.job_Applications.findUnique({
                where: { Application_id: appIdInt },
                include: { job: { select: { Company_id: true } } }
            });

            if (!application) return res.status(404).json({ success: false, error: 'Application not found' });
            if (application.User_id !== userIdInt) return res.status(400).json({ success: false, error: 'Application does not belong to the provided userId' });
            if (application.job.Company_id !== companyId) return res.status(403).json({ success: false, error: 'Unauthorized to delete this application' });

            // Delete the specific application
            await prisma.job_Applications.delete({ where: { Application_id: appIdInt } });

            // Invalidate company jobs cache since an applicant was removed
            await redis.del(`dashboard:company:jobs:${companyId}`);
        }

        // Check if user has other accepted ('InContact') applications for this company
        const remainingAcceptedApps = await prisma.job_Applications.count({
            where: {
                User_id: userIdInt,
                job: { Company_id: companyId },
                Status: 'InContact'
            }
        });

        // Only remove from chat if no remaining accepted applications
        if (remainingAcceptedApps === 0) {
            await prisma.in_Chat.deleteMany({
                where: { Company_id: companyId, User_id: userIdInt }
            });
        }

        // ✅ INVALIDATE CACHE
        await redis.del(`dashboard:company:stats:${companyId}`);
        await redis.del(`dashboard:company:user_inchat:${companyId}`);
        await redis.del(`dashboard:user:stats:${userIdInt}`);

        res.status(200).json({
            success: true,
            message: remainingAcceptedApps === 0
                ? 'Application deleted and user removed from chat'
                : 'Application deleted, user remains in chat due to other accepted applications',
            remainingApplications: remainingAcceptedApps
        });

    } catch (error) {
        console.error('Refuse User Error:', error);
        res.status(500).json({ success: false, error: 'Failed to refuse user' });
    }
};

/**
 * Accept Applicant - Add user to In_Chat
 * POST /Company/Dashboard/AcceptApplicant/:applicationId
 */
exports.acceptApplicant = async (req, res) => {
    try {
        const companyId = req.company.companyId;
        const { applicationId } = req.params;
        const appIdInt = parseInt(applicationId);

        if (isNaN(appIdInt)) return res.status(400).json({ success: false, error: 'Invalid applicationId format' });

        const application = await prisma.job_Applications.findUnique({
            where: { Application_id: appIdInt },
            include: {
                user: { select: { User_id: true, FirstName: true, LastName: true } },
                job: { select: { Job_role: true, Company_id: true } }
            }
        });

        if (!application) return res.status(404).json({ success: false, error: 'Application not found' });
        if (application.job.Company_id !== companyId) return res.status(403).json({ success: false, error: 'Unauthorized' });

        // Add to Chat if not exists
        const existingChat = await prisma.in_Chat.findFirst({
            where: { Company_id: companyId, User_id: application.User_id }
        });

        if (!existingChat) {
            await prisma.in_Chat.create({
                data: { Company_id: companyId, User_id: application.User_id, Status: 'Active' }
            });
        }

        // Update application status
        await prisma.job_Applications.update({
            where: { Application_id: appIdInt },
            data: { Status: 'InContact' }
        });

        // ✅ INVALIDATE CACHE (User + Company)
        await redis.del(`dashboard:user:stats:${application.User_id}`);
        await redis.del(`dashboard:company:stats:${companyId}`);
        await redis.del(`dashboard:company:user_inchat:${companyId}`);

        // Notify User
        await prisma.user_Notifications_History.create({
            data: {
                User_id: application.User_id,
                Type: 'New_Contact',
                Content: `Your application for ${application.job.Job_role} has been accepted!`,
                Date: new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: 'Application accepted and user added to chat successfully',
            data: { userId: application.User_id, userName: `${application.user.FirstName} ${application.user.LastName}` }
        });

    } catch (error) {
        console.error('Accept Applicant Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to accept applicant',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Helper function
 */
function formatRelativeDate(date) {
    const now = new Date();
    const past = new Date(date);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
}