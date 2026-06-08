import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

export async function clearDemoData(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!

    await prisma.$transaction([
      prisma.note.deleteMany({ where: { userId } }),
      prisma.interview.deleteMany({ where: { userId } }),
      prisma.candidateJob.deleteMany({ where: { job: { userId } } }),
      prisma.candidate.deleteMany({ where: { userId } }),
      prisma.job.deleteMany({ where: { userId } }),
    ])

    res.json({ message: 'All data cleared' })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}
