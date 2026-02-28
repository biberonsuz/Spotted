import { useState, useRef } from 'react'
import { useShops } from '../hooks/useShops'
import { useVisitedShops } from '../context/VisitedShopsContext'
import { createVisitWithSpotteds } from '../api/visitedShops'
import { ApiError, apiClient } from '../api/client'
import type { SpottedItemPayload } from '../api/visitedShops'
import Select from '../ui/primitives/Select'

const emptySpottedRow = (): SpottedItemPayload & { key: number } => ({
  key: Date.now(),
  imageUrl: '',
  brand: '',
  clothingCategory: '',
  colour: '',
})

export default function AddView() {
  const { shops, loading: shopsLoading } = useShops()
  const { visitedIds, reload } = useVisitedShops()
  const [visitShopId, setVisitShopId] = useState<string>('')
  const [visitRating, setVisitRating] = useState<string>('')
  const [spottedRows, setSpottedRows] = useState<(SpottedItemPayload & { key: number })[]>([])
  const [visitSubmitting, setVisitSubmitting] = useState(false)
  const [visitError, setVisitError] = useState<string | null>(null)
  const [visitSuccess, setVisitSuccess] = useState(false)
  const [uploadingForKey, setUploadingForKey] = useState<number | null>(null)
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault()
    const shopId = Number(visitShopId)
    if (!visitShopId || Number.isNaN(shopId)) {
      setVisitError('Please select a shop.')
      return
    }
    setVisitError(null)
    setVisitSuccess(false)
    setVisitSubmitting(true)
    try {
      const spotteds: SpottedItemPayload[] = spottedRows
        .map((row) => ({
          imageUrl: row.imageUrl?.trim() || undefined,
          brand: row.brand?.trim() || undefined,
          clothingCategory: row.clothingCategory?.trim() || undefined,
          colour: row.colour?.trim() || undefined,
        }))
        .filter(
          (s) =>
            s.imageUrl != null ||
            (s.brand != null && s.brand !== '') ||
            (s.clothingCategory != null && s.clothingCategory !== '') ||
            (s.colour != null && s.colour !== ''),
        )
      const ratingNum =
        visitRating.trim() !== ''
          ? Number(visitRating)
          : undefined
      if (ratingNum != null && (Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10)) {
        setVisitError('Rating must be between 0 and 10.')
        setVisitSubmitting(false)
        return
      }
      await createVisitWithSpotteds(shopId, spotteds, ratingNum)
      setVisitShopId('')
      setVisitRating('')
      setSpottedRows([])
      setVisitSuccess(true)
      await reload()
    } catch (err) {
      setVisitError(err instanceof ApiError ? err.message : 'Failed to add visit.')
    } finally {
      setVisitSubmitting(false)
    }
  }

  const addSpottedRow = () => setSpottedRows((prev) => [...prev, emptySpottedRow()])
  const removeSpottedRow = (key: number) =>
    setSpottedRows((prev) => prev.filter((r) => r.key !== key))
  const updateSpottedRow = (
    key: number,
    field: keyof SpottedItemPayload,
    value: string,
  ) => {
    setSpottedRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)),
    )
  }

  const handleImageUpload = async (rowKey: number, file: File | null) => {
    if (!file) return
    setUploadingForKey(rowKey)
    try {
      const url = await apiClient.uploadImage(file)
      updateSpottedRow(rowKey, 'imageUrl', url)
    } catch {
      setVisitError('Image upload failed. Try another image (max 5MB, JPEG/PNG/WebP/GIF).')
    } finally {
      setUploadingForKey(null)
      const input = fileInputRefs.current[rowKey]
      if (input) input.value = ''
    }
  }

  return (
    <div className="w-full min-w-0 max-w-5xl mx-auto flex flex-col gap-8 mb-24 p-4 overflow-x-hidden">
      <h2 className="text-lg font-medium">Add a visit</h2>

      {/* Add a visit (with optional spotteds) */}
      <section className="flex flex-col gap-3 max-w-md">
        <p className="text-sm text-gray-500">
          Select a shop to mark as visited and optionally add spotted items. If you&apos;ve already
          visited that shop, we&apos;ll add the spotted items to that visit.
        </p>
        <form onSubmit={handleAddVisit} className="flex flex-col gap-4">
          {visitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {visitError}
            </p>
          )}
          {visitSuccess && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Done. Visit added or spotted items added to existing visit.
            </p>
          )}
          <Select
            label="Shop"
            placeholder="Select a shop"
            value={visitShopId}
            onChange={(val) => {
              setVisitShopId(val)
              setVisitError(null)
            }}
            options={[
              ...(shopsLoading ? [{ value: '__loading__', label: 'Loading…', disabled: true }] : []),
              ...(shops ?? []).map((shop) => ({
                value: String(shop.id),
                label: `${shop.name}, ${shop.neighbourhood}${visitedIds.has(shop.id) ? ' (visited)' : ''}`,
              })),
            ]}
          />

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Your rating (optional)</span>
            <input
              type="number"
              min={0}
              max={10}
              step={0.5}
              value={visitRating}
              onChange={(e) => {
                setVisitRating(e.target.value)
                setVisitError(null)
              }}
              placeholder="0–10"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-24"
            />
            <span className="text-xs text-gray-500">Personal ranking for this shop (0–10)</span>
          </label>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Spotted items (optional)</span>
              <button
                type="button"
                onClick={addSpottedRow}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add item
              </button>
            </div>
            {spottedRows.length === 0 && (
              <p className="text-sm text-gray-500 mb-2">No items. Add any you spotted on this visit.</p>
            )}
            <div className="flex flex-col gap-3">
              {spottedRows.map((row) => (
                <div
                  key={row.key}
                  className="p-3 border border-gray-200 rounded-lg flex flex-col gap-2 bg-gray-50/50"
                >
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeSpottedRow(row.key)}
                      className="text-xs text-gray-500 hover:text-red-600"
                      aria-label="Remove"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-600">Image</span>
                    <input
                      ref={(el) => { fileInputRefs.current[row.key] = el }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={(e) => handleImageUpload(row.key, e.target.files?.[0] ?? null)}
                      disabled={uploadingForKey === row.key}
                    />
                    {uploadingForKey === row.key && (
                      <span className="text-xs text-gray-500">Uploading…</span>
                    )}
                    {row.imageUrl && uploadingForKey !== row.key && (
                      <div className="mt-1 flex items-center gap-2">
                        <img
                          src={row.imageUrl}
                          alt=""
                          className="h-14 w-14 object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => updateSpottedRow(row.key, 'imageUrl', '')}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove image
                        </button>
                      </div>
                    )}
                  </div>
                  <label className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-600">Brand</span>
                    <input
                      type="text"
                      value={row.brand ?? ''}
                      onChange={(e) => updateSpottedRow(row.key, 'brand', e.target.value)}
                      placeholder="e.g. Prada"
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-600">Clothing category</span>
                    <input
                      type="text"
                      value={row.clothingCategory ?? ''}
                      onChange={(e) =>
                        updateSpottedRow(row.key, 'clothingCategory', e.target.value)
                      }
                      placeholder="e.g. Dress"
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-600">Colour</span>
                    <input
                      type="text"
                      value={row.colour ?? ''}
                      onChange={(e) => updateSpottedRow(row.key, 'colour', e.target.value)}
                      placeholder="e.g. Black"
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={visitSubmitting || !visitShopId}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {visitSubmitting ? 'Adding…' : 'Add visit'}
          </button>
        </form>
      </section>
    </div>
  )
}
