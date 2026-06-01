import { Router } from 'express'
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobs.controller'
import { validate } from '../middleware/validate.middleware'
import { authMiddleware } from '../middleware/auth.middleware'
import { createJobSchema, updateJobSchema } from '../schemas/job.schema'

const router = Router()

router.use(authMiddleware)

router.get('/', getJobs)
router.get('/:id', getJob)
router.post('/', validate(createJobSchema), createJob)
router.patch('/:id', validate(updateJobSchema), updateJob)
router.delete('/:id', deleteJob)

export default router