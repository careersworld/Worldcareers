'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Plus, Briefcase, Users, Eye, User, Settings, LogOut, Home } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function CompanyDashboard() {
    const [loading, setLoading] = useState(true)
    const [company, setCompany] = useState<any>(null)
    const [jobs, setJobs] = useState<any[]>([])
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalViews: 0,
        totalApplications: 0
    })
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            // Check if user is company
            if (session.user.user_metadata?.role !== 'company') {
                router.push('/')
                return
            }

            // Fetch company profile
            const { data: profile, error } = await supabase
                .from('company_profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (error) throw error
            setCompany(profile)

            // Fetch jobs
            const { data: companyJobs, error: jobsError } = await supabase
                .from('jobs')
                .select('*')
                .eq('company_id', session.user.id)
                .order('created_at', { ascending: false })

            if (jobsError) throw jobsError
            setJobs(companyJobs || [])

            // Calculate stats
            const activeJobs = companyJobs?.filter((j: any) => !j.deadline || new Date(j.deadline) > new Date()).length || 0
            const totalViews = companyJobs?.reduce((acc: number, job: any) => acc + (job.views_count || 0), 0) || 0
            const totalApplications = companyJobs?.reduce((acc: number, job: any) => acc + (job.applications_count || 0), 0) || 0

            setStats({ activeJobs, totalViews, totalApplications })

        } catch (error) {
            console.error('Error loading dashboard:', error)
        } finally {
            setLoading(false)
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
                                    Welcome back, {company?.company_name || 'there'}!
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {company?.industry || 'Manage your job postings and applications'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/">
                                    <Button variant="outline">
                                        <Home className="w-4 h-4 mr-2" />
                                        Return Home
                                    </Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <User className="w-4 h-4 mr-2" />
                                            Profile
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={() => router.push('/company/profile/edit')}>
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
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Quick Action */}
                    <div className="mb-8">
                        <Link href="/company/post-job">
                            <Button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] gap-2">
                                <Plus className="w-4 h-4" />
                                Post New Job
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Active Jobs</p>
                                    <p className="text-3xl font-bold">{stats.activeJobs}</p>
                                </div>
                                <Briefcase className="w-10 h-10 text-blue-500 opacity-50" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Applications</p>
                                    <p className="text-3xl font-bold">{stats.totalApplications}</p>
                                </div>
                                <Users className="w-10 h-10 text-green-500 opacity-50" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Views</p>
                                    <p className="text-3xl font-bold">{stats.totalViews}</p>
                                </div>
                                <Eye className="w-10 h-10 text-purple-500 opacity-50" />
                            </div>
                        </Card>
                    </div>

                    {/* Recent Jobs */}
                    <Card className="overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold">Your Job Postings</h2>
                        </div>
                        <div className="divide-y">
                            {jobs.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 mb-4">No jobs posted yet</p>
                                    <Link href="/company/post-job">
                                        <Button>Post Your First Job</Button>
                                    </Link>
                                </div>
                            ) : (
                                jobs.map((job) => (
                                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                    <span>{job.location}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{job.job_type?.replace('-', ' ')}</span>
                                                    <span>•</span>
                                                    <span className={
                                                        !job.deadline || new Date(job.deadline) > new Date()
                                                            ? "text-green-600 font-medium"
                                                            : "text-red-600 font-medium"
                                                    }>
                                                        {!job.deadline || new Date(job.deadline) > new Date() ? 'Active' : 'Closed'}
                                                    </span>
                                                </div>
                                                {job.deadline && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-6 ml-4">
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold text-gray-900">{job.views_count || 0}</div>
                                                    <div className="text-xs text-gray-500">Views</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold text-gray-900">{job.applications_count || 0}</div>
                                                    <div className="text-xs text-gray-500">Applications</div>
                                                </div>
                                                <Link href={`/job/${job.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    )
}
