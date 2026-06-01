import { Router } from 'express'
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notes.controller'
import { validate } from '../middleware/validate.middleware'
import { authMiddleware } from '../middleware/auth.middleware'
import { createNoteSchema, updateNoteSchema } from '../schemas/note.schema'

const router = Router()

router.use(authMiddleware)

router.get('/', getNotes)
router.post('/', validate(createNoteSchema), createNote)
router.patch('/:id', validate(updateNoteSchema), updateNote)
router.delete('/:id', deleteNote)

export default router