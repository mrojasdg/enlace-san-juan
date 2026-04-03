'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronRight,
  LayoutGrid,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex bg-green-xpale min-h-screen relative overflow-hidden">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Dynamic Header */}
        <header className="h-20 md:h-24 bg-white/50 backdrop-blur-xl border-b border-border px-4 md:px-12 flex items-center justify-between shrink-0 relative z-40 shadow-sm">
          {/* Menu Toggle & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-green-deeper active:scale-95 transition-all shadow-sm"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden sm:flex flex-col gap-1">
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
              <h1 className="font-outfit font-black text-xl md:text-3xl text-green-deeper leading-none capitalize truncate max-w-[150px] md:max-w-none">
                {title ||
                  (pageTitle === 'dashboard' ? 'Resumen General' : pageTitle)}
              </h1>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Global Search Admin - Hidden on very small screens */}
            <div className="hidden xl:flex items-center gap-3 bg-white border border-border rounded-2xl px-5 py-3 shadow-inner group focus-within:ring-2 focus-within:ring-green-mid/10 focus-within:border-green-mid/50 transition-all">
              <Search
                size={18}
                className="text-muted/40 group-focus-within:text-green-mid transition-colors"
              />
              <input
                type="text"
                placeholder="Buscar negocios..."
                className="bg-transparent border-none outline-none text-xs font-bold text-ink2 w-32 xl:w-64 placeholder:text-muted/20"
              />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border border-border text-muted hover:text-green-mid hover:bg-green-xpale transition-all flex items-center justify-center relative active:scale-95">
                <Bell size={18} />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
              </button>
              <div className="hidden md:block h-8 w-px bg-border/50 mx-2" />
              <Link href="/" target="_blank">
                <button className="h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl bg-green text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-green/20 hover:bg-green-mid transition-all flex items-center gap-2 md:gap-3">
                  <LayoutGrid size={14} />
                  <span className="hidden sm:inline">Sitio</span>
                </button>
              </Link>
            </div>
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
};
