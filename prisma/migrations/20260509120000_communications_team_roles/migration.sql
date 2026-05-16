-- AlterEnum: replace legacy communications roles with Communications Co-Manager / Communications Associate
BEGIN;

ALTER TABLE "User" ALTER COLUMN "teamRole" TYPE TEXT USING ("teamRole"::text);

UPDATE "User"
SET "teamRole" = 'Communications Associate'
WHERE "teamRole" IN (
  'Event Associate',
  'Marketing Associate',
  'Videographer',
  'Marketing \& Events Associate'
);

DROP TYPE "AllTeamRoles";

CREATE TYPE "AllTeamRoles" AS ENUM (
  'Team Captain',
  'Engineering Team Manager',
  'Business Team Manager',
  'Software Team Manager',
  'Software Technical Manager',
  'Embedded Team Lead',
  'Telemetry Team Lead',
  'Viscomm Team Lead',
  'Embedded Team',
  'Telemetry Team',
  'Viscomm Team',
  'Accounting Co-Manager',
  'Assistant Accounting Manager',
  'Accounting Analyst',
  'Accounting Associate',
  'Communications Manager',
  'Communications Co-Manager',
  'Communications Associate',
  'Sponsorship Manager',
  'Sponsorship Assistant Manager',
  'Monetary Lead',
  'In-Kind Lead',
  'Sponsorship Associate',
  'Electrical Manager',
  'Electrical Co-Manager',
  'Electrical Technical Manager',
  'Arrays Lead',
  'Energy Storage Lead',
  'High Voltage Lead',
  'Low Voltage Lead',
  'Arrays Team',
  'Energy Storage Team',
  'High Voltage Team',
  'Low Voltage Team',
  'Electrical Team',
  'Mechanical Manager',
  'Mechanical Technical Manager',
  'Suspension \& Steering Lead',
  'Structures Lead',
  'Electrical Integration Lead',
  'Body \& Chassis Lead',
  'Suspension \& Steering Team',
  'Structures Team',
  'Electrical Integration Team',
  'Body \& Chassis Team',
  'Multi Team'
);

ALTER TABLE "User" ALTER COLUMN "teamRole" TYPE "AllTeamRoles" USING ("teamRole"::"AllTeamRoles");

COMMIT;
