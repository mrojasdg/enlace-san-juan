'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Business } from '@/types/business';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, MapPin } from 'lucide-react';
import { isOpenNow } from '@/utils/schedule';
import { cn } from '@/utils/cn';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  const isOpen = business.schedule
    ? isOpenNow(business.schedule as any)
    : false;

  return (
    <Link
      href={`/${business.category?.slug || 'negocio'}/${business.slug}`}
      className="group block"
    >
      <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        {/* Cover Image */}
        <div className="h-48 relative overflow-hidden bg-gray-100">
          {business.cover_url ? (
            <Image
              src={business.cover_url}
              alt={business.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted/30">
              Sin imagen
            </div>
          )}

          {/* Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {business.is_featured && (
              <span className="bg-[#D4A520] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
                Destacado
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 z-10">
            <span
              className={cn(
                'text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl text-white backdrop-blur-md uppercase tracking-widest',
                isOpen ? 'bg-green/90' : 'bg-red-500/90'
              )}
            >
              {isOpen ? 'Abierto' : 'Cerrado'}
            </span>
          </div>

          {/* Title shifted to right of logo, bottom aligned over cover */}
          <div className="absolute bottom-2 left-[110px] pr-4 z-10 flex flex-col justify-end items-start pointer-events-none">
            <h3 
              className="font-outfit font-black text-white text-[24px] leading-tight drop-shadow-lg"
              style={{ maxWidth: '14ch', wordWrap: 'break-word' }}
            >
              {business.name}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 pt-0 relative">
          {/* Floating Logo */}
          <div className="absolute top-[-40px] left-6 z-20">
            <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              {business.logo_url ? (
                <Image
                  src={business.logo_url}
                  alt={`${business.name} logo`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-outfit font-black text-green-xpale text-2xl">
                  {business.name[0]}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 ml-[90px] pt-2 flex items-center gap-2">
            <span className="inline-block bg-[#F2F8F4] text-green-mid font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl">
              {business.category?.name || 'Categoría'}
            </span>
            {business.verified && (
              <CheckCircle
                size={16}
                className="text-blue-500 flex-shrink-0"
              />
            )}
          </div>

          <p className="text-sm text-muted font-jakarta leading-relaxed line-clamp-2 h-10 mb-6 group-hover:text-ink transition-colors">
            {business.tagline ||
              business.description ||
              'Sin descripción disponible.'}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-5 border-t border-border/50">
            <span className="text-[11px] font-bold text-muted/60 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} className="text-green-mid/50" />
              {business.neighborhood || 'San Juan del Río'}
            </span>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-xpale group-hover:bg-green transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green/20">
              <span className="text-[10px] font-black text-green group-hover:text-white uppercase tracking-widest leading-none">
                WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
