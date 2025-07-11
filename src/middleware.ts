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

    // If user is not authenticated and trying to access protected routes
    if (!user) {
        // Determine which login page to redirect to based on the route
        if (pathname.startsWith('/admin')) {
            const redirectUrl = new URL('/login', request.url);
            redirectUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(redirectUrl);
        } else if (pathname.startsWith('/judges') && !pathname.includes('/judges/login')) {
            const redirectUrl = new URL('/judges/login', request.url);
            redirectUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(redirectUrl);
        } else if (pathname.startsWith('/contestant')) {
            const redirectUrl = new URL('/login', request.url);
            redirectUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(redirectUrl);
        }
    } else {
        // User is authenticated, check if they have the appropriate role for the route
        const userId = user.id;

        // If accessing admin routes, check if user exists in admins table
        if (pathname.startsWith('/admin')) {
            try {
                const { data: adminData } = await supabase
                    .from('admins')
                    .select('id')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (!adminData) {
                    console.log('⛔ User tried to access admin area without admin role');
                    // Redirect to home or access denied page
                    return NextResponse.redirect(new URL('/access-denied', request.url));
                }
            } catch (error) {
                console.error('❌ Error checking admin role:', error);
                return NextResponse.redirect(new URL('/access-denied', request.url));
            }
        }

        // If accessing judge routes, check if user exists in judges table
        if (pathname.startsWith('/judges') && !pathname.includes('/judges/login')) {
            try {
                const { data: judgeData } = await supabase
                    .from('judges')
                    .select('id')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (!judgeData) {
                    console.log('⛔ User tried to access judge area without judge role');
                    // Redirect to judge login page
                    return NextResponse.redirect(new URL('/judges/login', request.url));
                }
            } catch (error) {
                console.error('❌ Error checking judge role:', error);
                return NextResponse.redirect(new URL('/judges/login', request.url));
            }
        }

        // If accessing contestant routes, check if user exists in contestants table
        if (pathname.startsWith('/contestant')) {
            try {
                const { data: contestantData } = await supabase
                    .from('contestants')
                    .select('id')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (!contestantData) {
                    console.log('⛔ User tried to access contestant area without contestant role');
                    // Redirect to contestant registration or access denied
                    return NextResponse.redirect(new URL('/register', request.url));
                }
            } catch (error) {
                console.error('❌ Error checking contestant role:', error);
                return NextResponse.redirect(new URL('/register', request.url));
            }
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
        '/contestant/:path*',
    ],
};