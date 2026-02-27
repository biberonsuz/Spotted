import { apiClient } from './client'
import type { AuthUser } from './auth'

export type MeResponse = Pick<AuthUser, 'id' | 'email' | 'name'> & {
  createdAt: string
}

export function getMe() {
  return apiClient.get<MeResponse>('/me')
}
