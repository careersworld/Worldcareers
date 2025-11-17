import { createServerSupabaseClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

const RWANDA_DISTRICTS = [
  'kigali', 'musanze', 'rubavu', 'huye', 'muhanga', 'rusizi', 'nyagatare',
  'rwamagana', 'gitarama', 'karongi', 'ngoma', 'kayonza', 'burera', 'gicumbi',
  'nyamasheke', 'rutsiro', 'nyanza', 'gatsibo', 'kirehe', 'ruhango',
  'bugesera', 'gakenke', 'kamonyi', 'nyaruguru', 'rulindo', 'gisagara',
  'ngororero', 'nyabihu', 'rwamag ana', 'eastern-province'
]

const SKILL_CATEGORIES = [
  'technology', 'healthcare', 'finance', 'education', 'engineering',
  'marketing', 'sales', 'customer-service', 'administration', 'management',
  'hospitality', 'construction', 'agriculture', 'legal', 'creative'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://worldcareers.rw'
  
  // Main pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/career-insights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    const supabase = await createServerSupabaseClient()
    
    // Fetch all jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id, created_at')
      .order('created_at', { ascending: false })

    // Fetch all blogs
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('slug, created_at')
      .order('created_at', { ascending: false })

    // Fetch all career insights
    const { data: insights, error: insightsError } = await supabase
      .from('career_insights')
      .select('slug, created_at')
      .order('created_at', { ascending: false })

    // Log errors but don't fail
    if (jobsError) console.warn('Error fetching jobs for sitemap:', jobsError.message)
    if (blogsError) console.warn('Error fetching blogs for sitemap:', blogsError.message)
    if (insightsError) console.warn('Error fetching insights for sitemap:', insightsError.message)

    // Add district pages
    RWANDA_DISTRICTS.forEach(district => {
      routes.push({
        url: `${baseUrl}/jobs/${district}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      })
    })

    // Add skill category pages
    SKILL_CATEGORIES.forEach(category => {
      routes.push({
        url: `${baseUrl}/jobs/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      })
    })

    // Add job pages
    if (jobs && !jobsError) {
      jobs.forEach(job => {
        routes.push({
          url: `${baseUrl}/job/${job.id}`,
          lastModified: new Date(job.created_at),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    }

    // Add blog pages
    if (blogs && !blogsError) {
      blogs.forEach(blog => {
        routes.push({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastModified: new Date(blog.created_at),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      })
    }

    // Add career insight pages
    if (insights && !insightsError) {
      insights.forEach(insight => {
        routes.push({
          url: `${baseUrl}/career-insights/${insight.slug}`,
          lastModified: new Date(insight.created_at),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      })
    }
  } catch (error) {
    console.warn('Error generating sitemap:', error)
    // Continue with static routes only
  }

  return routes
}
