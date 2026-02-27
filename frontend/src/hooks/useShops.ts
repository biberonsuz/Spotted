import { useEffect, useState } from 'react'
import type { Shop } from '../types/shop'
import { getShops } from '../api/shops'

export function useShops() {
  const [shops, setShops] = useState<Shop[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const data = await getShops()
        if (!cancelled) {
          setShops(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { shops, loading, error }
}

