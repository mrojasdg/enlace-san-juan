import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { PageTracker } from '@/components/shared/PageTracker';
import {
  CheckCircle,
  Smartphone,
  Globe,
  MapPin,
  MessageCircle,
  Camera,
  Star,
  FileText,
  Phone,
  Search,
  LayoutDashboard,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Mail,
  BookOpen,
} from 'lucide-react';

export const metadata = {
  title: 'Precios | Enlace San Juan',
  description:
    'Conoce nuestros planes y precios para destacar tu negocio en San Juan del Río.',
};

export default function PreciosPage() {
  return (
    <div className="min-h-screen pt-12 selection:bg-green-pale selection:text-green-deeper bg-[#F9FCFA]">
      <PageTracker path="precios" />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-0 md:pt-16 md:pb-0 px-6 md:px-12 overflow-hidden border-b border-border/30">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-green-xpale opacity-50 blur-3xl pointer-events-none -z-10 rounded-bl-[100%]"></div>
        <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end">
          <div className="space-y-8 relative z-10 max-w-2xl pb-20 md:pb-32">
            <span className="bg-green-xpale text-green px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-flex items-center gap-2 border border-green/20">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
              ENLACE SAN JUAN DEL RÍO
            </span>

            <h1 className="font-outfit font-black text-5xl md:text-6xl lg:text-7xl text-green-deeper leading-[1.1] tracking-tight">
              Digitaliza fácilmente <br />
              <span className="text-green relative inline-block pb-1">
                <span className="relative z-10">tu negocio</span>
                <svg
                  className="absolute w-[110%] h-3 -bottom-1 -left-[5%] text-green-pale -z-0"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted font-jakarta leading-relaxed max-w-lg">
              Directorio digital y revista interactiva para conectar con miles
              de habitantes y clientes potenciales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/registrate">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-16 px-8 bg-green hover:bg-green-mid text-white border-none rounded-2xl shadow-[0_15px_30px_-5px_rgba(0,183,113,0.3)] transition-all font-black uppercase tracking-widest text-[11px] group"
                >
                  Registra tu negocio
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-16 px-8 border-2 border-border hover:border-green hover:bg-green-xpale text-ink rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
                >
                  ¿Cómo funciona?
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative z-10 flex justify-center lg:justify-end items-end">
            <Image
              src="/AppEnlaceindex1.png"
              alt="App Enlace San Juan"
              width={1200}
              height={1200}
              className="w-full max-w-[750px] lg:max-w-none lg:w-[115%] h-auto object-contain block align-bottom -mb-1 shadow-none"
              priority
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="como-funciona"
        className="py-24 bg-white px-6 md:px-12 border-t border-border/50"
      >
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-black text-green uppercase tracking-[0.2em]">
              CÓMO FUNCIONA
            </span>
            <h2 className="font-outfit font-black text-3xl md:text-5xl text-green-deeper leading-tight">
              ¿Cómo funciona Enlace San Juan?
            </h2>
            <p className="text-muted text-base md:text-lg font-jakarta">
              Simples pasos para que tu negocio crezca en San Juan del Río con
              nuestra plataforma integral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-green-pale to-transparent -z-10"></div>

            {[
              {
                id: '1',
                title: 'Regístrate en línea',
                desc: 'Sube tu información, logo y fotos en minutos con nuestro asistente interactivo. Es fácil, rápido y completamente gratis.',
                icon: LayoutDashboard,
                color: 'text-green',
                bg: 'bg-green-xpale',
              },
              {
                id: '2',
                title: 'Perfil personalizado',
                desc: 'Creamos tu micrositio con menú o catálogo, horarios, fotografías y enlaces a tus redes sociales. Tu negocio estará listo para compartir.',
                icon: Globe,
                color: 'text-green',
                bg: 'bg-green-xpale',
              },
              {
                id: '3',
                title: 'Aparece en el directorio',
                desc: 'Los clientes te encontrarán fácilmente por categoría o ubicación en San Juan del Río, gracias a nuestro sistema de mapas.',
                icon: Search,
                color: 'text-green',
                bg: 'bg-green-xpale',
              },
              {
                id: '4',
                title: 'Súmate a la revista',
                desc: 'Expande tu alcance publicando tu negocio en nuestra edición impresa de gran calidad, junto con una atractiva nota publicitaria.',
                icon: FileText,
                color: 'text-green',
                bg: 'bg-green-xpale',
              },
            ].map((step) => (
              <div
                key={step.id}
                className="bg-white border border-border p-8 rounded-3xl hover:border-green-pale hover:shadow-xl transition-all group flex flex-col items-start relative overflow-hidden"
              >
                <div className="absolute top-6 right-6 font-outfit font-black text-6xl text-green group-hover:scale-110 transition-all z-0">
                  {step.id}
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.bg} ${step.color} mb-6 relative z-10 group-hover:scale-110 transition-transform`}
                >
                  <step.icon size={26} />
                </div>
                <h3 className="font-outfit font-black text-xl text-ink mb-3 relative z-10">
                  {step.title}
                </h3>
                <p className="text-muted font-jakarta text-sm leading-relaxed relative z-10">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MICROSITE FEATURES SECTION */}
      <section className="py-24 bg-[#F9FCFA] px-6 md:px-12 border-t border-border/50">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 max-w-xl">
            <span className="text-[10px] font-black text-green uppercase tracking-[0.2em]">
              CARACTERÍSTICAS
            </span>
            <h2 className="font-outfit font-black text-3xl md:text-5xl text-green-deeper leading-tight">
              Tu micrositio: una web completa que puedes compartir
            </h2>
            <p className="text-muted text-base md:text-lg font-jakarta">
              Con tu alta en el sitio obtienes tu propio web link que podrás
              enviar a tus clientes, y tendrás en la palma de tu mano la
              administración de tus productos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 pt-4">
              {[
                'Diseño moderno, atractivo y responsivo',
                'Botón directo para que te llamen rápido',
                'Galería de fotos e índice de productos',
                'Botón directo a WhatsApp',
                'Enlaces a tus redes sociales',
                'Horario de servicio fácil de entender',
                'QR Code para que lo uses en tu local',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-xpale text-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={12} className="stroke-[3]" />
                  </div>
                  <p className="text-sm font-bold text-ink2">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="absolute inset-0 bg-green-xpale rounded-[3rem] rotate-3 transform origin-center"></div>
            <div className="relative w-full max-w-md bg-white border border-border rounded-[2.5rem] p-6 shadow-2xl z-10 transform -rotate-1 transition-transform hover:rotate-0">
              {/* Browser/Microsite mockup top bar */}
              <div className="flex items-center gap-2 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Globe size={16} className="text-muted ml-2" />
                <div className="text-[10px] font-mono text-muted overflow-hidden text-ellipsis whitespace-nowrap">
                  enlacesanjuan.com.mx/negocio...
                </div>
              </div>
              {/* Placeholder for Mockup Image */}
              <div className="w-full aspect-video sm:aspect-square bg-white rounded-2xl overflow-hidden relative border border-border/50">
                <img
                  src="/liman.jpg"
                  alt="Microsite Preview"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REACH COMMUNITY SECTION */}
      <section className="py-24 bg-white px-6 md:px-12 border-t border-border/50 overflow-hidden">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative flex justify-center items-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-pale rounded-full blur-3xl opacity-30 pointer-events-none"></div>
            {/* Placeholder for Phone App Screen */}
            <div className="relative w-full max-w-[280px] aspect-[1/2] rounded-[3rem] bg-green-dark shadow-2xl overflow-hidden border-8 border-green-deeper transform -rotate-[5deg] hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-0 w-1/2 h-6 left-1/2 -translate-x-1/2 bg-green-deeper rounded-b-xl z-20"></div>
              <img
                src="/appindex.jpg"
                alt="Community App Display"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8 max-w-xl">
            <span className="text-[10px] font-black text-green uppercase tracking-[0.2em]">
              RESULTADOS COMPROBADOS
            </span>
            <h2 className="font-outfit font-black text-3xl md:text-5xl text-green-deeper leading-tight">
              Llega a toda la comunidad digital de San Juan del Río
            </h2>
            <p className="text-muted text-base md:text-lg font-jakarta">
              La combinación de nuestro sitio, campaña en redes sociales, el SEO
              optimizado y el tráfico publicitario, hace de nuestra plataforma
              una estrategia muy rentable para cualquier local en San Juan.
            </p>

            <div className="flex flex-col gap-4 pt-2">
              {[
                {
                  icon: TrendingUp,
                  title: 'Plan inicial desde $349 MXN',
                  desc: 'Un micrositio personalizado y ser parte del directorio principal. Con la opción de aparecer en la Revista pagando un porcentaje.',
                },
                {
                  icon: MessageCircle,
                  title: 'Botón de acción directo a WhatsApp',
                  desc: "Incrementa tus reservas o ventas rápidamente enviando un mensaje prediseñado que llega en un 'tap' a su Smartphone.",
                },
                {
                  icon: Camera,
                  title: 'Imágenes de alta resolución',
                  desc: 'Resalta del resto subiendo las mejores de tu negocio, con calidad e impacto visual real. Optimizado para móvil y PC en un 100%.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#F9FCFA] border border-border p-5 rounded-2xl flex gap-4 hover:border-green-pale transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0 text-green group-hover:bg-green group-hover:border-transparent group-hover:text-white transition-all shadow-sm">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-ink mb-1">{item.title}</h4>
                    <p className="text-xs text-muted leading-relaxed font-jakarta">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAGAZINE BENEFITS SECTION */}
      <section className="py-24 bg-white px-6 md:px-12 border-t border-border/50">
        <div className="container max-w-7xl mx-auto">
          <div className="bg-white rounded-[3.5rem] border border-border p-8 md:p-16 relative overflow-hidden shadow-xl">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-green-xpale opacity-30 select-none pointer-events-none -skew-x-12 translate-x-1/2"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Left Column: Information */}
              <div className="lg:col-span-7 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black font-outfit text-green-deeper leading-tight">
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
                    {
                      icon: <MessageCircle className="w-5 h-5" />,
                      title: 'Distribución Directa',
                      text: 'Se enviará a través de WhatsApp, redes sociales y correo directo cada mes.',
                    },
                    {
                      icon: <Mail className="w-5 h-5" />,
                      title: 'Alcance Mensual',
                      text: 'Llegamos a miles de habitantes de San Juan del Río de forma recurrente.',
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

                {/* Aviso de Apartado */}
                <div className="bg-green-xpale/50 border border-green-pale/30 rounded-[2.5rem] p-8 md:p-10 text-ink relative overflow-hidden">
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

              {/* Right Column: Magazine Mockup & CTA */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-12 py-10">
                <div className="relative group w-full max-w-[320px] aspect-[9/14] bg-white rounded-[2rem] overflow-hidden border-8 border-ink shadow-2xl transition-transform duration-500 hover:-translate-y-4">
                  <Image
                    src="/PORDADA_DEMO2026low.jpg"
                    alt="Representación de la Revista"
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent"></div>
                </div>

                <div className="flex flex-col items-center gap-6 w-full">
                  <Link href="/revista" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-16 px-10 bg-ink hover:bg-ink/90 text-white border-none rounded-2xl shadow-xl transition-all font-black uppercase tracking-widest text-[11px] group"
                    >
                      Ver ejemplos de revista
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] text-center">
                    Nuestras ediciones mensuales <br /> en formato interactivo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS SECTION */}
      <section className="py-24 bg-[#F9FCFA] px-6 md:px-12 border-t border-border/50">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-black text-green uppercase tracking-[0.2em]">
              PLANES Y PRECIOS
            </span>
            <h2 className="font-outfit font-black text-3xl md:text-5xl text-green-deeper leading-tight">
              Simple y transparente
            </h2>
            <p className="text-muted text-base md:text-lg font-jakarta">
              Invierte en tu negocio con planes que se adaptan a lo que
              necesitas.
            </p>
          </div>

          {/* PROMO ABRIL SECTION (NEW) */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="bg-gradient-to-r from-green-deeper to-green rounded-[3rem] p-1 shadow-2xl overflow-hidden group">
              <div className="bg-white rounded-[2.8rem] p-8 md:p-12 relative overflow-hidden h-full">
                {/* Elementos Decorativos */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-xpale rounded-full blur-3xl opacity-60 -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-xpale rounded-full blur-3xl opacity-40 -ml-32 -mb-32"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                  <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div className="space-y-4">
                      <span className="inline-block bg-ink text-white px-6 py-2 rounded-full font-black text-[12px] uppercase tracking-[0.3em] shadow-xl">
                        🔥 PROMO ABRIL
                      </span>
                      <h2 className="font-outfit font-black text-4xl md:text-5xl text-ink leading-[1.1] tracking-tight">
                        Asegura tu presencia <br className="hidden md:block" />
                        <span className="text-green">Abril + Mayo</span>
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <p className="text-muted font-jakarta text-lg max-w-xl leading-relaxed">
                        Obtén el <span className="font-black text-ink">Plan Enlace</span> (lo que queda de Abril y todo Mayo) +{' '}
                        <span className="font-black text-ink">Revista Enlace edición Mayo</span> por un precio especial.
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
                            Revista Mayo Incluida
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
                          $349
                        </span>
                        <span className="font-bold text-muted text-sm uppercase tracking-widest">
                          MXN
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-green uppercase tracking-[0.2em] mt-6 bg-white px-6 py-3 rounded-full shadow-sm border border-green/5">
                        Siguiente pago en Junio
                      </p>
                    </div>

                    <Link href="/pago" className="w-full relative z-10">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* PLAN 1 */}
            <div className="bg-white border-2 border-border hover:border-green-pale rounded-[2.5rem] p-8 md:p-10 shadow-xl transition-all relative overflow-hidden flex flex-col h-full">
              <div className="mb-8">
                <span className="inline-block bg-green-xpale text-green px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-6">
                  Recomendado para empezar
                </span>
                <h3 className="font-outfit font-black text-3xl text-ink mb-2">
                  Plan Enlace
                </h3>
                <p className="text-sm font-bold text-muted">
                  Tu ecosistema digital y micrositio 24/7
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-outfit font-black text-5xl text-green-deeper">
                    $349
                  </span>
                  <span className="text-sm font-bold text-muted uppercase tracking-widest">
                    MXN / mes
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {[
                  'Perfil oficial en el directorio web',
                  'Galería de hasta 20 imágenes',
                  'Menú / Catálogo en PDF',
                  'Botones de contacto',
                  'QR para tu tienda física y uso libre',
                  'Localización con mapa interactivo',
                  'Redes sociales (FB, IG, TT, etc.)',
                ].map((ft) => (
                  <div key={ft} className="flex items-start gap-3">
                    <CheckCircle
                      size={18}
                      className="text-green shrink-0 mt-0.5"
                    />
                    <span className="text-sm font-bold text-ink2">{ft}</span>
                  </div>
                ))}
              </div>

              <Link href="/registrate" className="mt-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-border hover:border-green hover:bg-green-xpale hover:text-green-deeper rounded-2xl h-14 font-black uppercase tracking-widest text-[11px] transition-all"
                >
                  Registrar mi negocio
                </Button>
              </Link>
            </div>

            {/* PLAN 2 PRO */}
            <div className="bg-green-deeper border-2 border-green-deeper rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col h-full transform md:-translate-y-4">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-light via-yellow-400 to-green-light animate-pulse"></div>
              <div className="absolute top-1/4 right-0 w-64 h-64 bg-green opacity-20 blur-3xl rounded-full"></div>

              <div className="mb-8 relative z-10">
                <span className="inline-block bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 shadow-sm">
                  🌟 "Complementa tu presencia"
                </span>
                <h3 className="font-outfit font-black text-3xl text-white mb-2">
                  Revista mensual
                </h3>
                <p className="text-sm font-bold text-green-xpale pr-4">
                  Si ya tienes plan mensual de nuestro directorio decide qué mes
                  pagas la presencia en nuestra revista y tendrás un anuncio de
                  página completa.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="font-outfit font-black text-6xl text-white leading-none">
                    +$249
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white/60 uppercase tracking-widest leading-relaxed text-left">
                    pesos al mes / <br className="hidden sm:block" />
                    tú decides qué mes
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10 relative z-10">
                {[
                  'Con tu plan enlace suma +249 y obtén tu anuncio',
                  'Revista digital local',
                  'Espacio de página completa de tu negocio',
                  'Promocionaremos en todos los canales',
                  'Hasta 40 empresas por mes',
                ].map((ft) => (
                  <div key={ft} className="flex items-start gap-3">
                    <CheckCircle
                      size={18}
                      className="text-green-light shrink-0 mt-0.5"
                    />
                    <span className="text-sm font-bold text-white">{ft}</span>
                  </div>
                ))}
              </div>

              <Link
                href="https://wa.me/524273232026?text=quiero%20estar%20en%20la%20revista%20del%20siguiente%20mes"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto relative z-10"
              >
                <Button
                  size="lg"
                  className="w-full bg-green text-white hover:bg-green-light border-none rounded-2xl h-14 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-green/20 transition-all"
                >
                  Quiero estar en la revista
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Internal icon component for ArrowRight in case lucide doesn't load it immediately
function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
