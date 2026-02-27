import { useState } from 'react'

export default function Dropdown({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="text-sm text-gray-600 w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-medium text-gray-700 text-sm cursor-pointer"
      >
        {label}
        <span
          className="material-icons transition-transform duration-200"
          style={{ fontSize: '16px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </div>
      {isOpen && (
        <div className="mt-1">
          {children}
        </div>
      )}
    </div>
  )
}
