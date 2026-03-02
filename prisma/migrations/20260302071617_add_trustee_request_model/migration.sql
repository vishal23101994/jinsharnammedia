/*
  Warnings:

  - You are about to drop the column `approvalToken` on the `Trustee` table. All the data in the column will be lost.
  - You are about to drop the column `approvalTokenExpires` on the `Trustee` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Trustee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Trustee_approvalToken_key";

-- AlterTable
ALTER TABLE "Trustee" DROP COLUMN "approvalToken",
DROP COLUMN "approvalTokenExpires",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "TrusteeRequest" (
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

    CONSTRAINT "TrusteeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrusteeRequest_email_key" ON "TrusteeRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TrusteeRequest_approvalToken_key" ON "TrusteeRequest"("approvalToken");
