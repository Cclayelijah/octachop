/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Auth_userName_key" ON "Auth"("userName");
