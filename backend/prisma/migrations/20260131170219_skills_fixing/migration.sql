/*
  Warnings:

  - You are about to drop the column `Skill_confidence` on the `User_Skills` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User_Skills" DROP COLUMN "Skill_confidence",
ADD COLUMN     "Skill_Certification" TEXT;
