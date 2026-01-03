/*
  Warnings:

  - A unique constraint covering the columns `[songId,beatmapId]` on the table `Level` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Level_beatmapId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Level_songId_beatmapId_key" ON "Level"("songId", "beatmapId");
