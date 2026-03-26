'use client';

import { AdminSidebar } from './AdminSidebar';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronRight,
  LayoutGrid,
} from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const pathname = usePathname();
  const pageTitle = pathname.split('/').pop() || 'Dashboard';

  const breadcrumbs = [
    { name: 'Admin', href: '/admin/dashboard' },
    {
      name: pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1),
      href: pathname,
    },
  ];

  return (
    <div className="flex bg-green-xpale min-h-screen">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Dynamic Header */}
        <header className="h-24 bg-white/50 backdrop-blur-xl border-b border-border px-12 flex items-center justify-between shrink-0 relative z-40 shadow-sm">
          {/* Breadcrumbs */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60 mb-1">
              {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.href} className="flex items-center gap-3">
                  <Link
                    href={crumb.href}
                    className="hover:text-green-mid transition-all"
                  >
                    {crumb.name}
                  </Link>
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight size={10} className="text-muted/30" />
                  )}
                </div>
              ))}
            </div>
            <h1 className="font-outfit font-black text-3xl text-green-deeper leading-none capitalize">
              {title ||
                (pageTitle === 'dashboard' ? 'Resumen General' : pageTitle)}
            </h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-6">
            {/* Global Search Admin */}
            <div className="hidden md:flex items-center gap-3 bg-white border border-border rounded-2xl px-5 py-3 shadow-inner group focus-within:ring-2 focus-within:ring-green-mid/10 focus-within:border-green-mid/50 transition-all">
              <Search
                size={18}
                className="text-muted/40 group-focus-within:text-green-mid transition-colors"
              />
              <input
                type="text"
                placeholder="Buscar negocios, IDs, slugs..."
                className="bg-transparent border-none outline-none text-xs font-bold text-ink2 w-64 placeholder:text-muted/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-2xl bg-white border border-border text-muted hover:text-green-mid hover:bg-green-xpale hover:shadow-xl hover:shadow-green/5 transition-all duration-300 flex items-center justify-center relative active:scale-95 group">
                <Bell
                  size={20}
                  className="group-hover:translate-z-1 transform"
                />
                <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-border/50 mx-2" />
              <Link href="/" target="_blank">
                <button className="h-12 px-6 rounded-2xl bg-green text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-green/20 hover:bg-green-mid hover:shadow-2xl hover:shadow-green/30 active:scale-95 transition-all flex items-center gap-3">
                  <LayoutGrid size={16} />
                  Ver sitio público
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 p-12 overflow-y-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-12 pb-24">{children}</div>
        </section>
      </main>
    </div>
  );
};
