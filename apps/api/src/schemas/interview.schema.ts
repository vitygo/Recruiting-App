import { z } from 'zod'

export const createInterviewSchema = z.object({
  candidateId: z.string().min(1),
  jobId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  duration: z.number().int().positive().default(60),
  type: z.enum(['VIDEO', 'PHONE', 'ONSITE']).default('VIDEO'),
  meetLink: z.string().url().optional().or(z.literal('')),
})

export const updateInterviewSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().positive().optional(),
  type: z.enum(['VIDEO', 'PHONE', 'ONSITE']).optional(),
  meetLink: z.string().url().optional().or(z.literal('')),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  scorecard: z.string().optional(),
})

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>