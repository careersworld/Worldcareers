'use client'

import { createClient } from '@supabase/supabase-js'

let cachedClient: any = null

export function getSupabaseClient() {
  if (cachedClient) return cachedClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }

  cachedClient = createClient(url, key)
  return cachedClient
}
