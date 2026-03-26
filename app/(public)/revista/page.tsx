import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Magazine, MagazinePage } from '@/types/magazine';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export const revalidate = 0;

export async function generateMetadata() {
  return {
    title: 'Revista Digital - Enlace San Juan',
    description:
      'Explora las ediciones mensuales de nuestra revista digital interactiva de San Juan del Río.',
  };
}

// Función auxiliar para ordenar meses
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

export default async function RevistasPage() {
  // 1. Obtener revistas publicadas
  const { data: magazines } = await supabase
    .from('magazines')
    .select('*')
    .eq('status', 'published');

  const publishedMagazines: Magazine[] = magazines || [];

  // 2. Obtener las portadas (page_number = 1) para esas revistas
  const { data: coversData } = await supabase
    .from('magazine_pages')
    .select('*')
    .eq('page_number', 1)
    .in(
      'magazine_id',
      publishedMagazines.map((m) => m.id)
    )
    .not('image_url', 'is', null);

  const covers = (coversData as MagazinePage[]) || [];

  // Combinar revistas con su portada y ordenar
  const magazinesWithCovers = publishedMagazines
    .map((mag) => ({
      ...mag,
      cover: covers.find((c) => c.magazine_id === mag.id)?.image_url || null,
    }))
    .sort((a, b) => {
      // Orden consecutivo: Año descendente, Mes descendente
      if (a.year !== b.year) return b.year - a.year;
      return (
        (monthOrder[b.month.toLowerCase()] || 0) -
        (monthOrder[a.month.toLowerCase()] || 0)
      );
    });

  const whatsappNumber = '524272195971';
  const whatsappMessage = encodeURIComponent(
    '¡Hola! Quiero ser parte de la revista digital.'
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#F9FCFA]">
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Cabecera */}
        <div className="container mx-auto px-6 max-w-7xl mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="bg-green-xpale text-green px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-flex items-center gap-2 border border-green/20">
              <BookOpen size={12} />
              EDICIONES MENSUALES
            </span>
            <h1 className="text-5xl md:text-7xl font-black font-outfit text-ink tracking-tight">
              Revista <span className="text-green">Digital</span>
            </h1>
            <p className="text-lg text-muted font-jakarta max-w-xl mx-auto">
              Explora la mejor guía de negocios, servicios y promociones
              exclusivas de San Juan del Río en un formato interactivo premium.
            </p>
          </div>
        </div>

        {/* Listado de Revistas */}
        <div className="container mx-auto px-6 max-w-7xl mb-32">
          {magazinesWithCovers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
              {magazinesWithCovers.map((mag) => (
                <Link
                  key={mag.id}
                  href={`/revista/${mag.year}/${mag.month}`}
                  target="_blank"
                  className="group flex flex-col"
                >
                  <div className="relative w-full aspect-[9/16] bg-white rounded-[2rem] overflow-hidden border border-border shadow-lg transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:shadow-green/10 group-hover:border-green-pale">
                    {mag.cover ? (
                      <img
                        src={mag.cover}
                        alt={`Portada ${mag.month} ${mag.year}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center flex-col gap-4 text-muted/20">
                        <BookOpen className="w-12 h-12" />
                        <span className="text-xs font-black uppercase tracking-widest">
                          Sin Portada
                        </span>
                      </div>
                    )}

                    {/* Overlay Hover */}
                    <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button className="bg-white text-ink hover:bg-white hover:scale-105 transition-all rounded-2xl font-black uppercase text-[10px] tracking-widest px-6 h-12 shadow-2xl">
                        Leer Ahora
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 px-2">
                    <h3 className="text-xl font-black font-outfit uppercase text-ink group-hover:text-green transition-colors">
                      {mag.month}
                    </h3>
                    <p className="text-muted font-bold tracking-widest text-xs uppercase">
                      {mag.year}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-border shadow-sm">
              <BookOpen className="w-16 h-16 text-muted/20 mx-auto mb-6" />
              <h3 className="text-2xl font-outfit font-black text-ink mb-2">
                Próximamente nuevas ediciones
              </h3>
              <p className="text-muted font-jakarta">
                Estamos preparando el contenido del próximo mes para ti.
              </p>
            </div>
          )}
        </div>

        {/* Sección de Beneficios & Call to Action */}
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-white rounded-[3.5rem] border border-border p-8 md:p-16 relative overflow-hidden shadow-xl">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-green-xpale opacity-30 select-none pointer-events-none -skew-x-12 translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-center">
              <div className="flex-1 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black font-outfit text-ink leading-tight">
                    ¿Por qué aparecer en la <br />{' '}
                    <span className="text-green underline decoration-green/20 underline-offset-8">
                      Revista Digital
                    </span>
                    ?
                  </h2>
                  <p className="text-muted font-jakarta text-lg">
                    Más que un anuncio, es una experiencia interactiva que
                    conecta tu marca con miles de personas de forma directa y
                    elegante.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <TrendingUp className="w-5 h-5" />,
                      title: 'Exposición Total',
                      text: 'Visibilidad garantizada para tu negocio las 24 horas del día.',
                    },
                    {
                      icon: <Users className="w-5 h-5" />,
                      title: 'Botones Directos',
                      text: 'Visualiza el perfil en el directorio general.',
                    },
                    {
                      icon: <CheckCircle2 className="w-5 h-5" />,
                      title: 'Diseño personalizado',
                      text: 'Si no tienes un diseño nosotros te apoyamos a crearlo.',
                    },
                    {
                      icon: <BookOpen className="w-5 h-5" />,
                      title: 'Multiplataforma',
                      text: 'Visualización perfecta en celulares, tablets y computadoras.',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-5 p-6 rounded-3xl bg-green-xpale/20 border border-green-pale/10 hover:bg-white hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green shadow-sm border border-border">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-outfit font-black text-ink uppercase text-[11px] tracking-widest mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted font-jakarta leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Aviso de Apartado - Fuera de la cuadrícula para ancho total */}
                <div className="bg-green-xpale/50 border border-green-pale/30 rounded-[2.5rem] p-8 md:p-10 text-ink relative overflow-hidden mt-10">
                  <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green shadow-sm border border-border">
                      <Calendar size={32} />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h4 className="font-outfit font-black text-xl uppercase tracking-wider">
                        ¡Asegura tu Espacio!
                      </h4>
                      <p className="text-muted text-sm font-jakarta leading-relaxed">
                        Tienes hasta el{' '}
                        <strong className="text-green">
                          día 25 de cada mes
                        </strong>{' '}
                        para apartar tu espacio y enviar tu publicidad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-[420px] bg-green-xpale/30 rounded-[3rem] p-10 border border-green-pale/20 text-center space-y-8 flex flex-col justify-center py-16">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black font-outfit text-ink uppercase tracking-tight">
                    Anúnciate con nosotros
                  </h3>
                  <p className="text-muted text-sm font-jakarta">
                    Ya con tu mensualidad del plan enlace agrega 249 pesos y
                    decide en qué mes quieres anunciarte.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-border shadow-sm">
                    <p className="text-2xl font-black text-ink font-outfit">
                      $249{' '}
                      <span className="text-[10px] text-muted">
                        IVA Incluido
                      </span>
                    </p>
                    <p className="text-[9px] font-black text-green uppercase tracking-widest mt-1">
                      Costo extra por edición
                    </p>
                  </div>
                  <Link
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full h-16 bg-green hover:bg-green-mid text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-green/20 group">
                      Publicar mi Empresa
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                  Atención personalizada vía WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
