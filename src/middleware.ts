import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request);

    // Check if the user is authenticated
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Get the pathname from the URL
    const pathname = request.nextUrl.pathname;

    // If accessing admin routes, check if user is authenticated
    if (pathname.startsWith('/admin')) {
        if (!user) {
            // Redirect to login page if not authenticated
            const redirectUrl = new URL('/login', request.url);
            redirectUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(redirectUrl);
        }

        // For now, we'll allow any authenticated user to access admin routes
        // In a real application, you would check for admin role here
        // For example:
        // const { data } = await supabase.from('admins').select('*').eq('user_id', user.id).single();
        // if (!data) {
        //     return NextResponse.redirect(new URL('/', request.url));
        // }
    }

    // If accessing judge routes, check if user is authenticated and has judge role
    if (pathname.startsWith('/judges') && !pathname.includes('/judges/login')) {
        if (!user) {
            // Redirect to judge login page if not authenticated
            const redirectUrl = new URL('/judges/login', request.url);
            redirectUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(redirectUrl);
        }

        // Check if user has judge role in metadata
        const userRole = user.user_metadata?.role;
        if (userRole !== 'judge') {
            // If not a judge, redirect to appropriate login
            return NextResponse.redirect(new URL('/judges/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes that don't need auth
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth|api/register).*)',
        '/admin/:path*',
        '/judges/:path*',
    ],
};