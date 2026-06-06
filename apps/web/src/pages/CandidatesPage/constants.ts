export const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  LINKEDIN: { bg: 'rgba(0,119,181,0.12)', color: '#0077b5' },
  INDEED: { bg: 'rgba(255,122,61,0.12)', color: '#ff7a3d' },
  REFERRAL: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  MANUAL: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
  CAREERS_PAGE: { bg: 'rgba(0,153,255,0.12)', color: '#0099ff' },
  OTHER: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
}

export const STAGE_COLORS: Record<string, { bg: string; color: string }> = {
  APPLIED: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
  SCREENING: { bg: 'rgba(0,153,255,0.12)', color: '#0099ff' },
  INTERVIEW: { bg: 'rgba(251,146,60,0.12)', color: '#fb923c' },
  OFFER: { bg: 'rgba(249,115,22,0.12)', color: '#f97316' },
  HIRED: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  REJECTED: { bg: 'rgba(255,85,119,0.12)', color: '#ff5577' },
}

export const SOURCE_OPTIONS = [
  { value: 'MANUAL', label: 'Manual' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'INDEED', label: 'Indeed' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'CAREERS_PAGE', label: 'Careers Page' },
  { value: 'OTHER', label: 'Other' },
]

export const STAGE_OPTIONS = [
  { value: 'All', label: 'All stages' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SCREENING', label: 'Screening' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
]
