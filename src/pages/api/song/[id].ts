import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const songId = req.query.id

    if (!songId || Array.isArray(songId)) {
        return res.status(400).json({ error: 'Invalid song ID' })
    }

    try {
        switch (req.method) {
            case 'GET':
                return await handleGET(songId, res)
            case 'PUT':
                return await handlePUT(songId, req.body, res)
            case 'DELETE':
                return await handleDELETE(songId, res)

            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
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

// GET /api/song/:id
async function handleGET(songId: string, res: NextApiResponse) {
    try {
        const song = await prisma.song.findUnique({
            where: { songId: Number(songId) },
            include: {
                levels: {
                    where: { active: true },
                    orderBy: { difficulty: 'asc' }
                }
            }
        })

        if (!song) {
            return res.status(404).json({ error: 'Song not found' })
        }

        return res.status(200).json({ song })
    } catch (error) {
        console.error('Error fetching song:', error)
        return res.status(500).json({ 
            error: 'Failed to fetch song',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

// PUT /api/song/:id
async function handlePUT(songId: string, updateData: any, res: NextApiResponse) {
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
        if (error instanceof Error && error.message.includes('Record to update not found')) {
            return res.status(404).json({ error: 'Song not found' })
        }
        return res.status(500).json({ 
            error: 'Failed to update song',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

// DELETE /api/song/:id
async function handleDELETE(songId: string, res: NextApiResponse) {
    try {
        // Soft delete - set active to false instead of hard delete
        const song = await prisma.song.update({
            where: { songId: Number(songId) },
            data: { active: false }
        })

        return res.status(200).json({ 
            message: "Song was deleted successfully", 
            song 
        })
    } catch (error) {
        console.error('Error deleting song:', error)
        if (error instanceof Error && error.message.includes('Record to update not found')) {
            return res.status(404).json({ error: 'Song not found' })
        }
        return res.status(500).json({ 
            error: 'Failed to delete song',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}