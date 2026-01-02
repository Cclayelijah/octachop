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

// Helper function to generate unique file paths
export const generateFilePath = (songId: string, filename: string, type: 'audio' | 'image'): string => {
  const timestamp = Date.now()
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${songId}/${timestamp}_${sanitizedFilename}`
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