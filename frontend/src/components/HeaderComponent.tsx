import { Link } from 'react-router-dom'
import Button from '../ui/primitives/Button'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export default function HeaderComponent({
  onLoginClick,
  onRegisterClick,
}: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="font-medium text-left h-16 top-0 position-sticky flex w-full max-w-5xl flex-row items-center justify-between p-4 mx-auto">
      <Link to="/" className="text-2xl font-medium no-underline text-inherit">Spotted<span className="tracking-[-0.15em]">●●</span></Link>
      <nav>
        {user ? (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="hidden sm:inline">
              {user.name ?? user.email}
            </span>
            <Button
              onClick={logout}
              className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:border-red-500 hover:text-red-600"
            >
              Logout
            </Button>
          </div>
        ) : (
          <ul className="flex flex-row items-center justify-between gap-3">
            <li>
              <Button
                onClick={onRegisterClick}
                className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:border-blue-600 hover:text-blue-700"
              >
                Register
              </Button>
            </li>
            <li>
              <Button
                onClick={onLoginClick}
                className="rounded-full border border-gray-300 bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:border-blue-600 hover:text-blue-700"
              >
                Login
              </Button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  )
}

