"use client"
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { fixMapIcon } from '../map-fix'

// This sub-component moves the map when you search a new city
function ChangeView({ center }: any) {
  const map = useMap();
  map.setView(center, 10);
  return null;
}

export default function Map({ lat, lon }: any) {
  useEffect(() => { fixMapIcon() }, [])

  return (
    <MapContainer center={[lat, lon]} zoom={10} style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}>
      {/* Professional Dark Map Style */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[lat, lon]} />
      <ChangeView center={[lat, lon]} />
    </MapContainer>
  )
}