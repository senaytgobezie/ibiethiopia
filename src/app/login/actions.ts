'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function login(formData: FormData, redirectUrl: string = '/') {
    // Create client
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate inputs
    if (!email || !password) {
        throw new Error('Email and password are required')
    }

    // Sign in with Supabase
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login error:', error)

        // Handle specific error cases
        if (error.message === "Email not confirmed") {
            throw "Please check your email and confirm your account before logging in."
        }

        throw error.message
    }

    // Verify the session was created successfully
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        throw "Failed to create session. Please try again."
    }

    // Check which tables the user exists in to determine roles
    const userId = session.user.id;
    const userRoles = await getUserRoles(supabase, userId);

    console.log(`🔍 User ${userId} has roles:`, userRoles);

    let finalRedirectUrl = redirectUrl;

    // Determine redirect based on available roles
    if (userRoles.length === 0) {
        // No roles found - user doesn't exist in any role tables
        console.log('❌ User has no assigned roles');
        throw "Access denied. Please contact an administrator.";
    } else if (userRoles.length === 1) {
        // Single role - redirect directly
        const role = userRoles[0];
        finalRedirectUrl = getRoleRedirectUrl(role);
        console.log(`🎯 Single role '${role}' detected, redirecting to ${finalRedirectUrl}`);
    } else {
        // Multiple roles - redirect to role selection or default to first role
        // You can implement a role selection page later if needed
        // For now, prioritize roles: admin > judge > contestant
        const prioritizedRole = prioritizeRoles(userRoles);
        finalRedirectUrl = getRoleRedirectUrl(prioritizedRole);
        console.log(`🎭 Multiple roles detected [${userRoles.join(', ')}], prioritizing '${prioritizedRole}' -> ${finalRedirectUrl}`);
    }

    // Revalidate the path and redirect
    revalidatePath('/', 'layout')
    redirect(finalRedirectUrl)
}

// Helper function to check which tables the user exists in
async function getUserRoles(supabase: SupabaseClient, userId: string): Promise<string[]> {
    const roles: string[] = [];

    try {
        // Check if user exists in judges table
        const { data: judgeData } = await supabase
            .from('judges')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (judgeData) {
            roles.push('judge');
        }

        // Check if user exists in contestants table
        const { data: contestantData } = await supabase
            .from('contestants')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (contestantData) {
            roles.push('contestant');
        }

        // Check if user exists in admins table (if it exists)
        try {
            const { data: adminData } = await supabase
                .from('admins')
                .select('id')
                .eq('user_id', userId)
                .maybeSingle();

            if (adminData) {
                roles.push('admin');
            }
        } catch {
            // Admins table might not exist, ignore error
            console.log('ℹ️ Admins table not found or accessible');
        }

    } catch (error) {
        console.error('❌ Error checking user roles:', error);
    }

    return roles;
}

// Helper function to get redirect URL based on role
function getRoleRedirectUrl(role: string): string {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'judge':
            return '/judges';
        case 'contestant':
            return '/contestant';
        default:
            return '/contestant'; // Default fallback
    }
}

// Helper function to prioritize roles when user has multiple
function prioritizeRoles(roles: string[]): string {
    // Priority order: admin > judge > contestant
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('judge')) return 'judge';
    if (roles.includes('contestant')) return 'contestant';

    // Fallback to first role if none of the above
    return roles[0];
}

export async function signup(formData: FormData) {
    try {
        // Create client
        const supabase = await createClient()

        // type-casting here for convenience
        // in practice, you should validate your inputs
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }

        const { error } = await supabase.auth.signUp(data)

        if (error) {
            throw error.message
        }

        // After signup, redirect to a confirmation page
        redirect('/auth/confirmation')
    } catch (error) {
        console.error('Signup error:', error)
        throw error instanceof Error ? error.message : String(error)
    }
}