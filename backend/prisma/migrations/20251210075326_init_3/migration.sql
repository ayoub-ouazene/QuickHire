-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('JobSeeker', 'CurrentlyWorking');

-- CreateEnum
CREATE TYPE "NotifictionStatus" AS ENUM ('Hired', 'New', 'Completed');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Rejected', 'Applied', 'InContact');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('company', 'user');

-- CreateTable
CREATE TABLE "User" (
    "User_id" SERIAL NOT NULL,
    "FirstName" TEXT,
    "LastName" TEXT,
    "Number" TEXT,
    "Email" TEXT,
    "Password" TEXT,
    "Rating" DOUBLE PRECISION,
    "Status" "UserStatus",
    "Location" TEXT,
    "LinkedInLink" TEXT,
    "Website" TEXT,
    "Description" TEXT,
    "Photo" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("User_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "Company_id" SERIAL NOT NULL,
    "Name" TEXT,
    "Logo" TEXT,
    "Website" TEXT,
    "FoundationDate" TIMESTAMP(3),
    "Employees_Number" INTEGER,
    "Industry" TEXT,
    "Description" TEXT,
    "Rating" DOUBLE PRECISION,
    "Email" TEXT,
    "LinkedInLink" TEXT,
    "MainLocation" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("Company_id")
);

-- CreateTable
CREATE TABLE "In_Chat" (
    "User_id" INTEGER NOT NULL,
    "Company_id" INTEGER NOT NULL,
    "Status" TEXT,

    CONSTRAINT "In_Chat_pkey" PRIMARY KEY ("User_id","Company_id")
);

-- CreateTable
CREATE TABLE "User_Experience" (
    "Experience_id" SERIAL NOT NULL,
    "User_id" INTEGER NOT NULL,
    "Title" TEXT,
    "Start_date" TIMESTAMP(3),
    "End_date" TIMESTAMP(3),
    "Company_Name" TEXT,
    "Company_location" TEXT,
    "Job_type" TEXT,
    "Description" TEXT,
    "Company_logo" TEXT,

    CONSTRAINT "User_Experience_pkey" PRIMARY KEY ("Experience_id")
);

-- CreateTable
CREATE TABLE "User_Skills" (
    "Skill_id" SERIAL NOT NULL,
    "User_id" INTEGER NOT NULL,
    "Title" TEXT,
    "Description" TEXT,
    "Skill_confidence" INTEGER,

    CONSTRAINT "User_Skills_pkey" PRIMARY KEY ("Skill_id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "Manager_id" SERIAL NOT NULL,
    "Company_id" INTEGER NOT NULL,
    "Manager_Photo" TEXT,
    "FirstName" TEXT,
    "LastName" TEXT,
    "Role" TEXT,
    "Email" TEXT,
    "LinkedInLink" TEXT,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("Manager_id")
);

-- CreateTable
CREATE TABLE "Job" (
    "Job_id" SERIAL NOT NULL,
    "Company_id" INTEGER NOT NULL,
    "Job_role" TEXT,
    "Type" TEXT,
    "Category" TEXT,
    "Description" TEXT,
    "Responsibilities" TEXT,
    "WhoYouAre" TEXT,
    "NiceToHave" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("Job_id")
);

-- CreateTable
CREATE TABLE "JobSkill" (
    "Skill_id" SERIAL NOT NULL,
    "Job_id" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "JobSkill_pkey" PRIMARY KEY ("Skill_id")
);

-- CreateTable
CREATE TABLE "Job_Applications" (
    "Application_id" SERIAL NOT NULL,
    "User_id" INTEGER NOT NULL,
    "Job_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "Status" "ApplicationStatus",

    CONSTRAINT "Job_Applications_pkey" PRIMARY KEY ("Application_id")
);

-- CreateTable
CREATE TABLE "Invitations" (
    "Invitation_id" SERIAL NOT NULL,
    "Company_id" INTEGER NOT NULL,
    "User_id" INTEGER NOT NULL,
    "Job_Name" TEXT,
    "Type" TEXT,
    "Date" TIMESTAMP(3),

    CONSTRAINT "Invitations_pkey" PRIMARY KEY ("Invitation_id")
);

-- CreateTable
CREATE TABLE "Job_Hiring_History" (
    "Company_id" INTEGER NOT NULL,
    "User_id" INTEGER NOT NULL,
    "Job_Name" TEXT,
    "Start_Date" TIMESTAMP(3),
    "End_Date" TIMESTAMP(3),

    CONSTRAINT "Job_Hiring_History_pkey" PRIMARY KEY ("Company_id","User_id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "Message_id" SERIAL NOT NULL,
    "User_id" INTEGER NOT NULL,
    "Company_id" INTEGER NOT NULL,
    "Content" TEXT,
    "Date" TIMESTAMP(3),
    "Sender" "SenderType",

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("Message_id")
);

-- CreateTable
CREATE TABLE "User_Notifications_History" (
    "Notification_id" SERIAL NOT NULL,
    "User_id" INTEGER NOT NULL,
    "Content" TEXT,
    "Date" TIMESTAMP(3),
    "Type" "NotifictionStatus",

    CONSTRAINT "User_Notifications_History_pkey" PRIMARY KEY ("Notification_id")
);

-- CreateTable
CREATE TABLE "Company_Notifications_History" (
    "Notification_id" SERIAL NOT NULL,
    "Company_id" INTEGER NOT NULL,
    "Content" TEXT,
    "Date" TIMESTAMP(3),
    "Type" TEXT,

    CONSTRAINT "Company_Notifications_History_pkey" PRIMARY KEY ("Notification_id")
);

-- AddForeignKey
ALTER TABLE "In_Chat" ADD CONSTRAINT "In_Chat_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "In_Chat" ADD CONSTRAINT "In_Chat_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Experience" ADD CONSTRAINT "User_Experience_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Skills" ADD CONSTRAINT "User_Skills_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSkill" ADD CONSTRAINT "JobSkill_Job_id_fkey" FOREIGN KEY ("Job_id") REFERENCES "Job"("Job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Applications" ADD CONSTRAINT "Job_Applications_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Applications" ADD CONSTRAINT "Job_Applications_Job_id_fkey" FOREIGN KEY ("Job_id") REFERENCES "Job"("Job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Hiring_History" ADD CONSTRAINT "Job_Hiring_History_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Hiring_History" ADD CONSTRAINT "Job_Hiring_History_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Notifications_History" ADD CONSTRAINT "User_Notifications_History_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company_Notifications_History" ADD CONSTRAINT "Company_Notifications_History_Company_id_fkey" FOREIGN KEY ("Company_id") REFERENCES "Company"("Company_id") ON DELETE RESTRICT ON UPDATE CASCADE;
