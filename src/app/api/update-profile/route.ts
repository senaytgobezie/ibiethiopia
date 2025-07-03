import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone, gender, categories } = await req.json();

        // Create a server-side Supabase client with cookies
        const supabase = await createClient();

        // Get user information from the session
        const { data, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Auth error:', userError);
            return NextResponse.json({ error: 'Authentication error: ' + userError.message }, { status: 401 });
        }

        if (!data?.user) {
            console.error('No user found in session');
            return NextResponse.json({ error: 'No authenticated user found' }, { status: 401 });
        }

        const user = data.user;
        console.log('Authenticated user:', user.id);

        // Update contestant profile
        const { error: updateError } = await supabase
            .from('contestants')
            .update({
                name,
                email,
                phone,
                gender,
                categories: Array.isArray(categories) ? categories.join(',') : categories
            })
            .eq('user_id', user.id);

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            success: true
        });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            success: false
        }, { status: 500 });
    }
} 