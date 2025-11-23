import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in browser/client components
 * 
 * This client is configured to work with Next.js App Router and includes:
 * - Automatic cookie handling
 * - Authentication state management
 * - Real-time subscriptions
 * - Row Level Security (RLS) enforcement
 * 
 * @returns Configured Supabase client instance
 * 
 * @example
 * ```typescript
 * const supabase = createClient()
 * const { data, error } = await supabase.from('jobs').select('*')
 * ```
 */
export function createClient() {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase environment variables!')
        console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
        throw new Error('Missing Supabase configuration. Check your .env.local file.')
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
