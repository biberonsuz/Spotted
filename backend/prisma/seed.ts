import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import shops from '../../frontend/src/data/shops.json'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  for (const shop of shops) {
    await prisma.shop.upsert({
      where: { id: shop.id },
      update: {},
      create: {
        id: shop.id,
        name: shop.name,
        type: shop.type,
        openingHours: shop.opening_hours,
        latitude: shop.coordinates.latitude,
        longitude: shop.coordinates.longitude,
        address: shop.address,
        neighbourhood: shop.neighbourhood,
        city: shop.city,
      },
    })
  }
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

