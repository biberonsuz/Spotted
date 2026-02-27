import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { generateToken, hashPassword, verifyPassword } from '../lib/auth'

const router = Router()

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(100).optional(),
})

router.post('/register', async (req, res, next) => {
  try {
    const parsed = credentialsSchema.parse(req.body)

    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    })
    if (existing) {
      res.status(409).json({ error: 'Email already in use' })
      return
    }

    const passwordHash = await hashPassword(parsed.password)

    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        passwordHash,
        name: parsed.name,
      },
    })

    const token = generateToken(user)

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.errors })
      return
    }
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const parsed = credentialsSchema.pick({ email: true, password: true }).parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
    })

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const valid = await verifyPassword(parsed.password, user.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const token = generateToken(user)

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.errors })
      return
    }
    next(error)
  }
})

export default router

