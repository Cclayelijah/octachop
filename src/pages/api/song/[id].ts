import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const songId = req.query.id
  
    switch (req.method) {
      case 'DELETE':
        return handleDELETE(songId, res)
  
      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        )
    }
  }
  
  // DELETE /api/song/:id
  async function handleDELETE(songId: unknown, res: NextApiResponse<any>) {
    const song = await prisma.song.delete({
      where: { songId: Number(songId) },
    })
    return res.status(200).json({"message": "Song was deleted successfully"})
  }