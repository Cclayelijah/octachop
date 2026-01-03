import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Server-side function to get current user in API routes
async function getCurrentUserServer(req: NextApiRequest) {
  try {
    const { userId } = getAuth(req)
    
    console.log('Auth check - userId from clerk:', userId)
    console.log('Auth check - userId type:', typeof userId)
    
    if (!userId) {
      console.log('No userId from auth()')
      
      // Debug: List all users in database
      const allUsers = await prisma.user.findMany({
        select: { clerkId: true, email: true }
      })
      console.log('All users in database:', allUsers)
      
      return null
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        userType: true
      }
    })

    console.log('User found in database:', user ? 'Yes' : 'No')
    console.log('Searching for clerkId:', userId)
    
    // Debug: List all users in database when user not found
    if (!user) {
      const allUsers = await prisma.user.findMany({
        select: { clerkId: true, email: true }
      })
      console.log('All users in database:', allUsers)
    }
    
    if (user) {
      console.log('User details:', { userId: user.userId, email: user.email, role: user.userTypeName })
    }

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await getCurrentUserServer(req)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error('Error getting current user:', error)
    return res.status(500).json({ 
      error: 'Failed to get user',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}