import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, category, contact_name, phone, whatsapp, email, contact_email } = await req.json();

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const adminEmails = ['mauriciorojasdiseno@gmail.com', 'hola@enlacesanjuan.com.mx'];

    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY');
      return NextResponse.json({ error: 'Mail service unavailable' }, { status: 500 });
    }

    // 1. CORREO DE ALERTA PARA ADMINISTRADORES
    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Enlace San Juan <notificaciones@enlacesanjuan.com.mx>',
        to: adminEmails,
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
                    <td style="padding: 10px 0; color: #111827; font-weight: 700;">${contact_name || 'No especificado'} (${contact_email || 'Sin correo'})</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 12px; font-weight: 900; text-transform: uppercase;">Tel / WhatsApp</td>
                    <td style="padding: 10px 0; color: #111827; font-weight: 700;">${whatsapp || phone || 'Sin teléfono'}</td>
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
          </div>
        `,
      }),
    });

    // 2. CORREO DE BIENVENIDA PARA EL REGISTRANTE
    if (contact_email || email) {
      const recipientEmail = contact_email || email;
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Enlace San Juan <hola@enlacesanjuan.com.mx>',
          to: [recipientEmail],
          subject: `¡Bienvenido a Enlace San Juan! 🚀`,
          html: `
            <div style="font-family: sans-serif; background: #f4fbf5; padding: 40px; color: #1a2e1d;">
              <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #2a7a3b; font-size: 28px; font-weight: 800; margin: 0;">¡BIENVENIDO!</h1>
                  <p style="color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-top: 8px;">Enlace San Juan</p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                  Hola <strong>${contact_name || name}</strong>,
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                  Gracias por ser parte de nuestro directorio digital. Estamos muy emocionados de ayudarte a conectar con más personas en San Juan del Río.
                </p>

                <div style="background: #e6f4ea; padding: 24px; border-radius: 16px; border: 1px solid #c8e6d1; margin-bottom: 32px;">
                  <p style="font-size: 15px; font-weight: 700; color: #1a4d2e; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    ¿Qué sigue ahora?
                  </p>
                  <p style="font-size: 14px; line-height: 1.5; color: #2a7a3b; margin: 0;">
                    Ya que realices tu pago, avísanos para aprobar tu empresa y el mismo día quedará activa en nuestra plataforma para que todos puedan verte.
                  </p>
                </div>

                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 32px;">
                  Puedes contactarnos por este medio por cualquier duda o seguir la conversación directamente en nuestro WhatsApp:
                </p>

                <div style="text-align: center; margin-bottom: 40px;">
                  <a href="https://wa.me/524273232026" 
                     style="display: inline-block; background: #25D366; color: white; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);">
                    Contactar por WhatsApp
                  </a>
                </div>

                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 32px;" />
                
                <p style="font-size: 14px; text-align: center; color: #6b7280; font-style: italic;">
                  "Gracias por ser parte de Enlace San Juan."
                </p>
              </div>
              
              <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 24px;">
                © 2024 Enlace San Juan. <br>
                San Juan del Río, Querétaro.
              </p>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
    
  } catch (err) {
    console.error('Route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
