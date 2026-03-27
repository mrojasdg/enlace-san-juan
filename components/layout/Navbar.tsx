'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Menu,
  X,
  Search as SearchIcon,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const NavbarInner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hide search on Home but show on results and other pages
  const showSearch = pathname !== '/';

  // Stop matching spinner when URL params change (search completes)
  useEffect(() => {
    setIsSearching(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled state for background
      setScrolled(currentScrollY > 20);

      // Visibility logic
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down
        setVisible(false);
        setIsOpen(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Categorías', href: '/#categorias' },
    { name: 'Negocios', href: '/buscar' },
    { name: 'Revista', href: '/revista' },
    { name: 'Precios', href: '/precios' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500 transform',
        scrolled
          ? 'bg-white/95 border-b border-border backdrop-blur-md py-2 shadow-sm'
          : 'bg-white border-b border-transparent py-4',
        visible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Enlace San Juan"
            width={180}
            height={40}
            className="h-[34px] md:h-[40px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Search Bar (Dynamic) */}
        {showSearch && (
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md items-center bg-green-xpale/50 border border-green-pale/30 rounded-full pl-4 pr-1.5 py-1.5 group focus-within:ring-2 focus-within:ring-green/10 focus-within:border-green/30 transition-all"
          >
            <SearchIcon
              size={16}
              className="text-muted/60 group-focus-within:text-green mr-3"
            />
            <input
              type="text"
              placeholder="Buscar en San Juan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-ink w-full placeholder:text-muted/40"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="ml-2 bg-green px-4 py-2 rounded-full text-white hover:bg-green-mid transition-all disabled:opacity-50 flex items-center justify-center min-w-[36px] min-h-[36px]"
            >
              {isSearching ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <SearchIcon size={14} className="text-white" />
              )}
            </button>
          </form>
        )}

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[12px] font-jakarta font-bold text-muted hover:text-green transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/admin/login">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-border px-6 h-10 text-[10px] font-black uppercase tracking-widest text-muted"
            >
              Panel
            </Button>
          </Link>
          <Link href="/registrate">
            <Button
              size="sm"
              className="rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest bg-green hover:bg-green-mid border-none shadow-lg shadow-green/20"
            >
              Registra tu negocio
            </Button>
          </Link>
        </div>

        {/* Mobile Icons (Search + Menu) */}
        <div className="flex lg:hidden items-center gap-2">
          {showSearch && !isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="text-ink p-2 w-10 h-10 rounded-xl bg-green-xpale flex items-center justify-center transition-all"
            >
              <SearchIcon size={20} />
            </button>
          )}
          <button
            className="text-ink p-2 w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-border shadow-2xl animate-in fade-in slide-in-from-top-4 overflow-hidden">
          <div className="flex flex-col p-6 gap-6">
            {/* Mobile Search */}
            {showSearch && (
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-green-xpale border border-green-pale rounded-2xl pl-5 pr-2 py-2 w-full"
              >
                <SearchIcon size={18} className="text-green mr-3" />
                <input
                  type="text"
                  placeholder="¿Qué buscas hoy?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold text-ink w-full flex-1"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="ml-3 bg-green p-3 rounded-xl text-white hover:bg-green-mid transition-all disabled:opacity-50 flex items-center justify-center min-w-[44px] min-h-[44px]"
                >
                  {isSearching ? (
                    <Loader2 size={18} className="animate-spin text-white" />
                  ) : (
                    <SearchIcon size={18} className="text-white" />
                  )}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-outfit font-black text-ink hover:bg-green-xpale p-4 rounded-2xl transition-all flex items-center justify-between group"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  <SearchIcon
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-all text-green"
                  />
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-border font-black uppercase text-xs tracking-widest text-muted"
                >
                  Panel de Control
                </Button>
              </Link>
              <Link href="/registrate" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-14 rounded-2xl bg-green hover:bg-green-mid border-none font-black uppercase text-xs tracking-widest text-white shadow-xl shadow-green/20">
                  Registra tu negocio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Navbar = () => {
  return (
    <Suspense fallback={<div className="h-20 bg-white" />}>
      <NavbarInner />
    </Suspense>
  );
};
