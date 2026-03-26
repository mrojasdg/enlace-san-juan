'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Magazine } from '@/types/magazine';
import {
  PlusCircle,
  Edit2,
  ExternalLink,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RevisaListPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMagazines();
  }, []);

  const monthOrder: Record<string, number> = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  };

  const fetchMagazines = async () => {
    try {
      const { data, error } = await supabase
        .from('magazines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ordenar de forma descendente por año y mes consecutivo
      const sortedData = ((data as Magazine[]) || []).sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return (
          (monthOrder[b.month.toLowerCase()] || 0) -
          (monthOrder[a.month.toLowerCase()] || 0)
        );
      });

      setMagazines(sortedData);
    } catch (error) {
      console.error('Error al cargar revistas:', error);
      toast.error('Error al cargar las revistas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMagazine = async () => {
    const nameInput = window.prompt(
      'Ingresa el nombre o mes de la edición (ej: Enero, Edicion Especial, Demo):',
      ''
    );
    if (nameInput === null) return;

    let month = nameInput.trim() || 'sin-nombre';
    // Slugify basic
    month = month
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    setCreating(true);
    try {
      const date = new Date();
      const year = date.getFullYear();

      // Check if this combination already exists
      const existing = magazines.find(
        (m) => m.year === year && m.month === month
      );
      if (existing) {
        if (
          !window.confirm(
            `La edición '${month} ${year}' ya existe. ¿Deseas crear otra con un sufijo aleatorio?`
          )
        ) {
          setCreating(false);
          return;
        }
        month = `${month}-${Math.floor(Math.random() * 1000)}`;
      }

      const { data, error } = await supabase
        .from('magazines')
        .insert([{ year, month, status: 'draft' }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Revista creada exitosamente');
      router.push(`/admin/revistas/${data.id}`);
    } catch (error) {
      console.error('Error al crear revista:', error);
      toast.error('Error al crear la revista');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit font-black text-3xl text-ink">
            Revistas Digitales
          </h1>
          <p className="text-muted text-sm font-jakarta mt-1">
            Gestiona las ediciones mensuales de la revista interactiva.
          </p>
        </div>
        <Button
          onClick={handleCreateMagazine}
          disabled={creating}
          className="bg-green hover:bg-green-mid rounded-2xl shadow-xl shadow-green/20"
        >
          {creating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4 mr-2" />
          )}
          Crear Revista
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green" />
        </div>
      ) : magazines.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-border">
          <div className="w-16 h-16 bg-green-xpale text-green rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-ink">Sin revistas</h3>
          <p className="text-muted text-sm">
            No has creado ninguna revista digital aún.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {magazines.map((mag) => (
            <div
              key={mag.id}
              className="bg-white rounded-[2rem] p-6 border border-border shadow-sm hover:border-green-pale transition-colors group"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-outfit font-black text-2xl capitalize text-ink">
                    {mag.month} {mag.year}
                  </h3>
                  <div
                    className={`text-[10px] font-bold uppercase tracking-widest mt-2 px-3 py-1 inline-flex rounded-full ${
                      mag.status === 'published'
                        ? 'bg-green-xpale text-green'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {mag.status === 'published' ? 'Publicada' : 'Borrador'}
                  </div>
                </div>
                <BookOpen
                  className={`w-6 h-6 ${
                    mag.status === 'published' ? 'text-green' : 'text-border'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/admin/revistas/${mag.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-border hover:bg-green-xpale hover:text-green hover:border-green-pale text-xs uppercase font-black tracking-widest"
                  >
                    <Edit2 className="w-4 h-4 mr-2" /> Editar
                  </Button>
                </Link>
                {mag.status === 'published' && (
                  <a
                    href={`/revista/${mag.year}/${mag.month}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-12 px-0 rounded-xl border-border hover:bg-ink hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
