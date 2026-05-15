import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTracker } from '@/components/shared/PageTracker';
import { CheckCircle2, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Confirmación de Pago - Enlace San Juan',
    description: 'Gracias por tu pago. Tu perfil está en proceso de validación.',
  };
}

export default function PagoConfirmacionPage() {
  const whatsappNumber = '524273232026';
  const whatsappMessage = encodeURIComponent(
    '¡Hola! Acabo de realizar mi pago para Enlace San Juan. Adjunto el comprobante y confirmo que la información de mi empresa está lista para validación y autorización.'
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#F9FCFA]">
      <PageTracker path="pago-confirmacion" />
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Card Principal con efecto de profundidad */}
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-green/10 border border-green-pale/20 overflow-hidden relative">
            {/* Elementos Decorativos de Fondo (Aesthetic) */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-green-xpale/40 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-xpale/30 rounded-full blur-[100px] -ml-40 -mb-40" />

            <div className="relative z-10 p-8 md:p-20 text-center space-y-12">
              {/* Icono de Éxito con Aura */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green/20 rounded-full animate-ping scale-150 opacity-20 duration-[3000ms]" />
                  <div className="relative bg-green text-white p-8 rounded-full shadow-2xl shadow-green/40 border-4 border-white">
                    <CheckCircle2 size={56} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Títulos y Mensaje Central */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-green font-black uppercase tracking-[0.4em] text-[10px] bg-green-xpale px-6 py-2 rounded-full border border-green/10">
                    Transacción Exitosa
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black font-outfit text-ink tracking-tight pt-4">
                    ¡Gracias por <br />
                    <span className="text-green relative">
                      tu confianza
                      <svg className="absolute -bottom-2 left-0 w-full h-2 text-green/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                      </svg>
                    </span>!
                  </h1>
                </div>
                <p className="text-xl text-muted font-jakarta max-w-2xl mx-auto leading-relaxed">
                  Tu proceso de registro está casi completo. Para garantizar la calidad del directorio, un asesor validará tu información manualmente.
                </p>
              </div>

              {/* Grid de Pasos con Estilo Card */}
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="group bg-green-xpale/20 hover:bg-white p-10 rounded-[2.5rem] border border-green-pale/10 hover:shadow-xl hover:shadow-green/5 transition-all duration-500 space-y-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green shadow-sm border border-border group-hover:scale-110 transition-transform">
                    <ShieldCheck size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-outfit font-black text-ink uppercase text-xs tracking-widest">Paso 1: Validación</h3>
                    <p className="text-sm text-muted font-jakarta leading-relaxed">
                      Revisaremos los datos de tu empresa y el comprobante de pago para habilitar tu microsite.
                    </p>
                  </div>
                </div>

                <div className="group bg-green-xpale/20 hover:bg-white p-10 rounded-[2.5rem] border border-green-pale/10 hover:shadow-xl hover:shadow-green/5 transition-all duration-500 space-y-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green shadow-sm border border-border group-hover:scale-110 transition-transform">
                    <MessageCircle size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-outfit font-black text-ink uppercase text-xs tracking-widest">Paso 2: Activación</h3>
                    <p className="text-sm text-muted font-jakarta leading-relaxed">
                      Una vez validado, autorizaremos tu perfil para que sea visible en <strong>Enlace San Juan</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección WhatsApp con Gradiente Oscuro (Premium) */}
              <div className="pt-6">
                <div className="bg-ink rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl shadow-ink/20">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10 flex flex-col items-center space-y-8">
                    <div className="space-y-3 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-green">Paso Final Requerido</p>
                      <h2 className="text-2xl md:text-4xl font-black font-outfit leading-tight lg:max-w-xl">
                        Manda un mensaje para activar tu cuenta ahora
                      </h2>
                    </div>

                    <Link
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button className="w-full sm:px-16 h-20 bg-green hover:bg-green-mid text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-green/40 hover:scale-105 active:scale-95 transition-all group">
                        Enviar WhatsApp de Confirmación
                        <MessageCircle className="ml-4 w-6 h-6 animate-bounce" />
                      </Button>
                    </Link>

                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
                      Atención Inmediata • Lunes a Viernes 9:00 - 18:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegación Secundaria */}
          <div className="mt-16 text-center space-y-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 text-muted hover:text-green font-black text-[11px] uppercase tracking-[0.3em] transition-all bg-white px-8 py-4 rounded-full border border-border/50 shadow-sm hover:shadow-md"
            >
              <ArrowRight size={14} className="rotate-180" />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
