import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const supabase = await createClient();

    // Sign out the user
    await supabase.auth.signOut();

    // Clear all cookies
    const allCookies = await cookieStore.getAll();
    for (const cookie of allCookies) {
        if (cookie.name.startsWith('sb-')) {
            await cookieStore.set(cookie.name, '', { maxAge: 0 });
        }
    }

    // Redirect to login page
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
} 