import type { Shop } from '../types/shop'
import { apiClient } from './client'

export type CreateShopPayload = {
  name: string
  type: string
  opening_hours?: Record<string, string>
  coordinates: { latitude: number; longitude: number }
  address: string
  neighbourhood: string
  city: string
}

export function getShops() {
  return apiClient.get<Shop[]>('/shops')
}

export function getShop(id: number) {
  return apiClient.get<Shop>(`/shops/${id}`)
}

export type ShopSpotted = {
  id: number
  imageUrl: string | null
  brand: string | null
  clothingCategory: string | null
  colour: string | null
  createdAt: string
}

export function getShopSpotteds(shopId: number) {
  return apiClient.get<ShopSpotted[]>(`/shops/${shopId}/spotteds`)
}

export function createShop(payload: CreateShopPayload) {
  return apiClient.post<Shop>('/shops', payload)
}

export function createShopsBulk(payload: CreateShopPayload[]) {
  return apiClient.post<Shop[]>('/shops/bulk', { shops: payload })
}

