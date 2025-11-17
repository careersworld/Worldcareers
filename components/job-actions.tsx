'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { createClient } from '@/lib/supabase/client'
import { Bookmark, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface JobActionsProps {
  jobId: string
}

export function JobActions({ jobId }: JobActionsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [jobId])

  const checkStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

      // Check if saved
      const { data: savedData } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_id', jobId)
        .single()

      setSaved(!!savedData)

      // Check if applied
      const { data: appliedData } = await supabase
        .from('job_applications')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_id', jobId)
        .single()

      setApplied(!!appliedData)
    } catch (error) {
      console.error('Error checking status:', error)
    }
  }

  const handleSave = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      if (saved) {
        // Unsave
        await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId)
        setSaved(false)
      } else {
        // Save
        await supabase
          .from('saved_jobs')
          .insert([{ user_id: user.id, job_id: jobId }])
        setSaved(true)
      }
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Failed to save job')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (applied) {
      alert('You have already applied to this job')
      return
    }

    setLoading(true)
    try {
      await supabase
        .from('job_applications')
        .insert([{ 
          user_id: user.id, 
          job_id: jobId,
          status: 'pending' 
        }])
      setApplied(true)
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Error applying to job:', error)
      alert('Failed to apply to job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={loading}
        className="flex-1"
      >
        <Bookmark className={`w-4 h-4 mr-2 ${saved ? 'fill-current' : ''}`} />
        {saved ? 'Saved' : 'Save'}
      </Button>
      <Button
        size="sm"
        onClick={handleApply}
        disabled={loading || applied}
        className="flex-1 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
      >
        <Send className="w-4 h-4 mr-2" />
        {applied ? 'Applied' : 'Apply'}
      </Button>
    </div>
  )
}
