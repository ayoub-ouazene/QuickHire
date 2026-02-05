/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Company_Email_key" ON "Company"("Email");

-- CreateIndex
CREATE INDEX "indx_company_notifications" ON "Company_Notifications_History"("Company_id", "Date" DESC);

-- CreateIndex
CREATE INDEX "indx_for_inchat_user" ON "In_Chat"("User_id");

-- CreateIndex
CREATE INDEX "indx_for_inchat_company" ON "In_Chat"("Company_id");

-- CreateIndex
CREATE INDEX "indx_job_by_company" ON "Job"("Company_id");

-- CreateIndex
CREATE INDEX "idx_job_applications" ON "Job_Applications"("Job_id");

-- CreateIndex
CREATE INDEX "indx_status_job_application" ON "Job_Applications"("Status");

-- CreateIndex
CREATE INDEX "ind_hiriing_history_of_user" ON "Job_Hiring_History"("User_id");

-- CreateIndex
CREATE INDEX "ind_hiriing_history_of_company" ON "Job_Hiring_History"("Company_id");

-- CreateIndex
CREATE INDEX "indx_getting_hires" ON "Job_Hiring_History"("User_id", "End_Date");

-- CreateIndex
CREATE INDEX "indx_user_messages" ON "Messages"("User_id");

-- CreateIndex
CREATE INDEX "Messages_ConversationId_Date_idx" ON "Messages"("ConversationId", "Date" DESC);

-- CreateIndex
CREATE INDEX "indx_company_messages" ON "Messages"("Company_id");

-- CreateIndex
CREATE INDEX "User_Status_idx" ON "User"("Status");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE INDEX "indx_user_notifications" ON "User_Notifications_History"("User_id", "Date" DESC);
