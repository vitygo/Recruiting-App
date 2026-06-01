import { Router } from 'express'
import {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
} from '../controllers/interviews.controller'
import { validate } from '../middleware/validate.middleware'
import { authMiddleware } from '../middleware/auth.middleware'
import { createInterviewSchema, updateInterviewSchema } from '../schemas/interview.schema'

const router = Router()

router.use(authMiddleware)

router.get('/', getInterviews)
router.get('/:id', getInterview)
router.post('/', validate(createInterviewSchema), createInterview)
router.patch('/:id', validate(updateInterviewSchema), updateInterview)
router.delete('/:id', deleteInterview)

export default router