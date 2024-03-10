/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friend_accountId_key" ON "Friend"("accountId");
