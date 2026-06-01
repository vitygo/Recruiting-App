import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'
import { UpdateStageInput, AddCandidateToJobInput } from '../schemas/pipeline.schema'

export async function getPipeline(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { jobId, stage } = req.query

    const where: Record<string, unknown> = {
      job: { userId: req.userId },
    }

    if (jobId) where.jobId = jobId
    if (stage) where.stage = stage

    const pipeline = await prisma.candidateJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: true,
        job: true,
      },
    })

    res.json({ pipeline })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function addCandidateToJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { candidateId, jobId, stage } = req.body as AddCandidateToJobInput

    const [candidate, job] = await Promise.all([
      prisma.candidate.findFirst({ where: { id: candidateId, userId: req.userId } }),
      prisma.job.findFirst({ where: { id: jobId, userId: req.userId } }),
    ])

    if (!candidate || !job) {
      res.status(404).json({ error: 'Candidate or job not found' })
      return
    }

    const existing = await prisma.candidateJob.findUnique({
      where: { candidateId_jobId: { candidateId, jobId } },
    })

    if (existing) {
      res.status(409).json({ error: 'Candidate already in this job' })
      return
    }

    const candidateJob = await prisma.candidateJob.create({
      data: { candidateId, jobId, stage: stage ?? 'APPLIED' },
      include: { candidate: true, job: true },
    })

    res.status(201).json({ candidateJob })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateStage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { stage } = req.body as UpdateStageInput

    const candidateJob = await prisma.candidateJob.findFirst({
      where: {
        id: req.params.id,
        job: { userId: req.userId },
      },
    })

    if (!candidateJob) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    const updated = await prisma.candidateJob.update({
      where: { id: req.params.id },
      data: { stage },
      include: { candidate: true, job: true },
    })

    res.json({ candidateJob: updated })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function removeCandidateFromJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const candidateJob = await prisma.candidateJob.findFirst({
      where: {
        id: req.params.id,
        job: { userId: req.userId },
      },
    })

    if (!candidateJob) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    await prisma.candidateJob.delete({ where: { id: req.params.id } })

    res.json({ message: 'Candidate removed from job' })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}