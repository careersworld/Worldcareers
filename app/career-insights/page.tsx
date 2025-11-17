import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Career Insights - WorldCareers',
  description: 'Expert career advice, industry trends, and professional development tips.',
}

interface CareerInsight {
  id: string
  title: string
  slug: string
  category: string
  content: string
  image_url: string
  created_at: string
}

export default async function CareerInsightsPage() {
  let insights: CareerInsight[] = []

  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('career_insights')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    insights = data || []
  } catch (error) {
    console.error('Error fetching insights:', error)
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">
        {/* Header Section */}
        <section className="bg-[#FFF8DC] border-b border-gray-200 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">Career Insights</h1>
            <p className="text-gray-700">Expert advice, industry trends, and professional development tips</p>
          </div>
        </section>

        {/* Insights Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {insights.length === 0 ? (
            <p className="text-center text-gray-600">No career insights available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map(insight => (
                <Link key={insight.id} href={`/career-insights/${insight.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="relative h-48 sm:h-40 bg-gray-200">
                      {insight.image_url && (
                        <Image
                          src={insight.image_url || "/placeholder.svg"}
                          alt={insight.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-3 py-1 bg-[#FFF8DC] text-[#1a1a1a] text-xs font-semibold rounded-full mb-2">
                        {insight.category}
                      </span>
                      <h3 className="font-bold text-[#1a1a1a] mb-2 line-clamp-2">{insight.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{insight.content}</p>
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
