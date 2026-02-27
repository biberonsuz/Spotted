import { useAuth } from '../context/AuthContext'

/**
 * Returns the current authenticated user and a way to refresh their data from the API.
 * Use this when you need to show the user's name/email or refetch after profile updates.
 */
export function useCurrentUser() {
  const { user, refreshUser } = useAuth()
  return { user, refreshUser }
}
