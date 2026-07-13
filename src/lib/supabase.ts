import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Supabase client. Configured from VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 * (set in .env.local — which is git-ignored). Null when not configured, so the
 * ticket layer can fall back to local-only mode during development.
 */
export const supabase = url && key ? createClient(url, key) : null
