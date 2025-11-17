'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, Plus, Building2 } from 'lucide-react'
import RichText, { type RichTextHandle } from '@/components/ui/rich-text'
import type { Company } from '@/lib/types'

export default function NewJobPage(){
  const editorRef = useRef<RichTextHandle | null>(null)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('full-time')
  const [locationType, setLocationType] = useState('remote')
  const [category, setCategory] = useState('')
  const [applicationLink, setApplicationLink] = useState('')
  const [deadline, setDeadline] = useState('')
  const [saving, setSaving] = useState(false)
  
  // Company selection
  const [companies, setCompanies] = useState<Company[]>([])
  const [companySearch, setCompanySearch] = useState('')
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  
  // Available categories from database
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCompanies()
    fetchAvailableCategories()
  }, [])

  useEffect(() => {
    if (companySearch.trim()) {
      const filtered = companies.filter(c => 
        c.name.toLowerCase().includes(companySearch.toLowerCase())
      )
      setFilteredCompanies(filtered)
      setShowCompanyDropdown(filtered.length > 0)
    } else {
      setFilteredCompanies([])
      setShowCompanyDropdown(false)
    }
  }, [companySearch, companies])

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')
      
      if (error) {
        console.warn('Companies table not found, will create companies on the fly:', error)
        setCompanies([])
        return
      }
      setCompanies(data || [])
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
    }
  }

  const fetchAvailableCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('category')
      
      if (error) {
        console.error('Error fetching categories:', error)
        return
      }
      
      // Get unique categories that exist in the database
      const uniqueCategories = Array.from(new Set(
        data
          ?.map(job => job.category)
          .filter((cat): cat is string => cat !== null && cat !== undefined && cat !== '')
      ))
      
      setAvailableCategories(uniqueCategories.sort())
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try{
      let companyId = selectedCompany?.id
      let companyName = selectedCompany?.name || companySearch.trim()
      let companyLogoUrl = selectedCompany?.logo_url || ''

      if (!companyName) {
        alert('Please enter a company name')
        setSaving(false)
        return
      }

      const description = editorRef.current?.getHTML() || ''
      
      if (!description || description.trim() === '') {
        alert('Please provide a job description')
        setSaving(false)
        return
      }

      if (!category) {
        alert('Please select a category')
        setSaving(false)
        return
      }

      const jobData: any = { 
        title, 
        company: companyName,
        location, 
        job_type: jobType, 
        location_type: locationType,
        category,
        application_link: applicationLink, 
        description 
      }
      
      // Add optional fields
      if (companyId) jobData.company_id = companyId
      if (companyLogoUrl) jobData.company_logo_url = companyLogoUrl
      if (deadline) jobData.deadline = deadline
      
      console.log('Submitting job data:', jobData)
      
      const { data: insertedJob, error } = await supabase.from('jobs').insert([jobData]).select()
      
      if(error) {
        console.error('Database error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(error.message || 'Failed to insert job')
      }
      
      console.log('Job created successfully:', insertedJob)
      router.push('/admin')
    }catch(err: any){
      console.error('Failed to create job:', {
        error: err,
        message: err?.message,
        stack: err?.stack
      })
      alert(`Failed to create job: ${err?.message || JSON.stringify(err) || 'Unknown error'}`)
    }finally{ 
      setSaving(false) 
    }
  }

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company)
    setCompanySearch(company.name)
    setShowCompanyDropdown(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Create New Job</h1>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input 
                id="title"
                placeholder="e.g. Senior Full Stack Developer" 
                value={title} 
                onChange={(e)=>setTitle(e.target.value)} 
                required 
              />
            </div>
            
            {/* Company Selection */}
            <div className="space-y-4">
              <Label>Company *</Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Enter company name..."
                    value={companySearch}
                    onChange={(e) => {
                      setCompanySearch(e.target.value)
                      setSelectedCompany(null)
                    }}
                    onFocus={() => companySearch && setShowCompanyDropdown(true)}
                    required
                  />
                  {showCompanyDropdown && filteredCompanies.length > 0 && (
                    <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
                      {filteredCompanies.map((company) => (
                        <div
                          key={company.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleCompanySelect(company)}
                        >
                          <div className="flex items-center gap-3">
                            {company.logo_url && (
                              <img
                                src={company.logo_url}
                                alt={company.name}
                                className="w-10 h-10 object-contain rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{company.name}</p>
                              {company.description && (
                                <p className="text-xs text-gray-500 line-clamp-1">
                                  {company.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </Card>
                  )}
                </div>
                <Link href="/admin/companies/new">
                  <Button type="button" variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Company
                  </Button>
                </Link>
              </div>
              {selectedCompany && (
                <Card className="p-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    {selectedCompany.logo_url && (
                      <img
                        src={selectedCompany.logo_url}
                        alt={selectedCompany.name}
                        className="w-16 h-16 object-contain rounded"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{selectedCompany.name}</p>
                      {selectedCompany.description && (
                        <p className="text-sm text-gray-600">{selectedCompany.description}</p>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location"
                  placeholder="e.g. Kigali, Rwanda" 
                  value={location} 
                  onChange={(e)=>setLocation(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input 
                  id="deadline"
                  type="date" 
                  value={deadline} 
                  onChange={(e)=>setDeadline(e.target.value)} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="applicationLink">Application Link *</Label>
              <Input 
                id="applicationLink"
                placeholder="https://company.com/apply" 
                value={applicationLink} 
                onChange={(e)=>setApplicationLink(e.target.value)} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobType">Job Type *</Label>
                <select 
                  id="jobType"
                  value={jobType} 
                  onChange={(e)=>setJobType(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                  required
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <Label htmlFor="locationType">Location Type *</Label>
                <select 
                  id="locationType"
                  value={locationType} 
                  onChange={(e)=>setLocationType(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                  required
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select 
                id="category"
                value={category} 
                onChange={(e)=>setCategory(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                required
              >
                <option value="">Select a category</option>
                {availableCategories.length > 0 ? (
                  availableCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading categories...</option>
                )}
              </select>
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <RichText ref={editorRef} placeholder="Write a detailed job description including responsibilities, requirements, and benefits..." />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/admin">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-[#1a1a1a]" disabled={saving}>{saving ? 'Creating...' : 'Create Job'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
