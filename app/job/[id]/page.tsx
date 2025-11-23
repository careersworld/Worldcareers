'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Head from 'next/head'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { JobShareButtons } from '@/components/job-share-buttons'
import Link from 'next/link'
import type { Job } from '@/lib/types'
import { JOB_TYPE_LABELS, LOCATION_TYPE_LABELS } from '@/lib/constants'
import { ChevronLeft, Briefcase, MapPin, Globe, Clock, Eye, Users } from 'lucide-react'
import { trackView } from '@/lib/utils/view-tracking'

function sanitizeHtml(html: string) {
  // Minimal sanitizer: remove script/style tags and on* attributes
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const scripts = doc.querySelectorAll('script,style')
  scripts.forEach((n) => n.remove())
  // Remove event handler attributes
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT)
  while (walker.nextNode()) {
    const el = walker.currentNode as HTMLElement
    Array.from(el.attributes).forEach(attr => {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name)
    })
  }
  return doc.body.innerHTML
}

export default function JobDetailPage() {
  const params = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        if (!data) {
          setNotFound(true)
        } else {
          setJob(data)

          // Track view after job is loaded
          const { data: { user } } = await supabase.auth.getUser()
          await trackView('job', data.id, user?.id)
        }
      } catch (error) {
        console.error('Error fetching job:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-center text-muted-foreground">Loading job details...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (notFound || !job) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
              <p className="text-gray-600 mb-6">
                Sorry, we couldn't find the job you're looking for.
              </p>
              <Link href="/">
                <Button className="bg-[#1a1a1a] text-white">
                  Browse All Jobs
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const postedDate = new Date(job.created_at)
  const postedDaysAgo = Math.floor(
    (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const deadlineDate = job.deadline ? new Date(job.deadline) : null
  const daysUntilDeadline = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  // JobPosting structured data
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description?.replace(/<[^>]*>/g, '') || '',
    "datePosted": job.created_at,
    "validThrough": job.deadline || undefined,
    "employmentType": job.job_type.toUpperCase(),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company_name,
      "logo": job.company_logo_url || undefined,
      "sameAs": job.company_logo_url || undefined
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": "RW"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Rwanda"
    }
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const pageTitle = `${job.title} at ${job.company_name} | WorldCareers Rwanda`
  const pageDescription = job.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Apply for ${job.title} position at ${job.company_name} in ${job.location}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        {job.company_logo_url && <meta property="og:image" content={job.company_logo_url} />}
        <meta property="og:site_name" content="WorldCareers Rwanda" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {job.company_logo_url && <meta name="twitter:image" content={job.company_logo_url} />}

        {/* WhatsApp specific */}
        {job.company_logo_url && <meta property="og:image:secure_url" content={job.company_logo_url} />}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />
      </Head>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-[#1a1a1a] mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          <Card className="p-8">
            {/* Job Header */}
            <div className="mb-6">
              <div className="flex gap-4 items-start mb-4">
                {job.company_logo_url && (
                  <img
                    src={job.company_logo_url}
                    alt={`${job.company_name} logo`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-700 mb-3">{job.company_name}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{job.location}</span>
                  </div>
                </div>
              </div>

              {/* Job Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Job Type</p>
                    <p className="text-sm font-semibold text-gray-900">{JOB_TYPE_LABELS[job.job_type]}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Location Type</p>
                    <p className="text-sm font-semibold text-gray-900">{LOCATION_TYPE_LABELS[job.location_type]}</p>
                  </div>
                </div>
                {job.views_count !== undefined && (
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">Views</p>
                      <p className="text-sm font-semibold text-gray-900">{job.views_count.toLocaleString()} people viewed</p>
                    </div>
                  </div>
                )}
                {job.applications_count !== undefined && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">Applicants</p>
                      <p className="text-sm font-semibold text-gray-900">{job.applications_count.toLocaleString()} applications</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Posted Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {postedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-500">
                      ({postedDaysAgo} {postedDaysAgo === 1 ? 'day' : 'days'} ago)
                    </p>
                  </div>
                </div>
                {deadlineDate && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">Application Deadline</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {deadlineDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      {daysUntilDeadline !== null && (
                        <p className={`text-xs font-medium ${daysUntilDeadline < 0
                          ? 'text-red-600'
                          : daysUntilDeadline <= 7
                            ? 'text-orange-600'
                            : 'text-green-600'
                          }`}>
                          {daysUntilDeadline < 0
                            ? `Expired ${Math.abs(daysUntilDeadline)} ${Math.abs(daysUntilDeadline) === 1 ? 'day' : 'days'} ago`
                            : daysUntilDeadline === 0
                              ? 'Deadline today!'
                              : `${daysUntilDeadline} ${daysUntilDeadline === 1 ? 'day' : 'days'} left`
                          }
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">
                Job Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description || '') }} />
              </div>
            </div>

            {/* Apply Button */}
            <div className="border-t pt-6">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <JobShareButtons
                  jobId={job.id}
                  jobTitle={job.title}
                  companyName={job.company_name}
                  jobUrl={pageUrl}
                  location={job.location}
                  jobType={JOB_TYPE_LABELS[job.job_type]}
                  applicationLink={job.application_link}
                  companyLogo={job.company_logo_url}
                />
                <a
                  href={job.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] px-8 py-3 text-lg">
                    Apply Now
                  </Button>
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                You will be redirected to the company's application page
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
