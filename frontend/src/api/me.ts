import { apiClient } from './client'
import type { AuthUser } from './auth'

export type MeResponse = Pick<AuthUser, 'id' | 'email' | 'name'> & {
  createdAt: string
}

export function getMe() {
  return apiClient.get<MeResponse>('/me')
}

export function getBrands() {
  return apiClient.get<string[]>('/me/brands')
}

export function putBrands(brands: string[]) {
  return apiClient.put<string[]>('/me/brands', { brands })
}
