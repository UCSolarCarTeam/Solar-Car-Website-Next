/*
  Warnings:

  - Added the required column `SponsorLevel` to the `Sponsor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SponsorLevel" AS ENUM ('Gold', 'Silver', 'Bronze', 'Friends');

-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "SponsorLevel" "SponsorLevel" NOT NULL;
