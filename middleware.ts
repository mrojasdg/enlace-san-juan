<<<<<<< HEAD
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Obtenemos la sesión pero NO bloqueamos de inmediato si falla el refresh
    const { data: { session } } = await supabase.auth.getSession()

    // Solo redirigimos si NO hay sesión Y estamos en páginas críticas
    if (!session && req.nextUrl.pathname.startsWith('/admin/dashboard')) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return res
}

export const config = {
    matcher: ['/admin/:path*'],
}
=======
import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
>>>>>>> 56f280e928b510cd316e3d7a637182573aeb8b42
