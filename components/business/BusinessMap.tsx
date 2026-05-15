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
