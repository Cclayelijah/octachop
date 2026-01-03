import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user ID from Clerk
    const { userId: clerkUserId } = getAuth(req);
    
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // First, find the user in the Auth table using the Clerk user ID
    // For now, we'll use email or userName as the connection point
    // since we need to establish the link between Clerk and our database
    
    // Option 1: If the userName in Auth table matches Clerk username
    // Option 2: If email in Auth table matches Clerk email
    // Option 3: If we store Clerk user ID in a separate field
    
    // For now, let's assume we can identify the user by their Clerk user ID
    // stored in the email field or we'll need to create a mapping
    
    // Find user by Clerk ID
    const user = await prisma.user.findFirst({
      where: {
        clerkId: clerkUserId
      },
      include: {
        userType: true
      }
    });

    if (!user) {
      // User not found in database - they might need to be created
      return res.status(404).json({ error: 'User not found in database' });
    }
    
    // Calculate rank based on pp (performance points)
    const usersWithHigherPp = await prisma.user.count({
      where: {
        pp: {
          gt: user.pp
        }
      }
    });
    
    const rank = usersWithHigherPp + 1;
    
    // Calculate percentile
    const totalUsers = await prisma.user.count();
    const percentile = totalUsers > 0 ? Math.round((1 - (rank - 1) / totalUsers) * 100) : 100;
    
    const rankData = {
      rank,
      pp: user.pp,
      exp: user.exp,
      totalPlayTime: user.totalPlayTime,
      userType: user.userTypeName,
      userTypeDesc: user.userType?.userTypeDesc || '',
      totalUsers,
      percentile
    };

    return res.status(200).json(rankData);
    
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}