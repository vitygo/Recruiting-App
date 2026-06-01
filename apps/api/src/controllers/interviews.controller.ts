import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'
import { CreateInterviewInput, UpdateInterviewInput } from '../schemas/interview.schema'

export async function getInterviews(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { date, status } = req.query

    const where: Record<string, unknown> = { userId: req.userId }

    if (status) where.status = status
    if (date) {
      const start = new Date(date as string)
      const end = new Date(date as string)
      end.setDate(end.getDate() + 1)
      where.scheduledAt = { gte: start, lt: end }
    }

    const interviews = await prisma.interview.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: { candidate: true },
    })

    res.json({ interviews })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getInterview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const interview = await prisma.interview.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { candidate: true },
    })

    if (!interview) {
      res.status(404).json({ error: 'Interview not found' })
      return
    }

    res.json({ interview })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createInterview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body as CreateInterviewInput

    const candidate = await prisma.candidate.findFirst({
      where: { id: data.candidateId, userId: req.userId },
    })

    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' })
      return
    }

    const interview = await prisma.interview.create({
      data: {
        ...data,
        userId: req.userId!,
        scheduledAt: new Date(data.scheduledAt),
      },
      include: { candidate: true },
    })

    res.status(201).json({ interview })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateInterview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body as UpdateInterviewInput

    const interview = await prisma.interview.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!interview) {
      res.status(404).json({ error: 'Interview not found' })
      return
    }

    const updated = await prisma.interview.update({
      where: { id: req.params.id },
      data: {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      },
      include: { candidate: true },
    })

    res.json({ interview: updated })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteInterview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const interview = await prisma.interview.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!interview) {
      res.status(404).json({ error: 'Interview not found' })
      return
    }

    await prisma.interview.delete({ where: { id: req.params.id } })

    res.json({ message: 'Interview deleted' })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}