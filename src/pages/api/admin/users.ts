import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// Server-side function to get current user in API routes
async function getCurrentUserServer() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        userType: true
      }
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

function isSuperAdmin(user: any): boolean {
  return user && user.userType && user.userType.userTypeName === 'superadmin'
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if current user is authenticated and has proper permissions
    const currentUser = await getCurrentUserServer()
    if (!currentUser) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    switch (req.method) {
      case 'GET':
        // List all users (admins can view)
        if (currentUser.userTypeName === 'user') {
          return res.status(403).json({ error: 'Admin access required' })
        }

        const users = await prisma.user.findMany({
          include: {
            userType: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
        return res.status(200).json({ users })

      case 'PUT':
        // Update user role (only superadmins can change roles)
        if (!isSuperAdmin(currentUser)) {
          return res.status(403).json({ error: 'Super admin access required to change user roles' })
        }

        const { userId, userTypeName } = req.body
        
        if (!userId || !userTypeName) {
          return res.status(400).json({ error: 'userId and userTypeName are required' })
        }

        // Validate role exists
        const roleExists = await prisma.userType.findUnique({
          where: { userTypeName }
        })

        if (!roleExists) {
          return res.status(400).json({ error: 'Invalid role' })
        }

        const updatedUser = await prisma.user.update({
          where: { userId: parseInt(userId) },
          data: { userTypeName },
          include: { userType: true }
        })

        return res.status(200).json({ user: updatedUser })

      default:
        res.setHeader('Allow', ['GET', 'PUT'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('User management API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}