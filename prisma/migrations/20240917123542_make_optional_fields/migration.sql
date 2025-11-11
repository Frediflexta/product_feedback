/*
  Warnings:

  - Made the column `roadmapId` on table `Products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_roadmapId_fkey";

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "cattegory" DROP NOT NULL,
ALTER COLUMN "upvotes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "roadmapId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Roadmap" ALTER COLUMN "product_status" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
