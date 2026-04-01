"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
    LayoutGrid,
    LucideIcon
} from "lucide-react";
import { cn } from "@/utils/cn";

const ICON_MAP: Record<string, LucideIcon> = {
    utensils: Utensils,
    heart: HeartPulse,
    scissors: Scissors,
    bag: ShoppingBag,
    home: Home,
    graduation: GraduationCap,
    briefcase: Briefcase,
    car: Car,
    building: Building,
    calendar: CalendarCheck,
    palette: Palette,
    grid: LayoutGrid,
};

export const CategoryGrid = () => {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('order_num', { ascending: true });
            setCategories(data || []);
        };
        fetchCategories();
    }, []);

    const getIcon = (iconName: string) => {
        const key = iconName?.toLowerCase() || 'grid';
        return ICON_MAP[key] || LayoutGrid;
    };

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
                    {categories.map((cat) => {
                        const IconComponent = getIcon(cat.icon);
                        return (
                            <Link key={cat.slug} href={`/categoria/${cat.slug}`} className="group">
                                <div className="h-full bg-white border border-border rounded-3xl p-6 text-center flex flex-col items-center gap-4 hover:border-green hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-16 h-16 rounded-2xl bg-green-xpale text-green flex items-center justify-center group-hover:bg-green group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                        <IconComponent size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-jakarta font-black text-[13px] text-ink leading-tight mb-1">
                                            {cat.name}
                                        </h3>
                                        <p className="text-[10px] text-muted leading-tight line-clamp-2">
                                          {cat.description || cat.name}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
