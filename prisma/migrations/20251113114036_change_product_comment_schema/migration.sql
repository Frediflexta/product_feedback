/*
  Warnings:

  - You are about to drop the column `category` on the `ProductRequest` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ProductRequest` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `ProductRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'SUGGESTION',
ADD COLUMN     "upvotes" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductRequest" DROP COLUMN "category",
DROP COLUMN "status",
DROP COLUMN "upvotes";
