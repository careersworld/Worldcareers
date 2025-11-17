'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import type { CareerInsight } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2, Plus } from 'lucide-react'

interface InsightManagementProps {
  onUpdate?: () => void
}

export function InsightManagement({ onUpdate }: InsightManagementProps) {
  const [insights, setInsights] = useState<CareerInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInsight, setEditingInsight] = useState<CareerInsight | null>(null)
  const [formData, setFormData] = useState<Partial<CareerInsight>>({})
  const supabase = createClient()

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('career_insights')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setInsights(data || [])
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (insight?: CareerInsight) => {
    if (insight) {
      setEditingInsight(insight)
      setFormData(insight)
    } else {
      setEditingInsight(null)
      setFormData({
        title: '',
        slug: '',
        content: '',
        category: '',
        image_url: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingInsight(null)
    setFormData({})
  }

  const handleSaveInsight = async () => {
    try {
      const slug = (formData.slug || formData.title || '').toLowerCase().replace(/\s+/g, '-')
      const data = { ...formData, slug }

      if (editingInsight) {
        const { error } = await supabase
          .from('career_insights')
          .update(data)
          .eq('id', editingInsight.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('career_insights')
          .insert([data])
        if (error) throw error
      }
      await fetchInsights()
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving insight:', error)
    }
  }

  const handleDeleteInsight = async (id: string) => {
    if (!confirm('Are you sure you want to delete this insight?')) return
    try {
      const { error } = await supabase
        .from('career_insights')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchInsights()
    } catch (error) {
      console.error('Error deleting insight:', error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Career Insights</h2>
        <Link href="/admin/insights/new">
          <Button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
            <Plus className="w-4 h-4 mr-2" />
            Add Insight
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
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insights.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No insights found
                  </TableCell>
                </TableRow>
              ) : (
                insights.map(insight => (
                  <TableRow key={insight.id}>
                    <TableCell className="font-medium">{insight.title}</TableCell>
                    <TableCell>{insight.category}</TableCell>
                    <TableCell className="text-center">{insight.views_count || 0}</TableCell>
                    <TableCell>{formatDate(insight.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(insight)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteInsight(insight.id)}
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

      {/* Insight Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInsight ? 'Edit Insight' : 'Add New Insight'}</DialogTitle>
            <DialogDescription>
              {editingInsight ? 'Update career insight details' : 'Create a new career insight'}
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
              <label className="text-sm font-semibold mb-1 block">Category</label>
              <Input
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Career Development, Interview Tips"
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
              <label className="text-sm font-semibold mb-1 block">Content</label>
              <Textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveInsight}
              className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
            >
              {editingInsight ? 'Update Insight' : 'Create Insight'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
