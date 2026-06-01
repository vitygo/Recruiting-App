import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'
import { CreateJobInput, UpdateJobInput } from '../schemas/job.schema'

export async function getJobs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status, department } = req.query

    const where: Record<string, unknown> = { userId: req.userId }

    if (status) where.status = status
    if (department) where.department = department

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { candidates: true } } },
    })

    res.json({ jobs })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const job = await prisma.job.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: {
        candidates: {
          include: { candidate: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!job) {
      res.status(404).json({ error: 'Job not found' })
      return
    }

    res.json({ job })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body as CreateJobInput

    const job = await prisma.job.create({
      data: { ...data, userId: req.userId! },
    })

    res.status(201).json({ job })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body as UpdateJobInput

    const job = await prisma.job.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!job) {
      res.status(404).json({ error: 'Job not found' })
      return
    }

    const updated = await prisma.job.update({
      where: { id: req.params.id },
      data,
    })

    res.json({ job: updated })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const job = await prisma.job.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!job) {
      res.status(404).json({ error: 'Job not found' })
      return
    }

    await prisma.job.delete({ where: { id: req.params.id } })

    res.json({ message: 'Job deleted' })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}