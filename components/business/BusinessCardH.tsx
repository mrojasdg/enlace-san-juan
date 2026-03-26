'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Business } from '@/types/business';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, MapPin, MessageCircle } from 'lucide-react';
import { isOpenNow } from '@/utils/schedule';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

interface BusinessCardHProps {
  business: Business;
}

export const BusinessCardH = ({ business }: BusinessCardHProps) => {
  const isOpen = business.schedule
    ? isOpenNow(business.schedule as any)
    : false;

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Cover Image */}
      <Link
        href={`/${business.slug}`}
        className="w-full sm:w-48 h-48 relative overflow-hidden flex-shrink-0 bg-gray-100 group"
      >
        {business.cover_url ? (
          <Image
            src={business.cover_url}
            alt={business.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted/30">
            Sin imagen
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/${business.slug}`} className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-green-mid uppercase tracking-widest bg-green-xpale px-2 py-0.5 rounded-full">
                  {business.category?.name || 'Categoría'}
                </span>
                {business.is_featured && (
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest bg-gold/10 px-2 py-0.5 rounded-full">
                    Destacado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {business.logo_url && (
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={business.logo_url}
                      alt={business.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <h3 className="font-outfit font-black text-xl text-ink leading-tight hover:text-green transition-colors">
                    {business.name}
                  </h3>
                  {business.verified && (
                    <CheckCircle
                      size={18}
                      className="text-blue-500 flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            </Link>
          </div>

          <p className="text-sm text-muted line-clamp-2 max-w-lg mb-4">
            {business.tagline ||
              business.description ||
              'Explora este negocio en San Juan del Río.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted mb-4">
            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full text-ink2">
              <MapPin size={13} className="text-green-mid" />
              {business.neighborhood || 'San Juan del Río'}
            </span>
            <span
              className={cn(
                'flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full',
                isOpen ? 'text-green bg-green-xpale' : 'text-red-500 bg-red-50'
              )}
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  isOpen ? 'bg-green' : 'bg-red-500'
                )}
              />
              {isOpen ? 'Abierto ahora' : 'Cerrado'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/${business.slug}`}>
            <Button variant="outline" size="sm" className="px-6 rounded-xl">
              Ver perfil
            </Button>
          </Link>
          {business.whatsapp && (
            <Link href={`https://wa.me/52${business.whatsapp}`} target="_blank">
              <Button
                size="sm"
                className="px-6 bg-[#25D366] hover:bg-[#128C7E] border-none flex items-center gap-2 rounded-xl"
              >
                <MessageCircle size={16} />
                WhatsApp
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
