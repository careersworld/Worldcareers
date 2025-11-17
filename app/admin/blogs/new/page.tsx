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

export default function NewBlogPage(){
  const editorRef = useRef<RichTextHandle | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try{
      const content = editorRef.current?.getHTML() || ''
      const slug = (title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const { error } = await supabase.from('blogs').insert([{ title, author, excerpt, content, slug }])
      if(error) {
        console.error('Database error:', error)
        throw error
      }
      router.push('/admin')
    }catch(err: any){
      console.error('Failed to create blog:', err)
      alert(`Failed to create blog: ${err.message || 'Unknown error'}`)
    }finally{ setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Create New Blog Post</h1>
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
              <label className="block mb-2 text-sm font-medium">Blog Title *</label>
              <Input placeholder="e.g. 10 Tips for Your Next Job Interview" value={title} onChange={(e)=>setTitle(e.target.value)} required />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Author *</label>
              <Input placeholder="Author name" value={author} onChange={(e)=>setAuthor(e.target.value)} required />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Excerpt (Brief Summary) *</label>
              <Input placeholder="A short description of the blog post" value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} required />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Content *</label>
              <RichText ref={editorRef} placeholder="Write your blog post content here. Use the toolbar to format your text..." />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/admin">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-[#1a1a1a]" disabled={saving}>{saving ? 'Creating...' : 'Create Blog'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
