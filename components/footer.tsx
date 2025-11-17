'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface LocationLink {
  name: string
  slug: string
  count: number
}

interface CategoryLink {
  name: string
  slug: string
  count: number
}

const CATEGORY_NAMES: Record<string, string> = {
  'technology': 'Technology Jobs',
  'healthcare': 'Healthcare Jobs',
  'finance': 'Finance Jobs',
  'education': 'Education Jobs',
  'engineering': 'Engineering Jobs',
  'marketing': 'Marketing Jobs',
  'sales': 'Sales Jobs',
  'customer-service': 'Customer Service Jobs',
  'administration': 'Administration Jobs',
  'management': 'Management Jobs',
  'other': 'Other Jobs',
}

export function Footer() {
  const [districtLinks, setDistrictLinks] = useState<LocationLink[]>([])
  const [categoryLinks, setCategoryLinks] = useState<CategoryLink[]>([])

  useEffect(() => {
    fetchDistrictsAndCategories()
  }, [])

  const fetchDistrictsAndCategories = async () => {
    const supabase = createClient()
    
    try {
      // Fetch distinct locations from jobs
      const { data: locationData, error: locationError } = await supabase
        .from('jobs')
        .select('location')
      
      if (!locationError && locationData) {
        // Count jobs per location and get unique locations
        const locationCounts = new Map<string, number>()
        locationData.forEach(job => {
          if (job.location) {
            const location = job.location.split(',')[0].trim() // Get first part (city/district)
            locationCounts.set(location, (locationCounts.get(location) || 0) + 1)
          }
        })
        
        // Convert to array and sort by count
        const locations = Array.from(locationCounts.entries())
          .map(([name, count]) => ({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) // Show top 5 locations
        
        setDistrictLinks(locations)
      }

      // Fetch distinct categories from jobs
      const { data: categoryData, error: categoryError } = await supabase
        .from('jobs')
        .select('category')
      
      if (!categoryError && categoryData) {
        // Count jobs per category
        const categoryCounts = new Map<string, number>()
        categoryData.forEach(job => {
          if (job.category) {
            categoryCounts.set(job.category, (categoryCounts.get(job.category) || 0) + 1)
          }
        })
        
        // Convert to array and sort by count
        const categories = Array.from(categoryCounts.entries())
          .map(([slug, count]) => ({
            name: CATEGORY_NAMES[slug] || slug,
            slug,
            count
          }))
          .filter(cat => cat.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) // Show top 5 categories
        
        setCategoryLinks(categories)
      }
    } catch (error) {
      console.error('Error fetching footer data:', error)
    }
  }

  return (
    <footer className="bg-[#1a1a1a] text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">WorldCareers</h3>
            <p className="text-gray-400 text-sm">Find your dream job and build your career across Rwanda.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Jobs by Location</h4>
            <ul className="space-y-2 text-sm">
              {districtLinks.length > 0 ? (
                districtLinks.map(district => (
                  <li key={district.slug}>
                    <Link
                      href={`/jobs/${district.slug}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Jobs in {district.name} ({district.count})
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading...</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Jobs by Category</h4>
            <ul className="space-y-2 text-sm">
              {categoryLinks.length > 0 ? (
                categoryLinks.map(category => (
                  <li key={category.slug}>
                    <Link
                      href={`/jobs/category/${category.slug}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {category.name} ({category.count})
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading...</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/blogs" className="hover:text-white transition-colors">Career Blog</Link></li>
              <li><Link href="/career-insights" className="hover:text-white transition-colors">Career Insights</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">&copy; 2025 WorldCareers Rwanda. All rights reserved.</p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
