import Sidebar from '../components/Sidebar';
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SubmitButton from '../components/SubmitButton';

export default async function ContestantDashboard() {
    // Create client
    const supabase = await createClient()

    // Check authentication - always use getUser() for security
    const { data, error } = await supabase.auth.getUser()

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-xl mx-auto p-8 bg-black rounded-2xl shadow-2xl border border-accent flex flex-col items-center gap-6 mt-12">
                    <h1 className="text-3xl font-heading text-white font-bold mb-2 text-center">Welcome to Your Contestant Dashboard</h1>
                    <p className="text-secondary text-lg text-center mb-2 text-white">
                        Ready to compete? Submit your work below!
                    </p>
                    <SubmitButton />
                </div>
            </main>
        </div>
    );
}
