import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

// /api/level
// Required fields in body: beatmapId, difficulty, image,  approachRate,  noteData, breakData, beatmapUrl
// Optional fields in body: 
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const {
        songId,
        beatmapId,
        difficulty,
        image,
        approachRate, 
        noteData, 
        breakData,
        beatmapUrl
      } = req.body

    switch (req.method) {
        case 'POST':
            // creates a new level
            return handlePOST(
                songId,
                beatmapId,
                difficulty,
                image,
                approachRate, 
                noteData, 
                breakData,
                beatmapUrl, 
                res
            )
        case 'GET':
            // gets level list
            const levels = await prisma.level.findMany()
            return res.status(200).json({levels})
    
        default:
          throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
          )
      }
    
  }

async function handlePOST(
    songId: number,
    beatmapId: number,
    difficulty: string,
    image: string, 
    approachRate: string, 
    noteData: string,
    breakData:string, 
    beatmapUrl: string,
    res: NextApiResponse<any>
    ) {
      const level = await prisma.level.create({
        data: {
            songId,
            beatmapId,
            difficulty,
            image,
            approachRate,
            noteData,
            breakData,
            beatmapUrl,
            active: true,
        }
      })

      return res.status(200).json(level);
}