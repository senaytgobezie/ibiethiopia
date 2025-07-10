import AdminSidebar from '../../components/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
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

    // Fetch stats from database
    const { data: judgesCount, error: judgesError } = await supabase
        .from('judges')
        .select('id', { count: 'exact', head: true });

    const { data: contestantsCount, error: contestantsError } = await supabase
        .from('contestants')
        .select('id', { count: 'exact', head: true });

    const { data: submissionsCount, error: submissionsError } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true });

    const { data: pendingSubmissions, error: pendingError } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

    // Quick actions for admin
    const quickActions = [
        {
            title: "Add Judge",
            description: "Register a new judge and send login credentials",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
            ),
            link: "/admin/judges",
            color: "bg-blue-500"
        },
        {
            title: "Schedule Event",
            description: "Create a new event for contestants or judges",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            ),
            link: "/admin/events",
            color: "bg-green-500"
        },
        {
            title: "Post Notice",
            description: "Publish an announcement for users",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
            ),
            link: "/admin/notices",
            color: "bg-yellow-500"
        },
        {
            title: "Generate Reports",
            description: "Create reports on contest performance",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            link: "/admin/reports",
            color: "bg-purple-500"
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg mb-4">Judges</h3>
                            <p className="text-4xl font-bold">{judgesCount?.count || 0}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg mb-4">Contestants</h3>
                            <p className="text-4xl font-bold">{contestantsCount?.count || 0}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg mb-4">Submissions</h3>
                            <p className="text-4xl font-bold">{submissionsCount?.count || 0}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg mb-4">Pending Reviews</h3>
                            <p className="text-4xl font-bold">{pendingSubmissions?.count || 0}</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {quickActions.map((action, index) => (
                            <Link href={action.link} key={index} className="block">
                                <div className={`${action.color} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow`}>
                                    <div className="flex items-center mb-4">
                                        {action.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                                    <p className="text-sm opacity-90">{action.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="bg-blue-500 text-white p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">New submission received</p>
                                    <p className="text-sm text-gray-500">Contestant Abebe Kebede submitted "Creative Makeup Look"</p>
                                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="bg-green-500 text-white p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">Judge completed evaluation</p>
                                    <p className="text-sm text-gray-500">Judge Hiwot Bekele evaluated "Traditional Bridal Look"</p>
                                    <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="bg-yellow-500 text-white p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">New notice published</p>
                                    <p className="text-sm text-gray-500">Admin posted "Final Submission Deadline Extended"</p>
                                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <button className="text-accent hover:text-accent/80">View All Activity</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 