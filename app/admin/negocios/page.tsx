'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import {
  PlusCircle,
  Search,
  Edit,
  Eye,
  Trash2,
  Star,
  CheckCircle,
  BarChart3,
  QrCode,
  Download,
} from 'lucide-react';
import { ActivationToggle } from '@/components/admin/ActivationToggle';
import { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10;

export default function AdminBusinessListPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const searchTerm = searchParams.q || '';
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const qrRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('businesses')
        .select(
          'id, name, slug, logo_url, is_active, verified, is_featured, in_magazine, category_id, created_at, views, category:categories(name)',
          { count: 'exact' }
        );

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, count: exactCount } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      setBusinesses(data || []);
      setCount(exactCount || 0);
      setLoading(false);
    };

    fetchBusinesses();
  }, [page, searchTerm]);

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

  const downloadQR = (bizName: string, bizId: string) => {
    const svg = qrRefs.current[bizId];
    if (!svg) {
      toast.error('Error al generar QR');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width + 40; // Añadir padding
      canvas.height = img.height + 40; // Añadir padding

      if (ctx) {
        // Fondo blanco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Dibujar el QR centrado
        ctx.drawImage(img, 20, 20);

        // Convertir a JPG y descargar
        const jpgFile = canvas.toDataURL('image/jpeg', 1.0);
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR-${bizName.replace(/\s+/g, '-')}.jpg`;
        downloadLink.href = jpgFile;
        downloadLink.click();
        toast.success('Código QR Descargado');
      }
    };

    img.src =
      'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <AdminLayout>
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="max-w-xl">
          <h2 className="font-outfit font-black text-4xl text-green-deeper leading-tight mb-4">
            Gestión de <br /> Negocios
          </h2>
          <p className="text-muted font-jakarta text-sm">
            Administra, edita o elimina los establecimientos registrados en el
            directorio municipal.
          </p>
        </div>
        <Link href="/admin/negocios/nuevo">
          <Button className="h-16 px-10 rounded-[2rem] shadow-2xl flex items-center gap-4 text-sm font-black uppercase tracking-widest ring-8 ring-green-xpale">
            <PlusCircle size={24} />
            Registrar nuevo
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar Desktop */}
      <form className="bg-white p-6 rounded-[2.5rem] border border-border shadow-sm mb-12 flex flex-col md:flex-row items-center gap-8 shadow-inner-xl ring-4 ring-green-xpale/20">
        <div className="flex-1 w-full bg-green-xpale/50 rounded-2xl p-2 px-6 flex items-center gap-4">
          <Search size={20} className="text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={searchTerm}
            placeholder="Buscar por nombre..."
            className="bg-transparent border-none outline-none font-bold text-ink w-full placeholder:text-muted/30"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button type="submit" className="h-16 px-8 rounded-xl">
            Buscar
          </Button>
        </div>
      </form>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] border border-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-[#F4FBF5] border-b border-border">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">
                  Negocio & Info
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">
                  Categoría
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">
                  Info & Tráfico
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60 text-center">
                  Estado de Visibilidad
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60 text-right">
                  Acciones y Recursos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center">
                    <div className="w-8 h-8 rounded-full border-4 border-t-green border-green-xpale animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : businesses?.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-10 py-20 text-center text-muted font-jakarta italic text-sm"
                  >
                    No se encontraron negocios con esos criterios.
                  </td>
                </tr>
              ) : (
                businesses?.map((biz) => (
                  <tr
                    key={biz.id}
                    className="group hover:bg-green-xpale/30 transition-all duration-300"
                  >
                    <td className="px-8 py-8 w-[350px]">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-white border border-border shadow-md p-1 relative overflow-hidden flex-shrink-0 group-hover:shadow-xl transition-all">
                          {biz.logo_url ? (
                            <Image
                              src={biz.logo_url}
                              alt={biz.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-green-xpale text-xl">
                              {biz.name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-outfit font-black text-[15px] text-ink leading-none">
                              {biz.name}
                            </p>
                            {biz.verified && (
                              <CheckCircle
                                size={14}
                                className="text-blue-500"
                              />
                            )}
                          </div>
                          <p className="text-[10px] font-black text-muted/40 uppercase tracking-widest leading-none">
                            /{biz.slug}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-[10px] font-black text-green/50 uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                              <Star size={10} />{' '}
                              {biz.is_featured ? 'Featured' : 'Regular'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className="inline-block bg-white border border-border px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-green-mid shadow-sm">
                        {(biz.category as any)?.name || 'Premium'}
                      </span>
                    </td>

                    {/* COLUMNA DE TRÁFICO (VIEWS) */}
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-xpale rounded-xl flex items-center justify-center">
                          <BarChart3 size={20} className="text-green-mid" />
                        </div>
                        <div>
                          <p className="text-ink font-black text-lg font-outfit leading-none">
                            {biz.views || 0}
                          </p>
                          <p className="text-[9px] text-muted font-black uppercase tracking-widest">
                            Visitas Acum.
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* COLUMNA DE ESTADO */}
                    <td className="px-8 py-8">
                      <div className="flex justify-center">
                        <ActivationToggle
                          businessId={biz.id}
                          initialStatus={biz.is_active}
                        />
                      </div>
                    </td>

                    {/* COLUMNA DE ACCIONES */}
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-end gap-2">
                        {/* Código QR Oculto para renderizado limpio */}
                        <div className="hidden">
                          <QRCodeSVG
                            value={`https://enlacesanjuan.com.mx/${biz.slug}`}
                            size={1024}
                            level="H"
                            includeMargin={false}
                            ref={(el) => {
                              if (el) qrRefs.current[biz.id] = el;
                            }}
                          />
                        </div>

                        {/* Botón Descargar QR */}
                        <button
                          onClick={() => downloadQR(biz.name, biz.id)}
                          title="Descargar Código QR (JPG)"
                          className="group w-12 h-12 rounded-2xl bg-black border border-black flex items-center justify-center shadow-lg hover:shadow-2xl hover:bg-gray-800 transition-all relative"
                        >
                          <QrCode
                            size={20}
                            className="text-white group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-green rounded-full flex items-center justify-center border-2 border-white">
                            <Download size={10} className="text-white" />
                          </div>
                        </button>

                        <Link href={`/${biz.slug}`} target="_blank">
                          <button
                            title="Ver Micrositio"
                            className="w-12 h-12 rounded-2xl bg-white border border-border text-muted hover:text-green-mid hover:bg-green-xpale transition-all flex items-center justify-center shadow-sm"
                          >
                            <Eye size={18} />
                          </button>
                        </Link>
                        <Link href={`/admin/negocios/${biz.id}`}>
                          <button
                            title="Editar"
                            className="w-12 h-12 rounded-2xl bg-green-xpale text-green flex items-center justify-center border border-green-pale hover:bg-green hover:text-white transition-all shadow-sm"
                          >
                            <Edit size={18} />
                          </button>
                        </Link>
                        {/* Botón Eliminar (Simulado) */}
                        <button
                          title="Eliminar"
                          className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="bg-[#F4FBF5]/50 px-10 py-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-jakarta text-[11px] font-bold text-muted/60 uppercase tracking-[0.1em]">
            Mostrando {businesses?.length || 0} de {count || 0} negocios
            registrados
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/negocios?page=${Math.max(
                1,
                page - 1
              )}&q=${searchTerm}`}
            >
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-border font-black text-[10px] uppercase tracking-widest text-muted hover:text-green transition-all"
                disabled={page <= 1}
              >
                Anterior
              </Button>
            </Link>
            <div className="flex items-center gap-1 px-4">
              <span className="font-black text-xs text-ink">{page}</span>
              <span className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">
                de {totalPages}
              </span>
            </div>
            <Link
              href={`/admin/negocios?page=${Math.min(
                totalPages,
                page + 1
              )}&q=${searchTerm}`}
            >
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-border font-black text-[10px] uppercase tracking-widest text-muted hover:text-green transition-all"
                disabled={page >= totalPages}
              >
                Siguiente
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
