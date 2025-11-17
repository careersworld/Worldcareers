#!/usr/bin/env node
// Simple check script: verifies env vars and attempts to create a Supabase client.
// Usage: node scripts/check-supabase.js

const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing env vars. Please create a `.env.local` with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  process.exit(1)
}

console.log('Found SUPABASE_URL and ANON_KEY in environment (will mask values below)')
console.log('NEXT_PUBLIC_SUPABASE_URL=', url.replace(/(?<=https:\/\/).*/,'<project-ref>.supabase.co'))
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=', key.slice(0, 6) + '...' + key.slice(-6))

async function main() {
  const supabase = createClient(url, key)
  try {
    // Try a lightweight call: list storage buckets (may be blocked by RLS),
    // or fall back to a generic RPC if available. We'll handle any error.
    const { data, error } = await supabase.storage.listBuckets()
    if (error) {
      console.error('Client created but request returned error:')
      console.error(error.message || error)
      process.exit(2)
    }
    console.log('Successfully connected to Supabase storage. Buckets:', (data || []).length)
    process.exit(0)
  } catch (err) {
    console.error('Error while trying to use Supabase client:')
    console.error(err && err.message ? err.message : err)
    process.exit(3)
  }
}

main()
