/*
  Warnings:

  - The values [ENHANCEMMENT] on the enum `CATEGORY` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `category` on table `Feedback` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CATEGORY_new" AS ENUM ('FEATURE', 'ENHANCEMENT', 'BUG', 'UI', 'UX');
ALTER TABLE "Feedback" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Feedback" ALTER COLUMN "category" TYPE "CATEGORY_new" USING ("category"::text::"CATEGORY_new");
ALTER TYPE "CATEGORY" RENAME TO "CATEGORY_old";
ALTER TYPE "CATEGORY_new" RENAME TO "CATEGORY";
DROP TYPE "CATEGORY_old";
ALTER TABLE "Feedback" ALTER COLUMN "category" SET DEFAULT 'UI';
COMMIT;

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "category" SET NOT NULL;
