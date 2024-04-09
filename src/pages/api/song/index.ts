import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

// /api/song
// Required fields in body: beatmapSetId, songUrl, title,  titleUnicode,  artist, artistUnicode
// Optional fields in body: 

type SongData = {
    beatmapSetId: number,
    songUrl: string,
    defaultImg: string,
    title: string, 
    titleUnicode: string, 
    artist: string,
    artistUnicode:string
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

export async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const {
        songData, levels
      } = req.body

    switch (req.method) {
        case 'POST':
            // creates a new song
            return handlePOST(
                songData, levels, res
            )
        case 'GET':
            // gets song list
            const songs = await prisma.song.findMany()
            return res.status(200).json({songs})
    
        default:
          throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
          )
      }
    
  }

async function handlePOST(
    songData: SongData, levels: Level[], res: NextApiResponse<any>) {
    
        const existing = await prisma.song.findFirst({
            where: { beatmapSetId: Number(songData.beatmapSetId) }
        })

        if (existing) {
            return res.status(200).json(existing);
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
            beatmapSetId,
            songUrl,
            defaultImg,
            title,
            titleUnicode,
            artist,
            artistUnicode,
            active: true,
            levels: {
                create: levels
            }
        }
        })

        return res.status(200).json(song);
}