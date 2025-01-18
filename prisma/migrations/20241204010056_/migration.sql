-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "fieldOfStudy" TEXT,
    "teamRole" TEXT,
    "schoolYear" TEXT,
    "yearJoined" INTEGER,
    "profilePictureUrl" TEXT,
    "description" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");
