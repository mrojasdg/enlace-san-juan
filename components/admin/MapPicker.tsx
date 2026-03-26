'use client';

import { useEffect, useRef, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ lat, lng, onChange }: MapPickerProps) {
  const map = useMap();
  const markerRef = useRef<any>(null);

  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const pos = marker.getLatLng();
          onChange(pos.lat, pos.lng);
          map.flyTo(pos, map.getZoom());
        }
      },
    }),
    [onChange, map]
  );

  // Initial center on load if coordinates exist
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return lat && lng ? (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[lat, lng]}
      icon={icon}
      ref={markerRef}
    />
  ) : null;
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const defaultCenter: [number, number] = [20.3889, -100.0039]; // San Juan del Río

  return (
    <div className="h-96 w-full rounded-3xl overflow-hidden border-2 border-border shadow-inner relative z-0">
      <MapContainer
        center={lat && lng ? [lat, lng] : defaultCenter}
        zoom={14}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-border text-[10px] font-black uppercase text-green shadow-xl flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
        Arrastra el pin o haz click para moverlo
      </div>
    </div>
  );
}
