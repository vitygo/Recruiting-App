import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'
import { CreateNoteInput, UpdateNoteInput } from '../schemas/note.schema'

export async function getNotes(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { candidateId } = req.query

    const where: Record<string, unknown> = { userId: req.userId }

    if (candidateId) where.candidateId = candidateId

    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json({ notes })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body as CreateNoteInput

    const candidate = await prisma.candidate.findFirst({
      where: { id: data.candidateId, userId: req.userId },
    })

    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' })
      return
    }

    const note = await prisma.note.create({
      data: { ...data, userId: req.userId! },
    })

    res.status(201).json({ note })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body as UpdateNoteInput

    const note = await prisma.note.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!note) {
      res.status(404).json({ error: 'Note not found' })
      return
    }

    const updated = await prisma.note.update({
      where: { id: req.params.id },
      data,
    })

    res.json({ note: updated })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!note) {
      res.status(404).json({ error: 'Note not found' })
      return
    }

    await prisma.note.delete({ where: { id: req.params.id } })

    res.json({ message: 'Note deleted' })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}