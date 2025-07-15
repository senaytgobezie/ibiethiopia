import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Create admin client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseServiceRoleKey) {
            return NextResponse.json(
                { error: 'Service role key not configured' },
                { status: 500 }
            );
        }

        const adminClient = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Get user by email
        const { data: users, error: getUserError } = await adminClient.auth.admin.listUsers();

        if (getUserError) {
            console.error('Error getting users:', getUserError);
            return NextResponse.json(
                { error: 'Failed to get users' },
                { status: 500 }
            );
        }

        const user = users.users.find(u => u.email === email.toLowerCase());

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Confirm the user's email
        const { error: confirmError } = await adminClient.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
        );

        if (confirmError) {
            console.error('Error confirming user:', confirmError);
            return NextResponse.json(
                { error: 'Failed to confirm user' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'User confirmed successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Confirm user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 