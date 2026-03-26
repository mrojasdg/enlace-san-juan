'use client';

import { MessageCircle, Mail, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export const CTASection = () => {
  const plans = [
    { name: '$349 MXN', label: 'Micrositio + QR', icon: Layers },
    { name: '$250 MXN', label: 'Revista extra', icon: BookOpen },
    {
      name: 'Sin contratos',
      label: 'Solo el mes que necesites',
      icon: MessageCircle,
    },
  ];

  return (
    <section
      id="registrar"
      className="py-24 px-6 md:px-12 bg-green-dark relative overflow-hidden"
    >
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-green-light opacity-[0.05] blur-[120px] pointer-events-none" />

      <div className="container mx-auto text-center relative z-10 flex flex-col items-center max-w-4xl">
        <Link href="/">
          <Image
            src="/logo-white.png"
            alt="Enlace San Juan"
            width={120}
            height={28}
            className="h-10 w-auto mb-10 brightness-0 invert"
          />
        </Link>

        <h2 className="font-outfit font-black text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
          ¿Tu negocio ya está en <br />
          <span className="text-green-light">Enlace San Juan?</span>
        </h2>

        {/* Pricing pills hover effect */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {plans.map((plan) => (
            <div
              key={plan.label}
              className="group bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl px-6 py-4 transition-all duration-300 transform hover:-translate-y-2 cursor-default flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-green-light group-hover:bg-green-light group-hover:text-white transition-all duration-300">
                <plan.icon size={20} />
              </div>
              <div className="text-left">
                <h4 className="font-outfit font-black text-xl text-white leading-none mb-1">
                  {plan.name}
                </h4>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                  {plan.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center mx-auto items-center">
          <Link href="/registrate" className="w-full sm:w-auto group">
            <Button
              size="lg"
              className="w-full sm:w-auto px-10 bg-white text-green-deeper hover:bg-white/90 scale-100 hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.2)] rounded-2xl py-6 text-lg font-black tracking-tight flex items-center justify-center gap-3 whitespace-nowrap"
            >
              Registra tu negocio
            </Button>
          </Link>
          <Link
            href="mailto:hola@enlacesanjuan.com.mx"
            className="w-fit flex items-center gap-3 text-white/60 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors py-4"
          >
            <Mail size={20} />
            Escríbenos por email
          </Link>
        </div>
      </div>
    </section>
  );
};
