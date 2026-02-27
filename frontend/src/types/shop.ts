export type OpeningHours = Record<string, string>

export type Coordinates = {
  latitude: number
  longitude: number
}

export type Shop = {
  id: number
  name: string
  type: string
  opening_hours: OpeningHours
  coordinates: Coordinates
  address: string
  neighbourhood: string
  city: string
}

