'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Attempting to sign in...')
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error('Authentication error:', authError)
        throw authError
      }

      if (!authData.user) {
        throw new Error('No user data returned from authentication')
      }

      console.log('Authentication successful, fetching profile...')

      console.log('Authentication successful, checking role...')

      // Use metadata for role (set by trigger)
      const role = authData.user.user_metadata?.role || 'candidate'
      console.log('Role found:', role)

      // Redirect based on role using full page reload to ensure session is recognized
      if (role === 'admin') {
        console.log('Redirecting to admin dashboard')
        window.location.href = '/admin'
      } else if (role === 'company') {
        console.log('Redirecting to company dashboard')
        window.location.href = '/company/dashboard'
      } else {
        console.log('Redirecting to candidate dashboard')
        window.location.href = '/candidate/dashboard'
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Failed to sign in')
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
            <p className="text-center text-muted-foreground mb-8">Sign in to manage jobs and content</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#D4AF37] hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
