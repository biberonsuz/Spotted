import { useNavigate } from 'react-router-dom'
import Tag from '../primitives/Tag'
import RoundButton from '../primitives/RoundButton'
import Rating from '../primitives/Rating'
import OpenStatusTag from './OpenStatusTag'
import Dropdown from './Dropdown'

type Shop = {
  id: number
  name: string
  type: string
  opening_hours: Record<string, string>
  address: string
  neighbourhood: string
  city: string
}

interface ShopModalProps {
  shop: Shop
  isVisited: boolean
  onToggleVisited: () => void
  onClose: () => void
}

export default function ShopModal({
  shop,
  isVisited,
  onToggleVisited,
  onClose,
}: ShopModalProps) {
  const navigate = useNavigate()

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl m-4 flex flex-row overflow-hidden rounded-xl bg-white shadow-xl cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/shop/${shop.id}`)
        }}
      >
        <div className="flex-1 p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-medium text-gray-900">{shop.name}</h2>
              <p className="text-sm text-gray-500">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/map?neighbourhood=${encodeURIComponent(shop.neighbourhood)}`)
                  }}
                  className="underline decoration-dotted underline-offset-2 hover:text-blue-700 cursor-pointer"
                  aria-label={`View ${shop.neighbourhood} on the map`}
                >
                  {shop.neighbourhood}
                </button>
                {shop.city ? `, ${shop.city}` : ''}
              </p>
              <div className="mt-2 flex flex-row gap-2">
                <Tag tagName={shop.type} />
                <OpenStatusTag shop={shop} />
              </div>
              <RoundButton highlighted className="mt-2" onClick={onToggleVisited}>
                <span className="material-icons" style={{ fontSize: '18px' }}>
                  {isVisited ? 'check' : 'add'}
                </span>
              </RoundButton>
            </div>
            <div className="scale-150 m-2">
              <Rating rating={8.2} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <span
                className="material-icons text-gray-400"
                style={{ fontSize: '18px', marginTop: '1px' }}
              >
                location_on
              </span>
              <p className="text-sm text-gray-600">{shop.address}</p>
            </div>

            <div className="flex items-start gap-2">
              <span
                className="material-icons text-gray-400"
                style={{ fontSize: '18px', marginTop: '1px' }}
              >
                schedule
              </span>
              <Dropdown label="Opening hours">
                {Object.entries(shop.opening_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between gap-4">
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

