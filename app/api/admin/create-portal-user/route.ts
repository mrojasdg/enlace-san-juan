import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Obtener la información del negocio
    const { data: business, error: fetchError } = await supabaseAdmin
      .from('businesses')
      .select('id, name, contact_name, contact_email, user_id')
      .eq('id', businessId)
      .single();

    if (fetchError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const { contact_email, contact_name, name: businessName, user_id: existingUserId } = business;

    if (!contact_email) {
      return NextResponse.json({ error: 'Business contact_email is missing. Please define it first.' }, { status: 400 });
    }

    // Generar contraseña temporal
    const tempPassword = Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 10);
    let userId = existingUserId;
    let isNewUser = false;

    if (!userId) {
      // 2. Comprobar si el usuario ya existe en Supabase Auth por email
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;

      const existingAuthUser = users.find(u => u.email?.toLowerCase() === contact_email.toLowerCase());

      if (existingAuthUser) {
        userId = existingAuthUser.id;
        // Actualizar la contraseña del usuario existente
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: tempPassword
        });
        if (updateError) throw updateError;
      } else {
        // Crear nuevo usuario en Supabase Auth
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: contact_email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { contact_name, business_name: businessName }
        });

        if (createError || !newUser.user) {
          throw createError || new Error('Failed to create auth user');
        }

        userId = newUser.user.id;
        isNewUser = true;
      }

      // 3. Vincular el user_id al negocio
      const { error: linkError } = await supabaseAdmin
        .from('businesses')
        .update({ user_id: userId })
        .eq('id', businessId);

      if (linkError) throw linkError;
    } else {
      // Si ya está vinculado, solo cambiamos la contraseña
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: tempPassword
      });
      if (updateError) throw updateError;
    }

    // 4. Enviar correo usando Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      const portalUrl = `${req.headers.get('origin') || 'https://enlacesanjuan.com.mx'}/portal/login`;
      
      const emailBody = {
        from: 'Enlace San Juan <hola@enlacesanjuan.com.mx>',
        to: [contact_email],
        subject: isNewUser ? '🔑 Acceso Creado - Portal de Socios Enlace San Juan' : '🔄 Credenciales Restablecidas - Portal de Socios',
        html: `
          <div style="font-family: sans-serif; background: #f4fbf5; padding: 40px; color: #1a2e1d;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #2a7a3b; font-size: 24px; font-weight: 800; margin: 0; text-transform: uppercase;">PORTAL DE SOCIOS</h1>
                <p style="color: #6b7280; font-weight: 600; font-size: 12px; margin-top: 8px; tracking-spacing: 2px;">Enlace San Juan</p>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                Hola <strong>${contact_name || businessName}</strong>,
              </p>
              
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                Se ha configurado el acceso a tu portal administrativo para la empresa <strong>${businessName}</strong>. Desde aquí podrás gestionar las fotos de tu galería, eslogan, horarios de servicio, lista de productos/servicios y administrar tus reservas de citas.
              </p>

              <div style="background: #f9fafb; padding: 24px; border-radius: 16px; border: 1px solid #f3f4f6; margin-bottom: 32px;">
                <p style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 12px; text-transform: uppercase;">
                  Tus datos de acceso temporal:
                </p>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 6px 0; color: #6b7280;">Enlace de acceso:</td>
                    <td style="padding: 6px 0; font-weight: bold;"><a href="${portalUrl}" style="color: #2a7a3b;">${portalUrl}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #6b7280;">Usuario (Email):</td>
                    <td style="padding: 6px 0; font-weight: bold; font-family: monospace;">${contact_email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #6b7280;">Contraseña temporal:</td>
                    <td style="padding: 6px 0; font-weight: bold; font-family: monospace; font-size: 16px; color: #e11d48;">${tempPassword}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #fffbeb; padding: 20px; border-radius: 16px; border: 1px solid #fef3c7; margin-bottom: 32px;">
                <p style="font-size: 13px; line-height: 1.5; color: #b45309; margin: 0; font-weight: 600;">
                  ⚠️ Por seguridad, una vez que ingreses al portal te recomendamos cambiar tu contraseña temporal en el apartado de tu perfil.
                </p>
              </div>

              <div style="text-align: center; margin-bottom: 40px;">
                <a href="${portalUrl}" 
                   style="display: inline-block; background: #2a7a3b; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(42, 122, 59, 0.25);">
                  Ingresar al Portal
                </a>
              </div>

              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 24px;" />
              
              <p style="font-size: 13px; text-align: center; color: #9ca3af;">
                Si no solicitaste esta activación, puedes ignorar este correo.
              </p>
            </div>
          </div>
        `,
      };

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailBody),
      });
    } else {
      console.warn('Resend API key missing, credentials not sent via email. Temp password was:', tempPassword);
    }

    return NextResponse.json({
      success: true,
      message: isNewUser ? 'Acceso al portal creado y enviado correctamente.' : 'Contraseña restablecida y enviada correctamente.',
      user_id: userId
    });

  } catch (err: any) {
    console.error('Error creating portal user:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
