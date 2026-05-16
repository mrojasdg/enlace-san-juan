import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BusinessForm } from "@/components/admin/BusinessForm";
import { supabase } from "@/lib/supabase";

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
                <div className="text-center space-y-4">
                    <span className="text-[10px] font-black text-green uppercase tracking-[0.3em]">COMENCEMOS</span>
                    <h1 className="font-outfit font-black text-4xl md:text-6xl text-green-deeper leading-tight">Registra tu Empresa</h1>
                    <p className="text-muted font-jakarta text-lg">Únete al directorio más importante de San Juan del Río y comienza a atraer más clientes.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-border shadow-2xl shadow-green/5">
                    <BusinessForm categories={categories || []} isPublicRegistration={true} />
                </div>
            </div>

            <Footer />
        </div>
    );
}
