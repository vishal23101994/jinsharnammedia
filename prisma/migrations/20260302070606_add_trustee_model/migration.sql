-- CreateEnum
CREATE TYPE "TrusteeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Trustee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "designation" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "imageUrl" TEXT,
    "status" "TrusteeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalToken" TEXT,
    "approvalTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Trustee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trustee_email_key" ON "Trustee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trustee_approvalToken_key" ON "Trustee"("approvalToken");
