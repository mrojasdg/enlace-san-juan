'use client';

import { Navbar } from '@/components/layout/Navbar';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import dynamic from 'next/dynamic';

const SearchMap = dynamic(() => import('@/components/search/SearchMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-green-xpale flex items-center justify-center text-xs font-black uppercase tracking-widest text-muted2">Cargando mapa...</div>
});
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Filter, X, Map as MapIcon, List } from 'lucide-react';

export default function SearchPage({ searchParams }: { searchParams: any }) {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const { q, cat, is_featured } = searchParams;

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      let query = supabase
        .from('businesses')
        .select('*, category:categories(name, slug, icon)', { count: 'exact' })
        .eq('is_active', true);

      if (q) {
        query = query.or(`name.ilike.%${q}%,search_keywords.ilike.%${q}%`);
      }

      if (cat) {
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', cat)
          .single();
        if (catData) query = query.eq('category_id', catData.id);
      }

      if (is_featured === 'true') query = query.eq('is_featured', true);

      const { data, count: total } = await query.order('is_featured', {
        ascending: false,
      });

      // Normalize category if it's returned as an array by Supabase join
      const normalizedData = (data || []).map((biz: any) => ({
        ...biz,
        category: Array.isArray(biz.category) ? biz.category[0] : biz.category
      }));

      setBusinesses(normalizedData);
      setCount(total || 0);
      setIsLoading(false);
    };

    fetchResults();
  }, [q, cat, is_featured]);

  return (
    <main className="h-screen pt-20 flex flex-col overflow-hidden bg-white">
      <Navbar />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Panel 1: Filters (Desktop) */}
        <aside className="hidden lg:block w-[340px] h-full flex-shrink-0 border-r border-border">
          <SearchFilters />
        </aside>

        {/* Panel 2 & 3: Results and Map Side-by-Side on Desktop */}
        <section className="flex-1 h-full overflow-hidden flex flex-col lg:flex-row relative">
          {/* Results Column */}
          <div
            className={cn(
              'flex-1 h-full flex flex-col min-w-[340px]',
              viewMode === 'map' ? 'hidden lg:flex' : 'flex'
            )}
          >
            <SearchResults
              businesses={businesses}
              total={count}
              isLoading={isLoading}
            />
          </div>

          {/* Map Column */}
          <div
            className={cn(
              'flex-1 h-full border-l border-border bg-green-xpale',
              viewMode === 'map' ? 'flex' : 'hidden lg:flex'
            )}
          >
            {/* Escritorio: Siempre activo */}
            <div className="hidden lg:block w-full h-full">
              <SearchMap businesses={businesses} />
            </div>
            {/* Móvil: Montamos/Desmontamos para forzar invalidateSize */}
            <div className="lg:hidden w-full h-full">
              {viewMode === 'map' && <SearchMap businesses={businesses} />}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Actions Floating Bar */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-ink text-white px-6 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 active:scale-95 transition-all text-[10px] uppercase tracking-widest leading-none border-none"
        >
          <Filter size={16} />
          Filtros
        </button>
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="bg-green text-white px-6 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 active:scale-95 transition-all text-[10px] uppercase tracking-widest leading-none border-none"
        >
          {viewMode === 'list' ? <MapIcon size={16} /> : <List size={16} />}
          {viewMode === 'list' ? 'Ver Mapa' : 'Ver Lista'}
        </button>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-300">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-outfit font-black text-xl text-ink">
                Filtros
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-10 h-10 rounded-xl bg-green-xpale flex items-center justify-center text-ink"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SearchFilters onApply={() => setShowMobileFilters(false)} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
