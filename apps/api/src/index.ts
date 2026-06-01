import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.routes'
import candidatesRoutes from './routes/candidates.routes'
import jobsRoutes from './routes/jobs.routes'
import pipelineRoutes from './routes/pipeline.routes'
import interviewsRoutes from './routes/interviews.routes'
import notesRoutes from './routes/notes.routes'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.options('*', cors())
app.use(express.json({ limit: '500kb' }))
app.use(cookieParser())

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many requests',
}))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/candidates', candidatesRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/pipeline', pipelineRoutes)
app.use('/api/interviews', interviewsRoutes)
app.use('/api/notes', notesRoutes)

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})

export default app