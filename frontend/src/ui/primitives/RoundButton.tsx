export default function RoundButton({
  children,
  className = '',
  onClick,
  highlighted = false,
}: {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  highlighted?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center w-8 h-8 p-0 rounded-full border-[1.5px] bg-transparent cursor-pointer transition-colors ${highlighted ? 'text-blue-700 border-blue-700 hover:bg-blue-50 active:bg-blue-700 active:text-white' : 'text-gray-400 border-gray-200 hover:bg-gray-200 active:bg-gray-200 active:text-white active:border-gray-200'} ${className}`}
    >
      {children}
    </button>
  )
}
