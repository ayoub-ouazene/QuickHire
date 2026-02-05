require('dotenv').config();
const prisma = require("../../config/prisma.js");
const redis = require('../../config/redis.js');

/**
 * Create a new job posting
 * POST /Company/PostJob
 */
exports.createJob = async (req, res) => {
    try {
        // Get Company_id from authenticated token
        const companyId = req.company.companyId;

        // Extract job data from request body
        const {
            Job_role,
            Type,
            Category,
            Skills,
            Description,
            Responsibilities,
            WhoYouAre,
            NiceToHave
        } = req.body;

        // Validate required fields
        if (!Job_role || !Type || !Category) {
            return res.status(400).json({
                success: false,
                error: 'Job_role, Type, and Category are required fields'
            });
        }

        // Validate Skills is an array if provided
        if (Skills && !Array.isArray(Skills)) {
            return res.status(400).json({
                success: false,
                error: 'Skills must be an array'
            });
        }

        // Create job with associated skills using Prisma transaction
        // Prisma automatically prevents SQL injection through parameterized queries
        const newJob = await prisma.job.create({
            data: {
                Company_id: companyId,
                Job_role,
                Type,
                Category,
                Description,
                Responsibilities,
                WhoYouAre,
                NiceToHave,
                // Create JobSkill entries if skills are provided
                Job_Skills: Skills && Skills.length > 0 ? {
                    create: Skills.map(skillName => ({
                        Name: skillName
                    }))
                } : undefined
            },
            include: {
                Job_Skills: true, // Include skills in response
                company: {
                    select: {
                        Company_id: true,
                        Name: true,
                        Logo: true,
                        MainLocation: true
                    }
                }
            }
        });

        await redis.del(`dashboard:company:jobs:${companyId}`);
        await redis.del(`dashboard:company:stats:${companyId}`);

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            data: newJob
        });

    } catch (error) {
        console.error('Create Job Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create job posting',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
