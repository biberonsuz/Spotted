export default function ImageThumbnail({
  bgColor = 'bg-gray-100',
}: {
  bgColor?: string
}) {
  return <div className={`aspect-square rounded-xl ${bgColor}`} />
}
