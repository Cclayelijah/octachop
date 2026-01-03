import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { clerkId, email, firstName, lastName, username, imageUrl } = req.body

    console.log('Role check request:', { clerkId, email })

    if (!clerkId || !email) {
      return res.status(400).json({ error: 'clerkId and email are required' })
    }

    // Check if user exists, if not create them
    let user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        userType: true
      }
    })

    if (!user) {
      console.log('User not found, creating new user')
      // Create new user with default 'user' role
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          username: username || email,
          imageUrl: imageUrl || '',
          userTypeName: 'user'
        },
        include: {
          userType: true
        }
      })
      console.log('New user created:', user.email)
    } else {
      console.log('Existing user found:', user.email)
      
      // Update user info in case it changed
      user = await prisma.user.update({
        where: { clerkId },
        data: {
          email,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          username: username || user.username,
          imageUrl: imageUrl || user.imageUrl,
        },
        include: {
          userType: true
        }
      })
      console.log('User updated')
    }

    // Return user with role info
    res.json({
      userId: user.userId,
      email: user.email,
      userTypeName: user.userTypeName,
      firstName: user.firstName,
      lastName: user.lastName,
    })

  } catch (error) {
    console.error('Error in role check:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}