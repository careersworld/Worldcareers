import { Metadata } from 'next'
import DistrictJobsPageClient from './client'

const RWANDA_DISTRICTS: Record<string, { name: string; description: string }> = {
  'kigali': {
    name: 'Kigali',
    description: 'Rwanda\'s capital and largest city, hub for tech, finance, and international organizations'
  },
  'musanze': {
    name: 'Musanze',
    description: 'Gateway to Volcanoes National Park, center for tourism and hospitality jobs'
  },
  'rubavu': {
    name: 'Rubavu',
    description: 'Border town with vibrant trade, tourism, and service industry opportunities'
  },
  'huye': {
    name: 'Huye',
    description: 'Educational hub with University of Rwanda, opportunities in education and research'
  },
  'muhanga': {
    name: 'Muhanga',
    description: 'Growing commercial center with agriculture and trade opportunities'
  },
  'rusizi': {
    name: 'Rusizi',
    description: 'Tea plantation region with agriculture and processing industry jobs'
  },
  'nyagatare': {
    name: 'Nyagatare',
    description: 'Agricultural heartland with farming, livestock, and agribusiness opportunities'
  },
  'rwamagana': {
    name: 'Rwamagana',
    description: 'Eastern Province commercial center with growing retail and services sector'
  },
  'karongi': {
    name: 'Karongi',
    description: 'Lake Kivu shoreline, tourism and hospitality employment opportunities'
  },
  'ngoma': {
    name: 'Ngoma',
    description: 'Eastern Province district with agricultural and administrative positions'
  },
}

export async function generateMetadata({ params }: { params: Promise<{ district: string }> }): Promise<Metadata> {
  const { district } = await params
  const districtInfo = RWANDA_DISTRICTS[district] || { 
    name: district.charAt(0).toUpperCase() + district.slice(1), 
    description: `Find job opportunities in ${district}` 
  }

  return {
    title: `Jobs in ${districtInfo.name} - ${districtInfo.description}`,
    description: `Browse the latest job vacancies in ${districtInfo.name}, Rwanda. ${districtInfo.description}. Updated daily with new opportunities.`,
    keywords: [
      `jobs in ${districtInfo.name}`,
      `${districtInfo.name} jobs`,
      `${districtInfo.name} Rwanda jobs`,
      `employment ${districtInfo.name}`,
      `vacancies ${districtInfo.name}`,
    ],
    openGraph: {
      title: `Jobs in ${districtInfo.name}, Rwanda`,
      description: districtInfo.description,
      url: `https://worldcareers.rw/jobs/${district}`,
    },
    alternates: {
      canonical: `https://worldcareers.rw/jobs/${district}`,
    },
  }
}

export default async function DistrictJobsPage({ params }: { params: Promise<{ district: string }> }) {
  return <DistrictJobsPageClient />
}
