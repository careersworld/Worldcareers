'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { RichTextHandle } from '@/components/ui/rich-text'

const RichText = dynamic(() => import('@/components/ui/rich-text'), { ssr: false })

export default function NewInsightPage(){
  const editorRef = useRef<RichTextHandle | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Career Advice')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try{
      const content = editorRef.current?.getHTML() || ''
      const slug = (title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const { error } = await supabase.from('career_insights').insert([{ title, category, content, slug }])
      if(error) {
        console.error('Database error:', error)
        throw error
      }
      router.push('/admin')
    }catch(err: any){
      console.error('Failed to create insight:', err)
      alert(`Failed to create insight: ${err.message || 'Unknown error'}`)
    }finally{ setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Create Career Insight</h1>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Insight Title *</label>
              <Input placeholder="e.g. How to Negotiate Your Salary" value={title} onChange={(e)=>setTitle(e.target.value)} required />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Category *</label>
              <select 
                value={category} 
                onChange={(e)=>setCategory(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
              >
                <option value="Career Advice">Career Advice</option>
                <option value="Interview Tips">Interview Tips</option>
                <option value="Resume Writing">Resume Writing</option>
                <option value="Networking">Networking</option>
                <option value="Salary & Benefits">Salary & Benefits</option>
                <option value="Work-Life Balance">Work-Life Balance</option>
                <option value="Professional Development">Professional Development</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Content *</label>
              <RichText ref={editorRef} placeholder="Share your career insight and advice. Include actionable tips and real-world examples..." />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/admin">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-[#1a1a1a]" disabled={saving}>{saving ? 'Creating...' : 'Create Insight'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
