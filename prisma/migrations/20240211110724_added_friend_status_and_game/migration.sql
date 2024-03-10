/*
  Warnings:

  - Added the required column `status` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "game" TEXT,
ADD COLUMN     "status" INTEGER NOT NULL;
