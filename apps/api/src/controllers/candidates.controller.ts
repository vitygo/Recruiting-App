import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'
import { CreateCandidateInput, UpdateCandidateInput } from '../schemas/candidate.schema'

export async function getCandidates(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { search, source, page = '1', limit = '20' } = req.query

    const where: Record<string, unknown> = { userId: req.userId }

    if (source) where.source = source
    if (search) {
      where.OR = [
        { firstName: { contains: search as string } },
        { lastName: { contains: search as string } },
        { email: { contains: search as string } },
      ]
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: { jobs: { include: { job: true } } },
      }),
      prisma.candidate.count({ where }),
    ])

    res.json({ candidates, total, page: parseInt(page as string) })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getCandidate(req: AuthRequest, res: Response): Promise<void> {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: {
        jobs: { include: { job: true } },
        notes: { orderBy: { createdAt: 'desc' } },
        interviews: { orderBy: { scheduledAt: 'desc' } },
      },
    })

    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' })
      return
    }

    res.json({ candidate })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createCandidate(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body as CreateCandidateInput

    const candidate = await prisma.candidate.create({
      data: { ...data, userId: req.userId! },
    })

    res.status(201).json({ candidate })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateCandidate(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body as UpdateCandidateInput

    const candidate = await prisma.candidate.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' })
      return
    }

    const updated = await prisma.candidate.update({
      where: { id: req.params.id },
      data,
    })

    res.json({ candidate: updated })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteCandidate(req: AuthRequest, res: Response): Promise<void> {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' })
      return
    }

    await prisma.candidate.delete({ where: { id: req.params.id } })

    res.json({ message: 'Candidate deleted' })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}