import { useState, useEffect } from 'react'
import { getClosestNeighbourhood } from '../utils/closestShop'

export type ShopWithCoords = {
  coordinates: { latitude: number; longitude: number }
  neighbourhood: string
}

export function useClosestNeighbourhood(
  defaultNeighbourhood = 'Brick Lane',
  shopsList: ShopWithCoords[] = [],
): string {
  const [neighbourhood, setNeighbourhood] = useState<string>(defaultNeighbourhood)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const closest = getClosestNeighbourhood(
          pos.coords.latitude,
          pos.coords.longitude,
          shopsList
        )
        if (closest) setNeighbourhood(closest)
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [shopsList])

  return neighbourhood
}
