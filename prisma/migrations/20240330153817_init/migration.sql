-- CreateTable
CREATE TABLE "UserType" (
    "userTypeName" TEXT NOT NULL,
    "userTypeDesc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "userTypeName" TEXT NOT NULL,
    "totalPlayTime" INTEGER NOT NULL,
    "exp" INTEGER NOT NULL,
    "pp" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Auth" (
    "authId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userName" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("authId")
);

-- CreateTable
CREATE TABLE "Song" (
    "songId" SERIAL NOT NULL,
    "beatmapSetId" INTEGER NOT NULL,
    "songUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleUnicode" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "artistUnicode" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("songId")
);

-- CreateTable
CREATE TABLE "Level" (
    "levelId" SERIAL NOT NULL,
    "songId" INTEGER NOT NULL,
    "beatmapId" INTEGER NOT NULL,
    "difficulty" DECIMAL(65,30) NOT NULL,
    "image" TEXT NOT NULL,
    "approachRate" DECIMAL(65,30) NOT NULL,
    "noteData" TEXT NOT NULL,
    "breakData" TEXT NOT NULL,
    "beatmapUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("levelId")
);

-- CreateTable
CREATE TABLE "PassResult" (
    "passResultId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "misses" INTEGER NOT NULL DEFAULT 0,
    "healthBarData" INTEGER NOT NULL DEFAULT 0,
    "replayData" INTEGER NOT NULL,

    CONSTRAINT "PassResult_pkey" PRIMARY KEY ("passResultId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserType_userTypeName_key" ON "UserType"("userTypeName");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_authId_key" ON "Auth"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Song_beatmapSetId_key" ON "Song"("beatmapSetId");

-- CreateIndex
CREATE UNIQUE INDEX "Level_beatmapId_key" ON "Level"("beatmapId");

-- CreateIndex
CREATE UNIQUE INDEX "PassResult_passResultId_key" ON "PassResult"("passResultId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userTypeName_fkey" FOREIGN KEY ("userTypeName") REFERENCES "UserType"("userTypeName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("songId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassResult" ADD CONSTRAINT "PassResult_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("levelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassResult" ADD CONSTRAINT "PassResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
