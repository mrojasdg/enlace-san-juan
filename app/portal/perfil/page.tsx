'use client';

import React, { useEffect, useState } from 'react';
import { usePortal } from '../layout';
import PortalBusinessForm from '@/components/portal/PortalBusinessForm';
import { supabase } from '@/lib/supabase';
import { Category } from '@/types/business';
import toast from 'react-hot-toast';

export default function PortalProfilePage() {
  const { business } = usePortal();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('order_num', { ascending: true });

        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading || !business) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-green/20 border-t-green rounded-full animate-spin"></div>
        <p className="text-xs text-muted uppercase font-black">Cargando formulario...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1 block mb-1">GESTIÓN DE CONTENIDO</p>
        <p className="text-muted text-xs font-jakarta leading-relaxed max-w-xl">
          Modifica los datos de tu empresa como logo, imágenes de galería, horarios y datos de contacto de forma inmediata.
        </p>
      </div>
      <PortalBusinessForm initialData={business} categories={categories} />
    </div>
  );
}
