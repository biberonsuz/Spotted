const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = window.localStorage.getItem('auth_token') ?? undefined

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new ApiError(text || `Request failed with status ${res.status}`, res.status)
  }

  return (await res.json()) as T
}

async function uploadFile(path: string, file: File): Promise<{ url: string }> {
  const token = window.localStorage.getItem('auth_token') ?? undefined
  const form = new FormData()
  form.append('file', file)
  const headers: HeadersInit = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: form,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const message = typeof data?.error === 'string' ? data.error : `Upload failed (${res.status})`
    throw new ApiError(message, res.status)
  }
  return res.json() as Promise<{ url: string }>
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  uploadImage: (file: File): Promise<string> =>
    uploadFile('/me/upload', file).then((data) => `${API_BASE_URL}${data.url}`),
}

