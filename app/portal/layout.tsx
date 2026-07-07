'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Business } from '@/types/business';
import toast from 'react-hot-toast';
import { PortalLayout } from '@/components/portal/PortalLayout';

interface PortalContextType {
  business: Business | null;
  user: any | null;
  loading: boolean;
}

const PortalContext = createContext<PortalContextType>({
  business: null,
  user: null,
  loading: true,
});

export const usePortal = () => useContext(PortalContext);

export default function PortalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/portal/login';

  useEffect(() => {
    const checkAuthAndFetchBusiness = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setUser(null);
          setBusiness(null);
          if (!isLoginPage) {
            router.push('/portal/login');
          }
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Consultar negocio vinculado
        const { data: bizData, error: bizError } = await supabase
          .from('businesses')
          .select('*, category:categories(name, slug)')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (bizError) throw bizError;

        if (!bizData) {
          // Si es super-admin, permitir o redireccionar a admin
          const adminEmails = ['mauriciorojasdiseno@gmail.com', 'hola@enlacesanjuan.com.mx', 'admin@enlacesanjuan.com.mx'];
          if (adminEmails.includes(session.user.email || '')) {
            toast.error('Eres administrador general. Redirigiendo a tu panel.');
            router.push('/admin/dashboard');
            return;
          }

          toast.error('Esta cuenta no tiene ningún negocio asociado.');
          await supabase.auth.signOut();
          router.push('/portal/login');
          return;
        }

        if (!bizData.has_bookings) {
          toast.error('Tu negocio no tiene habilitado el sistema de reservas.');
          await supabase.auth.signOut();
          router.push('/portal/login');
          return;
        }

        setBusiness(bizData);

        // Si está en login y ya está validado, mandar al dashboard
        if (isLoginPage) {
          router.push('/portal/dashboard');
        }
      } catch (err: any) {
        console.error('Error in portal auth check:', err);
        toast.error('Error de autenticación');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchBusiness();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isLoginPage) {
        router.push('/portal/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, isLoginPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-xpale flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-green/20 border-t-green rounded-full animate-spin"></div>
        <p className="font-outfit font-black text-green-deeper uppercase tracking-widest text-[10px]">Cargando portal...</p>
      </div>
    );
  }

  if (isLoginPage) {
    return <PortalContext.Provider value={{ business, user, loading }}>{children}</PortalContext.Provider>;
  }

  if (!user || !business) {
    return null;
  }

  return (
    <PortalContext.Provider value={{ business, user, loading }}>
      <PortalLayout business={business as any}>
        {children}
      </PortalLayout>
    </PortalContext.Provider>
  );
}
