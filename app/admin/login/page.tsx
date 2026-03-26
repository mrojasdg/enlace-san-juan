'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Mail, Lock, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Bienvenido al panel, administrador');
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-green-deeper relative flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-mid rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-lg relative z-10 flex flex-col items-center">
        {/* Logo above card */}
        <div className="mb-12 text-center flex flex-col items-center gap-4">
          <Image
            src="/logo-white.png"
            alt="Enlace San Juan"
            width={180}
            height={40}
            className="h-12 w-auto brightness-0 invert"
          />
          <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
              Acceso Administrativo
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white/5 relative overflow-hidden group">
          {/* subtle line accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green to-green-mid" />

          <div className="mb-10">
            <h1 className="font-outfit font-black text-4xl text-green-deeper leading-tight mb-3">
              Panel de <br /> Gestión
            </h1>
            <p className="text-muted font-jakarta text-sm leading-relaxed max-w-[240px]">
              Inicia sesión para administrar los negocios en el directorio
              local.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-5">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.15em] ml-2 block group-focus-within:text-green-mid transition-colors">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-green-mid transition-all"
                    size={20}
                  />
                  <input
                    type="email"
                    required
                    placeholder="admin@enlacesanjuan.com.mx"
                    className="w-full bg-green-xpale/50 border-2 border-transparent focus:border-green-mid/20 focus:bg-white outline-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-ink placeholder:text-muted/30 transition-all font-jakarta shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.15em] ml-2 block group-focus-within:text-green-mid transition-colors">
                  Contraseña Segura
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-green-mid transition-all"
                    size={20}
                  />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-green-xpale/50 border-2 border-transparent focus:border-green-mid/20 focus:bg-white outline-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-ink placeholder:text-muted/30 transition-all font-jakarta shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-2xl shadow-xl shadow-green/20 text-lg font-black tracking-tight flex items-center justify-center gap-3 active:scale-95 transition-all enabled:hover:bg-green-mid"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar al sistema
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </form>

          {/* Additional info footer */}
          <div className="mt-12 pt-8 border-t border-border flex items-center justify-between text-[10px] font-black text-muted uppercase tracking-widest gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-green-mid" />
              Solo personal autorizado
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <Link href="/" className="hover:text-green-mid transition-colors">
              Volver al sitio público
            </Link>
          </div>
        </div>

        {/* Footer brand */}
        <p className="mt-12 text-white/20 font-jakarta text-[10px] uppercase font-bold tracking-[0.25em]">
          Powered by Enlace San Juan Engine v1.0
        </p>
      </div>
    </main>
  );
}
