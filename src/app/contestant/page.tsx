'use client';
import Sidebar from '../components/Sidebar';

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function ContestantDashboard() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
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
                    <button
                        className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition font-heading text-lg shadow-lg tracking-wide mb-4"
                        onClick={() => window.location.href = '/contestant/submit'}
                    >
                        Submit Your Work
                    </button>
                </div>
            </main>
        </div>
    );
}
