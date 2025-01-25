-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('Team Captain', 'Engineering Team Manager', 'Business Team Manager', 'Software Team Lead', 'Embedded Team Lead', 'Telemetry Team Lead', 'Viscomm Team Lead', 'Embedded Team', 'Telemetry Team', 'Viscomm Team', 'Accounting Co-Manager', 'Assistant Accounting Manager', 'Accounting Analyst', 'Accounting Associate', 'Communications Manager', 'Event Associate', 'Marketing Associate', 'Videographer', 'Marketing \& Events Associate', 'Sponsorship Manager', 'Sponsorship Associate', 'Monetary Lead', 'Sponsorship Assistant Manager', 'In-Kind Lead', 'Electrical Co-Manager', 'Arrays Lead', 'Energy Storage Lead', 'High Voltage Lead', 'Low Voltage Lead', 'Arrays Team', 'Energy Storage Team', 'High Voltage Team', 'Low Voltage Team', 'Electrical Team', 'Mechanical Manager', 'Suspension \& Steering Lead', 'Structures Lead', 'Electrical Integration Lead', 'Suspension \& Steering Team', 'Structures Team', 'Electrical Integration Team', 'Body \& Chassis Team', 'Multi Team');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "ucid" INTEGER,
    "schoolEmail" TEXT,
    "phoneNumber" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "fieldOfStudy" TEXT,
    "teamRole" "TeamRole",
    "schoolYear" TEXT,
    "yearJoined" TEXT,
    "profilePictureUrl" TEXT,
    "description" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_ucid_key" ON "User"("ucid");

-- CreateIndex
CREATE UNIQUE INDEX "User_schoolEmail_key" ON "User"("schoolEmail");
