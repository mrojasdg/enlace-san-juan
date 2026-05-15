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
