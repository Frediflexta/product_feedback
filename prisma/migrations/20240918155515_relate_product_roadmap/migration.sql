/*
  Warnings:

  - You are about to drop the column `cattegory` on the `Feedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "cattegory",
ADD COLUMN     "category" "CATEGORY" DEFAULT 'UI';
