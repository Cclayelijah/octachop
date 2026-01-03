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

    console.log('Sync request received:', { clerkId, email, firstName, lastName, username })

    if (!clerkId || !email) {
      return res.status(400).json({ error: 'clerkId and email are required' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    })

    console.log('Existing user found:', existingUser ? 'Yes' : 'No')

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: {
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          username: username || null,
          imageUrl: imageUrl || null,
        }
      })
      console.log('User updated successfully:', { userId: updatedUser.userId, email: updatedUser.email })
      return res.status(200).json({ user: updatedUser, action: 'updated' })
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          username: username || null,
          imageUrl: imageUrl || null,
          userTypeName: 'user', // Default role
          totalPlayTime: 0,
          exp: 0,
          pp: 0
        }
      })
      console.log('User created successfully:', { userId: newUser.userId, email: newUser.email })
      return res.status(201).json({ user: newUser, action: 'created' })
    }
  } catch (error) {
    console.error('Error syncing user:', error)
    return res.status(500).json({ 
      error: 'Failed to sync user',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}