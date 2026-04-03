'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Building2,
  PlusCircle,
  Settings,
  LogOut,
  Home,
  Grid3X3,
  BookOpen,
  Mail,
  HelpCircle,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const menuItems = [
  { name: 'Resumen', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Negocios', href: '/admin/negocios', icon: Building2 },
  { name: 'Agregar nuevo', href: '/admin/negocios/nuevo', icon: PlusCircle },
  { name: 'Categorías', href: '/admin/categorias', icon: Grid3X3 },
  { name: 'Revista Web', href: '/admin/revistas', icon: BookOpen },
  { name: 'Estadísticas', href: '/admin/estadisticas', icon: BarChart3 },
];

const secondaryItems = [
  { name: 'Configuración', href: '/admin/settings', icon: Settings },
  { name: 'Soporte', href: '/admin/support', icon: HelpCircle },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error al cerrar sesión');
    } else {
      toast.success('Sesión cerrada correctamente');
      router.push('/admin/login');
      router.refresh();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed lg:relative w-[300px] h-screen bg-green-deeper text-white flex flex-col items-center justify-between py-12 px-6 border-r border-white/5 z-[70] shadow-2xl overflow-hidden shrink-0 transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
      {/* Decorative pulse background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-green/10 to-transparent pointer-events-none" />

      {/* Header / Logo */}
      <div className="w-full flex flex-col items-center gap-12 relative z-10">
        <Link href="/admin/dashboard" className="group">
          <Image
            src="/logo-white.png"
            alt="Enlace San Juan Admin"
            width={140}
            height={32}
            className="h-8 w-auto brightness-0 invert shadow-2xl transition-transform group-hover:scale-105"
          />
          <div className="mt-4 flex items-center justify-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-mid" />
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40">
              Admin Panel
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="w-full space-y-2">
          <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">
            Menú principal
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-jakarta',
                  isActive
                    ? 'bg-white text-green-deeper font-black shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-[1.05]'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon
                  size={22}
                  className={cn(
                    'transition-transform group-hover:scale-110',
                    isActive ? 'text-green-mid' : 'text-white/20'
                  )}
                />
                <span className="text-sm font-bold tracking-tight">
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Secondary Menu */}
        <nav className="w-full space-y-2 mt-8">
          <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">
            Sistema
          </p>
          {secondaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 px-5 py-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <item.icon
                size={18}
                className="text-white/10 group-hover:text-white/30"
              />
              <span className="text-xs font-bold tracking-tight">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer / User / Logout */}
      <div className="w-full space-y-6 relative z-10 pt-12 border-t border-white/5">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-light to-green-mid p-0.5 shadow-xl">
            <div className="w-full h-full bg-green-deeper rounded-[0.85rem] flex items-center justify-center font-outfit font-black text-white">
              AD
            </div>
          </div>
          <div>
            <p className="text-xs font-black text-white leading-tight uppercase tracking-widest">
              Administrador
            </p>
            <p className="text-[10px] text-white/40 leading-tight">
              Acceso total
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest active:scale-95 group shadow-2xl"
        >
          <LogOut
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Cerrar sesión
        </button>

        <p className="text-center text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">
          Enlace San Juan Engine
        </p>
      </div>
    </aside>
    </>
  );
};
