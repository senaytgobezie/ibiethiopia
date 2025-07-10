import AdminSidebar from '../../components/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function ManageContestants() {
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

    // Mock contestants data - in a real app, this would come from the database
    const contestants = [
        {
            id: 1,
            name: "Abebe Kebede",
            email: "abebe.k@example.com",
            phone: "+251912345678",
            category: "Web Development",
            projectTitle: "E-Commerce Platform for Local Artisans",
            registrationDate: "2023-06-10",
            status: "Pending",
            avatar: "/images/avatar-placeholder.png"
        },
        {
            id: 2,
            name: "Tigist Alemu",
            email: "tigist.a@example.com",
            phone: "+251923456789",
            category: "Mobile App",
            projectTitle: "Mobile Health Monitoring App",
            registrationDate: "2023-06-09",
            status: "Pending",
            avatar: "/images/avatar-placeholder.png"
        },
        {
            id: 3,
            name: "Dawit Haile",
            email: "dawit.h@example.com",
            phone: "+251934567890",
            category: "IoT",
            projectTitle: "Smart Agriculture IoT Solution",
            registrationDate: "2023-06-05",
            status: "Approved",
            avatar: "/images/avatar-placeholder.png"
        },
        {
            id: 4,
            name: "Hanna Tesfaye",
            email: "hanna.t@example.com",
            phone: "+251945678901",
            category: "Game Development",
            projectTitle: "Educational Game for Children",
            registrationDate: "2023-06-03",
            status: "Approved",
            avatar: "/images/avatar-placeholder.png"
        },
        {
            id: 5,
            name: "Yonas Girma",
            email: "yonas.g@example.com",
            phone: "+251956789012",
            category: "AI/ML",
            projectTitle: "AI-Powered Translation Tool",
            registrationDate: "2023-06-01",
            status: "Approved",
            avatar: "/images/avatar-placeholder.png"
        },
        {
            id: 6,
            name: "Meron Tadesse",
            email: "meron.t@example.com",
            phone: "+251967890123",
            category: "Web Development",
            projectTitle: "Community Health Tracking System",
            registrationDate: "2023-05-28",
            status: "Approved",
            avatar: "/images/avatar-placeholder.png"
        },
        {
            id: 7,
            name: "Eyob Mengistu",
            email: "eyob.m@example.com",
            phone: "+251978901234",
            category: "Mobile App",
            projectTitle: "Public Transport Tracking App",
            registrationDate: "2023-05-25",
            status: "Rejected",
            avatar: "/images/avatar-placeholder.png"
        }
    ];

    // Stats for the dashboard
    const stats = {
        total: contestants.length,
        approved: contestants.filter(c => c.status === "Approved").length,
        pending: contestants.filter(c => c.status === "Pending").length,
        rejected: contestants.filter(c => c.status === "Rejected").length
    };

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Manage Contestants</h1>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Export Data
                            </button>
                            <button className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/80 transition flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Contestant
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Total Contestants</h3>
                            <p className="text-3xl font-bold mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-green-400 text-lg font-medium">Approved</h3>
                            <p className="text-3xl font-bold mt-2">{stats.approved}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-yellow-400 text-lg font-medium">Pending</h3>
                            <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-red-400 text-lg font-medium">Rejected</h3>
                            <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search contestants by name, email, or project..."
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                    <option value="all">All Categories</option>
                                    <option value="web">Web Development</option>
                                    <option value="mobile">Mobile App</option>
                                    <option value="iot">IoT</option>
                                    <option value="game">Game Development</option>
                                    <option value="ai">AI/ML</option>
                                </select>
                                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                    <option value="all">All Status</option>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contestants Table */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Contestant</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Registration Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contestants.map((contestant) => (
                                    <tr key={contestant.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden">
                                                    <Image
                                                        src={contestant.avatar}
                                                        alt={contestant.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{contestant.name}</div>
                                                    <div className="text-sm text-gray-500">{contestant.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {contestant.projectTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {contestant.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {contestant.registrationDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${contestant.status === 'Approved'
                                                ? 'bg-green-100 text-green-800'
                                                : contestant.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {contestant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button className="text-accent hover:text-accent-dark">
                                                    View
                                                </button>
                                                <button className="text-blue-600 hover:text-blue-800">
                                                    Edit
                                                </button>
                                                {contestant.status === 'Pending' && (
                                                    <>
                                                        <button className="text-green-600 hover:text-green-800">
                                                            Approve
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-800">
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {contestant.status === 'Approved' && (
                                                    <button className="text-red-600 hover:text-red-800">
                                                        Revoke
                                                    </button>
                                                )}
                                                {contestant.status === 'Rejected' && (
                                                    <button className="text-green-600 hover:text-green-800">
                                                        Approve
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pending Approvals Section */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">Pending Approvals</h2>
                        <div className="space-y-6">
                            {contestants.filter(c => c.status === "Pending").map((contestant) => (
                                <div key={contestant.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 relative rounded-full overflow-hidden">
                                                <Image
                                                    src={contestant.avatar}
                                                    alt={contestant.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-lg font-medium">{contestant.name}</div>
                                                <div className="text-sm text-gray-600">{contestant.email} • {contestant.phone}</div>
                                            </div>
                                        </div>
                                        <div className="md:text-right">
                                            <div className="font-medium">{contestant.projectTitle}</div>
                                            <div className="text-sm text-gray-600">{contestant.category} • {contestant.registrationDate}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-3 justify-end">
                                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">
                                            View Details
                                        </button>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                                            Reject
                                        </button>
                                        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {contestants.filter(c => c.status === "Pending").length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No pending approvals at this time.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Bulk Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Approve Multiple</h3>
                                <p className="text-sm text-gray-600 mb-4">Approve multiple contestants at once.</p>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition w-full">
                                    Approve Selected
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Send Welcome Email</h3>
                                <p className="text-sm text-gray-600 mb-4">Send welcome emails to selected contestants.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full">
                                    Send Emails
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Export Contestant Data</h3>
                                <p className="text-sm text-gray-600 mb-4">Export contestant data as CSV or Excel.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full">
                                    Export Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 