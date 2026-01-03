import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function restoreDatabase(backupFilePath: string) {
  try {
    console.log(`📂 Reading backup file: ${backupFilePath}`)
    
    if (!fs.existsSync(backupFilePath)) {
      console.error('❌ Backup file not found!')
      return
    }
    
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'))
    
    console.log(`📅 Backup created on: ${backupData.exportDate}`)
    console.log(`🔄 Starting restore process...`)
    
    // Clear existing data (be careful!)
    console.log('⚠️  Clearing existing data...')
    await prisma.userFavorites.deleteMany({})
    await prisma.passResult.deleteMany({})
    await prisma.level.deleteMany({})
    await prisma.song.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.userType.deleteMany({})
    
    // Restore data in correct order (respecting foreign key constraints)
    console.log('🏗️  Restoring UserTypes...')
    for (const userType of backupData.userTypes) {
      await prisma.userType.create({
        data: userType
      })
    }
    
    console.log('👥 Restoring Users...')
    for (const user of backupData.users) {
      await prisma.user.create({
        data: {
          userId: user.userId,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          imageUrl: user.imageUrl,
          userTypeName: user.userTypeName,
          bannedUntil: user.bannedUntil ? new Date(user.bannedUntil) : null,
          totalPlayTime: user.totalPlayTime,
          exp: user.exp,
          pp: user.pp,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }
      })
    }
    
    console.log('🎵 Restoring Songs and Levels...')
    for (const song of backupData.songs) {
      const createdSong = await prisma.song.create({
        data: {
          songId: song.songId,
          beatmapSetId: song.beatmapSetId,
          songUrl: song.songUrl,
          defaultImg: song.defaultImg,
          title: song.title,
          titleUnicode: song.titleUnicode,
          artist: song.artist,
          artistUnicode: song.artistUnicode,
          active: song.active,
          disabledOn: song.disabledOn ? new Date(song.disabledOn) : null
        }
      })
      
      // Restore levels for this song
      for (const level of song.levels) {
        await prisma.level.create({
          data: {
            levelId: level.levelId,
            songId: createdSong.songId,
            beatmapId: level.beatmapId,
            difficulty: level.difficulty,
            image: level.image,
            approachRate: level.approachRate,
            noteData: level.noteData,
            breakData: level.breakData,
            beatmapUrl: level.beatmapUrl,
            active: level.active
          }
        })
      }
    }
    
    console.log('🏆 Restoring Pass Results...')
    for (const passResult of backupData.passResults) {
      await prisma.passResult.create({
        data: {
          passResultId: passResult.passResultId,
          userId: passResult.userId,
          levelId: passResult.levelId,
          timestamp: passResult.timestamp,
          score: passResult.score,
          hits: passResult.hits,
          misses: passResult.misses,
          healthBarData: passResult.healthBarData,
          replayData: passResult.replayData
        }
      })
    }
    
    console.log('❤️  Restoring User Favorites...')
    for (const favorite of backupData.userFavorites) {
      await prisma.userFavorites.create({
        data: {
          userId: favorite.userId,
          levelId: favorite.levelId,
          favoritedAt: new Date(favorite.favoritedAt)
        }
      })
    }
    
    console.log('✅ Database restore completed successfully!')
    console.log(`📊 Restored:`)
    console.log(`   - ${backupData.userTypes.length} user types`)
    console.log(`   - ${backupData.users.length} users`)
    console.log(`   - ${backupData.songs.length} songs`)
    console.log(`   - ${backupData.songs.reduce((total: number, song: any) => total + song.levels.length, 0)} levels`)
    console.log(`   - ${backupData.passResults.length} pass results`)
    console.log(`   - ${backupData.userFavorites.length} user favorites`)
    
  } catch (error) {
    console.error('❌ Error restoring database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get backup file path from command line argument
const backupFilePath = process.argv[2]
if (!backupFilePath) {
  console.error('❌ Please provide backup file path as argument')
  console.log('Usage: npx ts-node scripts/restore-database.ts <backup-file-path>')
  process.exit(1)
}

restoreDatabase(backupFilePath)