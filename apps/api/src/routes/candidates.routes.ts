import { Router } from 'express'
import {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '../controllers/candidates.controller'
import { validate } from '../middleware/validate.middleware'
import { authMiddleware } from '../middleware/auth.middleware'
import { createCandidateSchema, updateCandidateSchema } from '../schemas/candidate.schema'

const router = Router()

router.use(authMiddleware)

router.get('/', getCandidates)
router.get('/:id', getCandidate)
router.post('/', validate(createCandidateSchema), createCandidate)
router.patch('/:id', validate(updateCandidateSchema), updateCandidate)
router.delete('/:id', deleteCandidate)

export default router