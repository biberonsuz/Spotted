import { apiClient } from './client'

export type VisitedShopSummary = {
  id: number
  visitId: number
  name: string
  neighbourhood: string
  city: string
  visitedAt: string
  rating?: number | null
}

export type SpottedItemPayload = {
  imageUrl?: string
  brand?: string
  clothingCategory?: string
  colour?: string
}

export type CreateVisitResponse = {
  visitId: number
  shopId: number
  rating?: number | null
  spotteds: Array<{
    id: number
    imageUrl: string | null
    brand: string | null
    clothingCategory: string | null
    colour: string | null
    createdAt: string
  }>
}

export type ActivityItem =
  | {
      type: 'visit'
      visitId: number
      shopId: number
      shopName: string
      at: string
      rating: number | null
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

export function getActivity(limit?: number) {
  const q = limit != null ? `?limit=${limit}` : ''
  return apiClient.get<ActivityItem[]>(`/me/activity${q}`)
}

export function getVisitedShops() {
  return apiClient.get<VisitedShopSummary[]>('/me/visited-shops')
}

export function createVisitWithSpotteds(
  shopId: number,
  spotteds: SpottedItemPayload[] = [],
  rating?: number,
) {
  return apiClient.post<CreateVisitResponse>('/me/visited-shops', {
    shopId,
    spotteds,
    ...(rating != null ? { rating } : {}),
  })
}

export function updateVisitRating(visitId: number, rating: number) {
  return apiClient.patch<{ visitId: number; shopId: number; rating: number | null }>(
    `/me/visited-shops/${visitId}`,
    { rating },
  )
}

export function toggleVisitedShop(shopId: number) {
  return apiClient.post<{ shopId: number; visited: boolean }>(`/me/visited-shops/${shopId}/toggle`)
}

