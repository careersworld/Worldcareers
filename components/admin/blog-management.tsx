'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Blog } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2, Plus } from 'lucide-react'

interface BlogManagementProps {
  onUpdate?: () => void
}

export function BlogManagement({ onUpdate }: BlogManagementProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [formData, setFormData] = useState<Partial<Blog>>({})
  const supabase = createClient()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false})
      if (error) throw error
      setBlogs(data || [])
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog)
      setFormData(blog)
    } else {
      setEditingBlog(null)
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: '',
        image_url: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingBlog(null)
    setFormData({})
  }

  const handleSaveBlog = async () => {
    try {
      const slug = (formData.slug || formData.title || '').toLowerCase().replace(/\s+/g, '-')
      const data = { ...formData, slug }

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(data)
          .eq('id', editingBlog.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([data])
        if (error) throw error
      }
      await fetchBlogs()
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving blog:', error)
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchBlogs()
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const handleApproveBlog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: 'published' })
        .eq('id', id)
      if (error) throw error
      await fetchBlogs()
    } catch (error) {
      console.error('Error approving blog:', error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <Link href="/admin/blogs/new">
          <Button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
            <Plus className="w-4 h-4 mr-2" />
            Add Blog
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
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No blogs found
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map(blog => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>
                      {blog.status === 'pending' ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Published
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{blog.views_count || 0}</TableCell>
                    <TableCell>{formatDate(blog.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {blog.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApproveBlog(blog.id)}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(blog)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteBlog(blog.id)}
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

      {/* Blog Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
            <DialogDescription>
              {editingBlog ? 'Update blog details' : 'Create a new blog post'}
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
              <label className="text-sm font-semibold mb-1 block">Author</label>
              <Input
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Image URL (optional)</label>
              <Input
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Excerpt</label>
              <Textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Content</label>
              <Textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveBlog}
              className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
            >
              {editingBlog ? 'Update Blog' : 'Create Blog'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
