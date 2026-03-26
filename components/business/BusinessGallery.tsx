'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BusinessGalleryProps {
  images: string[];
  businessName: string;
}

export default function BusinessGallery({
  images,
  businessName,
}: BusinessGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setIndex(i);
  const closeLightbox = () => setIndex(null);
  const nextImage = () => setIndex((index! + 1) % images.length);
  const prevImage = () =>
    setIndex((index! - 1 + images.length) % images.length);

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-center px-4">
        <h2 className="font-outfit font-black text-2xl text-green-deeper uppercase tracking-[0.1em] flex items-center gap-3">
          <span className="w-1.5 h-8 bg-green rounded-full" />
          Galería de fotos
        </h2>
        <span className="bg-white px-4 py-1 rounded-full border border-border text-[10px] font-black text-muted uppercase tracking-widest shadow-sm">
          {images.length} Fotos
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {images.map((url, i) => (
          <div
            key={i}
            onClick={() => openLightbox(i)}
            className="aspect-square relative rounded-[2rem] overflow-hidden group bg-white border border-border hover:scale-[1.03] transition-all duration-500 shadow-lg cursor-zoom-in"
          >
            <Image
              src={url}
              alt={`${businessName} gallery ${i}`}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <Maximize2 size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {index !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-[10001] border border-white/20 backdrop-blur-md"
          >
            <X size={32} />
          </button>

          {/* Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all z-[10001] border border-white/10 backdrop-blur-md"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all z-[10001] border border-white/10 backdrop-blur-md"
          >
            <ChevronRight size={32} />
          </button>

          {/* Image Container */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-[70vh] md:h-[80vh]">
              <Image
                src={images[index]}
                alt={`${businessName} detail`}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-8 text-white/50 font-black uppercase tracking-[0.3em] text-[10px] bg-white/5 px-6 py-2 rounded-full border border-white/10">
              {index + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
