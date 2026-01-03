import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLISHABLE_SUPABASE_KEY!
const supabaseSecretKey = process.env.NEXT_SECRET_SUPABASE_KEY!

if (!supabaseURL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabasePublishableKey) {
  throw new Error('Missing env.NEXT_PUBLISHABLE_SUPABASE_KEY')
}

if (!supabaseSecretKey) { 
  throw new Error('Missing env.NEXT_SECRET_SUPABASE_KEY')
}

// Client-side Supabase client for browser usage
export const supabase = createClient(supabaseURL, supabasePublishableKey)

// Server-side Supabase client with service role key for admin operations
export const createServerSupabaseClient = (): SupabaseClient => {
  if (typeof window !== 'undefined') {
    throw new Error('createServerSupabaseClient should only be used on the server')
  }
  
  if (!supabaseSecretKey) {
    throw new Error('Missing env.NEXT_SECRET_SUPABASE_KEY for server operations')
  }
  
  return createClient(supabaseURL, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Storage bucket configurations
export const STORAGE_BUCKETS = {
  SONGS: 'songs',
  IMAGES: 'images',
} as const

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]