/*
  Warnings:

  - The `teamRole` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UpperTeamRoles" AS ENUM ('Team Captain', 'Engineering Team Manager', 'Business Team Manager', 'Electrical Co-Manager', 'Accounting Co-Manager', 'Assistant Accounting Manager', 'Communications Manager', 'Sponsorship Manager', 'Sponsorship Assistant Manager', 'Monetary Lead', 'In-Kind Lead', 'Software Team Lead', 'Embedded Team Lead', 'Telemetry Team Lead', 'Viscomm Team Lead', 'Arrays Lead', 'Energy Storage Lead', 'High Voltage Lead', 'Low Voltage Lead', 'Mechanical Manager', 'Suspension \& Steering Lead', 'Structures Lead', 'Electrical Integration Lead');

-- CreateEnum
CREATE TYPE "AccountingTeam" AS ENUM ('Accounting Analyst', 'Accounting Associate');

-- CreateEnum
CREATE TYPE "CommunicationsTeam" AS ENUM ('Event Associate', 'Marketing Associate', 'Videographer', 'Marketing \& Events Associate');

-- CreateEnum
CREATE TYPE "SponsorshipTeam" AS ENUM ('Sponsorship Associate');

-- CreateEnum
CREATE TYPE "SoftwareTeam" AS ENUM ('Embedded Team', 'Telemetry Team', 'Viscomm Team');

-- CreateEnum
CREATE TYPE "ElectricalTeam" AS ENUM ('Arrays Team', 'Energy Storage Team', 'High Voltage Team', 'Low Voltage Team', 'Electrical Team');

-- CreateEnum
CREATE TYPE "MechanicalTeam" AS ENUM ('Suspension \& Steering Team', 'Structures Team', 'Electrical Integration Team', 'Body \& Chassis Team');

-- CreateEnum
CREATE TYPE "MultiTeam" AS ENUM ('Multi Team');

-- CreateEnum
CREATE TYPE "AllTeamRoles" AS ENUM ('Team Captain', 'Engineering Team Manager', 'Business Team Manager', 'Software Team Lead', 'Embedded Team Lead', 'Telemetry Team Lead', 'Viscomm Team Lead', 'Embedded Team', 'Telemetry Team', 'Viscomm Team', 'Accounting Co-Manager', 'Assistant Accounting Manager', 'Accounting Analyst', 'Accounting Associate', 'Communications Manager', 'Event Associate', 'Marketing Associate', 'Videographer', 'Marketing \& Events Associate', 'Sponsorship Manager', 'Sponsorship Assistant Manager', 'Monetary Lead', 'In-Kind Lead', 'Sponsorship Associate', 'Electrical Co-Manager', 'Arrays Lead', 'Energy Storage Lead', 'High Voltage Lead', 'Low Voltage Lead', 'Arrays Team', 'Energy Storage Team', 'High Voltage Team', 'Low Voltage Team', 'Electrical Team', 'Mechanical Manager', 'Suspension \& Steering Lead', 'Structures Lead', 'Electrical Integration Lead', 'Suspension \& Steering Team', 'Structures Team', 'Electrical Integration Team', 'Body \& Chassis Team', 'Multi Team');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "teamRole",
ADD COLUMN     "teamRole" "AllTeamRoles";

-- DropEnum
DROP TYPE "TeamRole";
