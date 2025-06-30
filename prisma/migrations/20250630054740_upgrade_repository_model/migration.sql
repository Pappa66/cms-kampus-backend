/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `RepositoryItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RepositoryItem" DROP COLUMN "fileUrl",
ADD COLUMN     "abstract" TEXT,
ADD COLUMN     "advisor" TEXT,
ADD COLUMN     "keywords" TEXT;

-- CreateTable
CREATE TABLE "FileItem" (
    "id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "repositoryItemId" TEXT NOT NULL,

    CONSTRAINT "FileItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileItem" ADD CONSTRAINT "FileItem_repositoryItemId_fkey" FOREIGN KEY ("repositoryItemId") REFERENCES "RepositoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
