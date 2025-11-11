/*
  Warnings:

  - You are about to drop the column `comment` on the `FB_Comments` table. All the data in the column will be lost.
  - Added the required column `comments` to the `FB_Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FB_Comments" DROP COLUMN "comment",
ADD COLUMN     "comments" TEXT NOT NULL;
