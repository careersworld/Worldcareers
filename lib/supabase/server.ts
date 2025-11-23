import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for use in Server Components
 * 
 * This client is configured to work with Next.js App Router server components and includes:
 * - Server-side cookie handling
 * - Authentication state from cookies
 * - Row Level Security (RLS) enforcement
 * 
 * @returns Configured Supabase server client instance
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * const supabase = await createServerSupabaseClient()
 * const { data, error } = await supabase.from('jobs').select('*')
 * ```
 */
export async function createServerSupabaseClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
