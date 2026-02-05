const prisma = require("../../config/prisma")


const GetAllNotifications = async (req, res) => {
    try {
        const { id, type, page = 1, limit = 5 } = req.query;
        const userId = Number(id);
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const whereClause = type === "user" ? { User_id: userId } : { Company_id: userId };
        const model = type === "user" ? prisma.user_Notifications_History : prisma.Company_Notifications_History;

        // 1. Fetch count and data in parallel
        // FIXED: Changed from $transaction to Promise.all to prevent P2028 Timeout
        const [notifications, totalCount] = await Promise.all([
            model.findMany({
                where: whereClause,
                orderBy: { Date: 'desc' },
                skip: skip,
                take: take,
            }),
            model.count({ where: whereClause })
        ]);

        // 2. Rating Logic (Same as yours, but scoped to only the 'take' results)
        const completedNotificationIds = notifications
            .filter(n => n.Type === 'Completed')
            .map(n => n.Notification_id);

        let ratedStatusMap = {};
        if (completedNotificationIds.length > 0) {
            if (type === "user") {
                const historyRecords = await prisma.Job_Hiring_History.findMany({
                    where: { UserNotificationId: { in: completedNotificationIds } },
                    select: { UserNotificationId: true, CompanyRating: true }
                });
                historyRecords.forEach(r => ratedStatusMap[r.UserNotificationId] = r.CompanyRating !== null);
            } else {
                const historyRecords = await prisma.Job_Hiring_History.findMany({
                    where: { CompanyNotificationId: { in: completedNotificationIds } },
                    select: { CompanyNotificationId: true, UserRating: true }
                });
                historyRecords.forEach(r => ratedStatusMap[r.CompanyNotificationId] = r.UserRating !== null);
            }
        }

        const finalNotifications = notifications.map(notification => ({
            ...notification,
            isRated: notification.Type === 'Completed' ? (ratedStatusMap[notification.Notification_id] || false) : false
        }));

        res.status(200).json({
            data: finalNotifications,
            totalCount: totalCount
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to fetch" });
    }
}

const DeleteNotification = async (req, res) => {
    const { id, type } = req.body;
    const { notification_id } = req.params;

    const notification = await (type == "user" ?
        prisma.User_Notifications_History.delete({
            where: {
                User_id: Number(id),
                Notification_id: Number(notification_id)
            },
        })
        :
        prisma.Company_Notifications_History.delete({
            where: {
                Company_id: Number(id),
                Notification_id: Number(notification_id)

            }
        })
    )

    res.status(200).json(notification);
}


const DeleteAll = async (req, res) => {
    const { id, type } = req.body;

    const notifications = await (type == "user" ?
        prisma.User_Notifications_History.deleteMany({
            where: { User_id: Number(id) },
        })
        :
        prisma.Company_Notifications_History.deleteMany({
            where: { Company_id: Number(id) }
        })
    )

    res.status(200).json(notifications);


}


const AddNotification = async (req, res) => {
    try {
        const { id, type, Notification_Type, Content } = req.body;

        const notification = await (type === "user" ?
            prisma.user_Notifications_History.create({
                data: {
                    User_id: Number(id),
                    Content: Content,
                    Date: new Date(),
                    Type: Notification_Type.trim()
                },
            })
            :
            prisma.company_Notifications_History.create({ // Changed deleteMany to create
                data: {
                    Company_id: Number(id),
                    Content: Content,
                    Date: new Date(),
                    Type: Notification_Type.trim()
                },
            })
        );

        return res.status(201).json({
            success: true,
            data: notification
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}


const submitRating = async (req, res) => {
    // 1. We now receive 'notificationId' instead of 'historyId'
    const { notificationId, rating, role } = req.body;

    try {
        // 2. Determine which column to search based on who is submitting
        let searchCriteria = {};
        let fieldToUpdate = '';

        if (role === 'user') {

            searchCriteria = { UserNotificationId: parseInt(notificationId) };
            fieldToUpdate = 'CompanyRating';
        } else {
            // If a Company is submitting, we look for the row where 'CompanyNotificationId' matches
            // And we want to update the 'UserRating' column
            searchCriteria = { CompanyNotificationId: parseInt(notificationId) };
            fieldToUpdate = 'UserRating';
        }

        // 3. Find the specific History record linked to this notification
        const historyRecord = await prisma.job_Hiring_History.findFirst({
            where: searchCriteria
        });

        if (!historyRecord) {
            return res.status(404).json({ success: false, error: "No job history found for this notification." });
        }

        // 4. Update the Rating on that specific History record
        await prisma.job_Hiring_History.update({
            where: { id: historyRecord.id },
            data: { [fieldToUpdate]: Number(rating) }
        });

        // 5. Calculate and Sync the Average Rating (Logic remains similar, using data from the found record)
        if (role === 'user') {
            // User rated Company -> Recalculate Company's Average
            const stats = await prisma.job_Hiring_History.aggregate({
                where: { Company_id: historyRecord.Company_id },
                _avg: { CompanyRating: true }
            });

            await prisma.company.update({
                where: { Company_id: historyRecord.Company_id },
                data: { Rating: stats._avg.CompanyRating || 0 } // Default to 0 if null
            });

        } else {
            // Company rated User -> Recalculate User's Average
            const stats = await prisma.job_Hiring_History.aggregate({
                where: { User_id: historyRecord.User_id },
                _avg: { UserRating: true }
            });

            await prisma.user.update({
                where: { User_id: historyRecord.User_id },
                data: { Rating: stats._avg.UserRating || 0 } // Default to 0 if null
            });
        }

        res.status(200).json({
            success: true,
            message: "Rating submitted and profile average updated."
        });

    } catch (error) {
        console.error("Rating Error:", error);
        res.status(500).json({ success: false, error: "Failed to process rating." });
    }
};


module.exports = {
    GetAllNotifications,
    DeleteAll,
    DeleteNotification,
    AddNotification,
    submitRating,

}