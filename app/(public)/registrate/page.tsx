import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BusinessForm } from '@/components/admin/BusinessForm';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Registra tu Negocio | Enlace San Juan',
  description:
    'Llena el formulario para dar de alta tu empresa en el directorio local de San Juan del Río.',
};

export const revalidate = 0;

export default async function RegistratePage() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order_num', { ascending: true });

  return (
    <div className="min-h-screen pt-20 bg-[#F9FCFA]">
      <Navbar />

      <main className="container max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <span className="bg-green-xpale text-green px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-flex items-center gap-2 border border-green/20">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
            ÚNETE AL DIRECTORIO
          </span>
          <h1 className="font-outfit font-black text-4xl md:text-5xl text-green-deeper leading-tight">
            Registra tu negocio
          </h1>
          <p className="text-muted font-jakarta text-lg">
            Llena el siguiente formulario con la información de tu empresa.{' '}
            <br className="hidden sm:block" />
            Nosotros nos encargaremos de armar tu micrositio para que miles de
            sanjuanenses te encuentren fácilmente.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl p-8 lg:p-12 mb-20 border border-border">
          <BusinessForm
            categories={categories || []}
            isPublicRegistration={true}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
