export default function Avatar({
  size = 'w-10 h-10',
  bgColor = 'bg-gray-200',
  imageUrl,
}: {
  size?: string
  bgColor?: string
  imageUrl?: string | null
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={`rounded-full object-cover ${size}`}
      />
    )
  }
  return <div className={`rounded-full ${size} ${bgColor}`} />
}
