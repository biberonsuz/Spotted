import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/app', label: 'Home' },
  { to: '/app/map', label: 'Map' },
  { to: '/app/profile', label: 'Profile' },
]

export default function NavigationComponent() {
  const { pathname } = useLocation()

  return (
    <nav className="bottom-0 border-t border-gray-200">
      <ul className="flex w-full max-w-xs flex-row items-center justify-between p-4 mx-auto">
        {links.map(({ to, label }) => {
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
