import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

interface ShopMapProps {
  longitude: number
  latitude: number
  zoom?: number
  interactive?: boolean
}

export default function ShopMap({
  longitude,
  latitude,
  zoom = 15,
  interactive = false,
}: ShopMapProps) {
  return (
    <div className="shop-map relative w-full h-full filter saturate-50">
      <Map
        initialViewState={{
          longitude,
          latitude,
          zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/biberonsuz/cmm2hxfyn001e01qt0qljb4h4"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactive={interactive}
      />
    </div>
  )
}

