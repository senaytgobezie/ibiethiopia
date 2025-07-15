'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { UserRole } from '@/types/auth'

export async function login(formData: FormData, redirectUrl: string = '/') {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate inputs
    if (!email || !password) {
        throw new Error('Email and password are required')
    }

    // Create client
    const supabase = await createClient()

    // Sign in with Supabase
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login error:', error)

        // If email is not confirmed, try to auto-confirm the user
        if (error.message === "Email not confirmed" || error.message.includes("email_not_confirmed")) {
            console.log('Email not confirmed, attempting to auto-confirm user...')

            try {
                // Call our API to confirm the user
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/confirm-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    console.log('User confirmed successfully, retrying login...');

                    // Try login again
                    const { error: retryError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                    if (!retryError) {
                        // Success! Continue with normal flow
                        const { data: { session } } = await supabase.auth.getSession();
                        if (session) {
                            revalidatePath('/', 'layout');
                            await redirectBasedOnRole(session.user, redirectUrl);
                        }
                    }
                } else {
                    const errorData = await response.json();
                    throw errorData.error || 'Failed to confirm user';
                }
            } catch (confirmError) {
                console.error('Error confirming user:', confirmError);
                throw "Your email is not confirmed. Please check your inbox and click the confirmation link, or contact support for help.";
            }
        }

        throw error.message
    }

    // Verify the session was created successfully
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        throw "Failed to create session. Please try again."
    }

    // Redirect based on user role
    await redirectBasedOnRole(session.user, redirectUrl);
}

async function redirectBasedOnRole(user: any, originalRedirectUrl: string) {
    const userRole = user.user_metadata?.role as UserRole || 'contestant';

    // If there's a specific redirect URL and user has access to it, use it
    if (originalRedirectUrl && originalRedirectUrl !== '/') {
        const hasAccess = checkRoleAccess(originalRedirectUrl, userRole);
        if (hasAccess) {
            revalidatePath('/', 'layout');
            redirect(originalRedirectUrl);
        }
    }

    // Otherwise, redirect based on user role to their respective dashboard
    let redirectUrl = '/';

    switch (userRole) {
        case 'admin':
            redirectUrl = '/admin';
            break;
        case 'judge':
            redirectUrl = '/judges';
            break;
        case 'contestant':
            redirectUrl = '/contestant';
            break;
        default:
            redirectUrl = '/contestant'; // Default fallback
    }

    console.log(`Redirecting user with role '${userRole}' to: ${redirectUrl}`);
    revalidatePath('/', 'layout');
    redirect(redirectUrl);
}

function checkRoleAccess(pathname: string, userRole: UserRole): boolean {
    // Admin routes - only admin can access
    if (pathname.startsWith('/admin')) {
        return userRole === 'admin';
    }

    // Judge routes - only judge can access
    if (pathname.startsWith('/judges')) {
        return userRole === 'judge';
    }

    // Contestant routes - only contestant can access
    if (pathname.startsWith('/contestant')) {
        return userRole === 'contestant';
    }

    // Default: allow access
    return true;
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

        const { error } = await supabase.auth.signUp({
            ...data,
            options: {
                data: {
                    role: 'contestant' // Set default role for new users
                }
            }
        })

        if (error) {
            throw error.message
        }

        // After signup, redirect to login page instead of confirmation
        redirect('/login')
    } catch (error) {
        console.error('Signup error:', error)
        throw error instanceof Error ? error.message : String(error)
    }
}