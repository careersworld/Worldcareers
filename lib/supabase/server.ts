import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('Missing Supabase environment variables. Using placeholder client.')
    // Return a mock client for build time with chainable methods
    const mockQuery = {
      select: function() { return this },
      insert: function() { return this },
      update: function() { return this },
      delete: function() { return this },
      eq: function() { return this },
      neq: function() { return this },
      gt: function() { return this },
      gte: function() { return this },
      lt: function() { return this },
      lte: function() { return this },
      like: function() { return this },
      ilike: function() { return this },
      is: function() { return this },
      in: function() { return this },
      contains: function() { return this },
      containedBy: function() { return this },
      range: function() { return this },
      or: function() { return this },
      and: function() { return this },
      not: function() { return this },
      filter: function() { return this },
      match: function() { return this },
      order: function() { return this },
      limit: function() { return this },
      range: function() { return this },
      single: function() { return { data: null, error: new Error('Missing Supabase environment variables') } },
      maybeSingle: function() { return { data: null, error: null } },
      then: function(resolve: any) { 
        return resolve({ data: null, error: new Error('Missing Supabase environment variables') })
      },
    }
    
    return {
      from: () => mockQuery,
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
