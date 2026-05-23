-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company" TEXT,
ADD COLUMN     "companyTitle" TEXT,
ADD COLUMN     "yearRetired" TEXT,
ALTER COLUMN "clerkUserId" DROP NOT NULL;
