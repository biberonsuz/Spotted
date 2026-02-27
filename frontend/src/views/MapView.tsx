import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import ShopModal from '../ui/components/ShopModal'
import { useShops } from '../hooks/useShops'
import type { Shop } from '../types/shop'
import { useVisitedShops } from '../context/VisitedShopsContext'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function MapView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { shops, loading } = useShops()
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const { visitedIds, toggleVisited } = useVisitedShops()

  const shopParam = searchParams.get('shop')
  const neighbourhoodParam = searchParams.get('neighbourhood')

  const defaultViewState = {
    longitude: -0.0718,
    latitude: 51.5221,
    zoom: 14,
  }

  const shopFromParam = useMemo<Shop | null>(() => {
    if (!shopParam || !shops) return null
    return shops.find((s) => s.name === shopParam) ?? null
  }, [shopParam, shops])

  const activeSelectedShop = selectedShop ?? shopFromParam

  const neighbourhoodCenter = useMemo(() => {
    if (!neighbourhoodParam || !shops) return null
    const inNeighbourhood = shops.filter(
      (shop) => shop.neighbourhood === neighbourhoodParam,
    )
    if (inNeighbourhood.length === 0) return null

    const { latitude, longitude } = inNeighbourhood.reduce(
      (acc, shop) => ({
        latitude: acc.latitude + shop.coordinates.latitude,
        longitude: acc.longitude + shop.coordinates.longitude,
      }),
      { latitude: 0, longitude: 0 },
    )

    return {
      latitude: latitude / inNeighbourhood.length,
      longitude: longitude / inNeighbourhood.length,
    }
  }, [neighbourhoodParam, shops])

  const [viewState, setViewState] = useState(defaultViewState)

  useEffect(() => {
    if (neighbourhoodCenter) {
      setViewState((prev) => ({
        ...prev,
        longitude: neighbourhoodCenter.longitude,
        latitude: neighbourhoodCenter.latitude,
      }))
    } else {
      setViewState((prev) => ({
        ...prev,
        longitude: defaultViewState.longitude,
        latitude: defaultViewState.latitude,
      }))
    }
  }, [neighbourhoodCenter, defaultViewState.longitude, defaultViewState.latitude])

  const closeModal = () => {
    setSelectedShop(null)
    if (shopParam) setSearchParams({})
  }

  return (
    <Map
      viewState={viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/biberonsuz/cmm2hxfyn001e01qt0qljb4h4"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {loading && (
        <div className="absolute top-2 left-2 rounded bg-white/80 px-3 py-1 text-xs text-gray-700 shadow">
          Loading shops…
        </div>
      )}
      {shops?.map((shop) => (
        <Marker
          key={shop.name}
          longitude={shop.coordinates.longitude}
          latitude={shop.coordinates.latitude}
          anchor="bottom"
        >
          <span
            className="material-icons cursor-pointer text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontSize: '28px' }}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedShop(shop)
            }}
          >
            place
          </span>
        </Marker>
      ))}

      {activeSelectedShop && (
        <ShopModal
          shop={activeSelectedShop}
          isVisited={visitedIds.has(activeSelectedShop.id)}
          onToggleVisited={() => toggleVisited(activeSelectedShop.id)}
          onClose={closeModal}
        />
      )}
    </Map>
  )
}
