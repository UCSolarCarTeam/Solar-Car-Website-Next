-- CreateTable
CREATE TABLE "Timeline" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "monthNum" INTEGER NOT NULL,
    "monthName" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Timeline_year_monthNum_key" ON "Timeline"("year", "monthNum");
