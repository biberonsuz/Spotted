import { apiClient } from './client'

export type CreateSpottedPayload = {
  visitedShopId: number
  imageUrl?: string
  brand?: string
  clothingCategory?: string
  colour?: string
}

export type Spotted = {
  id: number
  visitedShopId: number
  imageUrl: string | null
  brand: string | null
  clothingCategory: string | null
  colour: string | null
  createdAt: string
}

export function createSpotted(payload: CreateSpottedPayload) {
  return apiClient.post<Spotted>('/me/spotted', payload)
}
