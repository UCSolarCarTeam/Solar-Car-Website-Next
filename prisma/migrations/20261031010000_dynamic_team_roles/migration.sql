-- Preserve role names and assignments while replacing the fixed enum with a managed catalog.
BEGIN;

ALTER TABLE "User" ALTER COLUMN "teamRole" TYPE TEXT USING ("teamRole"::text);

CREATE TABLE "TeamRole" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "section" TEXT NOT NULL,
  "adminOnly" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "modifiedBy" TEXT NOT NULL DEFAULT 'SYSTEM',
  CONSTRAINT "TeamRole_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TeamRole_name_key" ON "TeamRole"("name");
-- Role names are unique regardless of capitalization.
CREATE UNIQUE INDEX "TeamRole_name_insensitive_key" ON "TeamRole"(LOWER("name"));

INSERT INTO "TeamRole" ("name", "section", "adminOnly", "sortOrder") VALUES
  ('Team Captain', 'Co-Chairs', true, 0),
  ('Engineering Team Manager', 'Co-Chairs', true, 1),
  ('Business Team Manager', 'Co-Chairs', true, 2),
  ('Software Team Manager', 'Subteam Managers', true, 103),
  ('Software Technical Manager', 'Subteam Managers', true, 104),
  ('Embedded Team Lead', 'Team Leads', true, 205),
  ('Telemetry Team Lead', 'Team Leads', true, 206),
  ('Viscomm Team Lead', 'Team Leads', true, 207),
  ('Embedded Team', 'Software Team', false, 508),
  ('Telemetry Team', 'Software Team', false, 509),
  ('Viscomm Team', 'Software Team', false, 510),
  ('Accounting Co-Manager', 'Subteam Managers', true, 111),
  ('Assistant Accounting Manager', 'Subteam Managers', true, 112),
  ('Accounting Analyst', 'Accounting Team', false, 613),
  ('Accounting Associate', 'Accounting Team', false, 614),
  ('Communications Manager', 'Subteam Managers', true, 115),
  ('Communications Co-Manager', 'Subteam Managers', true, 116),
  ('Communications Associate', 'Communications Team', false, 717),
  ('Sponsorship Manager', 'Subteam Managers', true, 118),
  ('Sponsorship Assistant Manager', 'Subteam Managers', true, 119),
  ('Monetary Lead', 'Team Leads', true, 220),
  ('In-Kind Lead', 'Team Leads', true, 221),
  ('Sponsorship Associate', 'Sponsorship Team', false, 822),
  ('Electrical Manager', 'Subteam Managers', true, 123),
  ('Electrical Co-Manager', 'Subteam Managers', true, 124),
  ('Electrical Technical Manager', 'Subteam Managers', true, 125),
  ('Arrays Lead', 'Team Leads', true, 226),
  ('Energy Storage Lead', 'Team Leads', true, 227),
  ('High Voltage Lead', 'Team Leads', true, 228),
  ('Low Voltage Lead', 'Team Leads', true, 229),
  ('Arrays Team', 'Electrical Team', false, 430),
  ('Energy Storage Team', 'Electrical Team', false, 431),
  ('High Voltage Team', 'Electrical Team', false, 432),
  ('Low Voltage Team', 'Electrical Team', false, 433),
  ('Electrical Team', 'Electrical Team', false, 434),
  ('Mechanical Manager', 'Subteam Managers', true, 135),
  ('Mechanical Technical Manager', 'Subteam Managers', true, 136),
  ('Suspension & Steering Lead', 'Team Leads', true, 237),
  ('Structures Lead', 'Team Leads', true, 238),
  ('Electrical Integration Lead', 'Team Leads', true, 239),
  ('Body & Chassis Lead', 'Team Leads', true, 240),
  ('Suspension & Steering Team', 'Mechanical Team', false, 341),
  ('Structures Team', 'Mechanical Team', false, 342),
  ('Electrical Integration Team', 'Mechanical Team', false, 343),
  ('Body & Chassis Team', 'Mechanical Team', false, 344),
  ('Multi Team Lead', 'Team Leads', true, 245),
  ('Multi Team', 'Multi Team', false, 946);

UPDATE "User" SET "teamRole" = 'Suspension & Steering Lead' WHERE "teamRole" = 'Suspension \& Steering Lead';
UPDATE "User" SET "teamRole" = 'Body & Chassis Lead' WHERE "teamRole" = 'Body \& Chassis Lead';
UPDATE "User" SET "teamRole" = 'Suspension & Steering Team' WHERE "teamRole" = 'Suspension \& Steering Team';
UPDATE "User" SET "teamRole" = 'Body & Chassis Team' WHERE "teamRole" = 'Body \& Chassis Team';

ALTER TABLE "User" ADD CONSTRAINT "User_teamRole_fkey"
  FOREIGN KEY ("teamRole") REFERENCES "TeamRole"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
DROP TYPE "AllTeamRoles";

COMMIT;
