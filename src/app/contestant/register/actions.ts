'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function registerContestant(formData: FormData) {
    const supabase = await createClient()

    try {
        // Extract form data
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const name = formData.get('name') as string
        const phone = formData.get('phone') as string
        const gender = formData.get('gender') as string

        // Get the payment screenshot path (if uploaded client-side)
        const paymentScreenshotPath = formData.get('payment_screenshot_path') as string

        // Get categories from formData
        const categoriesData: string[] = []
        const allCategories = [
            'Halal',
            'Hair Artistry',
            'Makeup Artistry',
            'Fashion Design',
            'Nail Artistry',
            'Creative Make Up',
        ]

        allCategories.forEach(cat => {
            if (formData.get(cat) === 'on') {
                categoriesData.push(cat)
            }
        })

        // 1. Sign up user with Supabase Auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError || !authData.user) {
            throw signUpError?.message || 'Registration failed'
        }

        // Handle file upload if no path was provided
        let finalPaymentScreenshotPath = paymentScreenshotPath
        const paymentFile = formData.get('payment_screenshot') as File

        if (!finalPaymentScreenshotPath && paymentFile && paymentFile.size > 0) {
            console.log('Server-side upload fallback for payment screenshot')

            const fileExt = paymentFile.name.split('.').pop()
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
            const filePath = `screenshots/${fileName}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('payment-screenshots')
                .upload(filePath, paymentFile)

            if (uploadError) {
                console.error('Upload error:', uploadError)
                throw uploadError.message
            }

            finalPaymentScreenshotPath = uploadData?.path || ''
        }

        // 3. Insert into contestants table
        const { error: dbError } = await supabase
            .from('contestants')
            .insert({
                user_id: authData.user.id,
                name,
                email,
                phone,
                gender,
                categories: categoriesData.join(','),
                payment_screenshot: finalPaymentScreenshotPath,
            })

        if (dbError) {
            console.error('Database error:', dbError)
            throw dbError.message
        }

        // Redirect to confirmation page
        redirect('/auth/confirmation')
    } catch (error: unknown) {
        console.error('Registration error:', error)
        throw error instanceof Error ? error.message : String(error)
    }
} 