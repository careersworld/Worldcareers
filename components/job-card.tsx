import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Briefcase, MapPin, Clock, Eye, Users } from 'lucide-react'
import type { Job } from '@/lib/types'
import { JOB_TYPE_LABELS, LOCATION_TYPE_LABELS } from '@/lib/constants'
import { JobShareButtons } from '@/components/job-share-buttons'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const getDeadlineInfo = () => {
    if (!job.deadline) return null
    const deadline = new Date(job.deadline)
    const now = new Date()
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysRemaining < 0) return { text: 'Expired', color: 'text-red-600' }
    if (daysRemaining === 0) return { text: 'Today', color: 'text-orange-600' }
    if (daysRemaining === 1) return { text: '1 day left', color: 'text-orange-500' }
    if (daysRemaining <= 7) return { text: `${daysRemaining} days left`, color: 'text-yellow-600' }
    return { text: `${daysRemaining} days left`, color: 'text-muted-foreground' }
  }
  
  const getPostedTime = () => {
    const posted = new Date(job.created_at)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    }
    const months = Math.floor(diffInDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }

  const deadlineInfo = getDeadlineInfo()
  const postedTime = getPostedTime()

  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-3 sm:gap-4 items-start mb-3 sm:mb-4">
        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0">
          <AvatarImage src={job.company_logo_url || ''} alt={job.company} />
          <AvatarFallback className="rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] font-semibold text-xs sm:text-sm">
            {job.company.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm sm:text-lg text-foreground line-clamp-2">{job.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{job.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <Badge variant="secondary" className="flex items-center gap-1 text-xs py-0.5 px-2">
          <Briefcase className="w-3 h-3" />
          <span className="hidden sm:inline">{JOB_TYPE_LABELS[job.job_type] || job.job_type}</span>
          <span className="sm:hidden">{(JOB_TYPE_LABELS[job.job_type] || job.job_type).split(' ')[0]}</span>
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1 text-xs py-0.5 px-2">
          <MapPin className="w-3 h-3" />
          <span className="hidden sm:inline">{LOCATION_TYPE_LABELS[job.location_type] || job.location_type}</span>
          <span className="sm:hidden">{(LOCATION_TYPE_LABELS[job.location_type] || job.location_type).substring(0, 3)}</span>
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1 text-xs py-0.5 px-2 text-muted-foreground">
          <Clock className="w-3 h-3" />
          {postedTime}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-3 mb-3 sm:mb-4 text-xs text-muted-foreground">
        {job.views_count !== undefined && (
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{job.views_count.toLocaleString()} views</span>
          </div>
        )}
        {job.applications_count !== undefined && (
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{job.applications_count.toLocaleString()} applicants</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-2">
        {deadlineInfo && (
          <div className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${deadlineInfo.color}`}>
            <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">Deadline: {deadlineInfo.text}</span>
            <span className="sm:hidden">{deadlineInfo.text}</span>
          </div>
        )}
        {!deadlineInfo && <div className="hidden sm:block" />}
        <div className="flex gap-2 w-full sm:w-auto">
          <JobShareButtons 
            jobId={job.id} 
            jobTitle={job.title} 
            companyName={job.company}
            location={job.location}
            jobType={JOB_TYPE_LABELS[job.job_type]}
            applicationLink={job.application_link}
            companyLogo={job.company_logo_url}
          />
          <Link
            href={`/job/${job.id}`}
            className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors text-xs sm:text-sm font-medium text-center flex-1 sm:flex-initial"
          >
            View Details
          </Link>
        </div>
      </div>
    </Card>
  )
}
