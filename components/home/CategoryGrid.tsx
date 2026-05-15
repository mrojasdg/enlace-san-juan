"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    Utensils,
    HeartPulse,
    Scissors,
    ShoppingBag,
    Home,
    GraduationCap,
    Briefcase,
    Car,
    Building,
    CalendarCheck,
    Palette,
    LayoutGrid
} from "lucide-react";

const categories = [
    { name: "Gastronomía", slug: "gastronomia", icon: Utensils, sub: "Restaurantes, Cafés, Bares" },
    { name: "Salud & Bienestar", slug: "salud", icon: HeartPulse, sub: "Clínicas, Médicos, Gyms" },
    { name: "Belleza & Cuidado", slug: "belleza", icon: Scissors, sub: "Peluquerías, Spa, Barbería" },
    { name: "Tiendas & Retail", slug: "retail", icon: ShoppingBag, sub: "Ropa, Accesorios, Super" },
    { name: "Servicios al Hogar", slug: "hogar", icon: Home, sub: "Mantenimiento, Jardinería" },
    { name: "Educación", slug: "educacion", icon: GraduationCap, sub: "Escuelas, Cursos, Talleres" },
    { name: "Servicios Profesionales", slug: "profesionales", icon: Briefcase, sub: "Abogados, Diseño, Tech" },
    { name: "Automotriz", slug: "automotriz", icon: Car, sub: "Talleres, Llantas, Venta" },
    { name: "Inmobiliario", slug: "inmobiliario", icon: Building, sub: "Bienes Raíces, Renta" },
    { name: "Eventos & Entretenimiento", slug: "eventos", icon: CalendarCheck, sub: "Fiestas, Salones, DJ" },
    { name: "Artesanías & Cultura", slug: "artesanias", icon: Palette, sub: "Arte local, Museo" },
    { name: "Otros Servicios", slug: "otros", icon: LayoutGrid, sub: "Lavanderías, Varios" },
];

export const CategoryGrid = () => {
    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <div className="container max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-[10px] font-black text-green uppercase tracking-[0.2em]">EXPLORA</span>
                    <h2 className="font-outfit font-black text-3xl md:text-5xl text-green-deeper leading-tight">Encuentra lo que buscas</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <Link 
                            key={cat.slug} 
                            href={`/${cat.slug}`}
                            className="group bg-[#F9FCFA] border border-border p-8 rounded-3xl hover:border-green-pale hover:shadow-xl transition-all flex items-start gap-6"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-green group-hover:bg-green group-hover:text-white transition-all shadow-sm flex-shrink-0">
                                <cat.icon size={26} />
                            </div>
                            <div>
                                <h3 className="font-outfit font-black text-xl text-ink mb-1 group-hover:text-green transition-colors">{cat.name}</h3>
                                <p className="text-muted text-xs font-jakarta">{cat.sub}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
