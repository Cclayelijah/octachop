import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function backupDatabase() {
  try {
    console.log('Creating database backup...')
    
    // Get all data from each table
    const userTypes = await prisma.userType.findMany()
    const users = await prisma.user.findMany()
    const songs = await prisma.song.findMany({
      include: {
        levels: true
      }
    })
    const passResults = await prisma.passResult.findMany()
    const userFavorites = await prisma.userFavorites.findMany()
    
    const backupData = {
      exportDate: new Date().toISOString(),
      userTypes,
      users,
      songs,
      passResults,
      userFavorites
    }
    
    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }
    
    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFilename = `database_backup_${timestamp}.json`
    const backupPath = path.join(backupDir, backupFilename)
    
    // Write backup file
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))
    
    console.log(`✅ Database backup created successfully!`)
    console.log(`📁 File: ${backupPath}`)
    console.log(`📊 Backup contains:`)
    console.log(`   - ${userTypes.length} user types`)
    console.log(`   - ${users.length} users`)
    console.log(`   - ${songs.length} songs`)
    console.log(`   - ${songs.reduce((total, song) => total + song.levels.length, 0)} levels`)
    console.log(`   - ${passResults.length} pass results`)
    console.log(`   - ${userFavorites.length} user favorites`)
    
  } catch (error) {
    console.error('❌ Error creating backup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

backupDatabase()