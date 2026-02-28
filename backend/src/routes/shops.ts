import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

// id is never read from the client; the DB assigns it via autoincrement (extra keys like id are stripped)
const createShopSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().min(1).max(100),
  opening_hours: z.record(z.string()).default({}),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  address: z.string().min(1).max(500),
  neighbourhood: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
})

function toApiShop(shop: {
  id: number
  name: string
  type: string
  openingHours: unknown
  latitude: number
  longitude: number
  address: string
  neighbourhood: string
  city: string
}) {
  return {
    id: shop.id,
    name: shop.name,
    type: shop.type,
    opening_hours: shop.openingHours,
    coordinates: {
      latitude: shop.latitude,
      longitude: shop.longitude,
    },
    address: shop.address,
    neighbourhood: shop.neighbourhood,
    city: shop.city,
  }
}

const bulkCreateSchema = z.object({
  shops: z.array(createShopSchema).min(1).max(100),
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = createShopSchema.parse(req.body)
    const shop = await prisma.shop.create({
      data: {
        name: parsed.name,
        type: parsed.type,
        openingHours: parsed.opening_hours,
        latitude: parsed.coordinates.latitude,
        longitude: parsed.coordinates.longitude,
        address: parsed.address,
        neighbourhood: parsed.neighbourhood,
        city: parsed.city,
      },
    })
    res.status(201).json(toApiShop(shop))
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.errors })
      return
    }
    next(error)
  }
})

router.post('/bulk', requireAuth, async (req, res, next) => {
  try {
    const parsed = bulkCreateSchema.parse(req.body)
    const created: ReturnType<typeof toApiShop>[] = []
    for (const item of parsed.shops) {
      const shop = await prisma.shop.create({
        data: {
          name: item.name,
          type: item.type,
          openingHours: item.opening_hours,
          latitude: item.coordinates.latitude,
          longitude: item.coordinates.longitude,
          address: item.address,
          neighbourhood: item.neighbourhood,
          city: item.city,
        },
      })
      created.push(toApiShop(shop))
    }
    res.status(201).json(created)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.errors })
      return
    }
    next(error)
  }
})

router.get('/', async (_req, res, next) => {
  try {
    const shops = await prisma.shop.findMany({
      orderBy: [{ city: 'asc' }, { neighbourhood: 'asc' }, { name: 'asc' }],
    })
    res.json(shops.map(toApiShop))
  } catch (error) {
    next(error)
  }
})

// Spotteds for this shop from all users (no auth or user filter)
router.get('/:id/spotteds', async (req, res, next) => {
  try {
    const shopId = Number(req.params.id)
    if (Number.isNaN(shopId)) {
      res.status(400).json({ error: 'Invalid shop id' })
      return
    }

    const spotteds = await prisma.spotted.findMany({
      where: { visitedShop: { shopId } },
      orderBy: { createdAt: 'desc' },
    })

    res.json(
      spotteds.map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        brand: s.brand,
        clothingCategory: s.clothingCategory,
        colour: s.colour,
        createdAt: s.createdAt,
      })),
    )
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Invalid shop id' })
      return
    }

    const shop = await prisma.shop.findUnique({ where: { id } })
    if (!shop) {
      res.status(404).json({ error: 'Shop not found' })
      return
    }

    res.json(toApiShop(shop))
  } catch (error) {
    next(error)
  }
})

export default router

