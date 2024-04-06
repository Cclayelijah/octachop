import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const levelId = req.query.id
  
    switch (req.method) {
      case 'DELETE':
        return handleDELETE(levelId, res)
  
      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        )
    }
  }
  
  // DELETE /api/level/:id
  async function handleDELETE(levelId: unknown, res: NextApiResponse<any>) {
    const level = await prisma.level.delete({
      where: { levelId: Number(levelId) },
    })
    return res.status(200).json({"message": "Level was deleted successfully"})
  }