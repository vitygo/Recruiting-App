import { z } from 'zod'

export const updateStageSchema = z.object({
  stage: z.enum([
    'APPLIED',
    'SCREENING',
    'INTERVIEW',
    'OFFER',
    'HIRED',
    'REJECTED',
  ]),
})

export const addCandidateToJobSchema = z.object({
  candidateId: z.string().min(1),
  jobId: z.string().min(1),
  stage: z.enum([
    'APPLIED',
    'SCREENING',
    'INTERVIEW',
    'OFFER',
    'HIRED',
    'REJECTED',
  ]).default('APPLIED'),
})

export type UpdateStageInput = z.infer<typeof updateStageSchema>
export type AddCandidateToJobInput = z.infer<typeof addCandidateToJobSchema>