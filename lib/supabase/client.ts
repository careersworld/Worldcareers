import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase environment variables. Using placeholder client.')
    // Return a mock client for build time with chainable methods
    const mockQuery = {
      select: function () { return this },
      insert: function () { return this },
      update: function () { return this },
      delete: function () { return this },
      eq: function () { return this },
      neq: function () { return this },
      gt: function () { return this },
      gte: function () { return this },
      lt: function () { return this },
      lte: function () { return this },
      like: function () { return this },
      ilike: function () { return this },
      is: function () { return this },
      in: function () { return this },
      contains: function () { return this },
      containedBy: function () { return this },
      range: function () { return this },
      or: function () { return this },
      and: function () { return this },
      not: function () { return this },
      filter: function () { return this },
      match: function () { return this },
      order: function () { return this },
      limit: function () { return this },
      single: function () { return Promise.resolve({ data: null, error: null }) },
      maybeSingle: function () { return Promise.resolve({ data: null, error: null }) },
      then: function (resolve: any) {
        return resolve({ data: [], error: null })
      },
    }

    return {
      from: () => mockQuery,
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: (callback: any) => {
          // Return a mock subscription
          return {
            data: { subscription: { unsubscribe: () => { } } },
            error: null
          }
        },
        refreshSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          download: () => Promise.resolve({ data: null, error: null }),
          remove: () => Promise.resolve({ data: null, error: null }),
          list: () => Promise.resolve({ data: [], error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    } as any
  }

  client = createBrowserClient(
    supabaseUrl,
    supabaseKey
  )

  return client
}
