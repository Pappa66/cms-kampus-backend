-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('PUBLISHED', 'PRIVATE');

-- AlterTable
ALTER TABLE "RepositoryItem" ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "PublishStatus" NOT NULL DEFAULT 'PRIVATE';
