'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JobCard } from '@/components/job-card'
import { FilterPanel } from '@/components/filter-panel'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { Job, FilterOptions } from '@/lib/types'

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({})
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const JOBS_PER_PAGE = 10

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .or('deadline.is.null,deadline.gte.' + new Date().toISOString())
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
    
    if (filters.location && Array.isArray(filters.location) && filters.location.length > 0) {
      result = result.filter(job => {
        const jobLocation = job.location?.split(',')[0].trim()
        return filters.location && Array.isArray(filters.location) && filters.location.includes(jobLocation)
      })
    }

    setFilteredJobs(result)
    setPage(1) // Reset to first page when filters change
  }, [jobs, searchTerm, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  useEffect(() => {
    // Update displayed jobs based on current page
    setDisplayedJobs(filteredJobs.slice(0, page * JOBS_PER_PAGE))
  }, [filteredJobs, page])

  const handleSearch = () => {
    setSearchTerm(searchInput)
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearchInput('')
    setSearchTerm('')
    setFilters({})
    setMobileFilterOpen(false)
  }

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  const hasMore = displayedJobs.length < filteredJobs.length

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-[#FFF8DC] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 sm:mb-3">
                Find Your Dream Job
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 max-w-2xl mx-auto px-2">
                Discover amazing opportunities and advance your career with WorldCareers.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden  hover:border-gray-400 transition-colors focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-300">
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                />
                <Button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] rounded-none border-0 h-auto"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section with Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {/* Sidebar Filter */}
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
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {loading ? 'Loading...' : `${filteredJobs.length} jobs found`}
                </p>
              </div>

              {/* Jobs Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading jobs...</p>
                </div>
              ) : displayedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No jobs found matching your criteria.</p>
                  {(searchTerm || Object.keys(filters).length > 0) && (
                    <Button
                      onClick={handleClearFilters}
                      className="mt-4"
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    {displayedJobs.map(job => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center mt-8">
                      <Button
                        onClick={handleLoadMore}
                        className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] px-8 py-3"
                      >
                        Load More Jobs
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
