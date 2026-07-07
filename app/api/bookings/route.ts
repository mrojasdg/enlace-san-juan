import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { businessId, clientName, clientPhone, clientEmail, bookingDate, bookingTime, duration } = await req.json();

    if (!businessId || !clientName || !clientPhone || !clientEmail || !bookingDate || !bookingTime) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Obtener información de la empresa para confirmación y alertas
    const { data: business, error: bizError } = await supabaseAdmin
      .from('businesses')
      .select('id, name, contact_email, contact_name')
      .eq('id', businessId)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // 2. Insertar reserva en la base de datos
    const { data: booking, error: insertError } = await supabaseAdmin
      .from('bookings')
      .insert({
        business_id: businessId,
        client_name: clientName,
        client_phone: clientPhone,
        client_email: clientEmail,
        booking_date: bookingDate,
        booking_time: bookingTime,
        duration: duration || 60,
        status: 'confirmed'
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // 3. Enviar correos usando Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      // Formatear fecha
      const [year, month, day] = bookingDate.split('-');
      const formattedDate = `${day}/${month}/${year}`;

      // A. Correo de Alerta para la Empresa
      if (business.contact_email) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Enlace San Juan <notificaciones@enlacesanjuan.com.mx>',
            to: [business.contact_email],
            subject: `📅 Nueva Reserva de Cita: ${clientName}`,
            html: `
              <div style="font-family: sans-serif; background: #f4fbf5; padding: 40px; color: #1a2e1d;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                  <h1 style="color: #2a7a3b; font-size: 24px; font-weight: 800; margin-bottom: 24px; border-bottom: 2px solid #2a7a3b; padding-bottom: 12px; text-transform: uppercase;">
                    NUEVA RESERVA
                  </h1>
                  <p style="font-size: 16px; margin-bottom: 24px; color: #4b5563;">
                    ¡Hola! Se ha agendado una nueva cita para tu negocio <strong>${business.name}</strong> a través de <strong>Enlace San Juan</strong>.
                  </p>
                  
                  <div style="background: #f9fafb; padding: 24px; border-radius: 16px; border: 1px solid #f3f4f6; margin-bottom: 24px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-weight: bold; text-transform: uppercase; font-size: 11px;">Cliente:</td>
                        <td style="padding: 8px 0; color: #111827; font-weight: bold;">${clientName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-weight: bold; text-transform: uppercase; font-size: 11px;">Fecha:</td>
                        <td style="padding: 8px 0; color: #2a7a3b; font-weight: bold;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-weight: bold; text-transform: uppercase; font-size: 11px;">Hora:</td>
                        <td style="padding: 8px 0; color: #2a7a3b; font-weight: bold;">${bookingTime} hrs</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-weight: bold; text-transform: uppercase; font-size: 11px;">Teléfono:</td>
                        <td style="padding: 8px 0; color: #111827;"><a href="tel:${clientPhone}">${clientPhone}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-weight: bold; text-transform: uppercase; font-size: 11px;">Correo:</td>
                        <td style="padding: 8px 0; color: #111827;">${clientEmail}</td>
                      </tr>
                    </table>
                  </div>

                  <div style="text-align: center;">
                    <a href="${req.headers.get('origin') || 'https://enlacesanjuan.com.mx'}/portal/dashboard" 
                       style="display: inline-block; background: #2a7a3b; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase;">
                      Ver en el Calendario
                    </a>
                  </div>
                </div>
              </div>
            `
          }),
        });
      }

      // B. Correo de Confirmación para el Cliente
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Enlace San Juan <hola@enlacesanjuan.com.mx>',
          to: [clientEmail],
          subject: `✅ Cita Confirmada: ${business.name}`,
          html: `
            <div style="font-family: sans-serif; background: #f4fbf5; padding: 40px; color: #1a2e1d;">
              <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #2a7a3b; font-size: 26px; font-weight: 800; margin: 0;">¡TU CITA ESTÁ LISTA!</h1>
                  <p style="color: #6b7280; font-weight: 600; font-size: 11px; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px;">Enlace San Juan</p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                  Hola <strong>${clientName}</strong>,
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                  Queremos confirmarte que tu cita ha sido registrada con éxito en <strong>${business.name}</strong> a través de nuestra plataforma.
                </p>

                <div style="background: #e6f4ea; padding: 24px; border-radius: 16px; border: 1px solid #c8e6d1; margin-bottom: 32px;">
                  <h3 style="font-size: 14px; font-weight: 700; color: #1a4d2e; margin-top: 0; margin-bottom: 12px; text-transform: uppercase;">
                    Detalles de la Cita:
                  </h3>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #2a7a3b;">
                    <tr>
                      <td style="padding: 6px 0;">Negocio:</td>
                      <td style="padding: 6px 0; font-weight: bold; color: #1a4d2e;">${business.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0;">Fecha:</td>
                      <td style="padding: 6px 0; font-weight: bold; color: #1a4d2e;">${formattedDate}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0;">Hora:</td>
                      <td style="padding: 6px 0; font-weight: bold; color: #1a4d2e;">${bookingTime} hrs</td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin-bottom: 32px;">
                  Si por alguna razón necesitas cancelar o reprogramar tu cita, por favor ponte en contacto directamente con el negocio.
                </p>

                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 24px;" />
                
                <p style="font-size: 12px; text-align: center; color: #9ca3af;">
                  © 2024 Enlace San Juan. Directorio local de San Juan del Río.
                </p>
              </div>
            </div>
          `
        }),
      });
    }

    return NextResponse.json({ success: true, booking });
  } catch (err: any) {
    console.error('Error inserting booking:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
