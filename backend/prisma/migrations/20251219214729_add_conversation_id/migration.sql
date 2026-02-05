/*
  Warnings:

  - The primary key for the `In_Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `Type` column on the `User_Notifications_History` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `ConversationId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('Hired', 'New', 'Completed');

-- DropForeignKey
ALTER TABLE "Company_Notifications_History" DROP CONSTRAINT "Company_Notifications_History_Company_id_fkey";

-- DropForeignKey
ALTER TABLE "In_Chat" DROP CONSTRAINT "In_Chat_User_id_fkey";

-- DropForeignKey
ALTER TABLE "Invitations" DROP CONSTRAINT "Invitations_Company_id_fkey";

-- DropForeignKey
ALTER TABLE "Invitations" DROP CONSTRAINT "Invitations_User_id_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_Company_id_fkey";

-- DropForeignKey
ALTER TABLE "JobSkill" DROP CONSTRAINT "JobSkill_Job_id_fkey";

-- DropForeignKey
ALTER TABLE "Job_Applications" DROP CONSTRAINT "Job_Applications_Job_id_fkey";

-- DropForeignKey
ALTER TABLE "Job_Applications" DROP CONSTRAINT "Job_Applications_User_id_fkey";

-- DropForeignKey
ALTER TABLE "Job_Hiring_History" DROP CONSTRAINT "Job_Hiring_History_Company_id_fkey";

-- DropForeignKey
ALTER TABLE "Job_Hiring_History" DROP CONSTRAINT "Job_Hiring_History_User_id_fkey";

-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_Company_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_Company_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_User_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Experience" DROP CONSTRAINT "User_Experience_User_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Notifications_History" DROP CONSTRAINT "User_Notifications_History_User_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Skills" DROP CONSTRAINT "User_Skills_User_id_fkey";

-- AlterTable
ALTER TABLE "In_Chat" DROP CONSTRAINT "In_Chat_pkey",
ADD COLUMN     "ConversationId" SERIAL NOT NULL,
ADD CONSTRAINT "In_Chat_pkey" PRIMARY KEY ("ConversationId");

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "ConversationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User_Notifications_History" DROP COLUMN "Type",
ADD COLUMN     "Type" "NotificationStatus";

-- DropEnum
DROP TYPE "NotifictionStatus";

-- AddForeignKey
ALTER TABLE "In_Chat" ADD CONSTRAINT "In_Chat_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Experience" ADD CONSTRAINT "User_Experience_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Skills" ADD CONSTRAINT "User_Skills_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSkill" ADD CONSTRAINT "JobSkill_Job_id_fkey" FOREIGN KEY ("Job_id") REFERENCES "Job"("Job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Applications" ADD CONSTRAINT "Job_Applications_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Applications" ADD CONSTRAINT "Job_Applications_Job_id_fkey" FOREIGN KEY ("Job_id") REFERENCES "Job"("Job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Hiring_History" ADD CONSTRAINT "Job_Hiring_History_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Hiring_History" ADD CONSTRAINT "Job_Hiring_History_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_ConversationId_fkey" FOREIGN KEY ("ConversationId") REFERENCES "In_Chat"("ConversationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Notifications_History" ADD CONSTRAINT "User_Notifications_History_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company_Notifications_History" ADD CONSTRAINT "Company_Notifications_History_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE CASCADE ON UPDATE CASCADE;
