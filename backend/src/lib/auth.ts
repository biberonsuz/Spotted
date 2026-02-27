import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { User } from '../generated/prisma'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set')
}

export async function hashPassword(password: string) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  )
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub: number; email: string }
}

