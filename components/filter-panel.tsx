'use client'

import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { JOB_TYPES, LOCATION_TYPES, JOB_TYPE_LABELS, LOCATION_TYPE_LABELS } from '@/lib/constants'
import type { FilterOptions } from '@/lib/types'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FilterPanelProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  onClear: () => void
}

export function FilterPanel({ filters, onFilterChange, onClear }: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    locationType: true,
    location: true,
  })
  
  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  
  // Fetch available locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase.from('jobs').select('location')
      
      if (data) {
        const locations = Array.from(new Set(
          data
            .map(job => job.location?.split(',')[0].trim())
            .filter((loc): loc is string => !!loc)
        )).sort()
        setAvailableLocations(locations)
      }
    }
    fetchLocations()
  }, [])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleJobTypeChange = (type: string, checked: boolean) => {
    const current = filters.jobType || []
    const updated = checked
      ? [...current, type]
      : current.filter(t => t !== type)
    onFilterChange({ ...filters, jobType: updated.length > 0 ? updated : undefined })
  }

  const handleLocationTypeChange = (type: string, checked: boolean) => {
    const current = filters.locationType || []
    const updated = checked
      ? [...current, type]
      : current.filter(t => t !== type)
    onFilterChange({ ...filters, locationType: updated.length > 0 ? updated : undefined })
  }
  
  const handleLocationChange = (location: string, checked: boolean) => {
    const current = Array.isArray(filters.location) ? filters.location : []
    const updated = checked
      ? [...current, location]
      : current.filter((l: string) => l !== location)
    onFilterChange({ ...filters, location: updated.length > 0 ? updated : undefined })
  }

  return (
    <Card className="p-6 h-fit sticky top-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg">Filter</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      </div>

      {/* Job Type Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('jobType')}
          className="flex items-center justify-between w-full mb-4 font-semibold"
        >
          Type of Employment
          {expandedSections.jobType ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.jobType && (
          <div className="space-y-3">
            {JOB_TYPES.map(type => (
              <label key={type} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={filters.jobType?.includes(type) || false}
                  onCheckedChange={(checked) => handleJobTypeChange(type, checked as boolean)}
                />
                <span className="text-sm">{JOB_TYPE_LABELS[type]}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location Type Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('locationType')}
          className="flex items-center justify-between w-full mb-4 font-semibold"
        >
          Location Type
          {expandedSections.locationType ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.locationType && (
          <div className="space-y-3">
            {LOCATION_TYPES.map(type => (
              <label key={type} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={filters.locationType?.includes(type) || false}
                  onCheckedChange={(checked) => handleLocationTypeChange(type, checked as boolean)}
                />
                <span className="text-sm">{LOCATION_TYPE_LABELS[type]}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Location Section */}
      <div>
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full mb-4 font-semibold"
        >
          Location
          {expandedSections.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.location && (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {availableLocations.length > 0 ? (
              availableLocations.map(location => (
                <label key={location} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={filters.location?.includes(location) || false}
                    onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                  />
                  <span className="text-sm">{location}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">Loading locations...</p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
