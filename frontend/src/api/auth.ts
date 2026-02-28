import { apiClient } from './client'

export type AuthUser = {
  id: number
  email: string
  name?: string | null
  username?: string | null
  avatarUrl?: string | null
  createdAt?: string
}

export type AuthResponse = {
  user: AuthUser
  token: string
}

export function register(payload: { email: string; password: string; name?: string }) {
  return apiClient.post<AuthResponse>('/auth/register', payload)
}

export function login(payload: { email: string; password: string }) {
  return apiClient.post<AuthResponse>('/auth/login', payload)
}

