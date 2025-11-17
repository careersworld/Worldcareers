'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { JobCard } from '@/components/job-card'
import type { Job } from '@/lib/types'
import { Button } from '@/components/ui/button'

export function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) throw error
        setJobs(data || [])
      } catch (error) {
        console.error('Error fetching featured jobs:', error)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedJobs()
  }, [])

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Jobs</h2>
          <p className="text-gray-600">Discover amazing opportunities from top companies</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading featured jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No jobs available yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {jobs.slice(0, 6).map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="text-center">
              <Link href="/jobs">
                <Button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] px-8 py-3">
                  View All Jobs →
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
