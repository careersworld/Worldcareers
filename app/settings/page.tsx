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
import { ArrowLeft, Save, Lock, Bell, Shield } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Settings() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!')
      return
    }

    if (passwords.new.length < 8) {
      alert('Password must be at least 8 characters long!')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) throw error

      alert('Password updated successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error: any) {
      console.error('Error updating password:', error)
      alert(error.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const getDashboardLink = () => {
    const role = user?.user_metadata?.role
    if (role === 'admin') return '/admin'
    if (role === 'company') return '/company/dashboard'
    if (role === 'candidate') return '/candidate/dashboard'
    return '/'
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link href={getDashboardLink()}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-[#1a1a1a]">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList>
              <TabsTrigger value="account">
                <Shield className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed. Contact support if you need to update it.
                    </p>
                  </div>
                  <div>
                    <Label>User ID</Label>
                    <Input
                      value={user?.id || ''}
                      disabled
                      className="mt-1 bg-gray-50 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <Input
                      value={user?.user_metadata?.role || 'user'}
                      disabled
                      className="mt-1 bg-gray-50 capitalize"
                    />
                  </div>
                  <div>
                    <Label>Account Created</Label>
                    <Input
                      value={new Date(user?.created_at).toLocaleDateString()}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="new_password">New Password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      required
                      minLength={8}
                      className="mt-1"
                      placeholder="Enter new password"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters long
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      required
                      minLength={8}
                      className="mt-1"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email updates about your account</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Job Alerts</p>
                      <p className="text-sm text-gray-500">Get notified about new job postings</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Application Updates</p>
                      <p className="text-sm text-gray-500">Updates on your job applications</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-500">Promotional content and updates</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                  <Button className="mt-4 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}
