export default function Tag({
  tagName,
  bgColor = 'bg-gray-200',
  textColor = 'text-current',
  icon,
  iconRotation = 0,
}: {
  tagName: string
  bgColor?: string
  textColor?: string
  icon?: string
  iconRotation?: number
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-sm rounded-2xl px-2 py-1 ${bgColor} ${textColor}`}>
      {icon && <span className="material-icons" style={{ fontSize: '14px', transform: iconRotation ? `rotate(${iconRotation}deg)` : undefined }}>{icon}</span>}
      {tagName}
    </span>
  )
}
