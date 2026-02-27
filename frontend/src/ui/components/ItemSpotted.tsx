import ImageThumbnail from '../primitives/ImageThumbnail'

export default function ItemSpotted({
  clothingCategory,
  brand,
  itemColour,
  hasImage = false,
}: {
  clothingCategory?: string
  brand?: string
  itemColour?: string
  hasImage?: boolean
}) {
  return (
    <div className="mb-6 flex min-w-[140px] shrink-0 flex-col gap-2 sm:min-w-[200px]">
      {hasImage && <ImageThumbnail className="w-48 h-48" />}
      <div className="flex gap-2 items-center">
        <div className="text-sm flex gap-1 pl-0 min-w-0">
          {itemColour && <span>{itemColour}</span>}
          {brand && <span>{brand}</span>}
          {clothingCategory && <span>{clothingCategory}</span>}
        </div>
      </div>
      
    </div>
  )
}
