/*
  Warnings:

  - Added the required column `expiresAt` to the `Recruitment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recruitment" ADD COLUMN "expiresAt" TIMESTAMP NOT NULL DEFAULT NOW();