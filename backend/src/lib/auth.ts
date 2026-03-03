import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

type JwtUser = {
  id: number
  email: string
}

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

export function generateToken(user: JwtUser) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    JWT_SECRET as string,
    { expiresIn: '7d' },
  )
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET as string) as unknown as { sub: number; email: string }
}

