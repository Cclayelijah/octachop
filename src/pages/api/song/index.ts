import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";
import { createServerSupabaseClient } from 'src/lib/supabase';
import { uploadFileServer } from 'src/lib/fileUpload';

const prisma = new PrismaClient()

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
            where: { beatmapSetId: Number(songData.beatmapSetId) }
        })

        if (existing) {
            return res.status(409).json({ 
                error: 'Song already exists', 
                song: existing 
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