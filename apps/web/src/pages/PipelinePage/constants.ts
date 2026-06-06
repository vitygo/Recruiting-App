import type { PipelineStage } from '../../types'

export const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'APPLIED', label: 'Applied', color: '#9ca3af' },
  { id: 'SCREENING', label: 'Screening', color: 'var(--c-accent)' },
  { id: 'INTERVIEW', label: 'Interview', color: 'var(--c-orange)' },
  { id: 'OFFER', label: 'Offer', color: '#f97316' },
  { id: 'HIRED', label: 'Hired', color: 'var(--c-success)' },
]

export const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  LINKEDIN: { bg: 'rgba(0,119,181,0.12)', color: '#0077b5' },
  INDEED: { bg: 'rgba(255,122,61,0.12)', color: '#ff7a3d' },
  REFERRAL: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  MANUAL: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
  OTHER: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
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
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SCREENING', label: 'Screening' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'HIRED', label: 'Hired' },
]
