import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/tokens'
import { RegisterInput, LoginInput } from '../schemas/auth.schema'
import { AuthRequest } from '../middleware/auth.middleware'

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body as RegisterInput

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(409).json({ error: 'Email already in use' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    const accessToken  = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    await prisma.refreshToken.create({
      data: {
        token:     refreshToken,
        userId:    user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000,
      path:     '/api/auth',
    })

    res.status(201).json({ accessToken, user })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as LoginInput

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const accessToken  = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    await prisma.refreshToken.create({
      data: {
        token:     refreshToken,
        userId:    user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000,
      path:     '/api/auth',
    })

    const { passwordHash: _, ...safeUser } = user
    res.json({ accessToken, user: safeUser })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies?.refreshToken
    if (!token) {
      res.status(401).json({ error: 'No refresh token' })
      return
    }

    const payload = verifyRefreshToken(token)

    const stored = await prisma.refreshToken.findUnique({ where: { token } })
    if (!stored || stored.expiresAt < new Date()) {
      res.status(401).json({ error: 'Invalid refresh token' })
      return
    }

    await prisma.refreshToken.delete({ where: { token } })

    const newRefreshToken = generateRefreshToken(payload.userId)
    const newAccessToken  = generateAccessToken(payload.userId)

    await prisma.refreshToken.create({
      data: {
        token:     newRefreshToken,
        userId:    payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000,
      path:     '/api/auth',
    })

    res.json({ accessToken: newAccessToken })
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies?.refreshToken
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } })
    }

    res.clearCookie('refreshToken', { path: '/api/auth' })
    res.json({ message: 'Logged out' })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ user })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}