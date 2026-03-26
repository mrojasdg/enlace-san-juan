'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Business } from '@/types/business';
import 'leaflet/dist/leaflet.css';

// Dynamic import for Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

interface SearchMapProps {
  businesses: Business[];
}

export const SearchMap = ({ businesses }: SearchMapProps) => {
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
    <div className="w-full h-full relative cursor-crosshair">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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

      {/* Floating Checkbox */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-fit">
        <label className="bg-white/95 backdrop-blur-md shadow-2xl border border-border px-8 py-3 rounded-full flex items-center gap-4 cursor-pointer hover:scale-105 transition-all duration-300">
          <div className="relative w-6 h-6 border-2 border-green-xpale bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="w-full h-full bg-green text-white scale-0 peer-checked:scale-100 transition-transform duration-200 flex items-center justify-center">
              <span className="text-[10px] font-black">✓</span>
            </div>
          </div>
          <span className="text-xs font-black font-jakarta text-ink2 uppercase tracking-[0.15em] whitespace-nowrap">
            Buscar mientras muevo el mapa
          </span>
        </label>
      </div>

      {/* Map Legend / Branding */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-green-deeper text-white px-6 py-4 rounded-3xl shadow-2xl border border-white/10 hidden md:block">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-green-light font-black text-xs">JS</span>
          </div>
          <div>
            <h5 className="font-outfit font-black text-[11px] uppercase tracking-widest leading-none mb-1">
              Mapa de Negocios
            </h5>
            <p className="text-[10px] text-white/40 leading-none">
              San Juan del Río, Qro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
