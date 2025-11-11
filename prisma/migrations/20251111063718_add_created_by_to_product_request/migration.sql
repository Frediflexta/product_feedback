/*
  Warnings:

  - Added the required column `createdBy` to the `ProductRequest` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the column as nullable
ALTER TABLE "ProductRequest" ADD COLUMN "createdBy" TEXT;

-- Update existing records to assign them to the first user (or you can choose a specific user)
UPDATE "ProductRequest" SET "createdBy" = (SELECT "id" FROM "User" LIMIT 1) WHERE "createdBy" IS NULL;

-- Now make the column required
ALTER TABLE "ProductRequest" ALTER COLUMN "createdBy" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductRequest" ADD CONSTRAINT "ProductRequest_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
