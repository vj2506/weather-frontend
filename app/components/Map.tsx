"use client"
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { fixMapIcon } from '../map-fix'

// This component moves the map view when lat/lon change
function ChangeView({ center }: any) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 10);
    }
  }, [center, map]);
  return null;
}

export default function Map({ lat, lon }: any) {
  useEffect(() => { fixMapIcon() }, [])

  // Ensure lat and lon are treated as numbers
  const position: [number, number] = [Number(lat) || 0, Number(lon) || 0];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        {...({
          center: position,
          zoom: 10,
          style: { height: '100%', width: '100%', borderRadius: '1.5rem' }
        } as any)}
      >
        <TileLayer
          {...({
            url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            attribution: '&copy; OpenStreetMap contributors'
          } as any)}
        />
        
        <Marker {...({ position: position } as any)} />
        
        <ChangeView center={position} />
      </MapContainer>
    </div>
  )
}