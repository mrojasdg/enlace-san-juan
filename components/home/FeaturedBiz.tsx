"use client";

import { Business } from "@/types/business";
import { BusinessCard } from "@/components/business/BusinessCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedBizProps {
    businesses: Business[];
}

export const FeaturedBiz = ({ businesses }: FeaturedBizProps) => {
    return (
        <section id="destacados" className="py-24 px-6 md:px-12 bg-green-xpale">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div className="max-w-2xl">
                        <p className="font-outfit font-black text-xs text-green-mid uppercase tracking-[0.2em] mb-4">
                            Impulsa tu negocio local
                        </p>
                        <h2 className="font-outfit font-black text-4xl md:text-5xl text-green-deeper leading-tight">
                            Los negocios destacados <br />
                            <span className="text-green-mid">del mes</span>
                        </h2>
                        <p className="text-muted text-lg mt-6 font-jakarta leading-relaxed">
                            Descubre las empresas que están marcando la diferencia este mes en San Juan del Río. Calidad y servicio garantizado.
                        </p>
                    </div>
                    <Link href="/buscar?is_featured=true" className="hidden md:block">
                        <Button variant="outline" className="px-8 rounded-full flex items-center gap-2">
                            Ver todos los recomendados
                            <ArrowRight size={18} />
                        </Button>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {businesses && businesses.length > 0 ? (
                        businesses.map((biz) => (
                            <BusinessCard key={biz.id} business={biz} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center opacity-50 bg-white border border-dashed border-border rounded-3xl">
                            <p className="font-jakarta text-muted italic">Cargando sugerencias destacadas...</p>
                        </div>
                    )}
                </div>

                {/* Mobile Button */}
                <div className="mt-12 text-center md:hidden">
                    <Link href="/buscar?is_featured=true">
                        <Button variant="outline" className="w-full rounded-2xl">
                            Ver todos los recomendados
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
