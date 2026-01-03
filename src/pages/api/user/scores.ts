import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/user/scores
// Fetches recent scores/pass results for the current user
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        if (req.method !== 'GET') {
            res.setHeader('Allow', ['GET'])
            return res.status(405).json({ error: `Method ${req.method} not allowed` })
        }

        // Get current user from Clerk
        const { userId: clerkId } = getAuth(req)
        
        if (!clerkId) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { clerkId }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Get query parameters for pagination and filtering
        const limit = parseInt(req.query.limit as string) || 10
        const offset = parseInt(req.query.offset as string) || 0

        // Fetch user's recent pass results with level and song data
        const passResults = await prisma.passResult.findMany({
            where: { 
                userId: user.userId,
                level: {
                    active: true,
                    song: {
                        active: true
                    }
                }
            },
            include: {
                level: {
                    include: {
                        song: true
                    }
                },
                user: {
                    include: {
                        userType: true
                    }
                }
            },
            orderBy: {
                timestamp: 'desc'
            },
            take: limit,
            skip: offset
        })

        // Transform the data to match the expected format
        const formattedResults = passResults.map(result => ({
            ...result,
            accuracy: result.hits > 0 ? ((result.hits / (result.hits + result.misses)) * 100) : 0,
            grade: calculateGrade(result.hits, result.misses),
            formattedDate: new Date(result.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })
        }))

        return res.status(200).json({ 
            scores: formattedResults,
            total: await prisma.passResult.count({
                where: { 
                    userId: user.userId,
                    level: {
                        active: true,
                        song: {
                            active: true
                        }
                    }
                }
            })
        })

    } catch (error) {
        console.error('Scores API Error:', error)
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

// Helper function to calculate grade based on accuracy
function calculateGrade(hits: number, misses: number): string {
    if (hits === 0 && misses === 0) return 'F'
    
    const accuracy = (hits / (hits + misses)) * 100
    
    if (accuracy >= 95) return 'S'
    if (accuracy >= 90) return 'A'
    if (accuracy >= 80) return 'B'
    if (accuracy >= 70) return 'C'
    if (accuracy >= 60) return 'D'
    return 'F'
}