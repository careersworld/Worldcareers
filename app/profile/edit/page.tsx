'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    headline: '',
    bio: '',
    location: '',
    phone: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    // Company specific
    company_name: '',
    website_url: '',
    description: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      const userRole = user.user_metadata?.role || 'candidate'
      setRole(userRole)

      let table = 'candidate_profiles'
      if (userRole === 'admin') table = 'admin_profiles'
      if (userRole === 'company') table = 'company_profiles'

      const { data: profileData, error: profileError } = await supabase
        .from(table)
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      if (profileData) {
        if (userRole === 'company') {
          setProfile(prev => ({
            ...prev,
            email: user.email || '',
            company_name: profileData.company_name || '',
            location: profileData.location || '',
            website_url: profileData.website_url || '',
            description: profileData.description || '',
            first_name: profileData.contact_person_name || '' // Map contact person to first name for simplicity
          }))
        } else {
          setProfile(prev => ({
            ...prev,
            email: user.email || '',
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            headline: profileData.headline || '',
            bio: profileData.bio || '',
            location: profileData.location || '',
            phone: profileData.phone || '',
            linkedin_url: profileData.linkedin_url || '',
            github_url: profileData.github_url || '',
            portfolio_url: profileData.portfolio_url || ''
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // alert('Failed to load profile') 
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const userRole = user.user_metadata?.role || 'candidate'

      let error;

      if (userRole === 'admin') {
        const { error: updateError } = await supabase
          .from('admin_profiles')
          .update({
            first_name: profile.first_name,
            last_name: profile.last_name,
          })
          .eq('id', user.id)
        error = updateError
      } else if (userRole === 'company') {
        const { error: updateError } = await supabase
          .from('company_profiles')
          .update({
            company_name: profile.company_name,
            contact_person_name: profile.first_name,
            location: profile.location,
            website_url: profile.website_url,
            description: profile.description
          })
          .eq('id', user.id)
        error = updateError
      } else {
        // Candidate
        const { error: updateError } = await supabase
          .from('candidate_profiles')
          .update({
            first_name: profile.first_name,
            last_name: profile.last_name,
            headline: profile.headline,
            bio: profile.bio,
            location: profile.location,
            phone: profile.phone,
            linkedin_url: profile.linkedin_url,
            github_url: profile.github_url,
            portfolio_url: profile.portfolio_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
        error = updateError
      }

      if (error) throw error

      alert('Profile updated successfully!')

      // Redirect based on role
      if (userRole === 'admin') router.push('/admin')
      else if (userRole === 'company') router.push('/company/dashboard')
      else router.push('/candidate/dashboard')

    } catch (error: any) {
      console.error('Error saving profile:', error)
      alert(`Failed to save profile: ${error?.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen">
          <div className="max-w-3xl mx-auto px-4 py-12">
            <p className="text-center">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin'
    if (role === 'company') return '/company/dashboard'
    return '/candidate/dashboard'
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href={getDashboardLink()} className="inline-flex items-center text-sm text-gray-600 hover:text-[#1a1a1a] mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Email (read-only) */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {role === 'company' ? (
                <>
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={profile.company_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="first_name">Contact Person Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      value={profile.website_url}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={profile.description}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={profile.first_name}
                        onChange={handleChange}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={profile.last_name}
                        onChange={handleChange}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {role === 'candidate' && (
                    <>
                      {/* Headline */}
                      <div>
                        <Label htmlFor="headline">Professional Headline</Label>
                        <Input
                          id="headline"
                          name="headline"
                          value={profile.headline}
                          onChange={handleChange}
                          placeholder="Software Developer | Full Stack Engineer"
                          maxLength={100}
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profile.bio}
                          onChange={handleChange}
                          placeholder="Tell us about yourself..."
                          rows={4}
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {profile.bio.length}/500 characters
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profile.location}
                            onChange={handleChange}
                            placeholder="Kigali, Rwanda"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            placeholder="+250 XXX XXX XXX"
                          />
                        </div>
                      </div>

                      {/* Social Links */}
                      <div>
                        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                        <Input
                          id="linkedin_url"
                          name="linkedin_url"
                          type="url"
                          value={profile.linkedin_url}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/yourusername"
                        />
                      </div>

                      <div>
                        <Label htmlFor="github_url">GitHub URL</Label>
                        <Input
                          id="github_url"
                          name="github_url"
                          type="url"
                          value={profile.github_url}
                          onChange={handleChange}
                          placeholder="https://github.com/yourusername"
                        />
                      </div>

                      <div>
                        <Label htmlFor="portfolio_url">Portfolio URL</Label>
                        <Input
                          id="portfolio_url"
                          name="portfolio_url"
                          type="url"
                          value={profile.portfolio_url}
                          onChange={handleChange}
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
