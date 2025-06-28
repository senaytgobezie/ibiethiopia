import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/utils/supabaseClient';

export async function POST(req: NextRequest) {
    const { email, password, name, gender, phone, payment_phone } = await req.json();

    // 1. Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError || !authData.user) {
        return NextResponse.json({ error: authError?.message || 'Auth registration failed.' }, { status: 400 });
    }

    // 2. Insert profile into 'contestant' table
    const { error: dbError } = await supabase.from('contestant').insert([
        {
            user_id: authData.user.id,
            name,
            gender,
            phone,
            email,
            payment_phone,
        },
    ]);

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Registration successful!' });
} 