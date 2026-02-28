import { useState, useEffect, useRef } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { patchMe, type PatchMePayload } from '../api/me'
import { apiClient } from '../api/client'
import { ApiError } from '../api/client'
import Avatar from '../ui/primitives/Avatar'

export default function SettingsView() {
  const { user, refreshUser } = useCurrentUser()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setUsername(user.username ?? '')
      setAvatarUrl(user.avatarUrl ?? null)
    }
  }, [user?.id, user?.name, user?.username, user?.avatarUrl])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await apiClient.uploadImage(file)
      setAvatarUrl(url)
    } catch {
      setError('Image upload failed. Try another image (max 5MB, JPEG/PNG/WebP/GIF).')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)
    try {
      const payload: PatchMePayload = {
        name: name.trim() || undefined,
        username: username.trim() || null,
        avatarUrl: avatarUrl ?? null,
      }
      await patchMe(payload)
      await refreshUser()
      setSuccess(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col gap-6 p-4 mb-24">
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 p-4 mb-24">
      <h2 className="text-xl font-semibold">Settings</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            Settings saved.
          </p>
        )}

        <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
          <h3 className="text-lg font-medium">Profile</h3>

          <div className="flex items-center gap-4">
            <Avatar size="w-20 h-20" imageUrl={avatarUrl} />
            <div className="flex flex-col gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarChange}
                disabled={uploading}
                className="text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && <span className="text-xs text-gray-500">Uploading…</span>}
              <span className="text-xs text-gray-500">Max 5MB. JPEG, PNG, WebP or GIF.</span>
            </div>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-xs text-gray-500">Letters, numbers and underscore only. 2–50 characters. Shown as @username.</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-fit"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
