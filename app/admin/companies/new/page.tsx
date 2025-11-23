'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Mail, Building2 } from 'lucide-react'

export default function InviteCompanyPage() {
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      console.log('Inviting company:', { email, companyName })

      const { data, error } = await supabase
        .from('company_invites')
        .insert([
          {
            email,
            company_name: companyName
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw new Error(error.message || 'Failed to invite company')
      }

      console.log('Company invited successfully:', data)
      alert('Company invited successfully! They can now sign up with this email.')
      router.push('/admin')
    } catch (err: any) {
      console.error('Failed to invite company:', err)
      alert(`Failed to invite company: ${err?.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Invite New Company</h1>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Company Invitation</h2>
              <p className="text-sm text-gray-600">
                Add a company email to allow them to sign up as a company.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Company Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="company@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The company must use this exact email to sign up.
              </p>
            </div>

            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="e.g. Tech Solutions Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/admin">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                disabled={saving}
              >
                {saving ? 'Inviting...' : 'Send Invite'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
