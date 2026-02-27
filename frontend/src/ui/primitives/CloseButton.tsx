export default function CloseButton({
  onClick,
  className = '',
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center w-8 h-8 p-0 rounded-full border-none bg-transparent text-gray-400 cursor-pointer transition-colors hover:text-gray-700 ${className}`}
    >
      <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
    </button>
  )
}
