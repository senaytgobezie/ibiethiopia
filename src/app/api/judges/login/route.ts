import { NextRequest, NextResponse } from 'next/server';
import { authenticateJudge, createSession, setSessionCookie } from '@/utils/auth/database-auth';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Validate inputs
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Authenticate judge
        const judge = await authenticateJudge(email, password);

        if (!judge) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create session
        const sessionData = await createSession(judge, 'judge');
        await setSessionCookie(sessionData);

        return NextResponse.json(
            { success: true, message: 'Login successful' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Judge login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 