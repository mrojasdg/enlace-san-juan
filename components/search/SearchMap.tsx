"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Business } from "@/types/business";
import "leaflet/dist/leaflet.css";

// Dynamic import for Leaflet components (client-side only)
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

interface SearchMapProps {
    businesses: Business[];
}

export const SearchMap = ({ businesses }: SearchMapProps) => {
    const [L, setL] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Import Leaflet directly for icons/constants
        import("leaflet").then((Leaflet) => {
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
            className: "custom-marker-container bg-transparent border-0 flex justify-center items-end",
            html: `
        <div class="relative flex flex-col items-center group cursor-pointer">
          <div class="w-12 h-12 rounded-full border-[3px] border-white bg-white shadow-xl overflow-hidden flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 duration-300">
            ${biz.logo_url
                    ? `<img src="${biz.logo_url}" class="w-full h-full object-cover" />`
                    : `<div class="w-full h-full bg-green text-white flex items-center justify-center font-black text-xl">${biz.name[0]}</div>`
                }
          </div>
          <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-0.5 shadow-md"></div>
        </div>
      `,
            iconSize: [48, 58],
            iconAnchor: [24, 58],
        });
    };

    return (
        <MapContainer
            center={[20.3889, -99.9961]}
            zoom={14}
            className="w-full h-full"
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {businesses
                .filter((b) => b.latitude != null && b.longitude != null)
                .map((biz) => (
                    <Marker
                        key={biz.id}
                        position={[biz.latitude as number, biz.longitude as number]}
                        icon={createCustomIcon(biz)}
                    >
                        <Popup className="custom-leaflet-popup">
                            <div className="p-2 space-y-3 min-w-[200px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {biz.logo_url && <img src={biz.logo_url} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <h4 className="font-outfit font-black text-ink leading-tight">{biz.name}</h4>
                                        <p className="text-[9px] font-bold text-green uppercase tracking-widest">{biz.category?.name}</p>
                                    </div>
                                </div>
                                <a href={`/${biz.category?.slug}/${biz.slug}`} className="block">
                                    <button className="w-full bg-ink text-white py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-green transition-colors border-none">Ver perfil completo</button>
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
};
