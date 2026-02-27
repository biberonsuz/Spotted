function getRatingColors(rating: number): { border: string; text: string } {
  if (rating >= 7) return { border: 'border-green-600', text: 'text-green-600' }
  if (rating >= 4) return { border: 'border-yellow-800', text: 'text-yellow-800' }
  return { border: 'border-red-800', text: 'text-red-800' }
}

export default function Rating({ rating }: { rating: number }) {
  const { border, text } = getRatingColors(rating)

  return (
    <span className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-full border-[1.5px] bg-transparent text-sm font-medium ${border} ${text}`}>
      {rating}
    </span>
  )
}
