'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JobCard } from '@/components/job-card'
import { FilterPanel } from '@/components/filter-panel'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Job, FilterOptions } from '@/lib/types'

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({})
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_sponsored', false)
          .order('created_at', { ascending: false })

        if (error) throw error
        setJobs(data || [])
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const applyFilters = useCallback(() => {
    let result = jobs

    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.jobType && filters.jobType.length > 0) {
      result = result.filter(job => filters.jobType?.includes(job.job_type))
    }

    if (filters.locationType && filters.locationType.length > 0) {
      result = result.filter(job => filters.locationType?.includes(job.location_type))
    }

    setFilteredJobs(result)
  }, [jobs, searchTerm, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilters({})
    setMobileFilterOpen(false)
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <Button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="w-full bg-[#1a1a1a] text-white"
            >
              {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Filter - Mobile Collapsible, Desktop Fixed */}
            <div className={`${
              mobileFilterOpen ? 'block' : 'hidden'
            } md:block md:w-64 shrink-0`}>
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                onClear={handleClearFilters}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-8">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2"
                  />
                  {searchTerm && (
                    <Button
                      onClick={() => setSearchTerm('')}
                      variant="ghost"
                      className="px-2"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              </div>

              {/* Jobs Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading jobs...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No jobs found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
