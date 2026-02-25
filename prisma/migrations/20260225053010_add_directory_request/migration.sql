-- CreateTable
CREATE TABLE "DirectoryRequest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "organization" TEXT,
    "position" TEXT,
    "zone" TEXT,
    "state" TEXT,
    "branch" TEXT,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "dateOfMarriage" TIMESTAMP(3),
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectoryRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DirectoryRequest_email_key" ON "DirectoryRequest"("email");
