import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('Missing Supabase environment variables. Using placeholder client.')
    // Return a mock client for build time
    return {
      from: () => ({
        select: () => ({ data: null, error: new Error('Missing Supabase environment variables') }),
        insert: () => ({ data: null, error: new Error('Missing Supabase environment variables') }),
        update: () => ({ data: null, error: new Error('Missing Supabase environment variables') }),
        delete: () => ({ data: null, error: new Error('Missing Supabase environment variables') }),
        eq: function() { return this },
        single: function() { return this },
        order: function() { return this },
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    } as any
  }

  const cookieStore = await cookies()

  const supabase = createSupabaseClient(url, key, {
    global: {
      headers: {
        'x-client-info': 'nextjs',
      },
    },
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set(name, value, options)
      },
      remove(name) {
        cookieStore.delete(name)
      },
    },
  })

  return supabase
}
