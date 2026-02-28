import path from 'path'
import express from 'express'
import cors from 'cors'
import shopsRouter from './routes/shops'
import authRouter from './routes/auth'
import meRouter from './routes/me'

const app = express()

const corsOrigin = process.env.CORS_ORIGIN

app.use(
  cors(
    corsOrigin
      ? {
          origin: corsOrigin,
        }
      : undefined,
  ),
)
app.use(express.json())

const uploadsDir = path.join(__dirname, '..', 'uploads')
app.use('/uploads', express.static(uploadsDir))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/shops', shopsRouter)
app.use('/auth', authRouter)
app.use('/me', meRouter)

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  },
)

export default app

