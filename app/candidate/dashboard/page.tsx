'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  Briefcase,
  Bookmark,
  FileText,
  Upload,
  PenSquare,
  User,
  Settings,
  LogOut,
  TrendingUp
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Job {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  created_at: string
}

interface Application {
  id: string
  job_id: string
  applied_at: string
  status: string
  jobs: Job
}

export default function CandidateDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [viewedJobs, setViewedJobs] = useState<Job[]>([])
  const [stats, setStats] = useState({
    applied: 0,
    saved: 0,
    views: 0,
    jobsViewed: 0
  })

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

      const { data: profileData } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Check if user is actually a candidate
      if (user.user_metadata?.role === 'admin') {
        router.push('/admin')
        return
      }
      if (user.user_metadata?.role === 'company') {
        router.push('/company/dashboard')
        return
      }

      setUser(user)
      setProfile(profileData)
      await fetchDashboardData(user.id)
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardData = async (userId: string) => {
    try {
      // Fetch applications
      const { data: appsData } = await supabase
        .from('job_applications')
        .select(`
          id,
          job_id,
          applied_at,
          status,
          jobs (
            id,
            title,
            company,
            location,
            job_type,
            created_at
          )
        `)
        .eq('user_id', userId)
        .order('applied_at', { ascending: false })

      // Fetch saved jobs
      const { data: savedData } = await supabase
        .from('saved_jobs')
        .select(`
          jobs (
            id,
            title,
            company,
            location,
            job_type,
            created_at
          )
        `)
        .eq('user_id', userId)

      setApplications(appsData?.map((app: any) => ({
        id: app.id,
        job_id: app.job_id,
        applied_at: app.applied_at,
        status: app.status,
        jobs: Array.isArray(app.jobs) ? app.jobs[0] : app.jobs
      })).filter((app: Application) => app.jobs) || [])
      setSavedJobs(savedData?.map((s: any) => s.jobs).filter(Boolean) || [])

      setStats({
        applied: appsData?.length || 0,
        saved: savedData?.length || 0,
        views: profile?.profile_views || 0,
        jobsViewed: 0 // Tracking removed for simplification
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewing': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <p className="text-center">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-[#1a1a1a]">
                  Welcome back, {profile?.first_name || 'there'}!
                </h1>
                <p className="text-sm text-gray-600">{profile?.headline || 'Complete your profile to get started'}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
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
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Jobs Applied</p>
                  <p className="text-3xl font-bold">{stats.applied}</p>
                </div>
                <Briefcase className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Saved Jobs</p>
                  <p className="text-3xl font-bold">{stats.saved}</p>
                </div>
                <Bookmark className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Profile Views</p>
                  <p className="text-3xl font-bold">{stats.views}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-500 opacity-50" />
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => router.push('/candidate/cv')}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">My CV</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => router.push('/candidate/cv/upload')}
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm">Upload CV</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => router.push('/candidate/blog/new')}
              >
                <PenSquare className="w-6 h-6" />
                <span className="text-sm">Write Blog</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => router.push('/')}
              >
                <Briefcase className="w-6 h-6" />
                <span className="text-sm">Browse Jobs</span>
              </Button>
            </div>
          </Card>

          {/* Applications & Saved Jobs Tabs */}
          <Tabs defaultValue="applications">
            <TabsList>
              <TabsTrigger value="applications">My Applications ({stats.applied})</TabsTrigger>
              <TabsTrigger value="saved">Saved Jobs ({stats.saved})</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="mt-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Application History</h2>
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-4">You haven't applied to any jobs yet</p>
                      <Link href="/">
                        <Button>Browse Jobs</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{app.jobs.title}</h3>
                              <p className="text-gray-600">{app.jobs.company_name}</p>
                              <p className="text-sm text-gray-500">{app.jobs.location}</p>
                            </div>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center mt-3 text-sm">
                            <span className="text-gray-500">Applied: {formatDate(app.applied_at)}</span>
                            <Link href={`/job/${app.job_id}`}>
                              <Button variant="outline" size="sm">View Job</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Saved Jobs</h2>
                  {savedJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <Bookmark className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-4">No saved jobs yet</p>
                      <Link href="/">
                        <Button>Browse Jobs</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedJobs.map((job) => (
                        <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <p className="text-gray-600">{job.company_name}</p>
                              <p className="text-sm text-gray-500">{job.location} • {job.job_type}</p>
                            </div>
                            <Link href={`/job/${job.id}`}>
                              <Button variant="outline" size="sm">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}
