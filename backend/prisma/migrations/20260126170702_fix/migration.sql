/*
  Warnings:

  - The `Type` column on the `Company_Notifications_History` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Company_Notifications_History" DROP COLUMN "Type",
ADD COLUMN     "Type" "NotificationStatus";
