import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

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

