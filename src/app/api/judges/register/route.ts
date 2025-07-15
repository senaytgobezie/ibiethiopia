import { NextRequest, NextResponse } from 'next/server';
import { registerJudge } from '@/utils/auth/database-auth';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const name = formData.get('name') as string;
        const bio = formData.get('bio') as string;
        const years_experience = parseInt(formData.get('years_experience') as string) || 0;

        // Validate inputs
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Register judge
        const judge = await registerJudge(
            email,
            password,
            name,
            bio || undefined,
            undefined, // specialty will be added later if needed
            years_experience || undefined
        );

        if (!judge) {
            return NextResponse.json(
                { error: 'Judge with this email already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Judge account created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Judge registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 