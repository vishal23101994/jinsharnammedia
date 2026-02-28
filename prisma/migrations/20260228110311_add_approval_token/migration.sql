/*
  Warnings:

  - A unique constraint covering the columns `[approvalToken]` on the table `DirectoryMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[approvalToken]` on the table `DirectoryRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DirectoryMember" ADD COLUMN     "approvalToken" TEXT,
ADD COLUMN     "approvalTokenExpires" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "DirectoryRequest" ADD COLUMN     "approvalToken" TEXT,
ADD COLUMN     "approvalTokenExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "DirectoryMember_approvalToken_key" ON "DirectoryMember"("approvalToken");

-- CreateIndex
CREATE UNIQUE INDEX "DirectoryRequest_approvalToken_key" ON "DirectoryRequest"("approvalToken");
