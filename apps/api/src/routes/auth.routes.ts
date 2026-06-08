import { Router } from 'express'
import { register, login, refresh, logout, me, updateMe } from '../controllers/auth.controller'
import { validate } from '../middleware/validate.middleware'
import { authMiddleware } from '../middleware/auth.middleware'
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/auth.schema'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', authMiddleware, me)
router.patch('/me', authMiddleware, validate(updateProfileSchema), updateMe)

export default router