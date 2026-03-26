'use client';

import { Search, RotateCcw, Filter, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const categories = [
  { name: 'Gastronomía', id: 'gastronomia' },
  { name: 'Salud & Bienestar', id: 'salud' },
  { name: 'Belleza & Cuidado', id: 'belleza' },
  { name: 'Tiendas & Retail', id: 'retail' },
  { name: 'Otros Servicios', id: 'otros' },
];

const features = [
  'Pago con Tarjeta',
  'Estacionamiento',
  'WiFi',
  'Aire Acondicionado',
  'Delivery',
];

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SearchFiltersProps {
  onApply?: () => void;
}

export const SearchFilters = ({ onApply }: SearchFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('cat') || '');

  const handleApply = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('cat', category);

    router.push(`/buscar?${params.toString()}`);
    if (onApply) onApply();
  };

  const handleReset = () => {
    setQuery('');
    setCategory('');
    router.push('/buscar');
    if (onApply) onApply();
  };

  return (
    <div className="w-full h-full bg-white flex flex-col p-8 border-r border-border overflow-y-auto">
      <div className="flex items-center gap-3 mb-10">
        <Filter size={20} className="text-green-mid" />
        <h2 className="font-outfit font-black text-lg text-green-deeper uppercase tracking-[0.1em]">
          Filtros de búsqueda
        </h2>
      </div>

      <div className="space-y-12">
        {/* Search Input */}
        <section>
          <label className="block font-jakarta font-black text-xs text-muted uppercase tracking-[0.15em] mb-4">
            ¿Qué estás buscando hoy?
          </label>
          <div className="relative group">
            <Search
              className="absolute left-0 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-green transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Nombre del negocio..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              className="w-full pl-8 py-3 bg-transparent border-b border-border focus:border-green outline-none text-ink font-medium placeholder:text-muted/40 transition-all font-jakarta text-sm"
            />
          </div>
        </section>

        {/* Category Select */}
        <section>
          <label className="block font-jakarta font-black text-xs text-muted uppercase tracking-[0.15em] mb-5">
            Categoría principal
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 bg-green-xpale border border-border rounded-2xl outline-none focus:border-green text-sm font-bold text-ink2 cursor-pointer appearance-none"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </section>

        {/* Features Checkboxes (UI Only for now) */}
        <section>
          <label className="block font-jakarta font-black text-xs text-muted uppercase tracking-[0.15em] mb-6">
            Características destacadas
          </label>
          <div className="space-y-4">
            {features.map((feature) => (
              <label
                key={feature}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="relative w-6 h-6 border-2 border-border rounded-lg group-hover:border-green transition-colors flex items-center justify-center bg-white overflow-hidden">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-full h-full bg-green text-white scale-0 peer-checked:scale-100 transition-transform duration-200 flex items-center justify-center">
                    <Check size={14} strokeWidth={4} />
                  </div>
                </div>
                <span className="text-sm font-jakarta font-medium text-ink2 group-hover:text-green transition-colors leading-none">
                  {feature}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Order By (UI Only for now) */}
        <section>
          <label className="block font-jakarta font-black text-xs text-muted uppercase tracking-[0.15em] mb-4">
            Ordernar por
          </label>
          <select className="w-full bg-transparent border-none outline-none text-sm font-bold text-ink2 cursor-pointer">
            <option value="featured">Destacados primero</option>
            <option value="recent">Más recientes</option>
            <option value="abc">Alfabéticamente (A-Z)</option>
          </select>
        </section>

        <div className="pt-4 flex flex-col gap-6">
          <Button
            onClick={handleApply}
            size="lg"
            className="w-full py-4 rounded-2xl shadow-xl font-black tracking-tight text-base"
          >
            Refinar búsqueda
          </Button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 text-xs font-bold text-muted hover:text-red-500 transition-colors uppercase tracking-[0.1em]"
          >
            <RotateCcw size={14} />
            Resetear filtros
          </button>
        </div>
      </div>
    </div>
  );
};
