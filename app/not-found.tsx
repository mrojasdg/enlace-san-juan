import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9FCFA] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-700">
        {/* Logo Centered */}
        <div className="flex justify-center mb-12">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Enlace San Juan"
              width={220}
              height={50}
              className="h-12 w-auto object-contain hover:scale-105 transition-transform"
              priority
            />
          </Link>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="relative inline-block">
            <span className="text-9xl font-black font-outfit text-green/5 select-none">
              404
            </span>
            <h1 className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-black font-outfit text-ink">
              Lo que intentas no se encuentra
            </h1>
          </div>
          <p className="text-muted font-jakarta text-lg">
            Parece que la página que buscas ha cambiado de lugar o ya no existe.
            No te preocupes, regresa a la página principal para seguir
            explorando.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-green hover:bg-green-mid text-white rounded-2xl px-8 h-14 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-green/20 group w-full sm:w-auto">
              <Home className="mr-2 w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              Regresa al Inicio
            </Button>
          </Link>
          <Link href="/buscar">
            <Button
              variant="outline"
              className="border-border hover:bg-white text-muted rounded-2xl px-8 h-14 font-black uppercase text-[11px] tracking-widest w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Ir al Directorio
            </Button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="pt-20 opacity-20 pointer-events-none">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
            Enlace San Juan ®
          </p>
        </div>
      </div>

      {/* Background blur effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
