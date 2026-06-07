import type { PipelineStage, CandidateJob, Candidate, Job, Interview } from '../../types'

export const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'APPLIED',   label: 'Applied',      color: '#9ca3af' },
  { id: 'SCREENING', label: 'Phone Screen',  color: 'var(--c-accent)' },
  { id: 'INTERVIEW', label: 'Interview',     color: 'var(--c-orange)' },
  { id: 'OFFER',     label: 'Offer',         color: '#f97316' },
  { id: 'HIRED',     label: 'Hired',         color: 'var(--c-success)' },
  { id: 'REJECTED',  label: 'Rejected',      color: '#ef4444' },
]

export const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  LINKEDIN:     { bg: 'rgba(0,119,181,0.12)',  color: '#0077b5' },
  INDEED:       { bg: 'rgba(255,122,61,0.12)', color: '#ff7a3d' },
  REFERRAL:     { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e' },
  CAREERS_PAGE: { bg: 'rgba(99,102,241,0.12)', color: '#6366f1' },
  MANUAL:       { bg: 'rgba(156,163,175,0.12)',color: '#9ca3af' },
  OTHER:        { bg: 'rgba(156,163,175,0.12)',color: '#9ca3af' },
}

export const SOURCE_OPTIONS = [
  { value: 'MANUAL',       label: 'Manual' },
  { value: 'LINKEDIN',     label: 'LinkedIn' },
  { value: 'INDEED',       label: 'Indeed' },
  { value: 'REFERRAL',     label: 'Referral' },
  { value: 'CAREERS_PAGE', label: 'Careers Page' },
  { value: 'OTHER',        label: 'Other' },
]

export const STAGE_OPTIONS = [
  { value: 'APPLIED',   label: 'Applied' },
  { value: 'SCREENING', label: 'Phone Screen' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER',     label: 'Offer' },
  { value: 'HIRED',     label: 'Hired' },
  { value: 'REJECTED',  label: 'Rejected' },
]

// ── Demo seed helpers ────────────────────────────────────────────────────────

function mkCandidate(
  id: string, firstName: string, lastName: string,
  email: string, phone: string, location: string,
  source: Candidate['source'],
): Candidate {
  return { id, firstName, lastName, email, phone, location, source, createdAt: '2026-05-20T00:00:00Z', userId: 'demo' }
}

function mkJob(
  id: string, title: string, department: string, location: string,
  type: Job['type'], salaryMin: number, salaryMax: number, description: string,
  status: Job['status'] = 'OPEN',
): Job {
  return { id, title, department, location, type, salaryMin, salaryMax, status, description, createdAt: '2026-05-01T00:00:00Z', userId: 'demo' }
}

function mkCJ(
  id: string, candidateId: string, jobId: string, stage: PipelineStage,
  aiScore: number, aiReason: string, candidate: Candidate, job: Job,
  rejectionReason?: string,
  appliedAt?: string,
): CandidateJob {
  return {
    id, candidateId, jobId, stage, aiScore, aiReason, rejectionReason,
    appliedAt: appliedAt ?? 'Applied 17 days ago',
    createdAt: '2026-05-21T00:00:00Z', updatedAt: '2026-05-21T00:00:00Z',
    candidate, job,
  }
}

// ── Demo Jobs ─────────────────────────────────────────────────────────────────

export const DEMO_JOBS: Job[] = [
  mkJob('demo-job-1', 'Senior React Developer', 'Engineering',    'Remote',            'FULL_TIME', 110000, 150000, 'Build next-gen web apps with React and TypeScript.', 'ACTIVE'),
  mkJob('demo-job-2', 'DevOps Engineer',         'Infrastructure', 'New York, NY',      'FULL_TIME', 100000, 135000, 'Own CI/CD pipelines, K8s clusters, and cloud infra.', 'REVIEWING'),
  mkJob('demo-job-3', 'Product Designer',         'Design',         'San Francisco, CA', 'FULL_TIME',  95000, 125000, 'Craft user experiences from concept to pixel-perfect delivery.', 'OPEN'),
  mkJob('demo-job-4', 'Frontend Engineer',        'Engineering',    'Remote',            'FULL_TIME',  85000, 110000, 'Delivered and closed — position has been filled.', 'ENDED'),
]

const [j1, j2, j3] = DEMO_JOBS

// ── Demo Candidates ───────────────────────────────────────────────────────────

const dc = {
  c1:  mkCandidate('dc-1',  'Alex',     'Johnson',  'alex.johnson@mail.com',    '+1 212 555 0101', 'New York, NY',       'LINKEDIN'),
  c2:  mkCandidate('dc-2',  'Sara',     'Nguyen',   'sara.nguyen@mail.com',     '+1 415 555 0102', 'San Francisco, CA',  'INDEED'),
  c3:  mkCandidate('dc-3',  'James',    'Park',     'james.park@mail.com',      '+1 650 555 0103', 'Palo Alto, CA',      'REFERRAL'),
  c4:  mkCandidate('dc-4',  'Emily',    'Chen',     'emily.chen@mail.com',      '+1 408 555 0104', 'Remote',             'LINKEDIN'),
  c5:  mkCandidate('dc-5',  'Michael',  'Torres',   'michael.torres@mail.com',  '+1 646 555 0105', 'Brooklyn, NY',       'REFERRAL'),
  c6:  mkCandidate('dc-6',  'Priya',    'Sharma',   'priya.sharma@mail.com',    '+1 332 555 0106', 'Austin, TX',         'LINKEDIN'),
  c7:  mkCandidate('dc-7',  'Daniel',   'Kim',      'daniel.kim@mail.com',      '+1 212 555 0107', 'New York, NY',       'INDEED'),
  c8:  mkCandidate('dc-8',  'Olivia',   'Martinez', 'olivia.martinez@mail.com', '+1 917 555 0108', 'Remote',             'REFERRAL'),
  c9:  mkCandidate('dc-9',  'Liam',     'Wilson',   'liam.wilson@mail.com',     '+1 718 555 0109', 'Queens, NY',         'MANUAL'),
  c10: mkCandidate('dc-10', 'Zoe',      'Adams',    'zoe.adams@mail.com',       '+1 415 555 0110', 'San Francisco, CA',  'CAREERS_PAGE'),
  c11: mkCandidate('dc-11', 'Noah',     'Lee',      'noah.lee@mail.com',        '+1 650 555 0111', 'Menlo Park, CA',     'LINKEDIN'),
  c12: mkCandidate('dc-12', 'Isabella', 'Brown',    'isabella.brown@mail.com',  '+1 510 555 0112', 'Oakland, CA',        'REFERRAL'),
}

export const DEMO_PIPELINE: CandidateJob[] = [
  // ── Senior React Developer ────────────────────────────────────────────────
  mkCJ('dcj-1',  'dc-1',  'demo-job-1', 'APPLIED',   72, 'Strong TypeScript background',         dc.c1,  j1, undefined,                                            'Applied 18 days ago'),
  mkCJ('dcj-2',  'dc-2',  'demo-job-1', 'APPLIED',   58, 'React exp, limited TS',               dc.c2,  j1, undefined,                                            'Applied 17 days ago'),
  mkCJ('dcj-3',  'dc-3',  'demo-job-1', 'SCREENING', 85, '5 yrs React, open source contributor', dc.c3,  j1, undefined,                                            'Applied 14 days ago'),
  mkCJ('dcj-4',  'dc-4',  'demo-job-1', 'INTERVIEW', 91, 'Senior React, system design exp',      dc.c4,  j1, undefined,                                            'Applied 12 days ago'),
  mkCJ('dcj-5',  'dc-5',  'demo-job-1', 'OFFER',     94, 'Exceptional React + GraphQL',          dc.c5,  j1, undefined,                                            'Applied 10 days ago'),
  // ── DevOps Engineer ───────────────────────────────────────────────────────
  mkCJ('dcj-6',  'dc-6',  'demo-job-2', 'APPLIED',   65, 'AWS certified, limited K8s',           dc.c6,  j2, undefined,                                            'Applied 21 days ago'),
  mkCJ('dcj-7',  'dc-7',  'demo-job-2', 'SCREENING', 78, 'K8s + Terraform expert',              dc.c7,  j2, undefined,                                            'Applied 16 days ago'),
  mkCJ('dcj-8',  'dc-8',  'demo-job-2', 'INTERVIEW', 88, 'CI/CD automation & GitOps',           dc.c8,  j2, undefined,                                            'Applied 13 days ago'),
  mkCJ('dcj-9',  'dc-9',  'demo-job-2', 'REJECTED',  42, 'Limited cloud exp',                   dc.c9,  j2, 'Does not meet minimum cloud infra requirements',     'Applied 23 days ago'),
  // ── Product Designer ──────────────────────────────────────────────────────
  mkCJ('dcj-10', 'dc-10', 'demo-job-3', 'APPLIED',   70, 'Figma proficient, UX portfolio',      dc.c10, j3, undefined,                                            'Applied 15 days ago'),
  mkCJ('dcj-11', 'dc-11', 'demo-job-3', 'SCREENING', 82, 'Strong product sense, motion design', dc.c11, j3, undefined,                                            'Applied 11 days ago'),
  mkCJ('dcj-12', 'dc-12', 'demo-job-3', 'HIRED',     96, 'Exceptional portfolio, cultural fit', dc.c12, j3, undefined,                                            'Applied 8 days ago'),
]

// ── Demo Interviews ───────────────────────────────────────────────────────────
// Linked to candidates currently in INTERVIEW or SCREENING stages.

export const DEMO_INTERVIEWS: Interview[] = [
  {
    id: 'demo-iv-1',
    candidateId: 'dc-4',
    jobId: 'demo-job-1',
    userId: 'demo',
    scheduledAt: '2026-06-09T10:00:00Z',
    duration: 60,
    type: 'VIDEO',
    meetLink: 'https://meet.google.com/abc-demo-1',
    status: 'SCHEDULED',
    interviewerName: 'Sarah Mitchell',
    notes: 'Technical interview — system design round',
    createdAt: '2026-06-01T00:00:00Z',
    candidate: dc.c4,
  },
  {
    id: 'demo-iv-2',
    candidateId: 'dc-8',
    jobId: 'demo-job-2',
    userId: 'demo',
    scheduledAt: '2026-06-10T14:00:00Z',
    duration: 90,
    type: 'ONSITE',
    meetLink: 'https://meet.google.com/abc-demo-2',
    status: 'SCHEDULED',
    interviewerName: 'Tom Reynolds',
    notes: 'On-site technical & culture-fit',
    createdAt: '2026-06-01T00:00:00Z',
    candidate: dc.c8,
  },
  {
    id: 'demo-iv-3',
    candidateId: 'dc-3',
    jobId: 'demo-job-1',
    userId: 'demo',
    scheduledAt: '2026-06-11T11:00:00Z',
    duration: 30,
    type: 'PHONE',
    meetLink: 'https://meet.google.com/abc-demo-3',
    status: 'SCHEDULED',
    interviewerName: 'Linda Zhao',
    notes: 'HR screen — culture & availability',
    createdAt: '2026-06-01T00:00:00Z',
    candidate: dc.c3,
  },
  {
    id: 'demo-iv-4',
    candidateId: 'dc-7',
    jobId: 'demo-job-2',
    userId: 'demo',
    scheduledAt: '2026-06-12T15:30:00Z',
    duration: 60,
    type: 'VIDEO',
    meetLink: 'https://meet.google.com/abc-demo-4',
    status: 'SCHEDULED',
    interviewerName: 'Marcus Chen',
    notes: 'K8s deep-dive technical screen',
    createdAt: '2026-06-01T00:00:00Z',
    candidate: dc.c7,
  },
]
