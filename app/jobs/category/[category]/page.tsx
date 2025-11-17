import { Metadata } from 'next'
import CategoryJobsPageClient from './client'

const SKILL_CATEGORIES: Record<string, { name: string; description: string; keywords: string[] }> = {
  'technology': {
    name: 'Technology & IT',
    description: 'Software development, web design, IT support, data analysis, cybersecurity, and tech innovation roles',
    keywords: ['developer', 'programmer', 'software', 'IT', 'tech', 'engineer', 'data', 'web', 'mobile', 'cloud']
  },
  'healthcare': {
    name: 'Healthcare & Medical',
    description: 'Doctors, nurses, pharmacists, medical technicians, and healthcare administration positions',
    keywords: ['doctor', 'nurse', 'medical', 'health', 'hospital', 'clinic', 'pharmacist', 'healthcare']
  },
  'finance': {
    name: 'Finance & Banking',
    description: 'Banking, accounting, financial analysis, auditing, and investment opportunities',
    keywords: ['accountant', 'finance', 'banking', 'audit', 'financial', 'investment', 'credit', 'treasury']
  },
  'education': {
    name: 'Education & Training',
    description: 'Teaching positions, training roles, curriculum development, and educational administration',
    keywords: ['teacher', 'professor', 'instructor', 'education', 'training', 'tutor', 'lecturer']
  },
  'engineering': {
    name: 'Engineering',
    description: 'Civil, mechanical, electrical, chemical engineering and construction project roles',
    keywords: ['engineer', 'engineering', 'civil', 'mechanical', 'electrical', 'construction', 'technical']
  },
  'marketing': {
    name: 'Marketing & Communications',
    description: 'Digital marketing, brand management, PR, content creation, and communications roles',
    keywords: ['marketing', 'communications', 'brand', 'digital', 'social media', 'content', 'PR']
  },
  'sales': {
    name: 'Sales & Business Development',
    description: 'Sales representatives, business development, account management, and retail positions',
    keywords: ['sales', 'business development', 'account', 'retail', 'representative', 'commercial']
  },
  'customer-service': {
    name: 'Customer Service',
    description: 'Customer support, call center, client relations, and service excellence roles',
    keywords: ['customer service', 'support', 'call center', 'client', 'service', 'helpdesk']
  },
  'administration': {
    name: 'Administration & Office',
    description: 'Administrative assistants, office management, coordination, and secretarial positions',
    keywords: ['admin', 'administrator', 'office', 'secretary', 'coordinator', 'assistant']
  },
  'management': {
    name: 'Management & Leadership',
    description: 'Managers, directors, team leaders, and executive positions across all sectors',
    keywords: ['manager', 'director', 'head', 'chief', 'executive', 'leader', 'supervisor']
  },
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const categoryInfo = SKILL_CATEGORIES[category] || {
    name: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Find ${category} jobs in Rwanda`,
    keywords: [category]
  }

  return {
    title: `${categoryInfo.name} Jobs in Rwanda - Latest Vacancies`,
    description: `Browse ${categoryInfo.name.toLowerCase()} opportunities in Rwanda. ${categoryInfo.description}. Updated daily with new positions.`,
    keywords: [
      ...categoryInfo.keywords,
      `${categoryInfo.name} jobs Rwanda`,
      `${categoryInfo.name} vacancies`,
      `${categoryInfo.name} careers Rwanda`,
    ],
    openGraph: {
      title: `${categoryInfo.name} Jobs in Rwanda`,
      description: categoryInfo.description,
      url: `https://worldcareers.rw/jobs/category/${category}`,
    },
    alternates: {
      canonical: `https://worldcareers.rw/jobs/category/${category}`,
    },
  }
}

export default async function CategoryJobsPage({ params }: { params: Promise<{ category: string }> }) {
  return <CategoryJobsPageClient />
}
