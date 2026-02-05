/*
  Warnings:

  - A unique constraint covering the columns `[UserNotificationId]` on the table `Job_Hiring_History` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CompanyNotificationId]` on the table `Job_Hiring_History` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Job_Hiring_History" ADD COLUMN     "CompanyNotificationId" INTEGER,
ADD COLUMN     "UserNotificationId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Job_Hiring_History_UserNotificationId_key" ON "Job_Hiring_History"("UserNotificationId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_Hiring_History_CompanyNotificationId_key" ON "Job_Hiring_History"("CompanyNotificationId");
