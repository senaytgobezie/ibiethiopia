import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { sendJudgeCredentials } from '@/utils/email';

// Standard API response types
interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

// Create admin client with service role key
const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseServiceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
    }

    return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
    const supabase = await createClient();

    try {
        // Check authentication using regular client
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: 'Authentication required',
                error: 'Unauthorized access'
            }, { status: 401 });
        }

        // Parse and validate form data
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const bio = formData.get('bio') as string || '';
        const years_experience = parseInt(formData.get('years_experience') as string) || 0;
        const specialty = formData.getAll('specialty') as string[];

        // Input validation
        if (!name?.trim()) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: 'Validation failed',
                error: 'Name is required'
            }, { status: 400 });
        }

        if (!email?.trim() || !isValidEmail(email)) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: 'Validation failed',
                error: 'Valid email address is required'
            }, { status: 400 });
        }

        if (years_experience < 0) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: 'Validation failed',
                error: 'Years of experience cannot be negative'
            }, { status: 400 });
        }

        console.log(`🧑‍⚖️ Adding new judge: ${name} (${email})`);

        // Check if judge already exists
        const { data: existingJudge } = await supabase
            .from('judges')
            .select('id')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (existingJudge) {
            console.log(`⚠️ Judge with email ${email} already exists`);
            return NextResponse.json<ApiResponse>({
                success: false,
                message: 'Judge already exists',
                error: 'A judge with this email address already exists'
            }, { status: 409 });
        }

        // Generate secure password
        const generatedPassword = generateSecurePassword();
        const judgeId = uuidv4();

        console.log(`🔐 Creating auth user for: ${email}`);

        // Create admin client for admin operations
        const adminClient = createAdminClient();

        // Step 1: Create auth user directly using admin API (bypasses confirmation emails)
        const { data: authData, error: createUserError } = await adminClient.auth.admin.createUser({
            email: email.toLowerCase().trim(),
            password: generatedPassword,
            email_confirm: true, // Auto-confirm the user
            user_metadata: {
                role: 'judge',
                name: name.trim(),
                judge_id: judgeId
            }
        });

        // For admin-created accounts, we want to confirm them immediately
        // This prevents the need for email confirmation
        if (authData?.user && !authData.user.email_confirmed_at) {
            try {
                console.log('🔐 Confirming user account immediately...');
                const { error: confirmError } = await adminClient.auth.admin.updateUserById(
                    authData.user.id,
                    { email_confirm: true }
                );

                if (confirmError) {
                    console.error('⚠️ Failed to confirm user account:', confirmError);
                    // Continue anyway - user can still login
                }
            } catch (confirmErr) {
                console.error('⚠️ Error confirming user account:', confirmErr);
                // Continue anyway
            }
        }

        let finalAuthUser = authData?.user;
        let isExistingUser = false;

        // If user creation fails, check if user already exists
        if (createUserError) {
            console.log(`⚠️ User creation failed: ${createUserError.message}`);

            // Check if error is due to user already existing
            if (createUserError.message.includes('already registered') ||
                createUserError.message.includes('already exists') ||
                createUserError.message.includes('already been registered') ||
                createUserError.message.includes('User already registered')) {

                console.log(`🔍 User already exists, retrieving existing user data for: ${email}`);

                // Try to get existing user by email using admin API
                const { data: existingUsers, error: getUserError } = await adminClient.auth.admin.listUsers();

                if (getUserError) {
                    console.error('❌ Error retrieving existing users:', getUserError);
                    return NextResponse.json<ApiResponse>({
                        success: false,
                        message: 'Failed to retrieve existing user information',
                        error: getUserError.message
                    }, { status: 500 });
                }

                // Find the user by email
                const existingUser = existingUsers.users.find(user =>
                    user.email?.toLowerCase() === email.toLowerCase().trim()
                );

                if (!existingUser) {
                    console.error('❌ User should exist but could not be found');
                    return NextResponse.json<ApiResponse>({
                        success: false,
                        message: 'User exists but could not be retrieved',
                        error: 'Unable to find existing user'
                    }, { status: 500 });
                }

                finalAuthUser = existingUser;
                isExistingUser = true;
                console.log(`✅ Retrieved existing user: ${existingUser.id}`);

                // Update existing user's metadata to include judge role
                const { error: updateUserError } = await adminClient.auth.admin.updateUserById(
                    existingUser.id,
                    {
                        user_metadata: {
                            ...existingUser.user_metadata,
                            role: 'judge',
                            name: name.trim(),
                            judge_id: judgeId
                        }
                    }
                );

                if (updateUserError) {
                    console.error('⚠️ Failed to update user metadata:', updateUserError);
                    // Don't fail here, just log the warning
                }

            } else {
                // Other user creation errors
                console.error('❌ Error creating user account:', createUserError);
                return NextResponse.json<ApiResponse>({
                    success: false,
                    message: 'Failed to create user account',
                    error: createUserError.message
                }, { status: 500 });
            }
        }

        if (!finalAuthUser) {
            console.error('❌ No user data available');
            return NextResponse.json<ApiResponse>({
                success: false,
                message: 'Failed to get user information',
                error: 'No user data available'
            }, { status: 500 });
        }

        if (isExistingUser) {
            console.log(`✅ Using existing auth user: ${finalAuthUser.id}`);
        } else {
            console.log(`✅ Created new auth user: ${finalAuthUser.id}`);
        }

        // Step 2: Create judge profile using the auth user ID
        const judgeData = {
            id: judgeId,
            user_id: null, // Initially null, will update after confirming user exists
            name: name.trim(),
            email: email.toLowerCase().trim(),
            bio: bio.trim(),
            specialty,
            years_experience,
            status: 'active',
            created_at: new Date().toISOString()
        };

        console.log(`👨‍⚖️ Creating judge profile for: ${name}`);

        const { data: newJudge, error: createJudgeError } = await supabase
            .from('judges')
            .insert(judgeData)
            .select()
            .single();

        // If judge profile creation fails, rollback only if we created a new user
        if (createJudgeError) {
            console.error('❌ Error creating judge profile:', createJudgeError);

            // Only rollback if we created a new user (not existing)
            if (!isExistingUser) {
                try {
                    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(finalAuthUser.id);
                    if (deleteUserError) {
                        console.error('⚠️ Failed to rollback auth user:', deleteUserError);
                    } else {
                        console.log('🔄 Successfully rolled back newly created auth user');
                    }
                } catch (rollbackError) {
                    console.error('⚠️ Error during rollback:', rollbackError);
                }
            }

            return NextResponse.json<ApiResponse>({
                success: false,
                message: 'Failed to create judge profile',
                error: createJudgeError.message
            }, { status: 500 });
        }

        console.log(`✅ Judge profile created: ${judgeId}`);

        // Step 3: Update judge profile with user_id after confirming user exists
        // Wait a moment for the auth user to be fully created
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Verify the user exists in auth.users and update judge profile
            const { data: verifyUser, error: verifyError } = await adminClient.auth.admin.getUserById(finalAuthUser.id);

            if (verifyError || !verifyUser.user) {
                console.error('❌ Auth user not found after creation:', verifyError);
                // User doesn't exist, keep user_id as null but continue
                console.log('⚠️ Continuing without linking to auth user');
            } else {
                // Update judge profile with user_id
                const { error: updateError } = await supabase
                    .from('judges')
                    .update({ user_id: finalAuthUser.id })
                    .eq('id', judgeId);

                if (updateError) {
                    console.error('⚠️ Failed to update judge with user_id:', updateError);
                    // Don't fail here, judge is created successfully
                } else {
                    console.log(`✅ Judge profile linked to user: ${finalAuthUser.id}`);
                }
            }
        } catch (linkError) {
            console.error('⚠️ Error linking judge to user:', linkError);
            // Don't fail here, judge is created successfully
        }

        // Send credentials email (only if we created a new user, existing users keep their password)
        if (!isExistingUser) {
            try {
                console.log(`📧 Sending credentials to ${email}`);
                const emailResult = await sendJudgeCredentials(name, email, generatedPassword);

                if (!emailResult.success) {
                    console.error('❌ Failed to send credentials email:', emailResult.error);

                    return NextResponse.json<ApiResponse>({
                        success: true,
                        message: 'Judge created successfully, but failed to send email. Please send credentials manually.',
                        data: {
                            judge: newJudge,
                            emailSent: false,
                            isExistingUser: false
                        }
                    });
                }

                console.log('✅ Credentials email sent successfully');

            } catch (emailError) {
                console.error('❌ Error sending credentials email:', emailError);

                return NextResponse.json<ApiResponse>({
                    success: true,
                    message: 'Judge created successfully, but failed to send email. Please send credentials manually.',
                    data: {
                        judge: newJudge,
                        emailSent: false,
                        isExistingUser: false
                    }
                });
            }
        }

        // Complete success
        const successMessage = isExistingUser
            ? 'Existing user added as judge successfully'
            : 'Judge added successfully and credentials sent via email';

        return NextResponse.json<ApiResponse>({
            success: true,
            message: successMessage,
            data: {
                judge: newJudge,
                emailSent: !isExistingUser, // Only sent for new users
                isExistingUser
            }
        });

    } catch (error) {
        console.error('❌ Unexpected error adding judge:', error);

        return NextResponse.json<ApiResponse>({
            success: false,
            message: 'An unexpected error occurred',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to generate a secure password
function generateSecurePassword(length = 16): string {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const allChars = lowercase + uppercase + numbers + special;

    let password = "";

    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
} 