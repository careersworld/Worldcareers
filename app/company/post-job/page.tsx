'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function PostJobPage() {
    const [loading, setLoading] = useState(false)
    const [companyName, setCompanyName] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        job_type: 'full-time',
        location_type: 'onsite',
        experience_level: 'mid',
        salary_min: '',
        salary_max: '',
        application_link: '',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: ''
    })

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || session.user.user_metadata?.role !== 'company') {
            router.push('/')
            return
        }

        // Get company name
        const { data } = await supabase
            .from('company_profiles')
            .select('company_name')
            .eq('id', session.user.id)
            .single()

        if (data) setCompanyName(data.company_name)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Not authenticated')

            // Convert text areas to arrays (split by new lines)
            const responsibilities = formData.responsibilities.split('\n').filter(line => line.trim())
            const requirements = formData.requirements.split('\n').filter(line => line.trim())
            const benefits = formData.benefits.split('\n').filter(line => line.trim())

            const { error } = await supabase.from('jobs').insert({
                posted_by: session.user.id,
                company: companyName,
                title: formData.title,
                location: formData.location,
                job_type: formData.job_type,
                location_type: formData.location_type,
                experience_level: formData.experience_level,
                salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
                salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
                application_link: formData.application_link,
                description: formData.description,
                responsibilities,
                requirements,
                benefits,
                is_active: true
            })

            if (error) throw error

            alert('Job posted successfully!')
            router.push('/company/dashboard')
        } catch (error: any) {
            console.error('Error posting job:', error)
            alert('Failed to post job: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSelectChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value })
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/company/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2 mb-4">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
                    <p className="text-gray-600">Create a job listing for {companyName}</p>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input id="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Senior React Developer" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <Input id="location" required value={formData.location} onChange={handleChange} placeholder="e.g. New York, NY" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="job_type">Job Type</Label>
                                <Select value={formData.job_type} onValueChange={(v) => handleSelectChange('job_type', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full-time">Full Time</SelectItem>
                                        <SelectItem value="part-time">Part Time</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location_type">Location Type</Label>
                                <Select value={formData.location_type} onValueChange={(v) => handleSelectChange('location_type', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="onsite">On-site</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                        <SelectItem value="remote">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Salary & Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="experience_level">Experience Level</Label>
                                <Select value={formData.experience_level} onValueChange={(v) => handleSelectChange('experience_level', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entry">Entry Level</SelectItem>
                                        <SelectItem value="mid">Mid Level</SelectItem>
                                        <SelectItem value="senior">Senior Level</SelectItem>
                                        <SelectItem value="lead">Lead / Manager</SelectItem>
                                        <SelectItem value="executive">Executive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary_min">Min Salary (Annual USD)</Label>
                                <Input id="salary_min" type="number" value={formData.salary_min} onChange={handleChange} placeholder="e.g. 80000" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary_max">Max Salary (Annual USD)</Label>
                                <Input id="salary_max" type="number" value={formData.salary_max} onChange={handleChange} placeholder="e.g. 120000" />
                            </div>
                        </div>

                        {/* Application Link */}
                        <div className="space-y-2">
                            <Label htmlFor="application_link">Application Link/Email *</Label>
                            <Input id="application_link" required value={formData.application_link} onChange={handleChange} placeholder="https://... or mailto:..." />
                            <p className="text-xs text-gray-500">Where should candidates apply?</p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description *</Label>
                            <Textarea id="description" required value={formData.description} onChange={handleChange} rows={6} placeholder="Describe the role..." />
                        </div>

                        {/* Lists */}
                        <div className="space-y-2">
                            <Label htmlFor="responsibilities">Key Responsibilities (One per line)</Label>
                            <Textarea id="responsibilities" value={formData.responsibilities} onChange={handleChange} rows={4} placeholder="- Write clean code&#10;- Collaborate with team" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements (One per line)</Label>
                            <Textarea id="requirements" value={formData.requirements} onChange={handleChange} rows={4} placeholder="- 3+ years React experience&#10;- TypeScript knowledge" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="benefits">Benefits (One per line)</Label>
                            <Textarea id="benefits" value={formData.benefits} onChange={handleChange} rows={4} placeholder="- Health insurance&#10;- Remote work" />
                        </div>

                        <div className="pt-4 flex justify-end gap-4">
                            <Link href="/company/dashboard">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]" disabled={loading}>
                                {loading ? 'Posting...' : 'Post Job'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
