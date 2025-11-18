'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JobManagement } from '@/components/admin/job-management'
import { BlogManagement } from '@/components/admin/blog-management'
import { InsightManagement } from '@/components/admin/insight-management'
import { UserAnalytics } from '@/components/admin/user-analytics'
import { CompanyManagement } from '@/components/admin/company-management'
import { Briefcase, BookOpen, TrendingUp, User, Home, LogOut, Settings, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('jobs')
  const [stats, setStats] = useState({
    jobs: 0,
    blogs: 0,
    insights: 0,
    companies: 0,
    jobViews: 0,
    blogViews: 0,
    insightViews: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        // Not an admin, redirect to candidate dashboard
        router.push('/candidate/dashboard')
        return
      }

      // User is authenticated and is an admin
      setLoading(false)
      fetchStats()
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    }
  }

  const fetchStats = async () => {
    try {
      // Try to use materialized view first (fastest)
      const { data: statsView } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single()

      if (statsView) {
        setStats({
          jobs: statsView.active_jobs || 0,
          blogs: statsView.total_blogs || 0,
          insights: statsView.total_insights || 0,
          companies: statsView.total_companies || 0,
          jobViews: statsView.total_job_views || 0,
          blogViews: statsView.total_blog_views || 0,
          insightViews: statsView.total_insight_views || 0
        })
        return
      }

      // Fallback to individual queries if materialized view doesn't exist
      const [jobsRes, blogsRes, insightsRes, companiesRes] = await Promise.all([
        supabase.from('jobs').select('id, views_count', { count: 'exact' }),
        supabase.from('blogs').select('id, views_count', { count: 'exact' }),
        supabase.from('career_insights').select('id, views_count', { count: 'exact' }),
        supabase.from('companies').select('id', { count: 'exact' })
      ])

      const jobViews = (jobsRes.data || []).reduce((sum: number, job: any) => sum + (job.views_count || 0), 0)
      const blogViews = (blogsRes.data || []).reduce((sum: number, blog: any) => sum + (blog.views_count || 0), 0)
      const insightViews = (insightsRes.data || []).reduce((sum: number, insight: any) => sum + (insight.views_count || 0), 0)

      setStats({
        jobs: jobsRes.count || 0,
        blogs: blogsRes.count || 0,
        insights: insightsRes.count || 0,
        companies: companiesRes.count || 0,
        jobViews,
        blogViews,
        insightViews
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your platform</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push('/profile/edit')}>
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-3xl font-bold">{stats.jobs}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.jobViews.toLocaleString()} total views</p>
              </div>
              <Briefcase className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Blogs</p>
                <p className="text-3xl font-bold">{stats.blogs}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.blogViews.toLocaleString()} total views</p>
              </div>
              <BookOpen className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Career Insights</p>
                <p className="text-3xl font-bold">{stats.insights}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.insightViews.toLocaleString()} total views</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-3xl font-bold">{stats.companies}</p>
                <p className="text-xs text-muted-foreground mt-1">In database</p>
              </div>
              <Building2 className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs" className="mt-6">
            <JobManagement onUpdate={fetchStats} />
          </TabsContent>
          <TabsContent value="blogs" className="mt-6">
            <BlogManagement onUpdate={fetchStats} />
          </TabsContent>
          <TabsContent value="insights" className="mt-6">
            <InsightManagement onUpdate={fetchStats} />
          </TabsContent>
          <TabsContent value="companies" className="mt-6">
            <CompanyManagement />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <UserAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}