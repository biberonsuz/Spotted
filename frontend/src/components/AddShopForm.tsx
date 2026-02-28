import { useState } from 'react'
import { createShop, createShopsBulk } from '../api/shops'
import type { CreateShopPayload } from '../api/shops'
import { ApiError } from '../api/client'
import type { Shop } from '../types/shop'

type Props = {
  onSuccess?: (shop: Shop) => void
  onBulkSuccess?: (shops: Shop[]) => void
}

// Build payload for API; id from JSON is never included — the DB assigns it
function normalizeShopItem(raw: unknown): CreateShopPayload | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const coords = (o.coordinates as { latitude?: number; longitude?: number }) ?? {}
  const lat = typeof coords.latitude === 'number' ? coords.latitude : typeof o.latitude === 'number' ? o.latitude : null
  const lng = typeof coords.longitude === 'number' ? coords.longitude : typeof o.longitude === 'number' ? o.longitude : null
  const name = typeof o.name === 'string' ? o.name.trim() : ''
  const type = typeof o.type === 'string' ? o.type.trim() : ''
  const address = typeof o.address === 'string' ? o.address.trim() : ''
  const neighbourhood = typeof o.neighbourhood === 'string' ? o.neighbourhood.trim() : ''
  const city = typeof o.city === 'string' ? o.city.trim() : ''
  if (!name || !type || lat == null || lng == null || !address || !neighbourhood || !city) return null
  const opening_hours = o.opening_hours != null && typeof o.opening_hours === 'object' && !Array.isArray(o.opening_hours)
    ? (o.opening_hours as Record<string, string>)
    : {}
  return {
    name,
    type,
    coordinates: { latitude: lat, longitude: lng },
    address,
    neighbourhood,
    city,
    opening_hours: Object.keys(opening_hours).length ? opening_hours : undefined,
  }
}

export default function AddShopForm({ onSuccess, onBulkSuccess }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [form, setForm] = useState({
    name: '',
    type: '',
    address: '',
    neighbourhood: '',
    city: '',
    latitude: '',
    longitude: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const lat = Number(form.latitude)
    const lng = Number(form.longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError('Latitude and longitude must be valid numbers.')
      setSubmitting(false)
      return
    }

    try {
      const shop = await createShop({
        name: form.name.trim(),
        type: form.type.trim(),
        opening_hours: {},
        coordinates: { latitude: lat, longitude: lng },
        address: form.address.trim(),
        neighbourhood: form.neighbourhood.trim(),
        city: form.city.trim(),
      })
      onSuccess?.(shop)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add shop.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      let data: unknown
      try {
        data = JSON.parse(jsonInput)
      } catch {
        setError('Invalid JSON. Paste an array of shop objects.')
        setSubmitting(false)
        return
      }
      const arr = Array.isArray(data) ? data : [data]
      const payloads: CreateShopPayload[] = []
      for (let i = 0; i < arr.length; i++) {
        const item = normalizeShopItem(arr[i])
        if (!item) {
          setError(`Item at index ${i} is missing required fields (name, type, coordinates.latitude, coordinates.longitude, address, neighbourhood, city).`)
          setSubmitting(false)
          return
        }
        payloads.push(item)
      }
      if (payloads.length === 0) {
        setError('No valid shops in the JSON array.')
        setSubmitting(false)
        return
      }
      const created = await createShopsBulk(payloads)
      setJsonInput('')
      if (created.length === 1) {
        onSuccess?.(created[0])
      } else {
        onBulkSuccess?.(created)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add shops.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-md">
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Name</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. Rokit Brick Lane"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Type</span>
        <input
          type="text"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. Vintage Store, Charity Shop"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Address</span>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. 101 Brick Ln, London E1 6SE"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Neighbourhood</span>
        <input
          type="text"
          name="neighbourhood"
          value={form.neighbourhood}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. Brick Lane"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">City</span>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. London"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Latitude</span>
          <input
            type="text"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 51.522"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Longitude</span>
          <input
            type="text"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. -0.071"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Adding…' : 'Add shop'}
      </button>
    </form>

    <div className="border-t border-gray-200 pt-8">
      <h3 className="text-base font-medium text-gray-800 mb-2">Add multiple shops from JSON</h3>
      <p className="text-sm text-gray-500 mb-3">
        Paste a JSON array of shop objects. Each object must have: name, type, address, neighbourhood, city, and coordinates (latitude, longitude). opening_hours is optional.
      </p>
      <form onSubmit={handleBulkSubmit} className="flex flex-col gap-3">
        <textarea
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value)
            setError(null)
          }}
          placeholder={`[\n  { "name": "Shop name", "type": "Vintage Store", "address": "...", "neighbourhood": "Brick Lane", "city": "London", "coordinates": { "latitude": 51.52, "longitude": -0.07 } }\n]`}
          rows={10}
          className="font-mono text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={submitting || !jsonInput.trim()}
          className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Adding…' : 'Add shops from JSON'}
        </button>
      </form>
    </div>
    </div>
  )
}
