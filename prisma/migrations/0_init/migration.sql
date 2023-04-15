-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "track" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "beatmapId" INTEGER,
    "setId" INTEGER NOT NULL,
    "bgImage" TEXT,
    "difficulty" DOUBLE PRECISION NOT NULL,
    "notes" JSONB NOT NULL,
    "breaks" JSONB NOT NULL,
    "file" TEXT,

    CONSTRAINT "track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_set" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "title_unicode" VARCHAR(255) NOT NULL,
    "artist" VARCHAR(255) NOT NULL,
    "artist_unicode" VARCHAR(255) NOT NULL,
    "audio" TEXT NOT NULL,
    "beatmap_set_id" INTEGER NOT NULL,
    "image_dir" TEXT NOT NULL,

    CONSTRAINT "track_set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_play" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recording" TEXT,
    "num_hits" INTEGER NOT NULL,
    "num_misses" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "trackId" INTEGER NOT NULL,

    CONSTRAINT "track_play_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "bio" TEXT,
    "pfp" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "play_time" BIGINT NOT NULL DEFAULT 0,
    "cc" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_beatmapId_key" ON "track"("beatmapId");

-- CreateIndex
CREATE UNIQUE INDEX "track_set_beatmap_set_id_key" ON "track_set"("beatmap_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "track" ADD CONSTRAINT "track_setId_fkey" FOREIGN KEY ("setId") REFERENCES "track_set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_play" ADD CONSTRAINT "track_play_username_fkey" FOREIGN KEY ("username") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_play" ADD CONSTRAINT "track_play_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

