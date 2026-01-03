import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient, STORAGE_BUCKETS } from 'src/lib/supabase'
import { generateFilePath } from 'src/lib/fileUpload'

// Configure API route to handle larger files
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }

    try {
        console.log('Upload API called:', { 
            bodySize: JSON.stringify(req.body).length,
            hasFileData: !!req.body.fileData 
        })
        
        const { songId, fileType, fileName, fileData } = req.body

        if (!songId || !fileType || !fileName || !fileData) {
            console.error('Missing fields:', { songId: !!songId, fileType: !!fileType, fileName: !!fileName, fileData: !!fileData })
            return res.status(400).json({ 
                error: 'Missing required fields: songId, fileType, fileName, fileData' 
            })
        }

        if (!['audio', 'image'].includes(fileType)) {
            return res.status(400).json({ 
                error: 'Valid file type (audio or image) is required' 
            })
        }

        console.log('Processing upload:', { songId, fileType, fileName, fileDataLength: fileData.length })

        // Convert base64 data to buffer
        let buffer: Buffer
        try {
            // Remove data URL prefix if present (e.g., "data:audio/mpeg;base64,")
            const base64Data = fileData.includes(',') ? fileData.split(',')[1] : fileData
            buffer = Buffer.from(base64Data, 'base64')
            console.log('Buffer created successfully:', { size: buffer.length })
        } catch (bufferError) {
            console.error('Error creating buffer:', bufferError)
            return res.status(400).json({ 
                error: 'Invalid base64 data',
                message: 'Could not decode file data'
            })
        }
        
        // Determine storage bucket and path with proper sanitization
        const bucket = fileType === 'audio' ? STORAGE_BUCKETS.SONGS : STORAGE_BUCKETS.IMAGES
        const path = generateFilePath(songId, fileName, fileType === 'audio' ? 'audio' : 'image')
        const contentType = fileType === 'audio' ? 'audio/mpeg' : 'image/jpeg'

        // Use Supabase directly for upload
        const supabase = createServerSupabaseClient()
        
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, buffer, {
                contentType,
                upsert: true,
            })

        if (error) {
            console.error('Upload error:', error)
            return res.status(500).json({ 
                error: 'Upload failed',
                message: error.message
            })
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)

        return res.status(200).json({ 
            message: 'File uploaded successfully',
            url: publicUrl,
            path: data.path
        })

    } catch (error) {
        console.error('Upload API Error:', error)
        return res.status(500).json({ 
            error: 'Failed to upload file',
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}