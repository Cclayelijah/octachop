-- DropForeignKey
ALTER TABLE "Level" DROP CONSTRAINT "Level_songId_fkey";

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("songId") ON DELETE CASCADE ON UPDATE CASCADE;
