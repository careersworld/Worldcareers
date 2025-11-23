'use client'

import { useState, useEffect, useRef } from 'react'
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
import RichText, { RichTextHandle } from '@/components/ui/rich-text'

export default function CandidateBlogNewPage() {
  const router = useRouter()
  const supabase = createClient()
  const richTextRef = useRef<RichTextHandle>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [blog, setBlog] = useState({
    title: '',
    excerpt: '',
    author: ''
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('candidate_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single()

      setUser(user)
      setBlog({
        ...blog,
        author: profile ? `${profile.first_name} ${profile.last_name}` : user.email || 'Anonymous'
      })
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const content = richTextRef.current?.getHTML() || ''

    if (!blog.title || !blog.excerpt || !content) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const slug = generateSlug(blog.title)

      const { error } = await supabase
        .from('blogs')
        .insert([{
          title: blog.title,
          slug: `${slug}-${Date.now()}`,
          excerpt: blog.excerpt,
          content: content,
          author: blog.author,
          status: 'pending', // Requires admin approval
          created_by: user.id,
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      alert('Blog submitted successfully! It will be published after admin approval.')
      router.push('/candidate/dashboard')
    } catch (error: any) {
      console.error('Error saving blog:', error)
      alert(`Failed to save blog: ${error?.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-12">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/candidate/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-[#1a1a1a] mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-6">Write a Blog Post</h1>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                📝 Your blog post will be submitted for admin review before being published.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={blog.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={blog.author}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={blog.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of your blog post (1-2 sentences)"
                  required
                  rows={3}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {blog.excerpt.length}/300 characters
                </p>
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <div className="border rounded-lg">
                  <RichText ref={richTextRef} placeholder="Write your blog content here..." />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Submitting...' : 'Submit for Review'}
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
