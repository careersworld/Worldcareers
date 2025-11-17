export type Job = {
  id: string
  title: string
  company: string
  description: string
  location: string
  job_type: 'full-time' | 'part-time' | 'internship' | 'volunteer'
  location_type: 'remote' | 'onsite' | 'hybrid'
  application_link: string
  deadline?: string
  company_logo_url?: string
  company_id?: string
  views_count?: number
  applications_count?: number
  created_at: string
  updated_at: string
}

export type Company = {
  id: string
  name: string
  logo_url?: string
  description?: string
  website?: string
  created_at: string
  updated_at: string
}

export type Blog = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  image_url?: string
  views_count?: number
  status?: 'published' | 'pending' | 'draft'
  created_by?: string
  created_at: string
  updated_at: string
}

export type CareerInsight = {
  id: string
  title: string
  slug: string
  content: string
  category?: string
  image_url?: string
  views_count?: number
  created_at: string
  updated_at: string
}

export type FilterOptions = {
  jobType?: string[]
  locationType?: string[]
  company?: string
  location?: string | string[]
  search?: string
}
