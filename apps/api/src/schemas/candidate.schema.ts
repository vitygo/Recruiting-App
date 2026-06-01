import { z } from 'zod'

export const createCandidateSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().max(30).trim().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  cvUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().max(100).trim().optional(),
  source: z.enum([
    'LINKEDIN', 'INDEED', 'REFERRAL', 'CAREERS_PAGE', 'MANUAL', 'OTHER'
  ]).default('MANUAL'),
})

export const updateCandidateSchema = createCandidateSchema.partial()

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>