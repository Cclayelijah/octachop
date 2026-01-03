/*
  Warnings:

  - You are about to alter the column `difficulty` on the `Level` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(4,2)`.
  - The primary key for the `user_favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `songId` on the `user_favorites` table. All the data in the column will be lost.
  - Added the required column `levelId` to the `user_favorites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_favorites" DROP CONSTRAINT "user_favorites_songId_fkey";

-- AlterTable
ALTER TABLE "Level" ALTER COLUMN "difficulty" SET DATA TYPE DECIMAL(4,2);

-- AlterTable
ALTER TABLE "user_favorites" DROP CONSTRAINT "user_favorites_pkey",
DROP COLUMN "songId",
ADD COLUMN     "levelId" INTEGER NOT NULL,
ADD CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("userId", "levelId");

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("levelId") ON DELETE CASCADE ON UPDATE CASCADE;
