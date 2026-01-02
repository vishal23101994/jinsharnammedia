-- CreateEnum
CREATE TYPE "LatestUpdateCategory" AS ENUM ('JINSHARNAM', 'VATSALYA', 'ADVERTISEMENT');

-- AlterTable
ALTER TABLE "LatestUpdate" ADD COLUMN     "category" "LatestUpdateCategory" NOT NULL DEFAULT 'JINSHARNAM';
