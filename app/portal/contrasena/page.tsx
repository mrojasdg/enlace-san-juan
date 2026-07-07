'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function PortalPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success('Contraseña actualizada correctamente');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1 block mb-1">SEGURIDAD DE LA CUENTA</p>
        <p className="text-muted text-xs font-jakarta leading-relaxed max-w-sm">
          Actualiza la contraseña de acceso a tu portal administrativo. Recomendamos usar una contraseña segura y única.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border border-border p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-xpale rounded-full blur-2xl -mr-12 -mt-12"></div>
        
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-4">
            {/* Nueva Contraseña */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40" size={18} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Min. 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green outline-none rounded-xl py-4 pl-12 pr-12 font-bold text-sm text-ink transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40" size={18} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green outline-none rounded-xl py-4 pl-12 pr-12 font-bold text-sm text-ink transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-green hover:bg-green-mid text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-green/20 transition-all flex items-center justify-center gap-2 pt-1"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Guardar Contraseña'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
