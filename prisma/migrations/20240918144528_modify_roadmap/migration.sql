/*
  Warnings:

  - You are about to drop the column `roadmapId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Roadmap` table. All the data in the column will be lost.
  - You are about to drop the column `product_status` on the `Roadmap` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_roadmapId_fkey";

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "roadmapId" TEXT;

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "roadmapId";

-- AlterTable
ALTER TABLE "Roadmap" DROP COLUMN "category",
DROP COLUMN "product_status",
ADD COLUMN     "progress_status" "STATUS" DEFAULT 'PLANNED';

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE SET NULL ON UPDATE CASCADE;
