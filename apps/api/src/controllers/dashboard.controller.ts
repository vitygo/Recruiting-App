import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

export async function getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId!

    const [totalCandidates, totalJobs, totalInterviews] = await Promise.all([
      prisma.candidate.count({ where: { userId } }),
      prisma.job.count({ where: { userId } }),
      prisma.interview.count({ where: { userId } }),
    ])

    res.json({ totalCandidates, totalJobs, totalInterviews })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}
