import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/primitives/Button'
import Input from '../ui/primitives/Input'
import { useAuth } from '../context/AuthContext'

type AuthMode = 'login' | 'register'

interface AuthModalProps {
  mode: AuthMode
  onClose: () => void
}

export default function AuthModal({ mode, onClose }: AuthModalProps) {
  const { login, register } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const title = mode === 'login' ? 'Login' : 'Create an account'
  const subtitle =
    mode === 'login'
      ? 'Welcome back. Sign in to continue.'
      : 'Join the community of vintage lovers.'

  const primaryCta = mode === 'login' ? 'Login' : 'Register'
  const secondaryText =
    mode === 'login'
      ? "Don't have an account?"
      : 'Already have an account?'
  const secondaryLink = mode === 'login' ? 'Register' : 'Login'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')?.toString() ?? ''
    const email = formData.get('email')?.toString() ?? ''
    const password = formData.get('password')?.toString() ?? ''

    setIsSubmitting(true)
    setError(null)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      onClose()
      navigate('/app')
    } catch (err) {
      setError((err as Error).message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-center gap-4">
          <div>
            <h2 className="text-center text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-center mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <Input
              id="name"
              name="name"
              label="Name"
              type="text"
              placeholder="e.g. Alex"
              required
            />
          )}

          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />

          {mode === 'register' && (
            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              required
            />
          )}

          <Button
            type="submit"
            className={`mt-2 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/60 ${isSubmitting ? 'opacity-60 cursor-default' : ''}`}
          >
            {isSubmitting ? 'Working…' : primaryCta}
          </Button>

          {error && <p className="mt-1 text-center text-xs text-red-600">{error}</p>}

          <p className="mt-1 text-center text-xs text-gray-500">
            {secondaryText}{' '}
            <span className="cursor-pointer font-medium text-blue-700 hover:text-blue-800">
              {secondaryLink}
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

