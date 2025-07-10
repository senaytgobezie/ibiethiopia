import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export function createClient(request: NextRequest) {
    // Create a response object that we'll modify
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create a Supabase client using the request cookies
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return request.cookies.get(name)?.value
                },
                set(name, value, options) {
                    // Set the cookie in the response
                    response.cookies.set(name, value, options)
                },
                remove(name, options) {
                    // Remove the cookie from the response
                    response.cookies.set(name, '', { ...options, maxAge: 0 })
                },
            },
        }
    )

    return { supabase, response }
}

export async function updateSession(request: NextRequest) {
    const { supabase, response } = createClient(request)

    // IMPORTANT: Call getUser to refresh the session if needed
    const { data: { session } } = await supabase.auth.getSession()

    // Get the current URL path
    const path = request.nextUrl.pathname

    // Allow access to public routes regardless of auth status
    const isPublicRoute =
        path === '/' ||
        path.startsWith('/login') ||
        path.startsWith('/auth') ||
        path.startsWith('/register') ||
        path.startsWith('/contestant/register') ||
        path.startsWith('/judges/login')

    // If user is not authenticated and tries to access a protected route
    if (!session && !isPublicRoute) {
        // Redirect to login page with the return URL
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    return response
}