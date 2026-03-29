import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="bg-green-deeper text-white py-16 px-6 md:px-12">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Logo & Tagline */}
        <div className="space-y-6">
          <Link href="/">
            <Image
              src="/logo-white.png"
              alt="Enlace San Juan"
              width={100}
              height={24}
              className="h-6 w-auto brightness-0 invert"
              priority
            />
          </Link>
          <p className="text-white/50 text-sm leading-relaxed max-w-[240px]">
            El directorio digital más completo de San Juan del Río. Conectamos
            negocios locales con su comunidad.
          </p>
        </div>

        {/* Column 2: Categorías */}
        <div className="space-y-6">
          <h4 className="font-outfit font-bold text-lg">Categorías</h4>
          <ul className="space-y-3">
            {['Gastronomía', 'Salud', 'Belleza', 'Retail'].map((item) => (
              <li key={item}>
                <Link
                  href={`/categoria/${item.toLowerCase()}`}
                  className="text-white/50 hover:text-white/85 text-sm transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#categorias"
                className="text-white/50 hover:text-white/85 text-sm transition-colors font-bold mt-2 inline-block"
              >
                Ver más +
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Anunciantes */}
        <div className="space-y-6">
          <h4 className="font-outfit font-bold text-lg">Anunciantes</h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/precios"
                className="text-white/50 hover:text-white/85 text-sm transition-colors"
              >
                Ver Paquetes
              </Link>
            </li>
            <li>
              <Link
                href="/revista"
                className="text-white/50 hover:text-white/85 text-sm transition-colors"
              >
                Revista Digital
              </Link>
            </li>
            <li>
              <Link
                href="/registrate"
                className="text-white/50 hover:text-white/85 text-sm transition-colors"
              >
                Registra tu negocio
              </Link>
            </li>
            <li>
              <Link
                href="/terminos"
                className="text-white/50 hover:text-white/85 text-sm transition-colors"
              >
                Términos y Condiciones
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contacto */}
        <div className="space-y-6">
          <h4 className="font-outfit font-bold text-lg">Contacto</h4>
          <ul className="space-y-3">
            <li className="text-white/50 text-sm">
              San Juan del Río, Qro. México
            </li>
            <li>
              <Link
                href="mailto:hola@enlacesanjuan.com.mx"
                className="text-white/50 hover:text-white/85 text-sm transition-colors"
              >
                hola@enlacesanjuan.com.mx
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/50"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <Link
                href="https://wa.me/524273232026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white/85 text-sm transition-colors"
              >
                427 323 2026
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto mt-16 pt-8 border-t border-white/10 text-center sm:text-left">
        <p className="text-white/30 text-xs font-jakarta">
          © {new Date().getFullYear()} Enlace San Juan. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};
