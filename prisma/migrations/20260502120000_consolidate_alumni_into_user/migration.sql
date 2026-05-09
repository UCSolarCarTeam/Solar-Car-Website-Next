-- Add yearRetired to User
ALTER TABLE "User" ADD COLUMN "yearRetired" TEXT;

-- Make clerkUserId nullable
ALTER TABLE "User" ALTER COLUMN "clerkUserId" DROP NOT NULL;

-- Remove unique constraint on clerkUserId to allow nulls
ALTER TABLE "User" DROP CONSTRAINT "User_clerkUserId_key";

-- Add unique constraint that allows multiple nulls
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId") WHERE "clerkUserId" IS NOT NULL;

-- Copy Alumni data into User
INSERT INTO "User" (
  "firstName",
  "lastName",
  "profilePictureUrl",
  "linkedIn",
  "company",
  "companyTitle",
  "teamRole",
  "yearJoined" ,
  "yearRetired",
  "clerkUserId"
) SELECT
  "firstName",
  "lastName",
  "profilePictureUrl",
  "linkedIn",
  "company",
  "position",
  "teamRole",
  "yearJoinedSolarCar",
  "yearLeftSolarCar",
  NULL
FROM "Alumni";

-- Drop Alumni table
DROP TABLE "Alumni";
