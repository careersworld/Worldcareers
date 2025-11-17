'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JobCard } from '@/components/job-card'
import { FilterPanel } from '@/components/filter-panel'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import type { Job, FilterOptions } from '@/lib/types'

const RWANDA_DISTRICTS: Record<string, { name: string; description: string }> = {
  'kigali': {
    name: 'Kigali',
    description: 'Rwanda\'s capital and largest city, hub for tech, finance, and international organizations'
  },
  'musanze': {
    name: 'Musanze',
    description: 'Gateway to Volcanoes National Park, center for tourism and hospitality jobs'
  },
  'rubavu': {
    name: 'Rubavu',
    description: 'Border town with vibrant trade, tourism, and service industry opportunities'
  },
  'huye': {
    name: 'Huye',
    description: 'Educational hub with University of Rwanda, opportunities in education and research'
  },
  'muhanga': {
    name: 'Muhanga',
    description: 'Growing commercial center with agriculture and trade opportunities'
  },
  'rusizi': {
    name: 'Rusizi',
    description: 'Tea plantation region with agriculture and processing industry jobs'
  },
  'nyagatare': {
    name: 'Nyagatare',
    description: 'Agricultural heartland with farming, livestock, and agribusiness opportunities'
  },
  'rwamagana': {
    name: 'Rwamagana',
    description: 'Eastern Province commercial center with growing retail and services sector'
  },
  'karongi': {
    name: 'Karongi',
    description: 'Lake Kivu shoreline, tourism and hospitality employment opportunities'
  },
  'ngoma': {
    name: 'Ngoma',
    description: 'Eastern Province district with agricultural and administrative positions'
  },
}

export default function DistrictJobsPageClient() {
  const params = useParams()
  const district = params.district as string
  
  const [districtInfo, setDistrictInfo] = useState<{ name: string; description: string }>({
    name: RWANDA_DISTRICTS[district]?.name || district.charAt(0).toUpperCase() + district.slice(1),
    description: RWANDA_DISTRICTS[district]?.description || `Find job opportunities in ${district}`
  })
  
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        // Try to match the location slug to actual locations in database
        const locationSearchTerms = [
          districtInfo.name,
          district,
          district.charAt(0).toUpperCase() + district.slice(1)
        ]
        
        // Fetch all open jobs and filter by location
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .or('deadline.is.null,deadline.gte.' + new Date().toISOString())
          .order('created_at', { ascending: false })

        if (error) throw error
        
        // Filter jobs that match any of the location search terms
        const filteredData = (data || []).filter(job => {
          const jobLocation = job.location?.toLowerCase() || ''
          return locationSearchTerms.some(term => 
            jobLocation.includes(term.toLowerCase())
          )
        })
        
        setJobs(filteredData)
        setFilteredJobs(filteredData)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setJobs([])
        setFilteredJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [district, districtInfo.name])

  useEffect(() => {
    let result = jobs

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
  }, [jobs, filters])

  const handleClearFilters = () => {
    setFilters({})
    setMobileFilterOpen(false)
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-[#FFF8DC] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-[#1a1a1a]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                Jobs in {districtInfo.name}
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto text-center">
              {districtInfo.description}
            </p>
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
                  {loading ? 'Loading...' : `${filteredJobs.length} jobs found in ${districtInfo.name}`}
                </p>
              </div>

              {/* Jobs Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading jobs...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No jobs found in {districtInfo.name}.</p>
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="mt-4"
                    variant="outline"
                  >
                    Browse All Jobs
                  </Button>
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
        </section>
      </main>
      <Footer />
    </>
  )
}
