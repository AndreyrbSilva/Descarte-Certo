-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailCode" TEXT,
ADD COLUMN     "emailCodeExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;
