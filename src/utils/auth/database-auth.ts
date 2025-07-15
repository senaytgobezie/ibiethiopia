import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface AdminUser {
    id: string;
    email: string;
    name: string | null;
    created_at: string;
}

export interface JudgeUser {
    id: string;
    email: string;
    name: string;
    bio: string | null;
    specialty: string[] | null;
    years_experience: number | null;
    status: string | null;
    created_at: string;
}

export interface AuthSession {
    user: AdminUser | JudgeUser;
    role: 'admin' | 'judge';
    expiresAt: number;
}

// Session management
const SESSION_COOKIE_NAME = 'db-auth-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export async function createSession(user: AdminUser | JudgeUser, role: 'admin' | 'judge'): Promise<string> {
    const session: AuthSession = {
        user,
        role,
        expiresAt: Date.now() + SESSION_DURATION
    };

    const sessionData = Buffer.from(JSON.stringify(session)).toString('base64');
    return sessionData;
}

export async function getSession(): Promise<AuthSession | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
        return null;
    }

    try {
        const sessionData = Buffer.from(sessionCookie.value, 'base64').toString();
        const session: AuthSession = JSON.parse(sessionData);

        // Check if session is expired
        if (session.expiresAt < Date.now()) {
            return null;
        }

        return session;
    } catch (error) {
        console.error('Error parsing session:', error);
        return null;
    }
}

export async function setSessionCookie(sessionData: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION / 1000,
        path: '/'
    });
}

export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

// Admin authentication
export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
    const supabase = await createClient();

    try {
        // Get admin from database
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (error || !admin) {
            return null;
        }

        // Check if admin has password field (we'll need to add this)
        if (!admin.password_hash) {
            // For existing admins without password, we'll need to handle this
            // For now, return null
            return null;
        }

        // Verify password
        const isValid = await verifyPassword(password, admin.password_hash);
        if (!isValid) {
            return null;
        }

        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            created_at: admin.created_at
        };
    } catch (error) {
        console.error('Admin authentication error:', error);
        return null;
    }
}

// Judge authentication
export async function authenticateJudge(email: string, password: string): Promise<JudgeUser | null> {
    const supabase = await createClient();

    try {
        // Get judge from database
        const { data: judge, error } = await supabase
            .from('judges')
            .select('*')
            .eq('email', email.toLowerCase())
            .eq('status', 'active')
            .maybeSingle();

        if (error || !judge) {
            return null;
        }

        // Check if judge has password field (we'll need to add this)
        if (!judge.password_hash) {
            // For existing judges without password, we'll need to handle this
            // For now, return null
            return null;
        }

        // Verify password
        const isValid = await verifyPassword(password, judge.password_hash);
        if (!isValid) {
            return null;
        }

        return {
            id: judge.id,
            email: judge.email,
            name: judge.name,
            bio: judge.bio,
            specialty: judge.specialty,
            years_experience: judge.years_experience,
            status: judge.status,
            created_at: judge.created_at
        };
    } catch (error) {
        console.error('Judge authentication error:', error);
        return null;
    }
}

// Registration functions
export async function registerAdmin(email: string, password: string, name: string): Promise<AdminUser | null> {
    const supabase = await createClient();

    try {
        // Check if admin already exists
        const { data: existingAdmin } = await supabase
            .from('admins')
            .select('id')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (existingAdmin) {
            return null; // Admin already exists
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create admin
        const { data: admin, error } = await supabase
            .from('admins')
            .insert({
                email: email.toLowerCase(),
                password_hash: passwordHash,
                name: name.trim()
            })
            .select()
            .single();

        if (error || !admin) {
            console.error('Error creating admin:', error);
            return null;
        }

        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            created_at: admin.created_at
        };
    } catch (error) {
        console.error('Admin registration error:', error);
        return null;
    }
}

export async function registerJudge(
    email: string,
    password: string,
    name: string,
    bio?: string,
    specialty?: string[],
    years_experience?: number
): Promise<JudgeUser | null> {
    const supabase = await createClient();

    try {
        // Check if judge already exists
        const { data: existingJudge } = await supabase
            .from('judges')
            .select('id')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (existingJudge) {
            return null; // Judge already exists
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create judge
        const { data: judge, error } = await supabase
            .from('judges')
            .insert({
                email: email.toLowerCase(),
                password_hash: passwordHash,
                name: name.trim(),
                bio: bio?.trim() || null,
                specialty: specialty || null,
                years_experience: years_experience || null,
                status: 'active'
            })
            .select()
            .single();

        if (error || !judge) {
            console.error('Error creating judge:', error);
            return null;
        }

        return {
            id: judge.id,
            email: judge.email,
            name: judge.name,
            bio: judge.bio,
            specialty: judge.specialty,
            years_experience: judge.years_experience,
            status: judge.status,
            created_at: judge.created_at
        };
    } catch (error) {
        console.error('Judge registration error:', error);
        return null;
    }
} 