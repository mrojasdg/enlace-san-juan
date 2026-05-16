"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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

export default function BusinessMap({ lat, lng, name, address, logoUrl }: BusinessMapProps) {
    if (!lat || !lng) return null;

    // Custom circular icon with logo
    const customIcon = L.divIcon({
        className: "custom-div-icon bg-transparent border-0 flex justify-center items-end",
        html: `
            <div class="relative flex flex-col items-center">
                <div class="w-14 h-14 rounded-full border-[3px] border-white bg-white shadow-lg overflow-hidden flex items-center justify-center relative z-10">
                    ${logoUrl
                ? `<img src="${logoUrl}" class="w-full h-full object-cover" alt="${name}" />`
                : `<div class="w-full h-full bg-green text-white flex items-center justify-center font-black text-xl">${name[0]}</div>`
            }
                </div>
                <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-0.5 shadow-md"></div>
            </div>
        `,
        iconSize: [56, 66],
        iconAnchor: [28, 66],
    });

    return (
        <section id="ubicacion" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="font-outfit font-black text-2xl text-green-deeper uppercase tracking-[0.1em] flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green rounded-full" />
                Ubicación
            </h2>
            
            <div className="h-[450px] w-full rounded-[3rem] overflow-hidden border-2 border-border shadow-xl relative z-0">
                <MapContainer
                    center={[lat, lng]}
                    zoom={16}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[lat, lng]} icon={customIcon}>
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h4 className="font-outfit font-black text-ink">{name}</h4>
                                <p className="text-xs text-muted font-jakarta mt-1">{address}</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </section>
    );
}
