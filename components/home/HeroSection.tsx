'use client';

import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export const HeroSection = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    router.push(`/buscar?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-dark to-green py-20 px-6 md:py-24 md:px-12 flex flex-col items-center">
      {/* Decorative SVG Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-green-light opacity-[0.05] -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-green-xpale opacity-[0.08] translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />

      <div className="container mx-auto max-w-4xl text-center relative z-10 flex flex-col items-center">
        {/* Pill tag */}
        <div className="inline-flex items-center gap-2 bg-white/12 border border-white/20 rounded-full px-5 py-1.5 mb-8 backdrop-blur-sm">
          <MapPin size={14} className="text-green-light" />
          <span className="text-white text-[12px] font-bold uppercase tracking-[0.15em]">
            San Juan del Río, Querétaro
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-outfit font-black text-5xl md:text-7xl text-white leading-[1.05] tracking-tight mb-6">
          El directorio de <br />
          <span className="text-green-light text-transparent bg-clip-text bg-gradient-to-r from-[#86EFAC] to-[#5CBF72]">
            San Juan del Río
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/65 font-jakarta leading-relaxed max-w-2xl mb-12">
          Encuentra restaurantes, médicos, estéticas, tiendas y más. Todo lo que
          tu ciudad necesita, en un solo lugar.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl bg-white p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <Search className="text-muted flex-shrink-0" size={20} />
            <input
              type="text"
              placeholder="¿Qué negocio buscas?"
              className="w-full py-3 bg-transparent border-none outline-none text-[15px] text-ink placeholder:text-muted/60"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto px-10 py-4 font-black rounded-xl"
          >
            Buscar
          </Button>
        </form>
      </div>
    </section>
  );
};
