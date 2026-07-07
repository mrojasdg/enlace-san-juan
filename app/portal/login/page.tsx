'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PortalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Iniciando sesión...');
      // El layout detectará el cambio de auth y lo redireccionará
    } catch (error: any) {
      toast.error(error.message || 'Credenciales incorrectas');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4FBF5] relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-mid rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-lg relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 text-center flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <Image
            src="https://enlacesanjuan.com.mx/wp-content/uploads/2025/12/enlaceLogoSanJuan-300x125.png"
            alt="Enlace San Juan"
            width={180}
            height={75}
            className="h-14 w-auto object-contain"
            priority
          />
          <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-border shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
              Portal de Socios
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-border/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green to-green-mid" />

          <div className="mb-10">
            <h1 className="font-outfit font-black text-3xl text-green-deeper leading-tight mb-2">
              Bienvenido Socio
            </h1>
            <p className="text-muted font-jakarta text-xs leading-relaxed max-w-xs">
              Ingresa tus credenciales para administrar tus reservas e información de empresa.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.15em] ml-2 block group-focus-within:text-green-mid transition-colors">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-green transition-all" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="socio@correo.com"
                    className="w-full bg-green-xpale/40 border border-border focus:border-green/20 focus:bg-white outline-none rounded-xl py-4 pl-12 pr-6 text-sm font-bold text-ink placeholder:text-muted/30 transition-all font-jakarta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.15em] ml-2 block group-focus-within:text-green-mid transition-colors">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-green transition-all" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-green-xpale/40 border border-border focus:border-green/20 focus:bg-white outline-none rounded-xl py-4 pl-12 pr-6 text-sm font-bold text-ink placeholder:text-muted/30 transition-all font-jakarta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-xl shadow-xl shadow-green/10 text-sm font-black tracking-widest uppercase flex items-center justify-center gap-3 active:scale-95 transition-all mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar al Portal
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-border flex items-center justify-between text-[9px] font-black text-muted uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <AlertCircle size={12} className="text-green-mid" />
              Acceso Privado
            </div>
            <Link href="/" className="hover:text-green transition-colors">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
