import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { sendJudgeCredentials } from '@/utils/email';

export async function POST(req: NextRequest) {
    try {
        // Create Supabase client
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // If no authenticated user, return unauthorized
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse form data
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const bio = formData.get('bio') as string;
        const years_experience = parseInt(formData.get('years_experience') as string) || 0;
        const specialty = formData.getAll('specialty') as string[];

        console.log(`🧑‍⚖️ Adding new judge: ${name} (${email})`);

        // Validate required fields
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // Check if a judge with this email already exists
        const { data: existingJudge, error: checkError } = await supabase
            .from('judges')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (existingJudge) {
            console.log(`⚠️ Judge with email ${email} already exists`);
            return NextResponse.json({
                error: 'A judge with this email already exists',
                details: 'Please use a different email address'
            }, { status: 400 });
        }

        // Generate a random password for the new judge
        const generatedPassword = generateRandomPassword();

        // Create judge data object with a generated ID
        const judgeData = {
            id: uuidv4(), // Generate a UUID for the judge
            name,
            email,
            bio,
            specialty,
            years_experience,
            created_at: new Date().toISOString()
        };

        // Create a judge profile in the judges table
        const { data: newJudge, error: createJudgeError } = await supabase
            .from('judges')
            .insert(judgeData)
            .select()
            .single();

        if (createJudgeError) {
            console.error('❌ Error creating judge profile:', createJudgeError);
            return NextResponse.json({
                error: 'Failed to create judge profile',
                details: createJudgeError.message
            }, { status: 500 });
        }

        console.log(`✅ Judge profile created successfully: ${newJudge?.id || 'unknown'}`);

        // Create a new user in Supabase Auth using standard signUp
        const { data: authData, error: createUserError } = await supabase.auth.signUp({
            email,
            password: generatedPassword,
            options: {
                data: {
                    role: 'judge',
                    name,
                    judge_id: newJudge.id
                }
            }
        });

        if (createUserError) {
            console.error('❌ Error creating user account:', createUserError);
            // We don't return an error here because the judge profile was already created
            // The admin can manually send credentials later
        } else {
            console.log('✅ User account created successfully');
        }

        // Always send login credentials via email
        try {
            console.log(`📧 Sending credentials email to ${email}`);
            const emailResult = await sendJudgeCredentials(name, email, generatedPassword);

            if (!emailResult.success) {
                console.error('❌ Failed to send email, but judge was created:', emailResult.error);
            } else {
                console.log('✅ Credentials email sent successfully');
            }
        } catch (emailError) {
            console.error('❌ Error sending email:', emailError);
            // We don't return an error here because the judge was successfully created
        }

        return NextResponse.json({
            success: true,
            message: 'Judge added successfully. Login credentials have been sent to their email.',
            judge: newJudge,
            redirectTo: '/judges/login'
        });

    } catch (error) {
        console.error('❌ Error adding judge:', error);
        return NextResponse.json({
            error: 'Failed to add judge',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

// Helper function to generate a random password
function generateRandomPassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
} 