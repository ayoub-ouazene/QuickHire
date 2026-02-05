-- CreateIndex
CREATE INDEX "idx_invitations_company_user" ON "Invitations"("Company_id", "User_id");

-- CreateIndex
CREATE INDEX "idx_job_applications_user_job" ON "Job_Applications"("User_id", "Job_id");
