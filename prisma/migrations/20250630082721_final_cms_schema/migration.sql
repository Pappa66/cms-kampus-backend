/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `SubMenuItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "postId" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "externalLink" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "SubMenuItem" ADD COLUMN     "postId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_postId_key" ON "MenuItem"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "SubMenuItem_postId_key" ON "SubMenuItem"("postId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubMenuItem" ADD CONSTRAINT "SubMenuItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
