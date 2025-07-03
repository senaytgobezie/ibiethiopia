import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('file') as File;

        // Basic validation
        if (!title || !description || !file) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        // Create a server-side Supabase client
        const supabase = await createServerClient();

        // Get user information from the session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

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
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('submissions')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        console.log('File uploaded successfully:', uploadData?.path);

        // Get the contestant record for this user
        const { data: contestantData, error: contestantError } = await supabase
            .from('contestants')
            .select('id')
            .eq('user_id', userId)
            .single();

        let contestantId;

        // If contestant doesn't exist, create one
        if (contestantError || !contestantData) {
            console.log('Contestant not found, creating new contestant record');

            // Get user details from the current session
            const email = user.email || '';

            // Create a new contestant record
            const { data: newContestant, error: createError } = await supabase
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
        const { error: submissionError } = await supabase
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
    } catch (error: unknown) {
        console.error('Submission error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process submission.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
} 