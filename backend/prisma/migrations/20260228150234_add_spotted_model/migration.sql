-- CreateTable
CREATE TABLE "Spotted" (
    "id" SERIAL NOT NULL,
    "visitedShopId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "brand" TEXT,
    "clothingCategory" TEXT,
    "colour" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Spotted_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Spotted" ADD CONSTRAINT "Spotted_visitedShopId_fkey" FOREIGN KEY ("visitedShopId") REFERENCES "VisitedShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
