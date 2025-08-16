/*
  Warnings:

  - The values [Software Team Lead] on the enum `AllTeamRoles` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AllTeamRoles_new" AS ENUM ('Team Captain', 'Engineering Team Manager', 'Business Team Manager', 'Software Team Manager', 'Software Technical Manager', 'Embedded Team Lead', 'Telemetry Team Lead', 'Viscomm Team Lead', 'Embedded Team', 'Telemetry Team', 'Viscomm Team', 'Accounting Co-Manager', 'Assistant Accounting Manager', 'Accounting Analyst', 'Accounting Associate', 'Communications Manager', 'Event Associate', 'Marketing Associate', 'Videographer', 'Marketing \& Events Associate', 'Sponsorship Manager', 'Sponsorship Assistant Manager', 'Monetary Lead', 'In-Kind Lead', 'Sponsorship Associate', 'Electrical Manager', 'Electrical Co-Manager', 'Electrical Technical Manager', 'Arrays Lead', 'Energy Storage Lead', 'High Voltage Lead', 'Low Voltage Lead', 'Arrays Team', 'Energy Storage Team', 'High Voltage Team', 'Low Voltage Team', 'Electrical Team', 'Mechanical Manager', 'Mechanical Technical Manager', 'Suspension \& Steering Lead', 'Structures Lead', 'Electrical Integration Lead', 'Suspension \& Steering Team', 'Structures Team', 'Electrical Integration Team', 'Body \& Chassis Team', 'Multi Team');
ALTER TABLE "User" ALTER COLUMN "teamRole" TYPE "AllTeamRoles_new" USING ("teamRole"::text::"AllTeamRoles_new");
ALTER TYPE "AllTeamRoles" RENAME TO "AllTeamRoles_old";
ALTER TYPE "AllTeamRoles_new" RENAME TO "AllTeamRoles";
DROP TYPE "AllTeamRoles_old";
COMMIT;

-- DropIndex
DROP INDEX "User_ucid_key";

-- CreateTable
CREATE TABLE "Recruitment" (
    "id" SERIAL NOT NULL,
    "header" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Recruitment_pkey" PRIMARY KEY ("id")
);
