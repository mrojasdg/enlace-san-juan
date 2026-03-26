"use client";

import Link from "next/link";
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
import { cn } from "@/utils/cn";

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
        <section id="categorias" className="py-24 px-6 md:px-12 bg-white">
            <div className="container mx-auto">
                {/* Eyebrow */}
                <div className="text-center mb-12">
                    <p className="font-outfit font-black text-xs text-green-mid uppercase tracking-[0.25em] mb-4">
                        Explorar por categoría
                    </p>
                    <h2 className="font-outfit font-black text-4xl md:text-5xl text-green-deeper mb-6">
                        ¿Qué estás buscando hoy?
                    </h2>
                    <div className="w-16 h-1.5 bg-green rounded-full mx-auto" />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {categories.map((cat) => (
                        <Link key={cat.slug} href={`/categoria/${cat.slug}`} className="group">
                            <div className="h-full bg-white border border-border rounded-3xl p-6 text-center flex flex-col items-center gap-4 hover:border-green hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 rounded-2xl bg-green-xpale text-green flex items-center justify-center group-hover:bg-green group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                    <cat.icon size={32} />
                                </div>
                                <div>
                                    <h3 className="font-jakarta font-black text-[13px] text-ink leading-tight mb-1">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[10px] text-muted leading-tight line-clamp-2">
                                        {cat.sub}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
