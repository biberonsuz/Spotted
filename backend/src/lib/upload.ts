import path from 'path'
import fs from 'fs'
import multer from 'multer'

const uploadsDir = path.join(__dirname, '..', '..', 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').slice(0, 80)
    const name = `${Date.now()}-${base}${ext}`
    cb(null, name)
  },
})

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only images (JPEG, PNG, WebP, GIF) are allowed'))
    }
  },
})
