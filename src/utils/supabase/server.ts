import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'

// For server components and API routes
export async function createClient(serverCookies?: {
    get: (name: string) => { value: string } | undefined
    set: (name: string, value: string, options: CookieOptions) => void
}) {
    // Create a cookie handler that works with the provided cookies or uses empty functions
    const cookieHandler = serverCookies || {
        get: () => undefined,
        set: () => { },
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return cookieHandler.get(name)?.value
                },
                set(name, value, options) {
                    try {
                        cookieHandler.set(name, value, options)
                    } catch (e) {
                        // Ignore errors when setting cookies from Server Components
                        console.warn('Warning: Could not set cookie', name, e)
                    }
                },
                remove(name, options) {
                    try {
                        cookieHandler.set(name, '', options)
                    } catch (e) {
                        // Ignore errors when removing cookies from Server Components
                        console.warn('Warning: Could not remove cookie', name, e)
                    }
                },
            },
        }
    )
}