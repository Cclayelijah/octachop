import { supabase, createServerSupabaseClient, STORAGE_BUCKETS, StorageBucket } from './supabase'

export interface FileUploadOptions {
  bucket: StorageBucket
  path: string
  file: File
  contentType?: string
}

export interface FileUploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

// Client-side file upload function
export const uploadFile = async ({
  bucket,
  path,
  file,
  contentType
}: FileUploadOptions): Promise<FileUploadResult> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: contentType || file.type,
        upsert: true,
      })

    if (error) {
      console.error('Error uploading file:', error)
      return { success: false, error: error.message }
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    }
  } catch (err) {
    console.error('Unexpected error uploading file:', err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }
  }
}

// Server-side file upload function (for API routes)
export const uploadFileServer = async ({
  bucket,
  path,
  file,
  contentType
}: FileUploadOptions): Promise<FileUploadResult> => {
  try {
    const supabaseServer = createServerSupabaseClient()
    
    const { data, error } = await supabaseServer.storage
      .from(bucket)
      .upload(path, file, {
        contentType: contentType || file.type,
        upsert: true,
      })

    if (error) {
      console.error('Error uploading file (server):', error)
      return { success: false, error: error.message }
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseServer.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    }
  } catch (err) {
    console.error('Unexpected error uploading file (server):', err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }
  }
}

// Helper function to generate clean file paths (no timestamps for predictable overwriting)
export const generateFilePath = (songId: string, filename: string, type: 'audio' | 'image'): string => {
  // More aggressive sanitization for Supabase storage compatibility
  // Keep only alphanumeric characters, dots, hyphens, and underscores
  const sanitizedFilename = filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace any non-alphanumeric chars (except .-) with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single underscore
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase() // Convert to lowercase for consistency
  
  // Use predictable paths that can be overwritten (no timestamps)
  return `${songId}/${sanitizedFilename}`
}

// Helper function to clean up existing files for a song
export const cleanupSongFiles = async (songId: string): Promise<boolean> => {
  try {
    const supabase = createServerSupabaseClient()
    
    // Clean up both image and audio buckets
    const buckets = [STORAGE_BUCKETS.IMAGES, STORAGE_BUCKETS.SONGS]
    
    for (const bucket of buckets) {
      // List all files in the songId folder
      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list(songId, { limit: 1000 })
      
      if (listError) {
        console.warn(`Could not list files in ${bucket}/${songId}:`, listError.message)
        continue
      }
      
      if (files && files.length > 0) {
        // Delete all files in the folder
        const filePaths = files.map(file => `${songId}/${file.name}`)
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove(filePaths)
        
        if (deleteError) {
          console.warn(`Could not delete some files in ${bucket}/${songId}:`, deleteError.message)
        } else {
          console.log(`Cleaned up ${files.length} files from ${bucket}/${songId}`)
        }
      }
    }
    
    return true
  } catch (error) {
    console.error('Error cleaning up song files:', error)
    return false
  }
}

// Helper function to clean up specific files for levels being replaced
export const cleanupSpecificFiles = async (songId: string, filesToCleanup: string[]): Promise<boolean> => {
  try {
    if (filesToCleanup.length === 0) return true
    
    const supabase = createServerSupabaseClient()
    
    // Group files by bucket type
    const imageFiles: string[] = []
    const audioFiles: string[] = []
    
    filesToCleanup.forEach(filename => {
      const path = `${songId}/${filename.toLowerCase()}`
      if (filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        imageFiles.push(path)
      } else {
        audioFiles.push(path)
      }
    })
    
    // Clean up image files
    if (imageFiles.length > 0) {
      const { error: imageError } = await supabase.storage
        .from(STORAGE_BUCKETS.IMAGES)
        .remove(imageFiles)
      
      if (imageError) {
        console.warn(`Could not delete some image files:`, imageError.message)
      } else {
        console.log(`Cleaned up ${imageFiles.length} image files`)
      }
    }
    
    // Clean up audio files
    if (audioFiles.length > 0) {
      const { error: audioError } = await supabase.storage
        .from(STORAGE_BUCKETS.SONGS)
        .remove(audioFiles)
      
      if (audioError) {
        console.warn(`Could not delete some audio files:`, audioError.message)
      } else {
        console.log(`Cleaned up ${audioFiles.length} audio files`)
      }
    }
    
    return true
  } catch (error) {
    console.error('Error cleaning up specific files:', error)
    return false
  }
}

// Helper function to upload audio file
export const uploadAudioFile = async (songId: string, file: File): Promise<FileUploadResult> => {
  const path = generateFilePath(songId, file.name, 'audio')
  
  return uploadFile({
    bucket: STORAGE_BUCKETS.SONGS,
    path,
    file,
    contentType: 'audio/mpeg'
  })
}

// Helper function to upload image file
export const uploadImageFile = async (songId: string, file: File): Promise<FileUploadResult> => {
  const path = generateFilePath(songId, file.name, 'image')
  
  return uploadFile({
    bucket: STORAGE_BUCKETS.IMAGES,
    path,
    file,
  })
}

// Server-side helper functions
export const uploadAudioFileServer = async (songId: string, file: File): Promise<FileUploadResult> => {
  const path = generateFilePath(songId, file.name, 'audio')
  
  return uploadFileServer({
    bucket: STORAGE_BUCKETS.SONGS,
    path,
    file,
    contentType: 'audio/mpeg'
  })
}

export const uploadImageFileServer = async (songId: string, file: File): Promise<FileUploadResult> => {
  const path = generateFilePath(songId, file.name, 'image')
  
  return uploadFileServer({
    bucket: STORAGE_BUCKETS.IMAGES,
    path,
    file,
  })
}

// Delete file function
export const deleteFile = async (bucket: StorageBucket, path: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])
    
    if (error) {
      console.error('Error deleting file:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (err) {
    console.error('Unexpected error deleting file:', err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }
  }
}

// Server-side delete file function
export const deleteFileServer = async (bucket: StorageBucket, path: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabaseServer = createServerSupabaseClient()
    const { error } = await supabaseServer.storage.from(bucket).remove([path])
    
    if (error) {
      console.error('Error deleting file (server):', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (err) {
    console.error('Unexpected error deleting file (server):', err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }
  }
}