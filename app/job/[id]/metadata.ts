import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createServerSupabaseClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'The job you are looking for does not exist.',
    }
  }

  const title = `${job.title} at ${job.company} - ${job.location}`
  const description = job.description ? 
    job.description.replace(/<[^>]*>/g, '').substring(0, 160) : 
    `Apply for ${job.title} position at ${job.company} in ${job.location}. ${job.job_type} - ${job.location_type}`

  return {
    title,
    description,
    keywords: [
      job.title,
      job.company,
      job.location,
      `${job.title} Rwanda`,
      `jobs in ${job.location}`,
      job.job_type,
      job.location_type,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://worldcareers.rw/job/${job.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://worldcareers.rw/job/${job.id}`,
    },
  }
}
