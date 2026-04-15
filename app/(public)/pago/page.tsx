import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  CheckCircle,
  CreditCard,
  Banknote,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Elige tu método de pago | Enlace San Juan',
  description: 'Completa tu registro y elige cómo activar tu cuenta.',
};

export default function PagoPage() {
  return (
    <div className="min-h-screen pt-20 bg-[#F9FCFA]">
      <Navbar />

      <main className="container max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="bg-green-xpale text-green px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-flex items-center gap-2 border border-green/20">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
            CASI LISTO
          </span>
          <h1 className="font-outfit font-black text-4xl md:text-5xl text-green-deeper leading-tight">
            ¡Felicidades! <br className="hidden sm:block" /> Tu negocio está
            registrado
          </h1>
          <p className="text-muted font-jakarta text-lg">
            Selecciona cómo deseas realizar el pago y activar tu plan "Enlace"
            para publicar tu micrositio hoy mismo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {/* Opción 1: Suscripción MercadoPago */}
          <div className="bg-white border-2 border-green/30 hover:border-green-pale rounded-[2.5rem] p-8 md:p-10 shadow-xl transition-all relative overflow-hidden flex flex-col h-full items-center text-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"></div>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
              <CreditCard size={32} />
            </div>
            <h3 className="font-outfit font-black text-2xl text-ink mb-2">
              Suscripción Mensual Automática
            </h3>
            <p className="text-sm font-bold text-muted mb-6">
              Cargo recurrente mes a mes para que no te preocupes de nada.
              (Puedes cancelar cuando quieras).
            </p>

            <div className="mt-auto w-full">
              <a
                href="https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=59332d0b2f1848aaa39821800fbf04b6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-full h-14 bg-[#009EE3] hover:bg-[#0089c5] text-white border-none rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-500/30 transition-all"
                >
                  Suscribirme Ahora
                </Button>
              </a>
            </div>
          </div>

          {/* Opción 2: Un Solo Pago MercadoPago */}
          <div className="bg-white border-2 border-border hover:border-green-pale rounded-[2.5rem] p-8 md:p-10 shadow-xl transition-all relative overflow-hidden flex flex-col h-full items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-700 flex items-center justify-center mb-6">
              <Banknote size={32} />
            </div>
            <h3 className="font-outfit font-black text-2xl text-ink mb-2">
              Un Solo Mes
            </h3>
            <p className="text-sm font-bold text-muted mb-6">
              Paga con tarjeta de crédito/débito o en OXXO vía Mercado Pago.
              mes.
            </p>

            <div className="mt-auto w-full">
              <a
                href="https://mpago.li/1k74vmi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 border-2 border-border hover:border-[#009EE3] hover:bg-blue-50 hover:text-[#009EE3] text-ink rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
                >
                  Paga ahora
                </Button>
              </a>
            </div>
          </div>

          {/* Opción 3: Agendar Visita */}
          <div className="bg-white border-2 border-border hover:border-green-pale rounded-[2.5rem] p-8 md:p-10 shadow-xl transition-all relative overflow-hidden flex flex-col h-full items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
              <Calendar size={32} />
            </div>
            <h3 className="font-outfit font-black text-2xl text-ink mb-2">
              Paga en tu Local
            </h3>
            <p className="text-sm font-bold text-muted mb-6">
              Te visitamos. Paga en efectivo, tarjeta de crédito o transferencia
              directamente en tu negocio.
            </p>

            <div className="mt-auto w-full">
              <a
                href="https://wa.me/524273232026?text=Quiero%20agendar%20una%20visita%20para%20pago%20en%20mi%20negocio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 border-2 border-border hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 text-ink rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
                >
                  Agenda tu Visita
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Aviso de Autorización */}
        <div className="max-w-3xl mx-auto mb-12 text-center bg-blue-50 border border-blue-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-4 transition-all hover:bg-blue-100/50 group">
          <div className="w-10 h-10 rounded-full bg-blue-200/50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <CheckCircle size={22} className="stroke-[2.5]" />
          </div>
          <p className="text-sm md:text-base font-black text-blue-900 font-outfit uppercase tracking-tight">
            Después de tu pago, avísanos y tu micrositio pasara por una
            autorización que no pasará de dos horas
          </p>
        </div>

        {/* Nota Final Mejorada con Link a Confirmación */}
        <div className="max-w-3xl mx-auto text-center bg-white border-2 border-green/10 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-green/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-xpale rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-black font-outfit text-ink uppercase tracking-tight">
                ¿Ya realizaste tu pago?
              </h3>
              <p className="text-sm text-muted font-jakarta max-w-xl mx-auto">
                Es fundamental validar tu información y el comprobante para autorizar la visualización de tu empresa en el directorio.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pago/confirmacion">
                <Button className="w-full sm:w-auto bg-green text-white hover:bg-green-mid rounded-2xl px-10 h-14 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green/20">
                  Ver Pasos de Activación
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              
              <a
                href="https://wa.me/524273232026?text=Hola,%20mi%20pago%20ya%20está%20aplicado%20para%20activar%20mi%20anuncio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full sm:w-auto border-2 border-border hover:border-green hover:text-green rounded-2xl px-10 h-14 font-black text-[11px] uppercase tracking-widest transition-all">
                  Notificar ahora
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
