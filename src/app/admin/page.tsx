import AdminSidebar from '../components/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
    // Create client
    const supabase = await createClient();

    // Check authentication
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login');
    }

    // TODO: Add check for admin role
    // This would verify the user is actually an admin in the system

    // Mock data for dashboard - in a real app, this would come from the database
    const stats = {
        contestants: {
            total: 156,
            pending: 12,
        },
        judges: {
            total: 24,
            active: 22,
        },
        submissions: {
            total: 132,
            evaluated: 98,
            pending: 34,
        },
        events: {
            upcoming: 5,
            past: 2,
        }
    };

    // Recent activity data
    const recentActivity = [
        {
            id: 1,
            type: "registration",
            user: "Abebe Kebede",
            action: "registered as a contestant",
            time: "2 hours ago",
        },
        {
            id: 2,
            type: "submission",
            user: "Tigist Alemu",
            action: "submitted a project",
            time: "3 hours ago",
        },
        {
            id: 3,
            type: "evaluation",
            user: "Dr. Alemayehu Tadesse",
            action: "evaluated a submission",
            time: "5 hours ago",
        },
        {
            id: 4,
            type: "registration",
            user: "Dawit Haile",
            action: "registered as a contestant",
            time: "1 day ago",
        },
        {
            id: 5,
            type: "evaluation",
            user: "Dr. Hiwot Bekele",
            action: "evaluated a submission",
            time: "1 day ago",
        }
    ];

    // Pending approvals
    const pendingApprovals = [
        {
            id: 1,
            name: "Abebe Kebede",
            email: "abebe.k@example.com",
            type: "Contestant Registration",
            date: "June 10, 2023",
        },
        {
            id: 2,
            name: "Tigist Alemu",
            email: "tigist.a@example.com",
            type: "Contestant Registration",
            date: "June 9, 2023",
        }
    ];

    // Upcoming events
    const upcomingEvents = [
        {
            id: 1,
            title: "Judges Final Deliberation Meeting",
            date: "June 20, 2023",
            time: "2:00 PM - 5:00 PM",
            location: "Virtual (Zoom)",
        },
        {
            id: 2,
            title: "Awards Ceremony Preparation",
            date: "June 22, 2023",
            time: "10:00 AM - 11:30 AM",
            location: "Virtual (Zoom)",
        },
        {
            id: 3,
            title: "IBI Ethiopia Innovation Awards Ceremony",
            date: "June 25, 2023",
            time: "6:00 PM - 9:00 PM",
            location: "Skylight Hotel, Addis Ababa",
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/80 transition flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Refresh Data
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Link href="/admin/contestants" className="bg-black text-white p-6 rounded-xl shadow-md hover:bg-gray-900 transition">
                            <h3 className="text-accent text-lg font-medium">Contestants</h3>
                            <p className="text-3xl font-bold mt-2">{stats.contestants.total}</p>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Pending Approvals</p>
                                    <p className="font-medium text-yellow-400">{stats.contestants.pending}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </Link>

                        <Link href="/admin/judges" className="bg-black text-white p-6 rounded-xl shadow-md hover:bg-gray-900 transition">
                            <h3 className="text-accent text-lg font-medium">Judges</h3>
                            <p className="text-3xl font-bold mt-2">{stats.judges.total}</p>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Active</p>
                                    <p className="font-medium text-green-400">{stats.judges.active}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </Link>

                        <Link href="/admin/evaluations" className="bg-black text-white p-6 rounded-xl shadow-md hover:bg-gray-900 transition">
                            <h3 className="text-accent text-lg font-medium">Submissions</h3>
                            <p className="text-3xl font-bold mt-2">{stats.submissions.total}</p>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Pending Evaluation</p>
                                    <p className="font-medium text-yellow-400">{stats.submissions.pending}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </Link>

                        <Link href="/admin/events" className="bg-black text-white p-6 rounded-xl shadow-md hover:bg-gray-900 transition">
                            <h3 className="text-accent text-lg font-medium">Events</h3>
                            <p className="text-3xl font-bold mt-2">{stats.events.upcoming}</p>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Upcoming Events</p>
                                    <p className="font-medium text-blue-400">{stats.events.upcoming}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Pending Approvals */}
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Pending Approvals</h2>
                                <Link href="/admin/contestants" className="text-accent hover:underline text-sm">
                                    View All
                                </Link>
                            </div>

                            {pendingApprovals.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingApprovals.map((approval) => (
                                        <div key={approval.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <div className="text-lg font-medium">{approval.name}</div>
                                                    <div className="text-sm text-gray-600">{approval.email}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{approval.type} • {approval.date}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm">
                                                        Reject
                                                    </button>
                                                    <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm">
                                                        Approve
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No pending approvals at this time.
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Recent Activity</h2>
                                <Link href="/admin/reports" className="text-accent hover:underline text-sm">
                                    View Reports
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${activity.type === 'registration' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'submission' ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'
                                            }`}>
                                            {activity.type === 'registration' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                                                </svg>
                                            )}
                                            {activity.type === 'submission' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {activity.type === 'evaluation' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.user} {activity.action}
                                            </div>
                                            <div className="text-xs text-gray-500">{activity.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Upcoming Events</h2>
                            <Link href="/admin/events" className="text-accent hover:underline text-sm">
                                Manage Events
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {upcomingEvents.map((event) => (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{event.date}</div>
                                                <div>{event.time}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-accent hover:text-accent-dark mr-3">
                                                    View
                                                </button>
                                                <button className="text-blue-600 hover:text-blue-800">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Link href="/admin/judges" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex flex-col items-center text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent mb-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                </svg>
                                <h3 className="font-medium">Add Judge</h3>
                                <p className="text-xs text-gray-500 mt-1">Register a new judge</p>
                            </Link>
                            <Link href="/admin/notices" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex flex-col items-center text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent mb-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                                </svg>
                                <h3 className="font-medium">Send Notice</h3>
                                <p className="text-xs text-gray-500 mt-1">Create an announcement</p>
                            </Link>
                            <Link href="/admin/events" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex flex-col items-center text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent mb-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <h3 className="font-medium">Schedule Event</h3>
                                <p className="text-xs text-gray-500 mt-1">Create a new event</p>
                            </Link>
                            <Link href="/admin/reports" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex flex-col items-center text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent mb-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <h3 className="font-medium">View Reports</h3>
                                <p className="text-xs text-gray-500 mt-1">See detailed analytics</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 