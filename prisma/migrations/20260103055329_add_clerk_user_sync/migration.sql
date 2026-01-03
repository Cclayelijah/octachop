/*
  Warnings:

  - You are about to drop the `Auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userTypeName_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "userTypeName" SET DEFAULT 'user',
ALTER COLUMN "totalPlayTime" SET DEFAULT 0,
ALTER COLUMN "exp" SET DEFAULT 0,
ALTER COLUMN "pp" SET DEFAULT 0;

-- DropTable
DROP TABLE "Auth";

-- DropTable
DROP TABLE "UserType";

-- CreateTable
CREATE TABLE "user_types" (
    "userTypeName" TEXT NOT NULL,
    "userTypeDesc" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_types_userTypeName_key" ON "user_types"("userTypeName");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userTypeName_fkey" FOREIGN KEY ("userTypeName") REFERENCES "user_types"("userTypeName") ON DELETE RESTRICT ON UPDATE CASCADE;
