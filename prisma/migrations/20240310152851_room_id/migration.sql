/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `roomId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "fromUserId",
DROP COLUMN "toUserId",
ADD COLUMN     "roomId" INTEGER NOT NULL;
