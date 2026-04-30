-- CreateTable
CREATE TABLE "PulakSagarLiveUpdate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "state" TEXT,
    "message" TEXT NOT NULL,
    "imageUrl" TEXT,
    "mapLink" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PulakSagarLiveUpdate_pkey" PRIMARY KEY ("id")
);
