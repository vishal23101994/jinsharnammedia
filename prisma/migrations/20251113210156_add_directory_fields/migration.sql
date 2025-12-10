/*
  Warnings:

  - The values [REJECTED] on the enum `DirectoryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DirectoryStatus_new" AS ENUM ('PENDING', 'APPROVED');
ALTER TABLE "public"."DirectoryMember" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "DirectoryMember" ALTER COLUMN "status" TYPE "DirectoryStatus_new" USING ("status"::text::"DirectoryStatus_new");
ALTER TYPE "DirectoryStatus" RENAME TO "DirectoryStatus_old";
ALTER TYPE "DirectoryStatus_new" RENAME TO "DirectoryStatus";
DROP TYPE "public"."DirectoryStatus_old";
ALTER TABLE "DirectoryMember" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
