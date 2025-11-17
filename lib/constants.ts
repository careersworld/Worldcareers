export const JOB_TYPES = ['full-time', 'part-time', 'internship', 'volunteer'] as const
export const LOCATION_TYPES = ['remote', 'onsite', 'hybrid'] as const

export const JOB_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  'internship': 'Internship',
  'volunteer': 'Volunteer',
}

export const LOCATION_TYPE_LABELS: Record<string, string> = {
  'remote': 'Remote',
  'onsite': 'On-site',
  'hybrid': 'Hybrid',
}
