import path from 'path'
import express, { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { uploadSingle } from '../lib/upload'

const router = Router()

router.post(
  '/upload',
  requireAuth,
  uploadSingle.single('file'),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }
    const url = `/uploads/${req.file.filename}`
    res.json({ url })
  },
  (err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof Error && err.message.includes('Only images')) {
      res.status(400).json({ error: err.message })
      return
    }
    if (err && (err as { code?: string }).code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File too large (max 5MB)' })
      return
    }
    next(err)
  },
)

const spottedItemSchema = z.object({
  imageUrl: z.string().url().optional().or(z.literal('')),
  brand: z.string().max(200).optional(),
  clothingCategory: z.string().max(100).optional(),
  colour: z.string().max(50).optional(),
}).transform((data) => ({
  ...data,
  imageUrl: data.imageUrl && data.imageUrl.length > 0 ? data.imageUrl : null,
}))

const createVisitWithSpottedsSchema = z.object({
  shopId: z.number().int().positive(),
  rating: z.number().min(0).max(10).optional(),
  spotteds: z.array(spottedItemSchema).optional().default([]),
})

const updateVisitRatingSchema = z.object({
  rating: z.number().min(0).max(10),
})

const createSpottedSchema = z.object({
  visitedShopId: z.number().int().positive(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  brand: z.string().max(200).optional(),
  clothingCategory: z.string().max(100).optional(),
  colour: z.string().max(50).optional(),
}).transform((data) => ({
  ...data,
  imageUrl: data.imageUrl && data.imageUrl.length > 0 ? data.imageUrl : null,
}))

const patchMeSchema = z.object({
  name: z.string().min(0).max(200).optional(),
  username: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscore')
    .optional()
    .nullable(),
  avatarUrl: z.string().url().optional().nullable().or(z.literal('')),
}).transform((data) => ({
  ...data,
  avatarUrl: data.avatarUrl && data.avatarUrl.length > 0 ? data.avatarUrl : null,
}))

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.patch('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!
    const parsed = patchMeSchema.parse(req.body)
    if (parsed.username !== undefined && parsed.username !== null) {
      const existing = await prisma.user.findFirst({
        where: { username: parsed.username, id: { not: userId } },
      })
      if (existing) {
        res.status(400).json({ error: 'Username is already taken' })
        return
      }
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(parsed.name !== undefined && { name: parsed.name || null }),
        ...(parsed.username !== undefined && { username: parsed.username }),
        ...(parsed.avatarUrl !== undefined && { avatarUrl: parsed.avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      },
    })
    res.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    next(error)
  }
})

const putBrandsSchema = z.object({
  brands: z.array(z.string().min(1).max(200)).max(200),
})

router.get('/brands', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!
    const rows = await prisma.userBrand.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      select: { name: true },
    })
    res.json(rows.map((r) => r.name))
  } catch (error) {
    next(error)
  }
})

router.put('/brands', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!
    const parsed = putBrandsSchema.parse(req.body)
    const names = [...new Set(parsed.brands.map((s) => s.trim()).filter(Boolean))]
    await prisma.$transaction([
      prisma.userBrand.deleteMany({ where: { userId } }),
      ...names.map((name) =>
        prisma.userBrand.create({ data: { userId, name } }),
      ),
    ])
    const rows = await prisma.userBrand.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      select: { name: true },
    })
    res.json(rows.map((r) => r.name))
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    next(error)
  }
})

router.get('/activity', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!
    const limit = Math.min(Number(req.query.limit) || 20, 50)

    const visited = await prisma.visitedShop.findMany({
      where: { userId },
      include: { shop: true, spotteds: true },
      orderBy: { visitedAt: 'desc' },
      take: 50,
    })

    type ActivityItem =
      | {
          type: 'visit'
          visitId: number
          shopId: number
          shopName: string
          at: string
          rating: number | null
        }
      | {
          type: 'ranked'
          visitId: number
          shopId: number
          shopName: string
          rating: number
          at: string
        }
      | {
          type: 'spotted'
          spottedId: number
          visitId: number
          shopId: number
          shopName: string
          brand: string | null
          clothingCategory: string | null
          colour: string | null
          imageUrl: string | null
          at: string
        }

    const activities: ActivityItem[] = []
    for (const v of visited) {
      if (v.rating != null) {
        const rankedAt = v.ratingUpdatedAt ?? v.visitedAt
        activities.push({
          type: 'ranked',
          visitId: v.id,
          shopId: v.shopId,
          shopName: v.shop.name,
          rating: v.rating,
          at: rankedAt.toISOString(),
        })
      } else {
        activities.push({
          type: 'visit',
          visitId: v.id,
          shopId: v.shopId,
          shopName: v.shop.name,
          at: v.visitedAt.toISOString(),
          rating: v.rating,
        })
      }
      for (const s of v.spotteds) {
        activities.push({
          type: 'spotted',
          spottedId: s.id,
          visitId: v.id,
          shopId: v.shopId,
          shopName: v.shop.name,
          brand: s.brand,
          clothingCategory: s.clothingCategory,
          colour: s.colour,
          imageUrl: s.imageUrl,
          at: s.createdAt.toISOString(),
        })
      }
    }
    activities.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    const sliced = activities.slice(0, limit)
    res.json(sliced)
  } catch (error) {
    next(error)
  }
})

router.get('/visited-shops', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!

    const visited = await prisma.visitedShop.findMany({
      where: { userId },
      include: { shop: true },
      orderBy: { visitedAt: 'desc' },
    })

    res.json(
      visited.map((entry) => ({
        id: entry.shop.id,
        visitId: entry.id,
        name: entry.shop.name,
        neighbourhood: entry.shop.neighbourhood,
        city: entry.shop.city,
        visitedAt: entry.visitedAt,
        rating: entry.rating,
      })),
    )
  } catch (error) {
    next(error)
  }
})

router.patch(
  '/visited-shops/:visitId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!
    const visitId = Number(req.params.visitId)
    if (Number.isNaN(visitId)) {
      res.status(400).json({ error: 'Invalid visit id' })
      return
    }
    const parsed = updateVisitRatingSchema.parse(req.body)
    const visit = await prisma.visitedShop.findFirst({
      where: { id: visitId, userId },
    })
    if (!visit) {
      res.status(404).json({ error: 'Visit not found' })
      return
    }
    await prisma.visitedShop.update({
      where: { id: visitId },
      data: { rating: parsed.rating, ratingUpdatedAt: new Date() },
    })
    const updated = await prisma.visitedShop.findUnique({
      where: { id: visitId },
      include: { shop: true },
    })
    res.json({
      visitId: updated!.id,
      shopId: updated!.shopId,
      rating: updated!.rating,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    next(error)
  }
})

router.post('/visited-shops', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!
    const parsed = createVisitWithSpottedsSchema.parse(req.body)
    let visit = await prisma.visitedShop.findUnique({
      where: { userId_shopId: { userId, shopId: parsed.shopId } },
    })
    const isNewVisit = !visit
    const ratingData =
      parsed.rating != null
        ? { rating: parsed.rating, ratingUpdatedAt: new Date() }
        : {}
    if (!visit) {
      visit = await prisma.visitedShop.create({
        data: {
          userId,
          shopId: parsed.shopId,
          ...ratingData,
        },
      })
    } else if (Object.keys(ratingData).length > 0) {
      visit = await prisma.visitedShop.update({
        where: { id: visit.id },
        data: ratingData,
      })
    }
    const spotteds = await Promise.all(
      (parsed.spotteds ?? []).map((item) =>
        prisma.spotted.create({
          data: {
            visitedShopId: visit!.id,
            imageUrl: item.imageUrl,
            brand: item.brand ?? null,
            clothingCategory: item.clothingCategory ?? null,
            colour: item.colour ?? null,
          },
        }),
      ),
    )
    const updatedVisit = await prisma.visitedShop.findUnique({
      where: { id: visit.id },
    })
    res.status(isNewVisit ? 201 : 200).json({
      visitId: visit.id,
      shopId: visit.shopId,
      rating: updatedVisit?.rating ?? undefined,
      spotteds: spotteds.map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        brand: s.brand,
        clothingCategory: s.clothingCategory,
        colour: s.colour,
        createdAt: s.createdAt,
      })),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    next(error)
  }
})

router.post(
  '/visited-shops/:shopId/toggle',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!
    const shopId = Number(req.params.shopId)

    if (Number.isNaN(shopId)) {
      res.status(400).json({ error: 'Invalid shop id' })
      return
    }

    const existing = await prisma.visitedShop.findUnique({
      where: { userId_shopId: { userId, shopId } },
    })

    if (existing) {
      await prisma.visitedShop.delete({
        where: { id: existing.id },
      })
      res.json({ shopId, visited: false })
      return
    }

    await prisma.visitedShop.create({
      data: {
        userId,
        shopId,
      },
    })

    res.json({ shopId, visited: true })
  } catch (error) {
    next(error)
  }
})

router.post('/spotted', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!
    const parsed = createSpottedSchema.parse(req.body)
    const visit = await prisma.visitedShop.findFirst({
      where: { id: parsed.visitedShopId, userId },
    })
    if (!visit) {
      res.status(404).json({ error: 'Visit not found' })
      return
    }
    const spotted = await prisma.spotted.create({
      data: {
        visitedShopId: parsed.visitedShopId,
        imageUrl: parsed.imageUrl,
        brand: parsed.brand ?? null,
        clothingCategory: parsed.clothingCategory ?? null,
        colour: parsed.colour ?? null,
      },
    })
    res.status(201).json({
      id: spotted.id,
      visitedShopId: spotted.visitedShopId,
      imageUrl: spotted.imageUrl,
      brand: spotted.brand,
      clothingCategory: spotted.clothingCategory,
      colour: spotted.colour,
      createdAt: spotted.createdAt,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    next(error)
  }
})

export default router

