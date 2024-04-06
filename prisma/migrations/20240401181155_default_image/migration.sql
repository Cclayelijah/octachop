/*
  Warnings:

  - Added the required column `defaultImg` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "defaultImg" TEXT NOT NULL;
