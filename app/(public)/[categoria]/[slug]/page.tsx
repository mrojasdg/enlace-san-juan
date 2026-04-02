import { Business } from '@/types/business';
import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Pin as Pinterest,
  Linkedin,
  Music2 as Tiktok,
  Share2,
  FileText,
  ChevronRight,
  MessageCircle,
  Layers,
  CreditCard,
  Banknote,
  Receipt,
  Bike,
  ShoppingBag,
  CalendarCheck,
  Car,
  Wifi,
  Snowflake,
  Dog,
  Gamepad2,
} from 'lucide-react';
import { isOpenNow } from '@/utils/schedule';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CTASection } from '@/components/home/CTASection';
import { ViewTracker } from '@/components/business/ViewTracker';
import dynamic from 'next/dynamic';
import { UberEatsIcon, DidiFoodIcon, RappiIcon } from '@/components/shared/CustomIcons';

const BusinessGallery = dynamic(
  () =>
    import('@/components/business/BusinessGallery').then((mod) => mod.default),
  { ssr: false }
);
const BusinessMap = dynamic(
  () => import('@/components/business/BusinessMap').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full bg-green-xpale animate-pulse rounded-[1.5rem]" />
    ),
  }
);

const ALL_FEATURES = [
  { id: 'Pago con tarjeta', label: 'Pago con tarjeta', icon: CreditCard },
  {
    id: 'Pago con transferencia',
    label: 'Pago con transferencia',
    icon: Banknote,
  },
  {
    id: 'Facturación disponible',
    label: 'Facturación disponible',
    icon: Receipt,
  },
  { id: 'Servicio a domicilio', label: 'Servicio a domicilio', icon: Bike },
  { id: 'Para llevar', label: 'Para llevar', icon: ShoppingBag },
  { id: 'Pueden reservar', label: 'Pueden reservar', icon: CalendarCheck },
  { id: 'Estacionamiento', label: 'Estacionamiento', icon: Car },
  { id: 'Con WiFi', label: 'Con WiFi', icon: Wifi },
  { id: 'Aire acondicionado', label: 'Aire acondicionado', icon: Snowflake },
  { id: 'Pet friendly', label: 'Pet friendly', icon: Dog },
  {
    id: 'Con juegos infantiles',
    label: 'Con juegos infantiles',
    icon: Gamepad2,
  },
];

export const revalidate = 60;

export default async function BusinessMicrosite({
  params,
}: {
  params: { categoria: string; slug: string };
}) {
  const { data: business } = await supabase
    .from('businesses')
    .select('*, category:categories(name, slug, icon)')
    .eq('slug', params.slug)
    .single();

  if (!business) notFound();

  // Handle potential category array from Supabase join
  const categoryData: any = business.category;
  const category = Array.isArray(categoryData) ? categoryData[0] : categoryData;

  // Check if the business actually belongs to this category. If not, redirect them.
  if (category?.slug && category.slug !== params.categoria) {
    redirect(`/${category.slug}/${business.slug}`);
  }

  const isOpen = business.schedule
    ? isOpenNow(business.schedule as any)
    : false;

  return (
    <main className="min-h-screen pt-20 bg-green-xpale/30">
      <ViewTracker businessId={business.id} />
      <Navbar />

      <div className="container mx-auto max-w-[1240px] px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-16">
            {/* Business Hero */}
            <section className="relative rounded-[1.5rem] overflow-hidden bg-white shadow-2xl border border-border group">
              <div className="relative h-[220px] md:h-[300px] w-full bg-green-pale">
                {business.cover_url ? (
                  <Image
                    src={business.cover_url}
                    alt={business.name}
                    fill
                    className="object-cover transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Image
                      src="https://enlacesanjuan.com.mx/wp-content/uploads/2025/12/enlaceLogoSanJuan-300x125.png"
                      alt="Logo"
                      width={200}
                      height={40}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  <div
                    className={cn(
                      'px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2',
                      isOpen ? 'bg-green text-white' : 'bg-red-500 text-white'
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    {isOpen ? 'Abierto ahora' : 'Cerrado'}
                  </div>
                  {business.verified && (
                    <div className="bg-white/90 backdrop-blur-md text-blue-600 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                      <CheckCircle size={14} />
                      Negocio verificado
                    </div>
                  )}
                </div>
              </div>

              {/* Business Header Content Overlay */}
              <div className="px-6 md:px-8 pb-4 md:pb-10 -mt-20 md:-mt-24 relative z-10 flex flex-col md:flex-row items-end gap-5 md:gap-8 text-center md:text-left">
                {/* Logo - REDONDO COMPLETAMENTE */}
                <div className="w-28 h-28 md:w-44 md:h-44 rounded-full bg-white border-4 border-white shadow-2xl overflow-hidden flex-shrink-0 relative group mx-auto md:mx-0">
                  <div className="relative w-full h-full bg-white flex items-center justify-center rounded-full overflow-hidden">
                    {business.logo_url ? (
                      <Image
                        src={business.logo_url}
                        alt={business.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-outfit font-black text-5xl text-green/10">
                        {business.name[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 pb-2 md:pb-4">
                  <h1 className="font-outfit font-black text-3xl md:text-5xl text-ink md:text-white leading-tight md:leading-[1.05] mb-2 md:mb-2 drop-shadow-2xl">
                    {business.name}
                  </h1>
                  <div className="flex flex-col items-center md:items-start gap-2 md:gap-4 mt-8 md:mt-6">
                    <span className="bg-green-xpale text-green px-4 py-1.5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] inline-block shadow-sm">
                      {category?.name || 'Premium'}
                    </span>
                    <p className="text-ink/60 font-medium text-base md:text-lg italic leading-tight max-w-lg">
                      {business.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions (CTAs) */}
            <div className="flex flex-col gap-4">
              {business.catalog_pdf_url && (
                <Link
                  href={business.catalog_pdf_url}
                  target="_blank"
                  className="w-full"
                >
                  <Button
                    size="lg"
                    className="w-full bg-green hover:bg-green-mid text-white border-none flex items-center justify-center gap-4 rounded-2xl shadow-xl h-20 text-xl font-black tracking-tight transition-all"
                  >
                    <FileText size={32} />
                    {business.catalog_label || 'Menú / Catálogo'}
                  </Button>
                </Link>
              )}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`https://wa.me/52${business.whatsapp}`}
                  target="_blank"
                  className="flex-1 min-w-[240px]"
                >
                  <Button
                    size="lg"
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] border-none flex items-center justify-center gap-4 rounded-2xl shadow-xl h-20 text-xl font-black tracking-tight text-white"
                  >
                    <MessageCircle size={32} />
                    Contactar en WhatsApp
                  </Button>
                </Link>
                <div className="flex gap-4 flex-1 min-w-[240px]">
                  <Link href={`tel:${business.phone}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-20 border-border hover:bg-white text-ink rounded-2xl shadow-lg"
                    >
                      <Phone size={24} className="text-green-mid" />
                      <span className="ml-3 font-black uppercase text-sm tracking-widest">
                        Llamar
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              {business.website && (
                <Link
                  href={
                    business.website.startsWith('http')
                      ? business.website
                      : `https://${business.website}`
                  }
                  target="_blank"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-20 border-border hover:bg-green-xpale text-ink hover:text-green-deeper rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3"
                  >
                    <Globe size={24} className="text-green-mid" />
                    <span className="font-black uppercase text-sm tracking-widest mt-1">
                      Visitar Sitio Web Oficial
                    </span>
                  </Button>
                </Link>
              )}
            </div>

            {/* Description */}
            <section className="bg-white rounded-[1.5rem] p-6 md:p-10 border border-border shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-green" />
              <h2 className="font-outfit font-black text-lg md:text-xl text-green-deeper mb-4 md:mb-6 uppercase tracking-[0.2em]">
                Descripción
              </h2>
              <div className="text-muted text-base md:text-lg font-jakarta leading-snug md:leading-relaxed space-y-4">
                {business.description ||
                  'Este negocio aún no ha añadido una descripción detallada.'}
              </div>
            </section>

            {/* Business Services / Features */}
            {business.features && business.features.length > 0 && (
              <section className="bg-white rounded-[1.5rem] p-10 border border-border shadow-sm">
                <h2 className="font-outfit font-black text-xl text-green-deeper mb-8 uppercase tracking-[0.2em]">
                  Servicios del negocio
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {ALL_FEATURES.filter((f) =>
                    business.features?.includes(f.id)
                  ).map((feature) => (
                    <div
                      key={feature.id}
                      className="flex flex-col items-center text-center group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-green-xpale text-green flex items-center justify-center mb-3 group-hover:bg-green group-hover:text-white transition-all duration-300 shadow-sm">
                        <feature.icon size={28} />
                      </div>
                      <span className="font-jakarta font-black text-[9px] uppercase tracking-widest text-ink leading-tight">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery Section */}
            {business.gallery_urls?.length > 0 && (
              <BusinessGallery
                images={business.gallery_urls}
                businessName={business.name}
              />
            )}

            {/* Location Map Section */}
            {business.latitude && business.longitude && (
              <div className="space-y-6">
                <h2 className="font-outfit font-black text-xl text-green-deeper uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                  <MapPin className="text-green" />
                  Ubicación
                </h2>
                <BusinessMap
                  lat={Number(business.latitude)}
                  lng={Number(business.longitude)}
                  name={business.name}
                  address={`${business.address}, ${business.neighborhood}`}
                  logoUrl={business.logo_url}
                />
              </div>
            )}

            {/* Social Media & Schedule at the bottom */}
            <div className="grid grid-cols-1 gap-8">
              {/* Social Media */}
              <div className="bg-white rounded-[1.5rem] p-10 border border-border shadow-xl">
                <h3 className="font-outfit font-black text-lg text-green-deeper uppercase tracking-[0.2em] mb-6 leading-tight">
                  Redes sociales de <br />
                  <span className="text-green">{business.name}</span>
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    {
                      icon: Facebook,
                      key: 'facebook',
                      color:
                        'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white',
                    },
                    {
                      icon: Instagram,
                      key: 'instagram',
                      color:
                        'hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white',
                    },
                    {
                      icon: Tiktok,
                      key: 'tiktok',
                      color:
                        'hover:bg-black hover:border-black hover:text-white',
                    },
                    {
                      icon: Twitter,
                      key: 'twitter_x',
                      color:
                        'hover:bg-[#000000] hover:border-[#000000] hover:text-white',
                    },
                    {
                      icon: Linkedin,
                      key: 'linkedin',
                      color:
                        'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white',
                    },
                    {
                      icon: Pinterest,
                      key: 'pinterest',
                      color:
                        'hover:bg-[#E60023] hover:border-[#E60023] hover:text-white',
                    },
                    {
                      icon: Youtube,
                      key: 'youtube',
                      color:
                        'hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white',
                    },
                    {
                      icon: UberEatsIcon,
                      key: 'uber_eats',
                      color:
                        'hover:bg-[#06C167] hover:border-[#06C167] hover:text-white',
                    },
                    {
                      icon: DidiFoodIcon,
                      key: 'didi_food',
                      color:
                        'hover:bg-[#FF8B00] hover:border-[#FF8B00] hover:text-white',
                    },
                    {
                      icon: RappiIcon,
                      key: 'rappi',
                      color:
                        'hover:bg-[#ff441f] hover:border-[#ff441f] hover:text-white',
                    },
                  ].map((social) => {
                    const url = (business as any)[social.key];
                    if (!url || url === '') return null;

                    const isBrand =
                      social.key === 'uber_eats' ||
                      social.key === 'didi_food' ||
                      social.key === 'rappi';

                    const iconContent = (
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 overflow-hidden',
                          isBrand
                            ? 'p-0 bg-transparent'
                            : `bg-green-xpale text-green hover:text-white ${social.color} border border-green-pale`
                        )}
                      >
                        <social.icon size={isBrand ? 48 : 20} />
                      </div>
                    );

                    // Si es solo icono (valor '#'), lo mostramos sin link
                    if (url === '#') {
                      return (
                        <div
                          key={social.key}
                          className="cursor-help"
                          title="Disponible en esta plataforma"
                        >
                          {iconContent}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={social.key}
                        href={url as string}
                        target="_blank"
                      >
                        {iconContent}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Schedule Card */}
              <div className="bg-white rounded-[1.5rem] overflow-hidden border border-border shadow-2xl">
                <div className="bg-green-deeper p-6 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-white font-outfit font-black text-lg uppercase tracking-widest">
                      Horario
                    </h3>
                    <p className="text-green-light text-[9px] font-bold uppercase tracking-[0.2em]">
                      San Juan del Río
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-green-light border border-white/10">
                    <Clock size={20} />
                  </div>
                </div>
                  <div className="p-6 space-y-3">
                    {[
                      'lunes',
                      'martes',
                      'miercoles',
                      'jueves',
                      'viernes',
                      'sabado',
                      'domingo',
                    ].map((day) => {
                      const sch = (business.schedule as any)?.[day] || {
                        closed: true,
                      };
                      return (
                        <div
                          key={day}
                          className={cn(
                            'flex justify-between items-center py-1.5 transition-all px-3 rounded-lg',
                            day === days[new Date().getDay()]
                              ? 'bg-green-xpale text-green shadow-inner'
                              : 'text-muted hover:bg-black/[0.02]'
                          )}
                        >
                          <span className="uppercase font-black text-[10px] tracking-widest">
                            {day}
                          </span>
                          <span className="text-xs font-bold font-jakarta">
                            {sch.closed ? (
                              <span className="opacity-40 italic">Cerrado</span>
                            ) : (
                              `${sch.open} - ${sch.close} hrs`
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
              </div>
            </div>

            {/* Featured Products */}
            {business.products?.length > 0 && (
              <section className="bg-[#F4FBF5] rounded-[1.5rem] p-12 border border-border/50">
                <h2 className="font-outfit font-black text-xl text-green-deeper mb-8 uppercase tracking-[0.2em] flex items-center gap-4">
                  <Layers className="text-green" />
                  Productos & Servicios
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {business.products.map((product: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white p-8 rounded-[1rem] border border-border/50 shadow-sm group hover:border-green-mid transition-all hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-outfit font-black text-lg text-ink leading-tight group-hover:text-green-mid transition-all">
                          {product.name}
                        </h3>
                        <span className="text-green font-black text-lg leading-tight bg-green-xpale px-3 py-1 rounded-xl shadow-inner">
                          {product.price}
                        </span>
                      </div>
                      <p className="text-muted text-sm font-jakarta leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar (1/3) */}
          <aside className="lg:col-span-1 space-y-10">
            {/* Contact Card */}
            <div className="bg-white rounded-[1.5rem] p-10 border border-border shadow-xl space-y-10">
              <h3 className="font-outfit font-black text-xl text-green-deeper uppercase tracking-[0.2em]">
                Contacto Directo
              </h3>
              <div className="space-y-8">
                {business.phone && (
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-[0.75rem] bg-green-xpale text-green flex items-center justify-center flex-shrink-0 group-hover:bg-green group-hover:text-white transition-all shadow-sm">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">
                        Teléfono principal
                      </p>
                      <p className="font-jakarta font-black text-ink2 text-lg">
                        {business.phone}
                      </p>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-[0.75rem] bg-green-xpale text-green flex items-center justify-center flex-shrink-0 group-hover:bg-green group-hover:text-white transition-all shadow-sm">
                      <Mail size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">
                        Enviar mensaje
                      </p>
                      <p className="font-jakarta font-black text-ink2 truncate">
                        {business.email}
                      </p>
                    </div>
                  </div>
                )}
                {business.address && (
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-[0.75rem] bg-green-xpale text-green flex items-center justify-center flex-shrink-0 group-hover:bg-green group-hover:text-white transition-all shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">
                        Dirección oficial
                      </p>
                      <p className="font-jakarta font-black text-ink2 text-sm leading-snug">
                        {business.address}, <br /> {business.neighborhood}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-green p-10 rounded-[1.5rem] flex flex-col items-center text-center text-white shadow-[0_10px_30px_rgba(42,122,59,0.3)] border-4 border-white/20">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <Share2 size={32} />
              </div>
              <h3 className="font-outfit font-black text-xl mb-4 leading-tight">
                ¡Apoya a este negocio local!
              </h3>
              <p className="text-white/70 text-xs font-jakarta mb-8 leading-relaxed">
                Comparte este micrositio con tus amigos y ayúdanos a fortalecer
                nuestra comunidad en San Juan del Río.
              </p>
              <div className="flex gap-4 w-full">
                <Link
                  href={`https://wa.me/?text=Mira+el+micrositio+de+${encodeURIComponent(
                    business.name
                  )}+en+Enlace+San+Juan:+${encodeURIComponent(
                    'https://enlacesanjuan.com.mx/' + business.slug
                  )}`}
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    className="w-full bg-white text-green hover:bg-green-xpale rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl border-none"
                  >
                    Compartir
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="bg-white">
        <Footer />
      </div>
    </main>
  );
}

const days = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
