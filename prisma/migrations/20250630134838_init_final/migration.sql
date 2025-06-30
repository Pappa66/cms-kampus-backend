/*
  Warnings:

  - Added the required column `uploaderId` to the `RepositoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RepositoryItem" ADD COLUMN     "uploaderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RepositoryItem" ADD CONSTRAINT "RepositoryItem_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
