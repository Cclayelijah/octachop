/*
  Warnings:

  - The `noteData` column on the `Level` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `breakData` column on the `Level` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Level" DROP COLUMN "noteData",
ADD COLUMN     "noteData" JSONB[],
DROP COLUMN "breakData",
ADD COLUMN     "breakData" JSONB[];
