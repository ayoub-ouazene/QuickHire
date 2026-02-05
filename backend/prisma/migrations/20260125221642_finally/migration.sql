/*
  Warnings:

  - The primary key for the `Job_Hiring_History` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Job_Hiring_History" DROP CONSTRAINT "Job_Hiring_History_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Job_Hiring_History_pkey" PRIMARY KEY ("id");
