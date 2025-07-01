-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_postId_fkey";

-- DropForeignKey
ALTER TABLE "SubMenuItem" DROP CONSTRAINT "SubMenuItem_postId_fkey";

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "type" "MenuType" NOT NULL DEFAULT 'INTERNAL';

-- AlterTable
ALTER TABLE "SubMenuItem" ADD COLUMN     "type" "MenuType" NOT NULL DEFAULT 'INTERNAL';

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubMenuItem" ADD CONSTRAINT "SubMenuItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
