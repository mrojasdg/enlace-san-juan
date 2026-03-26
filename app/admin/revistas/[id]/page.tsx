'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Magazine, MagazinePage } from '@/types/magazine';
import {
  Copy,
  UploadCloud,
  Link as LinkIcon,
  Trash2,
  Eye,
  ExternalLink,
  Loader2,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function EditMagazinePage({
  params,
}: {
  params: { id: string };
}) {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [pages, setPages] = useState<MagazinePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Config controls
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Refs for file uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPage, setUploadingPage] = useState<number | null>(null);

  // Initial structure 42 pages
  const TOTAL_PAGES = 42;

  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchMagazine();
    }
  }, [params.id]);

  const fetchMagazine = async () => {
    try {
      const { data: mag, error: magError } = await supabase
        .from('magazines')
        .select('*')
        .eq('id', params.id)
        .single();

      if (magError) throw magError;

      setMagazine(mag);
      setYear(mag.year);
      setMonth(mag.month);
      setStatus(mag.status);

      const { data: pgs, error: pgsError } = await supabase
        .from('magazine_pages')
        .select('*')
        .eq('magazine_id', params.id)
        .order('page_number', { ascending: true });

      if (pgsError) throw pgsError;
      setPages(pgs || []);
    } catch (error) {
      console.error('Error fetching magazine:', error);
      toast.error('Error al cargar la revista');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMagazineInfo = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('magazines')
        .update({ year, month, status })
        .eq('id', params.id);
      if (error) throw error;
      toast.success('Información guardada');
      fetchMagazine();
    } catch (error) {
      console.error('Error setting mag info', error);
      toast.error('Error al guardar la información');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    pageNum: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPage(pageNum);
    toast.loading(`Subiendo página ${pageNum}...`, { id: 'upload' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${params.id}_page_${pageNum}_${Date.now()}.${fileExt}`;
      const filePath = `magazines/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('magazines')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('magazines').getPublicUrl(filePath);

      // Update or Insert the page
      const existingPage = pages.find((p) => p.page_number === pageNum);

      if (existingPage) {
        const { error: updateError } = await supabase
          .from('magazine_pages')
          .update({ image_url: publicUrl })
          .eq('id', existingPage.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('magazine_pages')
          .insert([
            {
              magazine_id: params.id,
              page_number: pageNum,
              image_url: publicUrl,
            },
          ]);
        if (insertError) throw insertError;
      }

      toast.success(`Página ${pageNum} subida con éxito`, { id: 'upload' });
      fetchMagazine();
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al subir la imagen', { id: 'upload' });
    } finally {
      setUploadingPage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePageDetailUpdate = async (
    pageNum: number,
    field: 'business_name' | 'business_link',
    value: string
  ) => {
    const existingPage = pages.find((p) => p.page_number === pageNum);
    if (!existingPage) {
      toast.error('Sube una imagen primero antes de poner enlaces');
      return;
    }

    try {
      const { error } = await supabase
        .from('magazine_pages')
        .update({ [field]: value })
        .eq('id', existingPage.id);

      if (error) throw error;

      // Only show toast if user blur out or pressed enter (handled by UI, but we'll re-fetch state silently)
      const updatedPages = pages.map((p) =>
        p.id === existingPage.id ? { ...p, [field]: value } : p
      );
      setPages(updatedPages);
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar detalle');
    }
  };

  const handleDeletePage = async (pageNum: number) => {
    if (!confirm(`¿Seguro que deseas eliminar la página ${pageNum}?`)) return;

    const existingPage = pages.find((p) => p.page_number === pageNum);
    if (!existingPage) return;

    try {
      const { error } = await supabase
        .from('magazine_pages')
        .delete()
        .eq('id', existingPage.id);
      if (error) throw error;
      toast.success('Página eliminada');
      fetchMagazine();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar la página');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green" />
      </div>
    );

  // Generate array 1..42
  const allPages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div>
          <h1 className="font-outfit font-black text-2xl text-ink uppercase">
            Editor de Revista
          </h1>
          <p className="text-muted text-xs font-jakarta mt-1 tracking-widest">
            SUBE IMÁGENES EN ALTA 9:16 (Baja resolución recomendada para web)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            value={month}
            onChange={(e) =>
              setMonth(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, '-')
                  .replace(/-+/g, '-')
              )
            }
            placeholder="Nombre de edición (URL)"
            className="h-12 px-4 rounded-xl border border-border text-sm font-bold bg-gray-50 uppercase tracking-widest text-ink focus:border-green outline-none min-w-[200px]"
          />

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-12 px-4 rounded-xl border border-border text-sm w-24 font-bold bg-gray-50 focus:border-green outline-none"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-12 px-4 rounded-xl border border-border text-sm font-bold font-jakarta bg-gray-50 uppercase tracking-widest text-ink focus:border-green outline-none"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicada</option>
          </select>

          <Button
            onClick={handleSaveMagazineInfo}
            disabled={saving}
            className="h-12 bg-ink hover:bg-black rounded-xl"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Configurar
          </Button>

          <a
            href={`/revista/${year}/${month}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="h-12 bg-green hover:bg-green-mid rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-green/20">
              <Eye className="w-4 h-4 mr-2" />
              Previsualizar Publicación
            </Button>
          </a>
        </div>
      </div>

      {status === 'published' && (
        <div className="bg-green-xpale border border-green-pale p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-green uppercase tracking-widest mb-1">
              Enlace de publicación activo
            </p>
            <a
              href={`/revista/${year}/${month}`}
              target="_blank"
              className="font-mono text-sm text-green-deeper font-black"
            >
              enlacesanjuan.com.mx/revista/{year}/{month}
            </a>
          </div>
        </div>
      )}

      {/* Grid 42 Pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
        {allPages.map((pageNum) => {
          const pageData = pages.find((p) => p.page_number === pageNum);
          const isCover = pageNum === 1;
          const isBackCover = pageNum === 42;
          let label = `Página ${pageNum}`;
          if (isCover) label = 'Portada #1';
          if (isBackCover) label = 'Contraportada #42';

          return (
            <div
              key={pageNum}
              className="bg-white rounded-2xl border-2 border-border border-dashed hover:border-green-pale transition-all p-4 flex flex-col group relative"
            >
              {uploadingPage === pageNum && (
                <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-green" />
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    isCover || isBackCover ? 'text-green' : 'text-muted'
                  }`}
                >
                  {label}
                </span>
                {pageData && (
                  <button
                    onClick={() => handleDeletePage(pageNum)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative aspect-[9/16] bg-gray-50 rounded-xl overflow-hidden mb-4 border border-border group-hover:shadow-md transition-shadow">
                {pageData?.image_url ? (
                  <Image
                    src={pageData.image_url}
                    alt={`Page ${pageNum}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <UploadCloud className="w-8 h-8" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">
                      Subir Imagen JPG 9:16
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(e, pageNum)}
                  title={`Subir imagen para la página ${pageNum}`}
                />
              </div>

              {/* Metadata */}
              <div className="flex flex-col gap-2 mt-auto">
                <input
                  type="text"
                  placeholder="Nombre del negocio"
                  className="w-full text-xs p-2 rounded-lg bg-gray-50 border border-border focus:border-green outline-none font-bold"
                  defaultValue={pageData?.business_name || ''}
                  onBlur={(e) =>
                    handlePageDetailUpdate(
                      pageNum,
                      'business_name',
                      e.target.value
                    )
                  }
                />
                <div className="relative">
                  <LinkIcon className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="url"
                    placeholder="Enlace del micrositio"
                    className="w-full text-[10px] p-2 pl-7 rounded-lg bg-gray-50 border border-border focus:border-green outline-none font-mono"
                    defaultValue={pageData?.business_link || ''}
                    onBlur={(e) =>
                      handlePageDetailUpdate(
                        pageNum,
                        'business_link',
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Hidden native input */}
      <input type="file" ref={fileInputRef} className="hidden" />
    </div>
  );
}
