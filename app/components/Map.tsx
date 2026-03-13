"use client"
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

function ChangeView({ center }: any) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 0) {
      map.setView(center, 10);
    }
  }, [center, map]);
  return null;
}

export default function Map({ lat, lon }: any) {
  const position: [number, number] = [Number(lat) || 0, Number(lon) || 0];

  return (
    <div style={{ height: '100%', width: '100%', background: '#0f172a' }}>
      <MapContainer 
        {...({
          center: position,
          zoom: 10,
          scrollWheelZoom: false,
          style: { height: '100%', width: '100%' }
        } as any)}
      >
        <TileLayer
          {...({
            url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            attribution: '&copy; OpenStreetMap contributors'
          } as any)}
        />
        
        {/* Using CircleMarker instead of Marker avoids the "Missing Icon" error completely */}
        <CircleMarker 
          {...({
            center: position,
            radius: 8,
            fillColor: "#3b82f6",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          } as any)} 
        />
        
        <ChangeView center={position} />
      </MapContainer>
    </div>
  )
}