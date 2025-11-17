'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, Upload, File, Download, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function CVUploadPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [cv, setCV] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)

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

      // Fetch existing CV
      const { data: cvData } = await supabase
        .from('user_profiles')
        .select('cv_url, cv_filename')
        .eq('id', user.id)
        .single()

      if (cvData?.cv_url) {
        setCV(cvData)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Please upload a PDF or Word document')
        return
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}_cv_${Date.now()}.${fileExt}`
      const filePath = `cvs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          cv_url: publicUrl,
          cv_filename: file.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      alert('CV uploaded successfully!')
      setCV({ cv_url: publicUrl, cv_filename: file.name })
      setFile(null)
    } catch (error: any) {
      console.error('Error uploading CV:', error)
      alert(`Failed to upload CV: ${error?.message || 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your CV?')) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update user profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          cv_url: null,
          cv_filename: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      alert('CV deleted successfully')
      setCV(null)
    } catch (error: any) {
      console.error('Error deleting CV:', error)
      alert(`Failed to delete CV: ${error?.message}`)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen">
          <div className="max-w-3xl mx-auto px-4 py-12">
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/candidate/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-[#1a1a1a] mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-6">My CV / Resume</h1>

            {cv ? (
              /* Existing CV */
              <div className="mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <File className="w-12 h-12 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-semibold">{cv.cv_filename}</p>
                      <p className="text-sm text-gray-500">Uploaded CV</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={cv.cv_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Upload New CV */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {cv ? 'Upload New CV' : 'Upload Your CV'}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cv-file">Choose File</Label>
                  <Input
                    id="cv-file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>

                {file && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <File className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload CV'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
