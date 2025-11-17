'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthProvider({ children }: { children: React.ReactNode }){
  useEffect(() => {
    const supabase = createClient()
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // session persistence handled by client options; this listener can be used to
      // react to changes or refresh UI if needed.
      // Example: console.log('Auth event', event)
    })

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  return <>{children}</>
}
