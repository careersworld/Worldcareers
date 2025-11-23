import type { Metadata, Viewport } from 'next'
import './globals.css'
import AuthProvider from '@/components/auth-provider'


export const metadata: Metadata = {
  metadataBase: new URL('https://worldcareers.rw'),
  title: {
    default: 'WorldCareers Rwanda - Find Jobs in Kigali & Across Rwanda',
    template: '%s | WorldCareers Rwanda'
  },
  description: 'Discover the latest job opportunities in Rwanda. Browse tech jobs, healthcare positions, finance roles, and more across Kigali, Musanze, Rubavu, and all Rwanda districts. Updated daily.',
  keywords: ['jobs in Rwanda', 'Rwanda jobs', 'Kigali jobs', 'jobs in Kigali', 'career Rwanda', 'employment Rwanda', 'job vacancies Rwanda', 'work in Rwanda', 'tech jobs Rwanda', 'remote jobs Rwanda'],
  authors: [{ name: 'WorldCareers' }],
  creator: 'WorldCareers',
  publisher: 'WorldCareers',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_RW',
    url: 'https://worldcareers.rw',
    title: 'WorldCareers Rwanda - Find Jobs in Kigali & Across Rwanda',
    description: 'Discover the latest job opportunities in Rwanda. Browse tech jobs, healthcare positions, finance roles, and more across all districts.',
    siteName: 'WorldCareers Rwanda',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorldCareers Rwanda - Find Jobs in Kigali & Across Rwanda',
    description: 'Discover the latest job opportunities in Rwanda. Browse tech jobs, healthcare positions, finance roles, and more.',
    creator: '@worldcareers',
  },
  alternates: {
    canonical: 'https://worldcareers.rw',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFF8DC' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WorldCareers Rwanda",
    "url": "https://worldcareers.rw",
    "logo": "https://worldcareers.rw/logo.png",
    "description": "Leading job board connecting talent with opportunities across Rwanda",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RW",
      "addressLocality": "Kigali"
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
