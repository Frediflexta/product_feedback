-- DropForeignKey
ALTER TABLE "Roadmap" DROP CONSTRAINT "Roadmap_productId_fkey";

-- AlterTable
ALTER TABLE "Roadmap" ADD COLUMN     "feedbackId" TEXT;
