import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all songs with search functionality
async function getAllSongs(searchTerm?: string) {
  const where: any = {}
  
  if (searchTerm) {
    const searchNumber = parseInt(searchTerm)
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { artist: { contains: searchTerm, mode: 'insensitive' } },
      { titleUnicode: { contains: searchTerm, mode: 'insensitive' } },
      { artistUnicode: { contains: searchTerm, mode: 'insensitive' } },
    ]
    
    // If searchTerm is a number, also search by songId
    if (!isNaN(searchNumber)) {
      where.OR.push({ songId: searchNumber })
    }
  }

  const songs = await prisma.song.findMany({
    where,
    include: {
      levels: {
        select: {
          levelId: true
        }
      }
    },
    orderBy: {
      songId: 'desc' // Most recent first
    }
  })

  // Transform the data to include level count and status
  return songs.map(song => ({
    songId: song.songId,
    beatmapSetId: song.beatmapSetId,
    title: song.title,
    titleUnicode: song.titleUnicode,
    artist: song.artist,
    artistUnicode: song.artistUnicode,
    songUrl: song.songUrl,
    defaultImg: song.defaultImg,
    active: song.active,
    disabledOn: song.disabledOn,
    levelCount: song.levels.length,
    status: song.disabledOn ? 'disabled' : 'active'
  }))
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Verify admin access
    const { userId } = getAuth(req)
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get current user to check if they're admin
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { userType: true }
    })

    if (!currentUser || (currentUser.userTypeName !== 'admin' && currentUser.userTypeName !== 'superadmin')) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    switch (req.method) {
      case 'GET':
        // Get search parameter
        const { search } = req.query
        const searchTerm = typeof search === 'string' ? search : undefined

        // Get all songs with optional search
        const songs = await getAllSongs(searchTerm)

        // Return songs with metadata
        return res.json({
          songs,
          totalSongs: songs.length,
          currentUser: {
            userId: currentUser.userId,
            userTypeName: currentUser.userTypeName
          }
        })

      case 'PATCH':
        // Update song (enable/disable)
        const { songId, disable } = req.body

        if (!songId) {
          return res.status(400).json({ error: 'Song ID is required' })
        }

        const updateData: any = {}
        
        if (disable !== undefined) {
          if (disable) {
            // Disable the song
            updateData.disabledOn = new Date()
            updateData.active = false
          } else {
            // Enable the song
            updateData.disabledOn = null
            updateData.active = true
          }
        }

        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ error: 'No valid update fields provided' })
        }

        // Update the song
        const updatedSong = await prisma.song.update({
          where: { songId: parseInt(songId) },
          data: updateData,
          include: {
            levels: {
              select: {
                levelId: true
              }
            }
          }
        })

        return res.json({
          success: true,
          song: {
            ...updatedSong,
            levelCount: updatedSong.levels.length,
            status: updatedSong.disabledOn ? 'disabled' : 'active'
          }
        })

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Error in admin/songs API:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}