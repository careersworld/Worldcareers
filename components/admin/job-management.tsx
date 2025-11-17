'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import type { Job } from '@/lib/types'
import { JOB_TYPES, LOCATION_TYPES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2, Plus } from 'lucide-react'

interface JobManagementProps {
  onUpdate?: () => void
}

export function JobManagement({ onUpdate }: JobManagementProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState<Partial<Job>>({})
  const supabase = createClient()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setJobs(data || [])
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (job?: Job) => {
    if (job) {
      setEditingJob(job)
      setFormData(job)
    } else {
      setEditingJob(null)
      setFormData({
        title: '',
        company: '',
        company_logo_url: '',
        description: '',
        location: '',
        job_type: 'full-time',
        location_type: 'remote',
        application_link: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingJob(null)
    setFormData({})
  }

  const handleSaveJob = async () => {
    try {
      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update(formData)
          .eq('id', editingJob.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([formData])
        if (error) throw error
      }
      await fetchJobs()
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving job:', error)
    }
  }

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchJobs()
      alert('Job deleted successfully!')
    } catch (error: any) {
      console.error('Error deleting job:', error)
      alert(`Failed to delete job: ${error?.message || 'Unknown error'}`)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Jobs</h2>
        <Link href="/admin/jobs/new">
          <Button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-center">Applications</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map(job => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell className="text-center">{job.views_count || 0}</TableCell>
                    <TableCell className="text-center">{job.applications_count || 0}</TableCell>
                    <TableCell>{formatDate(job.created_at)}</TableCell>
                    <TableCell>{job.deadline ? formatDate(job.deadline) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(job)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Job Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
            <DialogDescription>
              {editingJob ? 'Update job details' : 'Create a new job posting'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1 block">Title</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Company</label>
              <Input
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Company Logo URL (optional)</label>
              <Input
                value={formData.company_logo_url || ''}
                onChange={(e) => setFormData({ ...formData, company_logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Location</label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Job Type</label>
                <Select
                  value={formData.job_type || ''}
                  onValueChange={(value) => setFormData({ ...formData, job_type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Location Type</label>
                <Select
                  value={formData.location_type || ''}
                  onValueChange={(value) => setFormData({ ...formData, location_type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Deadline (optional)</label>
                <Input
                  type="datetime-local"
                  value={formData.deadline ? formData.deadline.substring(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Application Link</label>
              <Input
                value={formData.application_link || ''}
                onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveJob}
              className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
            >
              {editingJob ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
