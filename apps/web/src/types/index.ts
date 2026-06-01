export interface User {
    id: string
    name: string
    email: string
    role: 'RECRUITER' | 'HIRING_MANAGER' | 'ADMIN'
    avatarUrl?: string
    createdAt: string
  }
  
  export interface Job {
    id: string
    title: string
    department: string
    location: string
    type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE'
    salaryMin?: number
    salaryMax?: number
    description: string
    status: 'OPEN' | 'PAUSED' | 'CLOSED'
    createdAt: string
    userId: string
    _count?: { candidates: number }
  }
  
  export interface Candidate {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    linkedinUrl?: string
    cvUrl?: string
    location?: string
    source: 'LINKEDIN' | 'INDEED' | 'REFERRAL' | 'CAREERS_PAGE' | 'MANUAL' | 'OTHER'
    createdAt: string
    userId: string
    jobs?: CandidateJob[]
  }
  
  export interface CandidateJob {
    id: string
    candidateId: string
    jobId: string
    stage: PipelineStage
    aiScore?: number
    aiReason?: string
    rejectionReason?: string
    createdAt: string
    updatedAt: string
    candidate?: Candidate
    job?: Job
  }
  
  export type PipelineStage =
    | 'APPLIED'
    | 'SCREENING'
    | 'INTERVIEW'
    | 'OFFER'
    | 'HIRED'
    | 'REJECTED'
  
  export interface Interview {
    id: string
    candidateId: string
    jobId: string
    userId: string
    scheduledAt: string
    duration: number
    type: 'VIDEO' | 'PHONE' | 'ONSITE'
    meetLink?: string
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
    scorecard?: string
    createdAt: string
    candidate?: Candidate
  }
  
  export interface Note {
    id: string
    content: string
    type: 'TEXT' | 'CALL' | 'EMAIL' | 'SCORECARD'
    candidateId: string
    userId: string
    createdAt: string
  }
  
  export interface ApiError {
    error: string
    details?: Record<string, string[]>
  }