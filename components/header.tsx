'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    checkAuthAndRole()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuthAndRole()
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAuthAndRole = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setIsLoggedIn(!!session)

    if (session?.user) {
      // Use metadata for role (set by trigger)
      const role = session.user.user_metadata?.role || 'candidate'
      setUserRole(role)
    } else {
      setUserRole(null)
    }
  }

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin'
    if (userRole === 'company') return '/company/dashboard'
    return '/candidate/dashboard'
  }

  return (
    <header className="bg-[#FFF8DC] border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-lg sm:text-2xl text-[#1a1a1a]">
            WorldCareers
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#1a1a1a] hover:text-[#D4AF37] transition-colors">
              Find job
            </Link>
            <Link href="/career-insights" className="text-[#1a1a1a] hover:text-[#D4AF37] transition-colors">
              Career Insights
            </Link>
            <Link href="/blogs" className="text-[#1a1a1a] hover:text-[#D4AF37] transition-colors">
              Blogs
            </Link>
            <Link href="/about" className="text-[#1a1a1a] hover:text-[#D4AF37] transition-colors">
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAdmin ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" className="text-[#1a1a1a] hover:bg-white">Dashboard</Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="text-[#1a1a1a] hover:bg-white">Public Site</Button>
                </Link>
              </>
            ) : isLoggedIn ? (
              <Link href={getDashboardLink()}>
                <Button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] rounded-full">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-[#1a1a1a] hover:bg-white">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] rounded-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1a1a1a] text-lg font-bold"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200">
            <Link href="/" className="block py-2 text-[#1a1a1a]">
              Find job
            </Link>
            <Link href="/career-insights" className="block py-2 text-[#1a1a1a]">
              Career Insights
            </Link>
            <Link href="/blogs" className="block py-2 text-[#1a1a1a]">
              Blogs
            </Link>
            <Link href="/about" className="block py-2 text-[#1a1a1a]">
              About
            </Link>
            <div className="flex gap-2 mt-4 flex-col">
              {isLoggedIn ? (
                <Link href={getDashboardLink()}>
                  <Button className="w-full bg-[#1a1a1a] text-white">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full text-[#1a1a1a]">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-[#1a1a1a] text-white">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
