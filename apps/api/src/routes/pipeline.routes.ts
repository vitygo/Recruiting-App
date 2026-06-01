import { Router } from 'express'
import {
  getPipeline,
  addCandidateToJob,
  updateStage,
  removeCandidateFromJob,
} from '../controllers/pipeline.controller'
import { validate } from '../middleware/validate.middleware'
import { authMiddleware } from '../middleware/auth.middleware'
import { updateStageSchema, addCandidateToJobSchema } from '../schemas/pipeline.schema'

const router = Router()

router.use(authMiddleware)

router.get('/', getPipeline)
router.post('/', validate(addCandidateToJobSchema), addCandidateToJob)
router.patch('/:id/stage', validate(updateStageSchema), updateStage)
router.delete('/:id', removeCandidateFromJob)

export default router