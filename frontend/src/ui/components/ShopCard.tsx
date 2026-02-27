import { Link } from 'react-router-dom'
import Tag from '../primitives/Tag'
import type { ComponentProps } from 'react'
import Rating from '../primitives/Rating'
import OpenStatusTag from './OpenStatusTag'
import ImagePlaceholder from '../primitives/ImagePlaceholder'

type TagProps = ComponentProps<typeof Tag>

export default function ShopCard({
  shopId,
  shopName,
  neighbourhood,
  city,
  tags,
  brands,
  rating,
  openingHours,
}: {
  shopId?: number
  shopName: string
  neighbourhood?: string
  city?: string
  tags: TagProps[]
  brands: string[]
  rating: number
  openingHours: Record<string, string>
}) {
  const content = (
    <>
      <ImagePlaceholder className="w-28 h-28 shrink-0 rounded-xl" />

      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-base font-semibold truncate">{shopName}</h4>
            {(neighbourhood || city) && (
              <p className="text-sm text-gray-500">{[neighbourhood, city].filter(Boolean).join(', ')}</p>
            )}
          </div>
          <Rating rating={rating} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tagProps) => (
            <Tag key={tagProps.tagName} {...tagProps} />
          ))}
          <OpenStatusTag shop={{ opening_hours: openingHours }} />
        </div>

        {brands.length > 0 && (
          <p className="text-sm text-gray-500 line-clamp-2">{brands.join(', ')}</p>
        )}
      </div>
    </>
  )

  const className = 'flex gap-4 mt-3'

  if (shopId != null) {
    return (
      <Link to={`/shop/${shopId}`} className={`${className} block hover:opacity-95 transition-opacity`}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
