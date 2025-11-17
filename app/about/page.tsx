import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'About - WorldCareers',
  description: 'Learn more about WorldCareers and our mission to connect talent with opportunities.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">
        {/* Hero Section */}
        <section className="bg-[#FFF8DC] border-b border-gray-200 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">About WorldCareers</h1>
            <p className="text-lg text-gray-700">Connecting talent with opportunity across the globe</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                WorldCareers is dedicated to connecting talented professionals with exciting career opportunities around the world. We believe that everyone deserves access to meaningful work that aligns with their skills, values, and aspirations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-4">What We Offer</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#D4AF37] font-bold mr-3">•</span>
                  <span><strong>Comprehensive Job Listings:</strong> Browse thousands of opportunities across industries and locations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] font-bold mr-3">•</span>
                  <span><strong>Career Insights:</strong> Expert advice and industry trends to accelerate your growth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] font-bold mr-3">•</span>
                  <span><strong>Professional Resources:</strong> Blogs and articles from industry experts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] font-bold mr-3">•</span>
                  <span><strong>Advanced Filtering:</strong> Find jobs that match your preferences with our powerful search tools</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-4">Why Choose WorldCareers?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We're more than just a job board. We're committed to supporting your entire career journey. Whether you're starting your first job, changing careers, or climbing the ladder, WorldCareers provides the resources and opportunities you need.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our platform is designed with both job seekers and employers in mind, creating a community where opportunities flourish and careers thrive.
              </p>
            </div>

            <div className="bg-[#FFF8DC] rounded-lg p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4">Ready to Start Your Journey?</h3>
              <Link href="/jobs">
                <Button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                  Explore Jobs
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
