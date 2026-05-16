import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const { data: { session } } = await supabase.auth.getSession()

    const isPathAdmin = req.nextUrl.pathname.startsWith('/admin')
    const isPathLogin = req.nextUrl.pathname === '/admin/login'

    // Si intenta entrar a admin y no tiene sesión, al login
    if (isPathAdmin && !isPathLogin && !session) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Si ya tiene sesión e intenta ir al login, al dashboard
    if (isPathLogin && session) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return res
}

export const config = {
    matcher: ['/admin/:path*'],
}
