import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Calculate user rank based on PP (how many users have higher PP)
async function calculateUserRank(userPp: number): Promise<number> {
  const usersWithHigherPp = await prisma.user.count({
    where: {
      pp: {
        gt: userPp
      }
    }
  })
  
  return usersWithHigherPp + 1 // Rank is 1-indexed (1st place, 2nd place, etc.)
}

// Get all users with their calculated rank
async function getAllUsersWithRanks() {
  // First get all users ordered by PP descending
  const users = await prisma.user.findMany({
    include: {
      userType: true
    },
    orderBy: {
      pp: 'desc'
    }
  })

  // Calculate ranks efficiently by iterating through sorted list
  const usersWithRanks = users.map((user, index) => ({
    userId: user.userId,
    clerkId: user.clerkId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username || user.email,
    imageUrl: user.imageUrl,
    userTypeName: user.userTypeName,
    bannedUntil: user.bannedUntil,
    totalPlayTime: user.totalPlayTime,
    exp: user.exp,
    pp: user.pp,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    rank: index + 1, // Since sorted by PP desc, index + 1 = rank
    userType: user.userType
  }))

  return usersWithRanks
}

// Search users by username or ID
function searchUsers(users: any[], searchTerm: string) {
  if (!searchTerm) return users
  
  const lowerSearchTerm = searchTerm.toLowerCase()
  
  return users.filter(user => 
    user.username?.toLowerCase().includes(lowerSearchTerm) ||
    user.email?.toLowerCase().includes(lowerSearchTerm) ||
    user.userId.toString() === searchTerm ||
    user.firstName?.toLowerCase().includes(lowerSearchTerm) ||
    user.lastName?.toLowerCase().includes(lowerSearchTerm)
  )
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

    const isSuperAdmin = currentUser.userTypeName === 'superadmin'

    switch (req.method) {
      case 'GET':
        // Get search parameter
        const { search } = req.query
        const searchTerm = typeof search === 'string' ? search : ''

        // Get all users with ranks
        let users = await getAllUsersWithRanks()

        // Apply search filter if provided
        if (searchTerm) {
          users = searchUsers(users, searchTerm)
        }

        // Return users with additional metadata
        return res.json({
          users,
          totalUsers: users.length,
          currentUser: {
            userId: currentUser.userId,
            userTypeName: currentUser.userTypeName,
            isSuperAdmin
          }
        })

      case 'PATCH':
        // Update user (ban/unban for admins, role change for superadmins)
        const { userId: targetUserId, bannedUntil, userTypeName } = req.body

        if (!targetUserId) {
          return res.status(400).json({ error: 'User ID is required' })
        }

        const updateData: any = {}

        // Handle ban/unban (admins and superadmins can do this)
        if (bannedUntil !== undefined) {
          updateData.bannedUntil = bannedUntil ? new Date(bannedUntil) : null
        }

        // Handle role change (only superadmins can do this)
        if (userTypeName !== undefined) {
          if (!isSuperAdmin) {
            return res.status(403).json({ error: 'Superadmin access required for role changes' })
          }
          
          // Validate userTypeName
          const validRoles = ['user', 'admin', 'superadmin']
          if (!validRoles.includes(userTypeName)) {
            return res.status(400).json({ error: 'Invalid user type' })
          }
          
          updateData.userTypeName = userTypeName
        }

        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ error: 'No valid update fields provided' })
        }

        // Update the user
        const updatedUser = await prisma.user.update({
          where: { userId: parseInt(targetUserId) },
          data: updateData,
          include: { userType: true }
        })

        return res.json({
          success: true,
          user: updatedUser
        })

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Error in admin/users API:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}