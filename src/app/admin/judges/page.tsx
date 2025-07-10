import AdminSidebar from '../../components/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import JudgeManagementClient from './JudgeManagementClient';

export default async function ManageJudges() {
    // Create client
    const supabase = await createClient();

    // Check authentication
    const { data: userData, error: authError } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (authError || !userData?.user) {
        redirect('/login');
    }

    // Check if user is admin (in a real app, you'd check against a role in your database)
    // For now, we'll just proceed with the page

    // Fetch judges from the database
    const { data: judges, error: judgesError } = await supabase
        .from('judges')
        .select('*')
        .order('created_at', { ascending: false });

    if (judgesError) {
        console.error('Error fetching judges:', judgesError);
    }

    // Beauty contest categories for the specialty dropdown
    const beautyCategories = [
        "Makeup Artistry",
        "Nail Art",
        "Hair Styling",
        "Fashion Design",
        "Halal Beauty",
        "Creative Look",
        "Skincare",
        "Traditional Beauty Techniques",
        "Bridal Beauty"
    ];

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    {/* Pass all the data to the client component */}
                    <JudgeManagementClient
                        judges={judges || []}
                        beautyCategories={beautyCategories}
                    />
                </div>
            </main>
        </div>
    );
} 