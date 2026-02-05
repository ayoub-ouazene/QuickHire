require('dotenv').config();
const prisma = require("../../config/prisma.js");
const redis  = require("../../config/redis.js");

/**
 * Get Dashboard Statistics for User
 * GET /User/Dashboard
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cacheKey = `dashboard:user:stats:${userId}`;

        // 1. Try Cache
        const cachedData = await redis.get(cacheKey);
        if(cachedData) {
             return res.status(200).json({
                success: true,
                data: JSON.parse(cachedData),
                source: 'cache'
            });
        }

        // 2. Query DB (Parallel)
        const [companiesWorkedCount, activeProjectsCount, applicationsCount, invitationsCount] = await Promise.all([
            prisma.job_Hiring_History.count({ where: { User_id: userId } }),
            prisma.job_Hiring_History.count({
                where: {
                    User_id: userId,
                    OR: [ { End_Date: null }, { End_Date: { gt: new Date() } } ]
                }
            }),
            prisma.job_Applications.count({ where: { User_id: userId } }),
            prisma.invitations.count({ where: { User_id: userId } })
        ]);

        const responseData = {
            companiesWorked: companiesWorkedCount,
            activeProjects: activeProjectsCount,
            applications: applicationsCount,
            invitations: invitationsCount
        };

        // 3. Save to Cache (500s = ~8 mins)
        await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 500); 

        res.status(200).json({
            success: true,
            data: responseData,
            source: 'database'
        });

    } catch (error) {
        console.error('Get User Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard statistics',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get Companies User has Worked With
 * GET /User/Dashboard/CompaniesWorked
 */
exports.getCompaniesWorked = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cacheKey = `dashboard:companies_worked:user:${userId}`;

        // 1. Try Cache
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
             return res.status(200).json({
                success: true,
                data: JSON.parse(cachedData),
                source: 'cache'
            });
        }

        // 2. Query DB
        const companiesWorked = await prisma.job_Hiring_History.findMany({
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
            orderBy: { Start_Date: 'desc' }
        });

        // Transform data
        const transformedCompanies = companiesWorked.map(hire => {
            let status = 'Active';
            if (hire.End_Date && new Date(hire.End_Date) < new Date()) {
                status = 'Completed';
            }

            let duration = 'Present';
            if (hire.Start_Date) {
                const startDate = new Date(hire.Start_Date);
                const endDate = hire.End_Date ? new Date(hire.End_Date) : new Date();
                const startMonth = startDate.toLocaleString('default', { month: 'short', year: 'numeric' });
                const endStr = hire.End_Date
                    ? endDate.toLocaleString('default', { month: 'short', year: 'numeric' })
                    : 'Present';
                duration = `${startMonth} - ${endStr}`;
            }

            return {
                id: hire.id,
                companyId: hire.Company_id,
                name: hire.company.Name || 'Unknown Company',
                logo: hire.company.Logo,
                industry: hire.company.Industry,
                location: hire.company.MainLocation,
                rating: hire.company.Rating,
                position: hire.Job_Name || 'Employee',
                duration: duration,
                startDate: hire.Start_Date,
                endDate: hire.End_Date,
                status: status,
                userRating: hire.UserRating,
                companyRating: hire.CompanyRating
            };
        });

        // 3. Save to Cache
        await redis.set(cacheKey, JSON.stringify(transformedCompanies), 'EX', 400);

        res.status(200).json({
            success: true,
            data: transformedCompanies,
            source: 'database'
        });

    } catch (error) {
        console.error('Get Companies Worked Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch companies worked with',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};