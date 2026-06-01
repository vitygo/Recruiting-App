import { z } from 'zod'

export const createJobSchema = z.object({
    title: z.string().min(1).max(200).trim(),
    department: z.string().min(1).max(100).trim(),
    location: z.string().min(1).max(100).trim(),
    type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE']).default('FULL_TIME'),
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    description: z.string().min(1).trim(),
    status: z.enum(['OPEN', 'PAUSED', 'CLOSED']).default('OPEN'),
  })
  
  export const updateJobSchema = createJobSchema.partial()
  
  export type CreateJobInput = z.infer<typeof createJobSchema>
  export type UpdateJobInput = z.infer<typeof updateJobSchema>