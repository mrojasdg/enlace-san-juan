import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, category, contact_name, phone, whatsapp, email } = await req.json();

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    // Agregamos tus correos específicos
    const toEmails = ['mauriciorojasdiseno@gmail.com', 'hola@enlacesanjuan.com.mx'];

    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY');
      return NextResponse.json({ error: 'Mail service unavailable' }, { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        // IMPORTANTE: Si no tienes verificado tu dominio en Resend, 
        // usa 'onboarding@resend.dev' para probar duncionamiento.
        from: 'Enlace San Juan <notificaciones@enlacesanjuan.com.mx>',
        to: toEmails,
        subject: `🔔 Nueva Empresa: ${name}`,
        html: `
          <div style="font-family: sans-serif; background: #f4fbf5; padding: 40px; color: #1a2e1d;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
              <h1 style="color: #2a7a3b; font-size: 24px; font-weight: 800; margin-bottom: 24px; border-bottom: 2px solid #2a7a3b; padding-bottom: 12px; text-transform: uppercase;">
                NUEVO REGISTRO
              </h1>
              <p style="font-size: 16px; margin-bottom: 24px; color: #4b5563;">
                ¡Hola! Se ha registrado una nueva empresa en el directorio de <strong>Enlace San Juan</strong>.
              </p>
              
              <div style="background: #f9fafb; padding: 24px; border-radius: 16px; border: 1px solid #f3f4f6;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 12px; font-weight: 900; text-transform: uppercase;">Negocio</td>
                    <td style="padding: 10px 0; color: #111827; font-weight: 800; font-size: 16px;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 12px; font-weight: 900; text-transform: uppercase;">Categoría</td>
                    <td style="padding: 10px 0; color: #2a7a3b; font-weight: 800;">${category}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 12px; font-weight: 900; text-transform: uppercase;">Representante</td>
                    <td style="padding: 10px 0; color: #111827; font-weight: 700;">${contact_name || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 12px; font-weight: 900; text-transform: uppercase;">Tel / WhatsApp</td>
                    <td style="padding: 10px 0; color: #111827; font-weight: 700;">${whatsapp || phone || 'Sin teléfono'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 12px; font-weight: 900; text-transform: uppercase;">E-mail</td>
                    <td style="padding: 10px 0; color: #111827; font-weight: 700;">${email || 'Sin correo'}</td>
                  </tr>
                </table>
              </div>

              <div style="margin-top: 32px; text-align: center;">
                <a href="https://enlacesanjuan.com.mx/admin/negocios" 
                   style="display: inline-block; background: #2a7a3b; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase;">
                  Ir al panel de administración
                </a>
              </div>
            </div>
            <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 24px;">
              Este es un correo automático del sistema Enlace San Juan. <br>
              San Juan del Río, Qro. 2024.
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      const error = await res.json();
      console.error('Resend Error:', error);
      return NextResponse.json({ error: 'Failed to send mail' }, { status: 500 });
    }
  } catch (err) {
    console.error('Route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
