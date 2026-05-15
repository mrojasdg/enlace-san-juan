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
