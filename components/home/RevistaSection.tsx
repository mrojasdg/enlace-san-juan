'use client';

import { Check, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export const RevistaSection = () => {
  const steps = [
    {
      title: 'Diseño personalizado',
      desc: 'Si no tienes un diseño nosotros te apoyamos a crearlo.',
    },
    { title: 'Link a micrositio', desc: 'Conexión directa con tu perfil' },
    { title: 'Sin compromisos', desc: 'Mes con mes, sin suscripciones' },
    { title: '30 anuncios máx', desc: 'Exclusividad asegurada' },
  ];

  return (
    <section
      id="revista"
      className="py-24 px-6 md:px-12 bg-green-pale overflow-hidden"
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Content */}
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-6 bg-white/50 w-fit px-4 py-2 rounded-full border border-border">
            <BookOpen size={18} className="text-green-mid" />
            <span className="text-xs font-bold text-green-mid uppercase tracking-[0.1em]">
              Revista Digital
            </span>
          </div>

          <h2 className="font-outfit font-black text-4xl md:text-5xl text-green-deeper mb-8 leading-tight">
            Nuestra revista digital <br />
            <span className="text-green-mid">mensual</span>
          </h2>

          <p className="text-muted text-lg font-jakarta mb-10 leading-relaxed">
            Cada primer lunes de mes publicamos la revista digital que llega a
            miles de personas en San Juan del Río. No te quedes fuera de la
            próxima edición.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {steps.map((step) => (
              <li key={step.title} className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white text-green flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-green group-hover:text-white transition-all duration-300 transform group-hover:-rotate-6 border border-border">
                  <Check size={20} />
                </div>
                <div>
                  <h4 className="font-jakarta font-black text-sm text-ink leading-tight mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="https://wa.me/524273232026?text=Me+interesa+la+revista"
              target="_blank"
              className="flex-1"
            >
              <Button
                size="lg"
                className="w-full text-white bg-green-mid hover:bg-green shadow-lg"
              >
                Quiero aparecer en la revista
              </Button>
            </Link>
            <Link href="/revista/ultima-edicion" className="flex-1">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-green-dark border-green-dark bg-transparent"
              >
                Ver última edición
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Mockup Image */}
        <div className="relative group cursor-pointer">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="bg-white border-8 border-ink rounded-[3rem] overflow-hidden shadow-2xl relative z-10 aspect-[9/18.5] md:aspect-auto md:w-full md:h-[600px]">
            {/* Mockup content mockup */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-muted font-bold animate-pulse text-sm text-center px-8 uppercase space-y-4 flex-col">
              <BookOpen size={64} className="mb-4 text-green/20" />
              <span>Espacio para vista previa de la revista</span>
              <span className="text-[10px] lowercase normal-case opacity-50 font-normal">
                Sube una imagen o mockup del PDF interactivo
              </span>
            </div>
          </div>

          <div className="absolute -bottom-8 -right-8 bg-gold p-8 rounded-3xl text-white shadow-2xl z-20 group-hover:scale-110 transition-transform duration-300">
            <h4 className="font-outfit font-black text-3xl mb-1 leading-tight">
              MÁS DE <br /> 5K
            </h4>
            <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">
              Lectores <br /> locales
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
