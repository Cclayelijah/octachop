import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";
import { createServerSupabaseClient } from 'src/lib/supabase';
import { uploadFileServer } from 'src/lib/fileUpload';

const prisma = new PrismaClient()

// Configure API to handle large payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Allow up to 50MB for large song uploads
    },
    responseLimit: false,
  },
}

// /api/song
// Required fields in body: beatmapSetId, songUrl, title, titleUnicode, artist, artistUnicode
// Optional fields in body: defaultImg

type SongData = {
    beatmapSetId: number,
    songUrl: string,
    defaultImg?: string,
    title: string, 
    titleUnicode: string, 
    artist: string,
    artistUnicode: string
}

type Level = {
    levelId?: number,
    songId?: number,
    beatmapId: number,
    difficulty: number,
    image: string,
    approachRate: number,
    noteData: any[],
    breakData: any[],
    beatmapUrl: string,
    active?: boolean
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        switch (req.method) {
            case 'POST':
                // creates a new song
                const { songData, levels } = req.body
                return await handlePOST(songData, levels, res)
                
            case 'GET':
                // gets song list
                const songs = await prisma.song.findMany({
                    include: {
                        levels: {
                            where: { active: true },
                            orderBy: { difficulty: 'asc' }
                        }
                    },
                    where: { active: true }
                })
                return res.status(200).json({ songs })
                
            case 'PUT':
                // updates a song
                const { songId, updateData } = req.body
                return await handlePUT(songId, updateData, res)
                
            case 'DELETE':
                // soft deletes a song
                const { songId: deleteId } = req.body
                return await handleDELETE(deleteId, res)
        
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
                return res.status(405).json({ error: `Method ${req.method} not allowed` })
        }
    } catch (error) {
        console.error('API Error:', error)
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}
async function handlePOST(
    songData: SongData, 
    levels: Level[], 
    res: NextApiResponse
) {
    try {
        // Check if song with this beatmapSetId already exists
        const existing = await prisma.song.findFirst({
            where: { beatmapSetId: Number(songData.beatmapSetId) },
            include: {
                levels: {
                    where: { active: true }
                }
            }
        })

        if (existing) {
            console.log(`Song ${songData.beatmapSetId} already exists, adding new levels...`)
            
            // Get existing beatmapIds to avoid duplicates
            const existingBeatmapIds = new Set(existing.levels.map(level => level.beatmapId))
            
            // Filter out levels that already exist
            const newLevels = levels.filter(level => !existingBeatmapIds.has(level.beatmapId))
            
            if (newLevels.length === 0) {
                return res.status(200).json({ 
                    message: 'No new levels to add - all levels already exist',
                    song: existing,
                    skippedLevels: levels.length
                });
            }
            
            // Add new levels to existing song
            const updatedLevels = await prisma.level.createMany({
                data: newLevels.map(level => ({
                    songId: existing.songId,
                    beatmapId: Number(level.beatmapId),
                    difficulty: Number(level.difficulty),
                    image: level.image,
                    approachRate: Number(level.approachRate),
                    noteData: level.noteData,
                    breakData: level.breakData,
                    beatmapUrl: level.beatmapUrl,
                    active: true
                }))
            })
            
            // Get updated song with all levels
            const updatedSong = await prisma.song.findFirst({
                where: { songId: existing.songId },
                include: {
                    levels: {
                        where: { active: true },
                        orderBy: { difficulty: 'asc' }
                    }
                }
            })
            
            return res.status(200).json({ 
                message: `Added ${newLevels.length} new level(s) to existing song`,
                song: updatedSong,
                newLevels: newLevels.length,
                existingLevels: existingBeatmapIds.size
            });
        }

        const {
            beatmapSetId,
            songUrl,
            defaultImg,
            title,
            titleUnicode,
            artist,
            artistUnicode
        } = songData

        const song = await prisma.song.create({
            data: {
                beatmapSetId: Number(beatmapSetId),
                songUrl,
                defaultImg: defaultImg || '',
                title,
                titleUnicode,
                artist,
                artistUnicode,
                active: true,
                levels: {
                    create: levels.map(level => ({
                        beatmapId: Number(level.beatmapId),
                        difficulty: Number(level.difficulty),
                        image: level.image,
                        approachRate: Number(level.approachRate),
                        noteData: level.noteData,
                        breakData: level.breakData,
                        beatmapUrl: level.beatmapUrl,
                        active: true
                    }))
                }
            },
            include: {
                levels: true
            }
        })

        return res.status(201).json({ song });
    } catch (error) {
        console.error('Error creating song:', error)
        return res.status(500).json({ 
            error: 'Failed to create song',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

async function handlePUT(
    songId: number,
    updateData: Partial<SongData>,
    res: NextApiResponse
) {
    try {
        const song = await prisma.song.update({
            where: { songId: Number(songId) },
            data: {
                ...updateData,
                ...(updateData.beatmapSetId && { beatmapSetId: Number(updateData.beatmapSetId) })
            },
            include: {
                levels: true
            }
        })

        return res.status(200).json({ song })
    } catch (error) {
        console.error('Error updating song:', error)
        return res.status(500).json({ 
            error: 'Failed to update song',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

async function handleDELETE(
    songId: number,
    res: NextApiResponse
) {
    try {
        // Soft delete - set active to false
        const song = await prisma.song.update({
            where: { songId: Number(songId) },
            data: { active: false }
        })

        return res.status(200).json({ 
            message: 'Song deleted successfully', 
            song 
        })
    } catch (error) {
        console.error('Error deleting song:', error)
        return res.status(500).json({ 
            error: 'Failed to delete song',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}