import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId: clerkId } = getAuth(req);
  
  if (!clerkId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find user in database
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (req.method === 'GET') {
    try {
      const favorites = await prisma.userFavorites.findMany({
        where: { userId: user.userId },
        select: { levelId: true }
      });
      
      const levelIds = favorites.map((f: { levelId: number }) => f.levelId);
      return res.status(200).json(levelIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  }

  if (req.method === 'POST') {
    const { levelId } = req.body;
    
    if (!levelId) {
      return res.status(400).json({ error: 'Level ID is required' });
    }

    try {
      // Toggle favorite - add if not exists, remove if exists
      const existing = await prisma.userFavorites.findUnique({
        where: {
          userId_levelId: {
            userId: user.userId,
            levelId
          }
        }
      });

      if (existing) {
        // Remove from favorites
        await prisma.userFavorites.delete({
          where: {
            userId_levelId: {
              userId: user.userId,
              levelId
            }
          }
        });
        return res.status(200).json({ favorited: false });
      } else {
        // Add to favorites
        await prisma.userFavorites.create({
          data: {
            userId: user.userId,
            levelId
          }
        });
        return res.status(200).json({ favorited: true });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return res.status(500).json({ error: 'Failed to toggle favorite' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}