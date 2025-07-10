import JudgeSidebar from '../components/JudgeSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function JudgeDashboard() {
    // Create client
    const supabase = await createClient();

    // Check authentication - always use getUser() for security
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login');
    }

    // TODO: Add check for judge role
    // This would verify the user is actually a judge in the system

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <JudgeSidebar />
            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl mx-auto p-8 bg-black rounded-2xl shadow-2xl border border-accent flex flex-col items-center gap-6 mt-12">
                    <h1 className="text-3xl font-heading text-white font-bold mb-2 text-center">Welcome to Your Judge Dashboard</h1>
                    <p className="text-secondary text-lg text-center mb-2 text-white">
                        Review and evaluate contestant submissions
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
                        <div className="bg-gray-900 p-6 rounded-lg text-center">
                            <h3 className="text-accent text-xl mb-2">Pending</h3>
                            <p className="text-4xl font-bold text-white">12</p>
                            <p className="text-gray-400">New Submissions</p>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg text-center">
                            <h3 className="text-accent text-xl mb-2">Evaluated</h3>
                            <p className="text-4xl font-bold text-white">24</p>
                            <p className="text-gray-400">Total Submissions</p>
                        </div>
                    </div>
                    <div className="w-full mt-6">
                        <h3 className="text-accent text-xl mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="bg-gray-900 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-white">New submission from Abebe Kebede</p>
                                    <p className="text-gray-400 text-sm">Today, 10:45 AM</p>
                                </div>
                                <button className="bg-accent text-black px-3 py-1 rounded-md hover:bg-accent/80 transition">
                                    Review
                                </button>
                            </div>
                            <div className="bg-gray-900 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-white">New submission from Tigist Alemu</p>
                                    <p className="text-gray-400 text-sm">Today, 9:30 AM</p>
                                </div>
                                <button className="bg-accent text-black px-3 py-1 rounded-md hover:bg-accent/80 transition">
                                    Review
                                </button>
                            </div>
                            <div className="bg-gray-900 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-white">New submission from Dawit Haile</p>
                                    <p className="text-gray-400 text-sm">Yesterday, 4:15 PM</p>
                                </div>
                                <button className="bg-accent text-black px-3 py-1 rounded-md hover:bg-accent/80 transition">
                                    Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 