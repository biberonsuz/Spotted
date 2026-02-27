import { apiClient } from './client'

export type VisitedShopSummary = {
  id: number
  name: string
  neighbourhood: string
  city: string
  visitedAt: string
}

export function getVisitedShops() {
  return apiClient.get<VisitedShopSummary[]>('/me/visited-shops')
}

export function toggleVisitedShop(shopId: number) {
  return apiClient.post<{ shopId: number; visited: boolean }>(`/me/visited-shops/${shopId}/toggle`)
}

