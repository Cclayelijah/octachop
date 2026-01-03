import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

// Only create Prisma client on server side
const prisma = typeof window === 'undefined' ? new PrismaClient() : null

// Server-side function to get current user
export async function getCurrentUser() {
  if (typeof window !== 'undefined') {
    throw new Error('getCurrentUser can only be called on server side')
  }
  
  try {
    const { userId } = auth()
    
    if (!userId || !prisma) {
      return null
    }

    const user = await prisma.user.findFirst({
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

// Client-side function to get current user
export async function getCurrentUserClient(clerkUserId: string) {
  try {
    if (!clerkUserId) return null

    const response = await fetch('/api/user/me')
    const data = await response.json()
    
    if (response.ok) {
      return data.user
    } else {
      console.error('Failed to get current user:', data.error)
      return null
    }
  } catch (error) {
    console.error('Error getting current user from client:', error)
    return null
  }
}

export async function syncUserFromClerk(clerkUser: any) {
  try {
    console.log('Syncing user with Clerk ID:', clerkUser.id)
    
    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || null,
      lastName: clerkUser.lastName || null,
      username: clerkUser.username || null,
      imageUrl: clerkUser.imageUrl || null,
    }

    const response = await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('User sync successful:', result.action)
      return result
    } else {
      console.error('User sync failed:', result.error)
      return null
    }
  } catch (error) {
    console.error('Error syncing user from Clerk:', error)
    return null
  }
}

export function hasRole(user: any, roles: string[]): boolean {
  if (!user || !user.userType) return false
  return roles.includes(user.userType.userTypeName)
}

export function isAdmin(user: any): boolean {
  return hasRole(user, ['admin', 'superadmin'])
}

export function isSuperAdmin(user: any): boolean {
  return hasRole(user, ['superadmin'])
}