-- AlterEnum
ALTER TYPE "DirectoryStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "DirectoryMember" ADD COLUMN     "gender" TEXT;
