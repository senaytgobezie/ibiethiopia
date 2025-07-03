'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

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

    // Revalidate the path and redirect
    revalidatePath('/', 'layout')
    redirect(redirectUrl)
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