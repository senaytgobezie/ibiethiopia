import { NextRequest, NextResponse } from 'next/server';
import { registerAdmin } from '@/utils/auth/database-auth';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const name = formData.get('name') as string;

        // Validate inputs
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'All fields are required' },
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

        // Register admin
        const admin = await registerAdmin(email, password, name);

        if (!admin) {
            return NextResponse.json(
                { error: 'Admin with this email already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Admin account created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Admin registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 