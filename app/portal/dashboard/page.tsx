'use client';

import React, { useEffect, useState } from 'react';
import { usePortal } from '../layout';
import { supabase } from '@/lib/supabase';
import { Calendar, Users, Clock, AlertCircle, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PortalDashboardPage() {
  const { business } = usePortal();
  const [metrics, setMetrics] = useState({
    todayCount: 0,
    upcomingCount: 0,
    totalCount: 0,
  });
  const [nextBooking, setNextBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener fecha de hoy en formato local de México (YYYY-MM-DD)
  const getTodayString = () => {
    const options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const [{ value: month }, , { value: day }, , { value: year }] = formatter.formatToParts(new Date());
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!business) return;

    const fetchDashboardData = async () => {
      try {
        const today = getTodayString();

        // 1. Cargar reservas de hoy
        const { count: todayCount } = await supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', business.id)
          .eq('booking_date', today)
          .eq('status', 'confirmed');

        // 2. Cargar reservas futuras
        const { count: upcomingCount } = await supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', business.id)
          .gte('booking_date', today)
          .eq('status', 'confirmed');

        // 3. Cargar reservas totales
        const { count: totalCount } = await supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', business.id);

        setMetrics({
          todayCount: todayCount || 0,
          upcomingCount: upcomingCount || 0,
          totalCount: totalCount || 0,
        });

        // 4. Obtener la siguiente reserva inmediata
        const { data: bookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('business_id', business.id)
          .gte('booking_date', today)
          .eq('status', 'confirmed')
          .order('booking_date', { ascending: true })
          .order('booking_time', { ascending: true })
          .limit(1);

        if (bookings && bookings.length > 0) {
          setNextBooking(bookings[0]);
        }
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [business]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-green/20 border-t-green rounded-full animate-spin"></div>
        <p className="text-xs text-muted uppercase font-black">Cargando resumen...</p>
      </div>
    );
  }

  const kpis = [
    { label: "Citas para Hoy", value: metrics.todayCount, icon: Clock, color: "text-green", bg: "bg-green-xpale" },
    { label: "Próximas Reservas", value: metrics.upcomingCount, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Historial de Reservas", value: metrics.totalCount, icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-12">
      {/* Saludo Bienvenida */}
      <div className="bg-white rounded-[2.5rem] border border-border p-8 md:p-12 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-xpale/40 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="relative z-10 space-y-4">
          <span className="bg-green-xpale text-green px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-block border border-green/20">
            PANEL DE SOCIOS
          </span>
          <h2 className="font-outfit font-black text-3xl md:text-5xl text-green-deeper leading-tight">
            ¡Hola, {business?.contact_name || business?.name}!
          </h2>
          <p className="text-muted font-jakarta text-sm max-w-xl">
            Desde este panel de administración autónomo puedes gestionar las reservas de tus clientes y actualizar la información visible en tu micrositio de <strong>Enlace San Juan</strong>.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white p-8 rounded-[2rem] border border-border shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-300">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted">{kpi.label}</p>
              <h3 className="font-outfit font-black text-4xl text-ink leading-none">{kpi.value}</h3>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Next Booking & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Booking Info */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-border shadow-sm flex flex-col h-full justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <h3 className="font-outfit font-black text-lg text-green-deeper uppercase tracking-widest">Siguiente Cita</h3>
              <span className="text-[9px] font-black uppercase tracking-widest bg-green-xpale text-green px-3 py-1.5 rounded-full border border-green/10">Inmediata</span>
            </div>

            {nextBooking ? (
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Cliente</p>
                  <p className="font-outfit font-black text-2xl text-ink leading-tight">{nextBooking.client_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Fecha</p>
                    <p className="font-jakarta font-bold text-ink2 text-sm">{nextBooking.booking_date}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Hora de cita</p>
                    <p className="font-jakarta font-bold text-ink2 text-sm">{nextBooking.booking_time} hrs</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                  <div>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Celular / WhatsApp</p>
                    <a href={`https://wa.me/52${nextBooking.client_phone.replace(/\s+/g, '')}`} target="_blank" className="font-jakarta font-black text-green hover:underline text-sm truncate block">
                      {nextBooking.client_phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Correo electrónico</p>
                    <p className="font-jakarta font-bold text-ink2 text-sm truncate">{nextBooking.client_email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted font-jakarta space-y-2">
                <AlertCircle size={32} className="mx-auto text-muted/30" />
                <p className="text-sm font-bold">No tienes ninguna reserva agendada próximamente.</p>
                <p className="text-xs text-muted/60">Las nuevas reservas aparecerán aquí automáticamente.</p>
              </div>
            )}
          </div>

          {nextBooking && (
            <Link href="/portal/reservas" className="mt-8 block">
              <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                Ver Todas Las Reservas
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-border shadow-sm space-y-6 h-full flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-outfit font-black text-lg text-green-deeper uppercase tracking-widest pb-4 border-b border-border/50">Enlaces Rápidos</h3>
            <p className="text-muted text-xs font-jakarta leading-relaxed">
              Administra eficientemente tu presencia digital y los horarios de atención al cliente de forma instantánea.
            </p>

            <div className="space-y-4">
              <Link href="/portal/reservas" className="block p-4 bg-green-xpale/40 hover:bg-green-xpale/70 border border-green-pale/10 rounded-2xl transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green shadow-sm border border-border group-hover:scale-105 transition-transform"><Calendar size={18} /></div>
                    <div>
                      <p className="font-bold text-ink text-sm leading-tight">Calendario de Reservas</p>
                      <p className="text-[10px] text-muted leading-tight">Consulta y gestiona las citas de tus clientes.</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-muted/40 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/portal/perfil" className="block p-4 bg-green-xpale/40 hover:bg-green-xpale/70 border border-green-pale/10 rounded-2xl transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green shadow-sm border border-border group-hover:scale-105 transition-transform"><Users size={18} /></div>
                    <div>
                      <p className="font-bold text-ink text-sm leading-tight">Editar Datos del Negocio</p>
                      <p className="text-[10px] text-muted leading-tight">Actualiza imágenes, horarios, catálogo y redes sociales.</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-muted/40 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
