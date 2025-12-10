-- CreateEnum
CREATE TYPE "DirectoryStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "DirectoryMember" ADD COLUMN     "branch" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" "DirectoryStatus" NOT NULL DEFAULT 'PENDING';
