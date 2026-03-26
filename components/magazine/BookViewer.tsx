'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize,
  Move,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { MagazinePage } from '@/types/magazine';

interface BookViewerProps {
  pages: MagazinePage[];
  total: number;
}

export const BookViewer = ({ pages, total }: BookViewerProps) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Panning/Swipe state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastOffset = useRef({ x: 0, y: 0 });
  const swipeDistance = useRef(0);

  useEffect(() => {
    const checkLayout = () => {
      // Activa vista spread solo si es ancho (monitor) o si es tablet en horizontal
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsDesktop(width > height && width >= 1000);
    };
    checkLayout();
    window.addEventListener('resize', checkLayout);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('resize', checkLayout);
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Slides Definition
  const slides = useMemo(() => {
    const s: number[][] = [];
    if (!isDesktop) {
      for (let i = 1; i <= total; i++) s.push([i]);
    } else {
      s.push([1]);
      for (let i = 2; i < total; i += 2) {
        if (i + 1 < total) s.push([i, i + 1]);
        else if (i + 1 === total) s.push([i, i + 1]);
        else s.push([i]);
      }
      if (total > 1 && total % 2 === 0) {
        const alreadyIncluded = s.some((chunk) => chunk.includes(total));
        if (!alreadyIncluded) s.push([total]);
      }
    }
    return s;
  }, [isDesktop, total]);

  useEffect(() => {
    if (!isChanging) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
      lastOffset.current = { x: 0, y: 0 };
    }
  }, [slideIndex, isChanging]);

  const handleNext = () => {
    if (slideIndex >= slides.length - 1 || isChanging) return;
    setIsChanging(true);
    setTimeout(() => {
      setSlideIndex((prev) => prev + 1);
      setIsChanging(false);
    }, 300);
  };

  const handlePrev = () => {
    if (slideIndex <= 0 || isChanging) return;
    setIsChanging(true);
    setTimeout(() => {
      setSlideIndex((prev) => prev - 1);
      setIsChanging(false);
    }, 300);
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.5, 1);
    setScale(newScale);
    if (newScale === 1) {
      setOffset({ x: 0, y: 0 });
      lastOffset.current = { x: 0, y: 0 };
    }
  };

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY };
    swipeDistance.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;

    if (scale > 1) {
      setOffset({
        x: lastOffset.current.x + dx,
        y: lastOffset.current.y + dy,
      });
    } else {
      swipeDistance.current = dx;
    }
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (scale > 1) {
      lastOffset.current = { x: offset.x, y: offset.y };
    } else {
      // Swipe Detection
      if (Math.abs(swipeDistance.current) > 50) {
        if (swipeDistance.current > 0) handlePrev();
        else handleNext();
      }
    }
  };

  const renderPage = (
    num: number,
    side: 'left' | 'right' | 'single' = 'single'
  ) => {
    const data = pages.find((p) => p.page_number === num);
    return (
      <div
        className={`relative h-full aspect-[9/16] bg-[#111] shadow-2xl transition-all duration-300
                    ${
                      side === 'left'
                        ? 'rounded-l-xl border-y border-l border-white/5'
                        : ''
                    }
                    ${
                      side === 'right'
                        ? 'rounded-r-xl border-y border-r border-white/5'
                        : ''
                    }
                    ${
                      side === 'single'
                        ? 'rounded-xl border border-white/5'
                        : ''
                    }
                `}
      >
        <div className="w-full h-full overflow-hidden rounded-[inherit]">
          {data?.image_url ? (
            <img
              src={data.image_url}
              alt={`Página ${num}`}
              draggable={false}
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-contain select-none shadow-inner"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/5 bg-black/50">
              <span className="font-outfit text-5xl md:text-7xl font-black opacity-30">
                {num}
              </span>
            </div>
          )}
        </div>

        {/* Botón Micrositio (Inferior) - Posicionado fuera de la imagen cerca del menú */}
        {data?.business_link && scale === 1 && (
          <div className="absolute -bottom-2 left-0 w-full flex justify-center z-[100] pointer-events-none px-4">
            <Link
              href={data.business_link}
              target="_blank"
              className="pointer-events-auto"
            >
              <button className="bg-green/90 hover:bg-green px-3.5 py-1.5 rounded-full text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20 flex items-center gap-1.5 transform hover:scale-105 transition-all backdrop-blur-sm">
                <ExternalLink size={10} />
                {data.business_name || 'Ver Perfil'}
              </button>
            </Link>
          </div>
        )}

        {/* Sombra lomo */}
        {side === 'left' && (
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-20" />
        )}
        {side === 'right' && (
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-20" />
        )}
      </div>
    );
  };

  const currentSlide = slides[slideIndex] || [1];

  // Prefetch de imágenes adyacentes
  const prefetchImages = useMemo(() => {
    const nextSlide = slides[slideIndex + 1];
    const prevSlide = slides[slideIndex - 1];
    const images: string[] = [];
    [prevSlide, nextSlide].forEach((s) => {
      if (s)
        s.forEach((num) => {
          const p = pages.find((pg) => pg.page_number === num);
          if (p?.image_url) images.push(p.image_url);
        });
    });
    return images;
  }, [slideIndex, slides, pages]);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#050706] flex flex-col items-center justify-start overflow-hidden select-none">
      {/* Prefetch oculto */}
      <div className="hidden" aria-hidden="true">
        {prefetchImages.map((src) => (
          <img key={src} src={src} loading="lazy" />
        ))}
      </div>
      <div className="absolute inset-0 bg-[url('/bg-texture.png')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none" />

      {/* Area de Lectura */}
      <div
        className={`relative flex-1 w-full flex justify-center overflow-hidden
                ${isDesktop ? 'items-center pt-2 pb-24' : 'items-start pt-4'}
            `}
      >
        {/* Mobile Side Nav Buttons (Overlay on visual area) */}
        {!isDesktop && scale === 1 && (
          <>
            <div
              onClick={handlePrev}
              className="absolute left-0 top-0 w-12 h-full z-[150] cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white/10 group-active:text-white" />
            </div>
            <div
              onClick={handleNext}
              className="absolute right-0 top-0 w-12 h-full z-[150] cursor-pointer flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5 text-white/10 group-active:text-white" />
            </div>
          </>
        )}

        <div
          className={`flex items-center justify-center transition-all duration-300 transform-gpu
                        ${
                          isChanging
                            ? 'opacity-0 scale-95'
                            : 'opacity-100 scale-100'
                        }
                        ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}
                    `}
          style={{
            transform: `scale(${scale}) translate(${offset.x / scale}px, ${
              offset.y / scale
            }px)`,
            transition: isDragging
              ? 'none'
              : 'transform 0.4s cubic-bezier(0.2, 0, 0.4, 1), opacity 0.3s ease',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onMouseDown}
          onTouchMove={onMouseMove}
          onTouchEnd={onMouseUp}
        >
          <div
            className={`flex items-center justify-center max-w-full gap-0 ${
              isDesktop ? 'h-[85vh]' : 'h-[82vh]'
            }`}
          >
            {currentSlide.length === 1 ? (
              renderPage(currentSlide[0], 'single')
            ) : (
              <>
                {renderPage(currentSlide[0], 'left')}
                {renderPage(currentSlide[1], 'right')}
              </>
            )}
          </div>
        </div>

        {/* Desktop Nav Buttons */}
        <button
          onClick={handlePrev}
          disabled={slideIndex === 0 || isChanging}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-[100] p-4 bg-black/40 hover:bg-green text-white rounded-full backdrop-blur-md transition-all disabled:opacity-0 disabled:pointer-events-none border border-white/10 hidden md:block shadow-2xl"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNext}
          disabled={slideIndex === slides.length - 1 || isChanging}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-[100] p-4 bg-black/40 hover:bg-green text-white rounded-full backdrop-blur-md transition-all disabled:opacity-0 disabled:pointer-events-none border border-white/10 hidden md:block shadow-2xl"
        >
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>

      {/* Barra Inferior */}
      <div className="absolute bottom-0 left-0 w-full h-[80px] md:h-[90px] bg-black/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-4 md:px-12 z-[200]">
        {/* Paginas */}
        <div className="flex items-center gap-2 md:gap-4 md:w-1/3">
          <button
            onClick={handlePrev}
            disabled={slideIndex === 0 || isChanging}
            className="p-2 md:p-3 bg-white/5 rounded-full hover:bg-green text-white transition-all disabled:opacity-0 border border-white/5"
          >
            <ArrowLeft size={16} className="md:w-5 md:h-5" />
          </button>
          <div className="text-center min-w-[80px] md:min-w-[100px]">
            <span className="text-white font-mono font-bold text-xs md:text-lg tracking-tighter">
              {currentSlide.length > 1
                ? `${currentSlide[0]}-${currentSlide[1]}`
                : currentSlide[0]}
              <span className="text-white/30 mx-1.5">/</span>
              {total}
            </span>
          </div>
          <button
            onClick={handleNext}
            disabled={slideIndex === slides.length - 1 || isChanging}
            className="p-2 md:p-3 bg-white/5 rounded-full hover:bg-green text-white transition-all disabled:opacity-0 border border-white/5"
          >
            <ArrowRight size={16} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden md:flex justify-center md:w-1/3">
          <Link href="/">
            <img
              src="/logo-white.png"
              alt="Logo"
              className="h-7 opacity-40 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-1.5 md:gap-3 justify-end md:w-1/3">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="p-2 md:p-2.5 bg-white/5 text-white rounded-full hover:bg-white/10 transition-all disabled:opacity-20 border border-white/5"
          >
            <ZoomOut size={16} className="md:w-5 md:h-5" />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="p-2 md:p-2.5 bg-white/5 text-white rounded-full hover:bg-white/10 transition-all disabled:opacity-20 border border-white/5"
          >
            <ZoomIn size={16} className="md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => {
              // Intenta cerrar la ventana/pestaña si fue abierta por script o es nueva
              window.close();
              // Fallback: si no se cerró, redirigir al inicio o ir atrás
              if (!window.closed) {
                window.location.href = '/';
              }
            }}
            className="p-2 md:p-2.5 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
          >
            <X size={16} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <style jsx global>{`
                body { overflow: hidden; }
                .cursor-grab { cursor: grab; }
                .cursor-grabbing { cursor: grabbing; }
            `}</style>
    </div>
  );
};
