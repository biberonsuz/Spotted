export default function Avatar({
  size = 'w-10 h-10',
  bgColor = 'bg-gray-200',
}: {
  size?: string
  bgColor?: string
}) {
  return <div className={`rounded-full ${size} ${bgColor}`} />
}
