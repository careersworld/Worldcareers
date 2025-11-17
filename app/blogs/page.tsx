import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Blogs - WorldCareers',
  description: 'Industry news, career stories, and professional insights from experts.',
}

interface Blog {
  id: string
  title: string
  slug: string
  author: string
  excerpt: string
  image_url: string
  created_at: string
}

export default async function BlogsPage() {
  let blogs: Blog[] = []

  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .or('status.eq.published,status.is.null')
      .order('created_at', { ascending: false })

    if (error) throw error
    blogs = data || []
  } catch (error) {
    console.error('Error fetching blogs:', error)
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">
        {/* Header Section */}
        <section className="bg-[#FFF8DC] border-b border-gray-200 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">Blogs</h1>
            <p className="text-gray-700">Industry news, career stories, and professional insights</p>
          </div>
        </section>

        {/* Blogs Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {blogs.length === 0 ? (
            <p className="text-center text-gray-600">No blogs available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 sm:h-40 bg-gray-200">
                      {blog.image_url && (
                        <Image
                          src={blog.image_url || "/placeholder.svg"}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-[#1a1a1a] mb-2 line-clamp-2">{blog.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 flex-1">{blog.excerpt}</p>
                      <p className="text-xs text-gray-500 mt-3">By {blog.author}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
