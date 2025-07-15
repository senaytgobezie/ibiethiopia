// User role types
export type UserRole = 'admin' | 'judge' | 'contestant';

// User metadata interface
export interface UserMetadata {
    role?: UserRole;
    name?: string;
    email?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    [key: string]: unknown; // Allow additional metadata fields
}

// Extended Supabase User interface with role
export interface UserWithRole {
    id: string;
    email: string;
    user_metadata: UserMetadata;
    raw_user_meta_data: UserMetadata;
    created_at: string;
    updated_at: string;
    email_confirmed_at?: string;
    last_sign_in_at?: string;
    role: 'authenticated' | 'anon';
    aud: string;
    app_metadata: {
        provider: string;
        providers: string[];
    };
}

// Auth status interface
export interface AuthStatus {
    isAuthenticated: boolean;
    user: UserWithRole | null;
    role: UserRole | null;
    method: 'supabase' | 'database' | null;
}

// Role-based access control types
export interface RolePermissions {
    canAccessAdmin: boolean;
    canAccessJudge: boolean;
    canAccessContestant: boolean;
    canManageUsers: boolean;
    canEvaluateSubmissions: boolean;
    canSubmitWork: boolean;
}

// User profile interfaces
export interface AdminUser {
    id: string;
    email: string;
    name: string | null;
    created_at: string;
    user_metadata?: UserMetadata;
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
    user_metadata?: UserMetadata;
}

export interface ContestantUser {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    gender: string | null;
    categories: string | null;
    bio: string | null;
    created_at: string;
    user_metadata?: UserMetadata;
}

// Union type for all user types
export type AppUser = AdminUser | JudgeUser | ContestantUser;

// Session management types
export interface AuthSession {
    user: AppUser;
    role: UserRole;
    expiresAt: number;
}

// Registration types
export interface RegistrationData {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    phone?: string;
    gender?: string;
    categories?: string;
    bio?: string;
}

// Login types
export interface LoginData {
    email: string;
    password: string;
}

// Role validation helpers
export const isValidRole = (role: string): role is UserRole => {
    return ['admin', 'judge', 'contestant'].includes(role);
};

export const getDefaultRole = (): UserRole => 'contestant';

// Role hierarchy (for permission checking)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
    admin: 3,
    judge: 2,
    contestant: 1
};

export const hasRolePermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Helper function for middleware
export const getRoleFromMetadata = (user: { user_metadata?: UserMetadata } | null): UserRole => {
    return user?.user_metadata?.role || 'contestant';
}; 