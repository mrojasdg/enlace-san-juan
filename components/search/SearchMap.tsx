'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Business } from '@/types/business';
import 'leaflet/dist/leaflet.css';

// Dynamic import for Leaflet components (client-side only)
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Componente para corregir el tamaño del mapa en móviles
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 400); // Un poco más de tiempo para el cambio de flex transition
  }, [map]);
  return null;
};

interface SearchMapProps {
  businesses: Business[];
}

export default function SearchMap({ businesses }: SearchMapProps) {
  const [L, setL] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Import Leaflet directly for icons/constants
    import('leaflet').then((Leaflet) => {
      setL(Leaflet);
      setMounted(true);
    });
  }, []);

  if (!mounted || !L) {
    return (
      <div className="w-full h-full bg-green-xpale flex items-center justify-center text-muted font-jakarta font-bold animate-pulse uppercase tracking-[0.2em] text-xs">
        Configurando mapa interactivo...
      </div>
    );
  }

  // Custom icon creator
  const createCustomIcon = (biz: Business) => {
    return L.divIcon({
      className:
        'custom-marker-container bg-transparent border-0 flex justify-center items-end',
      html: `
        <div class="relative flex flex-col items-center group cursor-pointer">
          <div class="w-12 h-12 rounded-full border-[3px] border-white bg-white shadow-xl overflow-hidden flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 duration-300">
            ${
              biz.logo_url
                ? `<img src="${biz.logo_url}" class="w-full h-full object-cover" />`
                : `<div class="w-full h-full bg-green text-white flex items-center justify-center font-black text-xl">${biz.name[0]}</div>`
            }
          </div>
          <div class="w-4 h-4 bg-white rotate-45 -mt-2.5 shadow-md relative z-0 transition-transform group-hover:scale-110 duration-300"></div>
        </div>
      `,
      iconSize: [48, 52], // 48 is w-12 width, 52 handles height with arrow
      iconAnchor: [24, 52],
      popupAnchor: [0, -52],
    });
  };

  const center: [number, number] = [20.3904, -100.0024]; // San Juan del Río center

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        dragging={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizer />

        {businesses
          .filter((biz) => biz.latitude && biz.longitude)
          .map((biz) => (
            <Marker
              key={biz.id}
              position={[Number(biz.latitude), Number(biz.longitude)]}
              icon={createCustomIcon(biz)}
            >
              <Popup>
                <div className="p-2 max-w-[200px] flex flex-col gap-2">
                  <h4 className="font-outfit font-black text-sm text-green-deeper mb-0 leading-tight">
                    {biz.name}
                  </h4>
                  <p className="font-jakarta text-[11px] text-muted line-clamp-2 leading-relaxed mb-1">
                    {biz.tagline}
                  </p>
                  <a
                    href={`/${biz.slug}`}
                    className="w-full py-2 bg-green !text-white text-[10px] font-bold text-center block rounded-xl hover:bg-green-mid transition-colors uppercase tracking-[0.1em]"
                  >
                    Ver perfil completo
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
