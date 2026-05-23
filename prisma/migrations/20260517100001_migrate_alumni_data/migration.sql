-- Copy Alumni data into User
INSERT INTO "User" (
  "firstName",
  "lastName",
  "profilePictureUrl",
  "linkedIn",
  "company",
  "companyTitle",
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
  "yearJoinedSolarCar",
  "yearLeftSolarCar",
  NULL
FROM "Alumni";

-- DropTable
DROP TABLE "Alumni";