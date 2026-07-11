'use client';

import React, { useEffect, useState } from 'react';
import { usePortal } from '../layout';
import { supabase } from '@/lib/supabase';
import { CalendarDays, Clock, Phone, Mail, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

export default function PortalBookingsPage() {
  const { business } = usePortal();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener fecha de hoy en formato local de México (YYYY-MM-DD)
  const getTodayString = () => {
    const options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const [{ value: month }, , { value: day }, , { value: year }] = formatter.formatToParts(new Date());
    return `${year}-${month}-${day}`;
  };

  const today = getTodayString();
  const [duration, setDuration] = useState<number>(business?.booking_duration || 60);

  const handleDurationChange = async (newDuration: number) => {
    if (!business) return;
    setDuration(newDuration);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ booking_duration: newDuration })
        .eq('id', business.id);

      if (error) throw error;
      toast.success('Intervalo de reservas actualizado');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar el intervalo');
    }
  };

  const fetchBookings = async () => {
    if (!business) return;
    setLoading(true);

    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('business_id', business.id);

      if (activeTab === 'upcoming') {
        // Próximas reservas (de hoy en adelante, y que estén confirmadas)
        query = query.gte('booking_date', today).eq('status', 'confirmed');
      } else {
        // Historial (anteriores a hoy, o canceladas)
        query = query.or(`booking_date.lt.${today},status.eq.cancelled`);
      }

      const { data, error } = await query.order('booking_date', { ascending: activeTab === 'upcoming' })
                                        .order('booking_time', { ascending: activeTab === 'upcoming' });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error('Error al cargar la lista de reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [business, activeTab]);

  const handleCancelBooking = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva? Se le notificará al cliente de la cancelación.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      toast.success('Reserva cancelada con éxito');
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('No se pudo cancelar la reserva');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Configuration Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex bg-white border border-border rounded-2xl p-1.5 shadow-sm w-full md:max-w-md">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={cn(
              'flex-1 py-3 rounded-xl font-jakarta font-black text-xs uppercase tracking-widest transition-all',
              activeTab === 'upcoming' ? 'bg-green text-white shadow-md' : 'text-muted/60 hover:text-green'
            )}
          >
            Próximas Citas
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={cn(
              'flex-1 py-3 rounded-xl font-jakarta font-black text-xs uppercase tracking-widest transition-all',
              activeTab === 'past' ? 'bg-green text-white shadow-md' : 'text-muted/60 hover:text-green'
            )}
          >
            Historial / Canceladas
          </button>
        </div>

        {/* Interval Selector */}
        <div className="flex items-center gap-3 bg-white border border-border rounded-2xl px-5 py-3 shadow-sm self-start md:self-auto">
          <Clock size={16} className="text-green shrink-0" />
          <span className="text-[10px] font-black text-muted uppercase tracking-widest select-none">Intervalo:</span>
          <select
            value={duration}
            onChange={(e) => handleDurationChange(Number(e.target.value))}
            className="bg-transparent border-none outline-none font-bold text-xs text-ink cursor-pointer focus:ring-0"
          >
            <option value={30}>30 minutos</option>
            <option value={60}>60 minutos (1h)</option>
            <option value={90}>90 minutos (1.5h)</option>
            <option value={120}>120 minutos (2h)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-green/20 border-t-green rounded-full animate-spin"></div>
          <p className="text-xs text-muted uppercase font-black">Cargando citas...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const [y, m, d] = booking.booking_date.split('-');
            const formattedDate = `${d}/${m}/${y}`;
            const isConfirmed = booking.status === 'confirmed';

            return (
              <div
                key={booking.id}
                className={cn(
                  'bg-white rounded-[2rem] border p-6 md:p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative overflow-hidden group',
                  !isConfirmed ? 'opacity-60 border-border bg-gray-50/50' : 'border-border hover:border-green-pale'
                )}
              >
                {!isConfirmed && (
                  <div className="absolute top-4 right-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-200">
                    Cancelada
                  </div>
                )}
                
                {isConfirmed && (
                  <div className="absolute top-4 right-4 bg-green-xpale text-green px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green/10">
                    Confirmada
                  </div>
                )}

                <div className="space-y-6">
                  {/* Fecha y Hora */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-xpale text-green rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                      <CalendarDays size={20} />
                    </div>
                    <div>
                      <h4 className="font-outfit font-black text-lg text-ink leading-tight">{formattedDate}</h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} />
                        {booking.booking_time} hrs
                      </p>
                    </div>
                  </div>

                  {/* Detalles de cliente */}
                  <div className="bg-green-xpale/20 rounded-2xl p-5 border border-border/40 space-y-3 font-jakarta text-xs">
                    <div className="flex items-center gap-3">
                      <User size={14} className="text-muted/40" />
                      <span className="font-black text-ink">
                        {booking.client_name}
                        {booking.num_people && (
                          <span className="ml-2 px-2.5 py-0.5 rounded-full bg-green/10 text-green font-black text-[9px] uppercase tracking-wider">
                            {booking.num_people} {booking.num_people === 1 ? 'Lugar' : 'Lugares'}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-muted/40" />
                      <a href={`https://wa.me/52${booking.client_phone.replace(/\s+/g, '')}`} target="_blank" className="font-bold text-green hover:underline">
                        {booking.client_phone} (WhatsApp)
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={14} className="text-muted/40" />
                      <span className="font-bold text-ink2">{booking.client_email}</span>
                    </div>
                  </div>
                </div>

                {isConfirmed && activeTab === 'upcoming' && (
                  <div className="mt-8 pt-4 border-t border-border/50 flex justify-end">
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-5 py-2.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center gap-2"
                    >
                      <XCircle size={12} />
                      Cancelar Cita
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-border rounded-[2.5rem] p-16 text-center space-y-4 shadow-sm max-w-lg mx-auto">
          <AlertCircle size={40} className="text-muted/30 mx-auto" />
          <h4 className="font-outfit font-black text-xl text-green-deeper uppercase">Sin Reservas</h4>
          <p className="text-muted text-sm font-jakarta max-w-xs mx-auto leading-relaxed">
            {activeTab === 'upcoming'
              ? 'No tienes citas agendadas de hoy en adelante.'
              : 'Aún no se registran citas pasadas o canceladas en tu historial.'}
          </p>
        </div>
      )}
    </div>
  );
}
