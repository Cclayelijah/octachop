-- CreateTable
CREATE TABLE "user_favorites" (
    "userId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
    "favoritedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("userId","songId")
);

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("songId") ON DELETE CASCADE ON UPDATE CASCADE;
