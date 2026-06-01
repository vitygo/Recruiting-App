import { z } from 'zod'

export const createNoteSchema = z.object({
  content: z.string().min(1).trim(),
  type: z.enum(['TEXT', 'CALL', 'EMAIL', 'SCORECARD']).default('TEXT'),
  candidateId: z.string().min(1),
})

export const updateNoteSchema = z.object({
  content: z.string().min(1).trim(),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>