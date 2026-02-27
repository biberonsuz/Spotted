import type { Shop } from '../types/shop'
import { apiClient } from './client'

export function getShops() {
  return apiClient.get<Shop[]>('/shops')
}

export function getShop(id: number) {
  return apiClient.get<Shop>(`/shops/${id}`)
}

