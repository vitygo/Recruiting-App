import { Router } from 'express'
import { clearDemoData } from '../controllers/demo.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.use(authMiddleware)
router.delete('/clear', clearDemoData)

export default router
