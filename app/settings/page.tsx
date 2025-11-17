'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, Lock, Bell, Shield } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [settings, setSettings] = useState({
    email_notifications: true,
    profile_public: true,
    show_contact_info: false
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('is_profile_public')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setSettings({
          email_notifications: true,
          profile_public: profileData.is_profile_public || false,
          show_contact_info: false
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_profile_public: settings.profile_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      alert('Settings saved successfully!')
    } catch (error: any) {
      console.error('Error saving settings:', error)
      alert(`Failed to save settings: ${error?.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match')
      return
    }

    if (passwords.new.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) throw error

      alert('Password changed successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error: any) {
      console.error('Error changing password:', error)
      alert(`Failed to change password: ${error?.message}`)
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen">
          <div className="max-w-3xl mx-auto px-4 py-12">
            <p className="text-center">Loading settings...</p>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/admin" className="inline-flex items-center text-sm text-gray-600 hover:text-[#1a1a1a] mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <div className="space-y-6">
            {/* Privacy Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Privacy</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile_public">Public Profile</Label>
                    <p className="text-sm text-gray-500">Make your profile visible to everyone</p>
                  </div>
                  <Switch
                    id="profile_public"
                    checked={settings.profile_public}
                    onCheckedChange={(checked) => setSettings({ ...settings, profile_public: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show_contact">Show Contact Info</Label>
                    <p className="text-sm text-gray-500">Display phone and email on profile</p>
                  </div>
                  <Switch
                    id="show_contact"
                    checked={settings.show_contact_info}
                    onCheckedChange={(checked) => setSettings({ ...settings, show_contact_info: checked })}
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                className="mt-4 bg-[#1a1a1a] text-white"
              >
                {saving ? 'Saving...' : 'Save Privacy Settings'}
              </Button>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email_notif">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive job alerts and updates</p>
                  </div>
                  <Switch
                    id="email_notif"
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, email_notifications: checked })}
                  />
                </div>
              </div>
            </Card>

            {/* Change Password */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Change Password</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={changingPassword || !passwords.new || !passwords.confirm}
                  className="bg-[#1a1a1a] text-white"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
