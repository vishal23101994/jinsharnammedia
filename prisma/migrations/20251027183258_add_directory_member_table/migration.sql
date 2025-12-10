/*
  Warnings:

  - You are about to drop the column `fullName` on the `DirectoryMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `DirectoryMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `DirectoryMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DirectoryMember" DROP COLUMN "fullName",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "dateOfMarriage" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "organization" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DirectoryMember_email_key" ON "DirectoryMember"("email");
