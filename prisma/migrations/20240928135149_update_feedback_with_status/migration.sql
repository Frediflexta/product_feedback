/*
  Warnings:

  - You are about to drop the column `roadmapId` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the `Roadmap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_roadmapId_fkey";

-- DropForeignKey
ALTER TABLE "Roadmap" DROP CONSTRAINT "Roadmap_userId_fkey";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "roadmapId",
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'PLANNED';

-- DropTable
DROP TABLE "Roadmap";
