import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BusinessForm } from "@/components/admin/BusinessForm";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "Registra tu Negocio | Enlace San Juan",
    description: "Llena el formulario para dar de alta tu empresa en el directorio local de San Juan del Río.",
};

export default async function RegistratePage() {
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .order("name");

    return (
        <div className="min-h-screen bg-[#F9FCFA]">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-green uppercase tracking-[0.3em]">COMENCEMOS</span>
                        <h1 className="font-outfit font-black text-4xl md:text-6xl text-green-deeper leading-tight">Registra tu Empresa</h1>
                        <p className="text-muted font-jakarta text-lg">Únete al directorio más importante de San Juan del Río y comienza a atraer más clientes.</p>
                    </div>

                    {/* Badge muy visible de WhatsApp */}
                    <div className="inline-flex items-center justify-center pt-2 w-full">
                        <a 
                            href="https://wa.me/524273232026?text=Hola,%20me%20gustaría%20registrar%20mi%20empresa%20en%20Enlace%20San%20Juan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-col md:flex-row items-center justify-center gap-3 bg-[#E8F8F0] hover:bg-[#D4F3E2] text-green-deeper px-8 py-3.5 rounded-[2rem] md:rounded-full border border-green/20 font-bold text-xs md:text-sm tracking-wide shadow-md hover:shadow transition-all group duration-300 w-full max-w-2xl text-center md:text-left"
                        >
                            <div className="flex items-center gap-3 whitespace-nowrap">
                                <span className="relative flex h-3.5 w-3.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#25D366]"></span>
                                </span>
                                <span className="font-outfit font-black text-green-deeper">
                                    ¿Prefieres WhatsApp?
                                </span>
                            </div>
                            <span className="text-muted/80 font-normal md:border-l md:border-green/20 md:pl-4 whitespace-nowrap">
                                Regístrate enviando un mensaje al <strong className="text-green font-black font-mono whitespace-nowrap">427 323 2026</strong>
                            </span>
                        </a>
                    </div>
                </div>

                <div id="registro" className="bg-white p-8 md:p-12 rounded-[3rem] border border-border shadow-2xl shadow-green/5">
                    <BusinessForm categories={categories || []} isPublicRegistration={true} />
                </div>
            </div>

            {/* SECCIÓN PROMOCIONAL (NEW EN REGÍSTRATE) */}
            <div className="container mx-auto px-6 max-w-5xl mb-32">
                <div className="bg-gradient-to-r from-green-deeper to-green rounded-[3rem] p-1 shadow-2xl overflow-hidden group">
                    <div className="bg-white rounded-[2.8rem] p-8 md:p-12 relative overflow-hidden h-full">
                        {/* Elementos Decorativos */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-xpale rounded-full blur-3xl opacity-60 -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-xpale rounded-full blur-3xl opacity-40 -ml-32 -mb-32"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                            <div className="flex-1 space-y-6 text-center lg:text-left">
                                <div className="space-y-4">
                                    <span className="inline-block bg-ink text-white px-6 py-2 rounded-full font-black text-[12px] uppercase tracking-[0.3em] shadow-xl">
                                        🔥 PROMO JUNIO
                                    </span>
                                    <h2 className="font-outfit font-black text-4xl md:text-5xl text-ink leading-[1.1] tracking-tight">
                                        Asegura tu presencia <br className="hidden md:block" />
                                        <span className="text-green">Junio + Julio</span>
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-muted font-jakarta text-lg max-w-xl leading-relaxed">
                                        Obtén el <span className="font-black text-ink">Plan Enlace</span> (lo que queda de Junio y todo Julio) +{' '}
                                        <span className="font-black text-ink">Revista Enlace edición Junio</span> por un precio especial.
                                    </p>
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                        <div className="flex items-center gap-2 bg-[#F9FCFA] px-4 py-2.5 rounded-2xl border border-border group-hover:border-green/20 transition-colors">
                                            <CheckCircle2 size={18} className="text-green" />
                                            <span className="text-[11px] font-black text-ink uppercase tracking-wider">
                                                Plan Enlace Vigente
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-[#F9FCFA] px-4 py-2.5 rounded-2xl border border-border group-hover:border-green/20 transition-colors">
                                            <CheckCircle2 size={18} className="text-green" />
                                            <span className="text-[11px] font-black text-ink uppercase tracking-wider">
                                                Revista Junio Incluida
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-auto flex flex-col items-center gap-6 bg-green-xpale/30 p-10 md:px-14 rounded-[2.8rem] border border-green-pale/20 shadow-inner relative group/card">
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/card:opacity-100 transition-opacity rounded-[2.8rem]"></div>
                                <div className="text-center relative z-10">
                                    <p className="text-[11px] font-black text-muted uppercase tracking-[0.3em] mb-2">
                                        Pago Único Especial
                                    </p>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="font-outfit font-black text-7xl text-green-deeper tracking-tighter">
                                            $350
                                        </span>
                                        <span className="font-bold text-muted text-sm uppercase tracking-widest">
                                            MXN
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-black text-green uppercase tracking-[0.2em] mt-6 bg-white px-6 py-3 rounded-full shadow-sm border border-green/5">
                                        Siguiente pago en Agosto
                                    </p>
                                </div>

                                <Link href="#registro" className="w-full relative z-10">
                                    <Button className="w-full h-16 bg-green hover:bg-green-mid text-white border-none rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-green/20 group-hover:scale-105 active:scale-95 transition-all">
                                        Aprovechar Promo
                                        <ArrowRight className="ml-3 w-5 h-5 animate-pulse" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
