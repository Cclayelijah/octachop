import type { NextApiRequest, NextApiResponse } from 'next'
import { cleanupSongFiles } from 'src/lib/fileUpload'

// Configure API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }

    try {
        const { songId } = req.body

        if (!songId) {
            return res.status(400).json({ 
                error: 'Missing required field: songId' 
            })
        }

        console.log('Cleaning up files for songId:', songId)
        const success = await cleanupSongFiles(songId)
        
        if (success) {
            return res.status(200).json({ 
                message: 'Files cleaned up successfully',
                songId 
            })
        } else {
            return res.status(500).json({ 
                error: 'Failed to cleanup some files',
                songId 
            })
        }

    } catch (error) {
        console.error('Cleanup API Error:', error)
        return res.status(500).json({ 
            error: 'Failed to cleanup files',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}