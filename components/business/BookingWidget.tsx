'use client';

import React, { useState, useEffect } from 'react';
import { Business } from '@/types/business';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, User, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

interface BookingWidgetProps {
  business: Business;
}

export default function BookingWidget({ business }: BookingWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slotOccupancy, setSlotOccupancy] = useState<Record<string, number>>({});
  const [numPeople, setNumPeople] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [checkingSlots, setCheckingSlots] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  // Obtener fecha de hoy en formato local de México para el atributo 'min' del input date
  const getTodayString = () => {
    const options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const [{ value: month }, , { value: day }, , { value: year }] = formatter.formatToParts(new Date());
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  // 1. Obtener slots ocupados cuando cambia la fecha
  useEffect(() => {
    setSelectedSlot('');
    setNumPeople(1);

    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const fetchBookingsAndGenerateSlots = async () => {
      setCheckingSlots(true);
      setSelectedSlot('');

      try {
        // A. Obtener reservas existentes para este negocio en la fecha seleccionada
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('booking_time, num_people')
          .eq('business_id', business.id)
          .eq('booking_date', selectedDate)
          .eq('status', 'confirmed');

        if (error) throw error;

        // B. Calcular la ocupación por cada slot de tiempo
        const occupancy: Record<string, number> = {};
        bookings?.forEach((b) => {
          const time = b.booking_time;
          const count = b.num_people || 1;
          occupancy[time] = (occupancy[time] || 0) + count;
        });
        setSlotOccupancy(occupancy);

        // C. Determinar qué slots están llenos
        const maxCapacity = business.booking_type === 'group' ? (business.booking_max_capacity || 1) : 1;
        const bookedTimes = Object.keys(occupancy).filter((time) => occupancy[time] >= maxCapacity);
        setBookedSlots(bookedTimes);

        // B. Identificar día de la semana
        const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        // Crear fecha en zona horaria local de México para no tener desfases
        const [year, month, day] = selectedDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayOfWeek = days[dateObj.getDay()];

        const schedule = (business.schedule as any)?.[dayOfWeek];

        if (!schedule || schedule.closed || !schedule.open || !schedule.close) {
          setAvailableSlots([]);
          return;
        }

        // C. Generar slots de tiempo
        const slots: string[] = [];
        const [openH, openM] = schedule.open.split(':').map(Number);
        const [closeH, closeM] = schedule.close.split(':').map(Number);
        const duration = business.booking_duration || 60; // Duración en minutos

        let currentMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;

        // Validar si la fecha seleccionada es hoy para filtrar horas pasadas
        const isToday = selectedDate === todayStr;
        
        let nowMinutesLimit = -1;
        if (isToday) {
          const mxOpts = { timeZone: 'America/Mexico_City', hour12: false };
          const localString = new Date().toLocaleString('en-US', mxOpts);
          const localNow = new Date(localString);
          nowMinutesLimit = localNow.getHours() * 60 + localNow.getMinutes() + 30; // Bloquear con 30 minutos de anticipación
        }

        while (currentMinutes + duration <= closeMinutes) {
          const h = Math.floor(currentMinutes / 60);
          const m = currentMinutes % 60;
          const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          
          if (!isToday || currentMinutes > nowMinutesLimit) {
            slots.push(timeString);
          }
          
          currentMinutes += duration;
        }

        setAvailableSlots(slots);
      } catch (err) {
        console.error('Error fetching slots:', err);
        toast.error('Error al consultar horarios disponibles');
      } finally {
        setCheckingSlots(false);
      }
    };

    fetchBookingsAndGenerateSlots();
  }, [selectedDate, business, todayStr]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      toast.error('Por favor selecciona una fecha y una hora');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          clientName: name,
          clientPhone: phone,
          clientEmail: email,
          bookingDate: selectedDate,
          bookingTime: selectedSlot,
          duration: business.booking_duration || 60,
          numPeople: numPeople
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess(true);
      toast.success('¡Cita reservada correctamente!');
    } catch (err: any) {
      toast.error(err.message || 'Ocurrió un error al procesar tu reserva');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-[2rem] border border-green-pale p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-xpale rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="w-20 h-20 bg-green-xpale text-green rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={40} className="stroke-[2.5]" />
        </div>
        <div className="space-y-2">
          <h3 className="font-outfit font-black text-2xl text-green-deeper uppercase tracking-tight">
            ¡Reserva Confirmada!
          </h3>
          <p className="text-muted font-jakarta text-sm leading-relaxed max-w-sm mx-auto">
            Tu cita ha sido agendada con éxito para el día <strong className="text-ink">{selectedDate}</strong> a las <strong className="text-ink">{selectedSlot} hrs</strong>.
          </p>
        </div>
        <div className="bg-green-xpale/40 rounded-2xl p-4 border border-green/10 max-w-xs mx-auto text-left space-y-2">
          <p className="text-[10px] text-green font-black uppercase tracking-widest">Resumen de Cita</p>
          <p className="text-xs font-bold text-ink truncate">Cliente: {name}</p>
          <p className="text-xs text-muted">Negocio: {business.name}</p>
          {business.booking_type === 'group' && (
            <p className="text-xs text-muted">Personas: {numPeople}</p>
          )}
        </div>
        <Button
          onClick={() => {
            setSuccess(false);
            setSelectedDate('');
            setSelectedSlot('');
            setNumPeople(1);
            setName('');
            setPhone('');
            setEmail('');
          }}
          className="bg-green text-white hover:bg-green-mid rounded-xl px-8 h-12 text-xs uppercase font-black tracking-widest shadow-lg shadow-green/20"
        >
          Agendar otra cita
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-border p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-green-xpale rounded-full blur-2xl -mr-12 -mt-12"></div>
      
      <div className="space-y-2">
        <span className="bg-green-xpale text-green px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest inline-flex items-center gap-2 border border-green/10">
          <Calendar size={12} />
          AGENDA TU CITA
        </span>
        <h3 className="font-outfit font-black text-2xl text-green-deeper uppercase tracking-tight">
          Reservar Espacio
        </h3>
        <p className="text-xs text-muted font-jakarta">
          Elige el día y la hora de tu preferencia. Las citas son de <strong className="text-green">{business.booking_duration || 60} minutos</strong>.
        </p>
      </div>

      <form onSubmit={handleBooking} className="space-y-6">
        {/* 1. Selector de fecha */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
            Selecciona el Día
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40" size={18} />
            <input
              type="date"
              required
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green outline-none rounded-xl py-4 pl-12 pr-6 font-bold text-sm text-ink transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* 2. Selector de Hora */}
        {selectedDate && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
              Horas disponibles para el día seleccionado
            </label>
            
            {checkingSlots ? (
              <div className="py-6 flex items-center justify-center gap-3 text-muted text-xs font-bold uppercase tracking-wider">
                <div className="w-5 h-5 border-2 border-green/20 border-t-green rounded-full animate-spin"></div>
                Buscando horarios...
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;
                  const alreadyBooked = slotOccupancy[slot] || 0;
                  const maxCap = business.booking_type === 'group' ? (business.booking_max_capacity || 1) : 1;
                  const remaining = maxCap - alreadyBooked;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setNumPeople(1);
                      }}
                      className={cn(
                        'h-14 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center border-2',
                        isBooked
                          ? 'bg-gray-100 border-transparent text-muted/30 cursor-not-allowed line-through'
                          : isSelected
                            ? 'bg-green border-green text-white shadow-lg shadow-green/20'
                            : 'bg-white border-border text-ink hover:border-green-pale'
                      )}
                    >
                      <span className="flex items-center gap-1.5 leading-none">
                        <Clock size={12} className={isSelected ? 'text-white' : 'text-muted/40'} />
                        {slot}
                      </span>
                      {business.booking_type === 'group' && (
                        <span className={cn('text-[9px] font-black uppercase mt-1 leading-none tracking-wider', isSelected ? 'text-white/80' : 'text-green')}>
                          {remaining} disp.
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-900 text-xs font-bold font-jakarta">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                No hay horarios disponibles para el día seleccionado. El negocio podría estar cerrado o no tener más cupos.
              </div>
            )}
          </div>
        )}

        {/* 3. Formulario de Datos Personales */}
        {selectedSlot && (
          <div className="space-y-4 pt-4 border-t border-border/50 animate-in fade-in duration-300">
            {/* Selector de número de personas (Grupal) */}
            {business.booking_type === 'group' && (() => {
              const maxCap = business.booking_max_capacity || 1;
              const alreadyBooked = slotOccupancy[selectedSlot] || 0;
              const remaining = maxCap - alreadyBooked;

              return (
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                    ¿Cuántas personas asistirán?
                  </label>
                  <select
                    value={numPeople}
                    onChange={(e) => setNumPeople(Number(e.target.value))}
                    className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green outline-none rounded-xl py-4 px-5 font-bold text-sm text-ink transition-all cursor-pointer"
                  >
                    {Array.from({ length: remaining }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                  <p className="text-[9px] text-green font-bold ml-2 uppercase tracking-wide">
                    Lugares disponibles para esta hora: {remaining} de {maxCap}
                  </p>
                </div>
              );
            })()}

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                Tu Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green outline-none rounded-xl py-4 pl-12 pr-6 font-bold text-sm text-ink transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                Teléfono Celular (WhatsApp)
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40" size={18} />
                <input
                  type="tel"
                  required
                  placeholder="4271234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green outline-none rounded-xl py-4 pl-12 pr-6 font-bold text-sm text-ink transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40" size={18} />
                <input
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green outline-none rounded-xl py-4 pl-12 pr-6 font-bold text-sm text-ink transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-xl bg-green hover:bg-green-mid text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-green/20 transition-all flex items-center justify-center gap-2 pt-1"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'Confirmar Cita'
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
