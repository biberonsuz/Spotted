import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.userId!
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
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

router.get('/visited-shops', requireAuth, async (req, res, next) => {
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
        name: entry.shop.name,
        neighbourhood: entry.shop.neighbourhood,
        city: entry.shop.city,
        visitedAt: entry.visitedAt,
      })),
    )
  } catch (error) {
    next(error)
  }
})

router.post('/visited-shops/:shopId/toggle', requireAuth, async (req, res, next) => {
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

export default router

