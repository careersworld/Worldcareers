'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JobCard } from '@/components/job-card'
import { FilterPanel } from '@/components/filter-panel'
import { Button } from '@/components/ui/button'
import { Briefcase } from 'lucide-react'
import type { Job, FilterOptions } from '@/lib/types'

const SKILL_CATEGORIES: Record<string, { name: string; description: string; keywords: string[] }> = {
  'technology': {
    name: 'Technology & IT',
    description: 'Software development, web design, IT support, data analysis, cybersecurity, and tech innovation roles',
    keywords: ['developer', 'programmer', 'software', 'IT', 'tech', 'engineer', 'data', 'web', 'mobile', 'cloud']
  },
  'healthcare': {
    name: 'Healthcare & Medical',
    description: 'Doctors, nurses, pharmacists, medical technicians, and healthcare administration positions',
    keywords: ['doctor', 'nurse', 'medical', 'health', 'hospital', 'clinic', 'pharmacist', 'healthcare']
  },
  'finance': {
    name: 'Finance & Banking',
    description: 'Banking, accounting, financial analysis, auditing, and investment opportunities',
    keywords: ['accountant', 'finance', 'banking', 'audit', 'financial', 'investment', 'credit', 'treasury']
  },
  'education': {
    name: 'Education & Training',
    description: 'Teaching positions, training roles, curriculum development, and educational administration',
    keywords: ['teacher', 'professor', 'instructor', 'education', 'training', 'tutor', 'lecturer']
  },
  'engineering': {
    name: 'Engineering',
    description: 'Civil, mechanical, electrical, chemical engineering and construction project roles',
    keywords: ['engineer', 'engineering', 'civil', 'mechanical', 'electrical', 'construction', 'technical']
  },
  'marketing': {
    name: 'Marketing & Communications',
    description: 'Digital marketing, brand management, PR, content creation, and communications roles',
    keywords: ['marketing', 'communications', 'brand', 'digital', 'social media', 'content', 'PR']
  },
  'sales': {
    name: 'Sales & Business Development',
    description: 'Sales representatives, business development, account management, and retail positions',
    keywords: ['sales', 'business development', 'account', 'retail', 'representative', 'commercial']
  },
  'customer-service': {
    name: 'Customer Service',
    description: 'Customer support, call center, client relations, and service excellence roles',
    keywords: ['customer service', 'support', 'call center', 'client', 'service', 'helpdesk']
  },
  'administration': {
    name: 'Administration & Office',
    description: 'Administrative assistants, office management, coordination, and secretarial positions',
    keywords: ['admin', 'administrator', 'office', 'secretary', 'coordinator', 'assistant']
  },
  'management': {
    name: 'Management & Leadership',
    description: 'Managers, directors, team leaders, and executive positions across all sectors',
    keywords: ['manager', 'director', 'head', 'chief', 'executive', 'leader', 'supervisor']
  },
}

export default function CategoryJobsPageClient() {
  const params = useParams()
  const category = params.category as string
  const categoryInfo = SKILL_CATEGORIES[category] || {
    name: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Find ${category} jobs in Rwanda`,
    keywords: [category]
  }

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
        
        // Fetch open jobs by category field from database
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('category', category)
          .or('deadline.is.null,deadline.gte.' + new Date().toISOString())
          .order('created_at', { ascending: false })

        if (error) throw error
        
        setJobs(data || [])
        setFilteredJobs(data || [])
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setJobs([])
        setFilteredJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [category, categoryInfo.keywords])

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
              <Briefcase className="w-8 h-8 text-[#1a1a1a]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                {categoryInfo.name} Jobs
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto text-center">
              {categoryInfo.description}
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
                  {loading ? 'Loading...' : `${filteredJobs.length} ${categoryInfo.name.toLowerCase()} jobs found`}
                </p>
              </div>

              {/* Jobs Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading jobs...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No {categoryInfo.name.toLowerCase()} jobs found.</p>
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
