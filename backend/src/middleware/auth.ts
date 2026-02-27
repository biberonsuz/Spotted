import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../lib/auth'

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number
    userEmail?: string
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' })
    return
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = verifyToken(token)
    req.userId = payload.sub
    req.userEmail = payload.email
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

