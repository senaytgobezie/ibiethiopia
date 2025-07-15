import { createClient } from '@/utils/supabase/server';
import { getSession } from '@/utils/auth/database-auth';
import { AuthStatus, UserRole, UserWithRole } from '@/types/auth';

export async function getAuthStatus(): Promise<AuthStatus> {
    // Check database authentication first
    const dbSession = await getSession();

    if (dbSession) {
        return {
            isAuthenticated: true,
            user: dbSession.user as unknown as UserWithRole,
            role: dbSession.role,
            method: 'database'
        };
    }

    // Check Supabase authentication
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (user && !error) {
        // Get role from user metadata
        const userRole = user.user_metadata?.role as UserRole || 'contestant';

        return {
            isAuthenticated: true,
            user: user as UserWithRole,
            role: userRole,
            method: 'supabase'
        };
    }

    return {
        isAuthenticated: false,
        user: null,
        role: null,
        method: null
    };
}

// Helper functions for role checking
export async function getUserRole(): Promise<UserRole | null> {
    const authStatus = await getAuthStatus();
    return authStatus.role;
}

export async function isAdmin(): Promise<boolean> {
    const role = await getUserRole();
    return role === 'admin';
}

export async function isJudge(): Promise<boolean> {
    const role = await getUserRole();
    return role === 'judge';
}

export async function isContestant(): Promise<boolean> {
    const role = await getUserRole();
    return role === 'contestant';
}

export async function hasRolePermission(userRole: UserRole, requiredRole: UserRole): Promise<boolean> {
    const ROLE_HIERARCHY: Record<UserRole, number> = {
        admin: 3,
        judge: 2,
        contestant: 1
    };

    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Public route checking function
export function isPublicRoute(pathname: string): boolean {
    return pathname === '/' ||
        pathname.startsWith('/login') || // Single login page
        pathname.startsWith('/auth') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/contestant/register') ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.includes('.') // Static files
}

// Role-based access control functions for middleware
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

export function getUserRoleFromUser(user: { user_metadata?: { role?: string } } | null): UserRole | null {
    if (!user) return null;
    return (user.user_metadata?.role as UserRole) || 'contestant';
} 