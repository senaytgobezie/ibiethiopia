import { NextRequest, NextResponse } from 'next/server';
import { registerAdmin } from '@/utils/auth/database-auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        // Validate inputs
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
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
            {
                success: true,
                message: 'Admin account created successfully',
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Admin creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 