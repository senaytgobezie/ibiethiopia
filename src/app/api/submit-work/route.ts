import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('file') as File;
        const accessToken = req.headers.get('x-supabase-auth') || '';

        // Basic validation
        if (!title || !description || !file) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        // Create a new Supabase client with the access token
        const supabaseWithAuth = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            }
        );

        // Get user information from the token
        const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser();

        if (userError || !user) {
            console.error('Authentication error:', userError);
            return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
        }

        console.log('Authenticated user:', user.id, user.email);
        const userId = user.id;

        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `submissions/${userId}/${fileName}`;

        console.log('Uploading file to:', filePath);
        const { data: uploadData, error: uploadError } = await supabaseWithAuth.storage
            .from('submissions')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        console.log('File uploaded successfully:', uploadData?.path);

        // Get the contestant record for this user
        const { data: contestantData, error: contestantError } = await supabaseWithAuth
            .from('contestants')
            .select('id')
            .eq('user_id', userId)
            .single();

        let contestantId;

        // If contestant doesn't exist, create one
        if (contestantError || !contestantData) {
            console.log('Contestant not found, creating new contestant record');

            // Get user details
            const { data: userData } = await supabaseWithAuth.auth.getUser();
            const email = userData?.user?.email || '';

            // Create a new contestant record
            const { data: newContestant, error: createError } = await supabaseWithAuth
                .from('contestants')
                .insert({
                    user_id: userId,
                    name: email.split('@')[0], // Use part of email as name
                    email: email,
                })
                .select('id')
                .single();

            if (createError || !newContestant) {
                console.error('Error creating contestant:', createError);
                return NextResponse.json({ error: 'Failed to create contestant profile.' }, { status: 500 });
            }

            contestantId = newContestant.id;
        } else {
            contestantId = contestantData.id;
        }

        // Store submission in database
        const { error: submissionError } = await supabaseWithAuth
            .from('submissions')
            .insert({
                contestant_id: contestantId,
                title,
                description,
                file_path: filePath,
                status: 'pending', // pending, approved, rejected
                submitted_at: new Date().toISOString()
            });

        if (submissionError) {
            console.error('Submission error:', submissionError);
            return NextResponse.json({ error: submissionError.message }, { status: 500 });
        }

        console.log('Submission created successfully');
        return NextResponse.json({
            message: 'Submission received!',
            filePath: uploadData?.path
        });
    } catch (error: any) {
        console.error('Submission error:', error);
        return NextResponse.json({ error: error.message || 'Failed to process submission.' }, { status: 500 });
    }
} 