type WithCoordinates = { coordinates: { latitude: number; longitude: number }; neighbourhood: string }

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // metres
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getClosestNeighbourhood(
  userLat: number,
  userLon: number,
  shops: WithCoordinates[]
): string | null {
  if (shops.length === 0) return null
  let closest = shops[0]
  let minDist = haversineDistance(
    userLat,
    userLon,
    closest.coordinates.latitude,
    closest.coordinates.longitude
  )
  for (let i = 1; i < shops.length; i++) {
    const d = haversineDistance(
      userLat,
      userLon,
      shops[i].coordinates.latitude,
      shops[i].coordinates.longitude
    )
    if (d < minDist) {
      minDist = d
      closest = shops[i]
    }
  }
  return closest.neighbourhood
}
