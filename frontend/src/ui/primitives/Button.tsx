export default function Button({
  children,
  className = '',
  onClick,
  type = 'button',
  highlighted = false,
}: {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  highlighted?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl border-[1.5px] px-4 py-2 text-base font-medium font-inherit cursor-pointer transition-colors focus:outline-2 focus:outline-blue-500 ${highlighted ? 'text-blue-700 border-blue-700 hover:bg-blue-50 active:bg-blue-700 active:text-white' : 'border-gray-200 hover:bg-gray-200 active:bg-gray-200 active:text-white active:border-gray-200'} ${className}`}
    >
      {children}
    </button>
  )
}
