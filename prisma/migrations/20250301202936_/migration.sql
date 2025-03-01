/*
  Warnings:

  - You are about to drop the column `SponsorLevel` on the `Sponsor` table. All the data in the column will be lost.
  - Added the required column `sponsorLevel` to the `Sponsor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sponsor" DROP COLUMN "SponsorLevel",
ADD COLUMN     "sponsorLevel" "SponsorLevel" NOT NULL;
