-- CreateTable
CREATE TABLE "Alumni" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profilePictureUrl" TEXT,
    "company" TEXT,
    "position" TEXT,
    "yearJoinedSolarCar" TEXT,
    "yearLeftSolarCar" TEXT,
    "teamRole" TEXT,
    "linkedIn" TEXT,

    CONSTRAINT "Alumni_pkey" PRIMARY KEY ("id")
);
