import { NextRequest } from 'next/server';
import { AuthSession } from './database-auth';
import { UserRole, getRoleFromMetadata, UserMetadata } from '@/types/auth';

const SESSION_COOKIE_NAME = 'db-auth-session';

export function getDatabaseSession(request: NextRequest): AuthSession | null {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

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
        console.error('Error parsing session in middleware:', error);
        return null;
    }
}

export function isPublicRoute(pathname: string): boolean {
    return pathname === '/' ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/auth') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/contestant/register') ||
        pathname.startsWith('/judges/login') ||
        pathname.startsWith('/admin/login') ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.includes('.') // Static files
}

// New function to check role-based access
export function checkRoleAccess(pathname: string, userRole: UserRole | null): boolean {
    // Admin routes - only admin can access
    if (pathname.startsWith('/admin')) {
        return userRole === 'admin';
    }

    // Judge routes - only judge can access
    if (pathname.startsWith('/judges') && !pathname.includes('/judges/login')) {
        return userRole === 'judge';
    }

    // Contestant routes - only contestant can access
    if (pathname.startsWith('/contestant')) {
        return userRole === 'contestant';
    }

    // Default: allow access
    return true;
}

// New function to get user role from Supabase user
export function getUserRole(user: { user_metadata?: UserMetadata } | null): UserRole | null {
    if (!user) return null;
    return getRoleFromMetadata(user);
} 