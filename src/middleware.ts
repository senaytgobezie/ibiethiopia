import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';
import { isPublicRoute, checkRoleAccess, getUserRoleFromUser } from '@/utils/auth/auth-utils';

export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request);
    const pathname = request.nextUrl.pathname;

    // Allow public routes without authentication
    if (isPublicRoute(pathname)) {
        return response;
    }

    // Check if the user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser();

    // If not authenticated, redirect to single login page
    if (!user || error) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Get user role from metadata
    const userRole = getUserRoleFromUser(user);

    // Check role-based access
    const hasAccess = checkRoleAccess(pathname, userRole);

    if (!hasAccess) {
        // Redirect to single login page with appropriate message
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        redirectUrl.searchParams.set('error', 'insufficient_permissions');
        return NextResponse.redirect(redirectUrl);
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth|api/register).*)',
        '/admin/:path*',
        '/judges/:path*',
        '/contestant/:path*',
    ],
};