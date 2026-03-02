-- AlterTable
ALTER TABLE "Trustee" ADD COLUMN     "alternatePhone" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "dateOfMarriage" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;

-- AlterTable
ALTER TABLE "TrusteeRequest" ADD COLUMN     "alternatePhone" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "dateOfMarriage" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;
