import { apiClient } from './client'
import type { AuthUser } from './auth'

export type MeResponse = Pick<AuthUser, 'id' | 'email' | 'name' | 'username' | 'avatarUrl'> & {
  createdAt: string
}

export function getMe() {
  return apiClient.get<MeResponse>('/me')
}

export type PatchMePayload = {
  name?: string
  username?: string | null
  avatarUrl?: string | null
}

export function patchMe(payload: PatchMePayload) {
  return apiClient.patch<MeResponse>('/me', payload)
}

export function getBrands() {
  return apiClient.get<string[]>('/me/brands')
}

export function putBrands(brands: string[]) {
  return apiClient.put<string[]>('/me/brands', { brands })
}
