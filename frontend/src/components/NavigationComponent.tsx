import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/app', label: 'Home' },
  { to: '/app/map', label: 'Map' },
  { to: '/app/search', label: 'Search' },
  { to: '/app/profile', label: 'Profile' },
]

export default function NavigationComponent() {
  const { pathname } = useLocation()

  return (
    <nav className="bottom-0 border-t border-gray-200">
      <ul className="flex w-full max-w-sm flex-row items-center justify-between p-4 mx-auto gap-2">
        {links.slice(0, 2).map(({ to, label }) => {
          const isActive = pathname === to
          return (
            <li key={to}>
              <Link
                to={to}
                className={
                  isActive
                    ? 'font-semibold text-blue-700'
                    : 'text-gray-500 hover:text-blue-600'
                }
              >
                {label}
              </Link>
            </li>
          )
        })}
        <li>
          <Link
            to="/app/add"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
            aria-label="Add"
          >
            <span className="material-icons" style={{ fontSize: '24px' }}>
              add
            </span>
          </Link>
        </li>
        {links.slice(2).map(({ to, label }) => {
          const isActive = pathname === to
          return (
            <li key={to}>
              <Link
                to={to}
                className={
                  isActive
                    ? 'font-semibold text-blue-700'
                    : 'text-gray-500 hover:text-blue-600'
                }
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
