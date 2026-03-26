'use client';

import { Business } from '@/types/business';
import { BusinessCardH } from '@/components/business/BusinessCardH';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface SearchResultsProps {
  businesses: Business[];
  total: number;
  isLoading?: boolean;
}

export const SearchResults = ({
  businesses,
  total,
  isLoading,
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-green-xpale/20">
        <div className="w-12 h-12 border-4 border-green-pale border-t-green rounded-full animate-spin mb-4" />
        <p className="font-jakarta font-bold text-sm text-green animate-pulse">
          Buscando negocios...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-green-xpale/50 flex flex-col items-center overflow-y-auto w-full">
      {/* Header Results Info */}
      <div className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md px-8 py-4 border-b border-border flex justify-between items-center shadow-sm">
        <p className="font-jakarta font-bold text-sm text-ink2">
          Mostrando <span className="text-green">{businesses.length}</span> de{' '}
          {total} resultados
        </p>

        {/* Pagination Controls */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-xl bg-green-pale text-green hover:bg-green hover:text-white transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none">
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs font-black font-outfit text-ink2">
            Página 1
          </span>
          <button className="p-2 rounded-xl bg-green-pale text-green hover:bg-green hover:text-white transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl p-6 flex flex-col gap-6">
        {businesses.length > 0 ? (
          businesses.map((biz) => <BusinessCardH key={biz.id} business={biz} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-white border border-border rounded-[2.5rem] flex items-center justify-center text-muted/20 mb-8 shadow-2xl">
              <Inbox size={48} />
            </div>
            <h3 className="font-outfit font-black text-2xl text-green-deeper mb-3">
              No hay resultados
            </h3>
            <p className="text-muted max-w-sm font-jakarta leading-relaxed">
              Intenta quitando algunos filtros o buscando con otros términos.
            </p>
          </div>
        )}
      </div>

      {/* Final Pagination */}
      {businesses.length > 0 && (
        <div className="py-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-xl font-bold font-outfit text-sm transition-all duration-200 ${
                  page === 1
                    ? 'bg-green text-white shadow-xl'
                    : 'bg-white text-muted hover:bg-green-pale'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <p className="text-[10px] uppercase font-bold text-muted tracking-widest mt-2">
            Página 1 de {Math.ceil(total / 10)}
          </p>
        </div>
      )}
    </div>
  );
};
