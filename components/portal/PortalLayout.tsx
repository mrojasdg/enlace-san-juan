'use client';

import { useState } from 'react';
import { PortalSidebar } from './PortalSidebar';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutGrid, Globe, LogOut } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface PortalLayoutProps {
  children: React.ReactNode;
  business: {
    id: string;
    name: string;
    slug: string;
    category?: {
      slug: string;
    } | any;
  };
}

export function PortalLayout({ children, business }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = pathname.split('/').pop() || 'Dashboard';

  const categorySlug = business.category?.slug || 'premium';

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error al cerrar sesión');
    } else {
      toast.success('Sesión cerrada correctamente');
      window.location.href = '/portal/login';
    }
  };

  return (
    <div className="flex bg-green-xpale min-h-screen relative overflow-hidden">
      <PortalSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        businessName={business.name}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Portal Header */}
        <header className="h-20 md:h-24 bg-white/50 backdrop-blur-xl border-b border-border px-4 md:px-12 flex items-center justify-between shrink-0 relative z-40 shadow-sm">
          {/* Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-green-deeper active:scale-95 transition-all shadow-sm"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted/50 hidden sm:inline">
                Portal de Negocios
              </span>
              <h1 className="font-outfit font-black text-lg md:text-2xl text-green-deeper leading-none capitalize truncate max-w-[200px] md:max-w-none">
                {pageTitle === 'dashboard' ? 'Resumen General' : pageTitle === 'reservas' ? 'Mis Reservas' : pageTitle === 'contrasena' ? 'Seguridad' : 'Editar Mi Negocio'}
              </h1>
            </div>
          </div>

          {/* Portal Header Actions */}
          <div className="flex items-center gap-3">
            <Link href={`/${categorySlug}/${business.slug}`} target="_blank">
              <button className="h-10 md:h-12 px-4 md:px-6 rounded-xl bg-green text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-green/20 hover:bg-green-mid transition-all flex items-center gap-2">
                <Globe size={14} />
                <span className="hidden sm:inline">Ver Mi Sitio</span>
                <span className="sm:hidden">Ver</span>
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="h-10 md:h-12 px-4 md:px-6 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 p-4 md:p-12 overflow-y-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-12 pb-24">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
