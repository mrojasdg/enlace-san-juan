'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface BusinessMapProps {
  lat: number;
  lng: number;
  name: string;
  address: string;
  logoUrl?: string;
}

export default function BusinessMap({
  lat,
  lng,
  name,
  address,
  logoUrl,
}: BusinessMapProps) {
  if (!lat || !lng) return null;

  // Custom circular icon with logo
  const customIcon = L.divIcon({
    className:
      'custom-div-icon bg-transparent border-0 flex justify-center items-end',
    html: `
            <div class="relative flex flex-col items-center">
                <div class="w-14 h-14 rounded-full border-[3px] border-white bg-white shadow-lg overflow-hidden flex items-center justify-center relative z-10">
                    ${
                      logoUrl
                        ? `<img src="${logoUrl}" class="w-full h-full object-cover" alt="${name}" />`
                        : `<div class="w-full h-full bg-green text-white flex items-center justify-center font-black text-xl">${name[0]}</div>`
                    }
                </div>
                <div class="w-4 h-4 bg-white rotate-45 -mt-2.5 shadow-md relative z-0"></div>
            </div>
        `,
    iconSize: [56, 60], // Make sure it matches the rendered height
    iconAnchor: [28, 60], // Bottom-center (28 is half of 56 width, 60 is full height)
    popupAnchor: [0, -60], // Above the marker
  });

  return (
    <section className="bg-white rounded-[2.5rem] p-1 border border-border overflow-hidden shadow-2xl h-[400px] relative group">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        className="h-full w-full rounded-[2.3rem]"
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup className="custom-popup">
            <div className="p-2">
              <h4 className="font-outfit font-black text-green-deeper mb-1">
                {name}
              </h4>
              <p className="text-[10px] text-muted font-jakarta">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Map Overlay Button */}
      <div className="absolute bottom-6 right-6 z-[1000]">
        <a
          href={`https://google.com/maps?q=${lat},${lng}`}
          target="_blank"
          className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-green hover:bg-green hover:text-white transition-all transform hover:scale-105"
        >
          Cómo llegar con Maps
        </a>
      </div>
    </section>
  );
}
