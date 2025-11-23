'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditCompanyProfile() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState({
        company_name: '',
        email: '',
        description: '',
        website_url: '',
        industry: '',
        company_size: '',
        location: '',
        phone: '',
        logo_url: ''
    })

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('company_profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) throw error
            if (data) {
                setProfile(data)
            }
        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('company_profiles')
                .update({
                    company_name: profile.company_name,
                    description: profile.description,
                    website_url: profile.website_url,
                    industry: profile.industry,
                    company_size: profile.company_size,
                    location: profile.location,
                    phone: profile.phone,
                    logo_url: profile.logo_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error

            alert('Profile updated successfully!')
            router.push('/company/dashboard')
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to update profile. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className="pt-16 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <p className="text-center">Loading...</p>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="pt-16 min-h-screen bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link href="/company/dashboard">
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-[#1a1a1a]">Edit Company Profile</h1>
                        <p className="text-gray-600 mt-2">Update your company information</p>
                    </div>

                    {/* Form */}
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Company Name */}
                            <div>
                                <Label htmlFor="company_name">Company Name *</Label>
                                <Input
                                    id="company_name"
                                    value={profile.company_name}
                                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="mt-1 bg-gray-50"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Company Description</Label>
                                <Textarea
                                    id="description"
                                    value={profile.description || ''}
                                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                    rows={4}
                                    className="mt-1"
                                    placeholder="Tell us about your company..."
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <Label htmlFor="website_url">Website URL</Label>
                                <Input
                                    id="website_url"
                                    type="url"
                                    value={profile.website_url || ''}
                                    onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                                    className="mt-1"
                                    placeholder="https://example.com"
                                />
                            </div>

                            {/* Industry */}
                            <div>
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    value={profile.industry || ''}
                                    onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                                    className="mt-1"
                                    placeholder="e.g., Technology, Healthcare, Finance"
                                />
                            </div>

                            {/* Company Size */}
                            <div>
                                <Label htmlFor="company_size">Company Size</Label>
                                <select
                                    id="company_size"
                                    value={profile.company_size || ''}
                                    onChange={(e) => setProfile({ ...profile, company_size: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="501-1000">501-1000 employees</option>
                                    <option value="1000+">1000+ employees</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={profile.location || ''}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    className="mt-1"
                                    placeholder="City, Country"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={profile.phone || ''}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="mt-1"
                                    placeholder="+250 XXX XXX XXX"
                                />
                            </div>

                            {/* Logo URL */}
                            <div>
                                <Label htmlFor="logo_url">Company Logo URL</Label>
                                <Input
                                    id="logo_url"
                                    type="url"
                                    value={profile.logo_url || ''}
                                    onChange={(e) => setProfile({ ...profile, logo_url: e.target.value })}
                                    className="mt-1"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Link href="/company/dashboard">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    )
}
