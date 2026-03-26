'use client';

import { useState, useEffect } from 'react';

const words = [
  'restaurante',
  'café',
  'panadería',
  'doctor',
  'arquitecto',
  'abogados',
  'tacos',
  'tortas',
];

export const StatsStrip = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-green-dark py-16 px-6 md:px-12 border-y border-white/5 relative overflow-hidden flex justify-center items-center text-center">
      {/* Texture accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--white)_1px,_transparent_1px)] bg-[length:24px_24px]" />

      <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-center gap-x-4 gap-y-2">
        <span className="font-outfit font-black text-4xl md:text-5xl lg:text-6xl text-white">
          Busca
        </span>
        <div className="relative h-[48px] md:h-[60px] lg:h-[72px] overflow-hidden min-w-[280px] md:min-w-[340px] flex justify-center items-center">
          {words.map((word, i) => (
            <span
              key={word}
              className={`absolute font-outfit font-black text-4xl md:text-5xl lg:text-6xl text-green-light transition-all duration-500 ease-in-out ${
                index === i
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-4'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
        <span className="font-outfit font-black text-4xl md:text-5xl lg:text-6xl text-white">
          en nuestra ciudad
        </span>
      </div>
    </section>
  );
};
