export default function ImagePlaceholder({
  bgColor = 'bg-gray-100',
  className = '',
}: {
  bgColor?: string
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center ${bgColor} ${className}`}>
      <span className="material-icons text-gray-300" style={{ fontSize: '48px' }}>image</span>
    </div>
  )
}
