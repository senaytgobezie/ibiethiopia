import AdminSidebar from '../../components/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function ManageNotices() {
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

    // Mock notices data - in a real app, this would come from the database
    const notices = [
        {
            id: 1,
            title: "Final Evaluation Deadline Extended",
            content: "Due to the high volume of submissions, the final evaluation deadline has been extended by 48 hours. Please ensure all evaluations are completed by June 20th.",
            date: "June 15, 2023",
            author: "Admin",
            priority: "high",
            audience: "Judges",
            status: "Published"
        },
        {
            id: 2,
            title: "Judges Meeting - Final Round Preparation",
            content: "There will be a virtual meeting for all judges on June 18th at 3:00 PM to discuss the final round evaluation process. Please ensure you have reviewed at least 80% of your assigned submissions before the meeting.",
            date: "June 14, 2023",
            author: "Admin",
            priority: "medium",
            audience: "Judges",
            status: "Published"
        },
        {
            id: 3,
            title: "Submission Deadline Extension",
            content: "Good news! The submission deadline has been extended by 72 hours. You now have until June 15th at 11:59 PM to submit your final projects.",
            date: "June 10, 2023",
            author: "Admin",
            priority: "high",
            audience: "Contestants",
            status: "Published"
        },
        {
            id: 4,
            title: "Workshop: Preparing Your Final Presentation",
            content: "We're hosting a virtual workshop on June 12th at 2:00 PM to help you prepare your final presentation. Learn tips and tricks from industry experts on how to effectively showcase your project.",
            date: "June 8, 2023",
            author: "Admin",
            priority: "medium",
            audience: "Contestants",
            status: "Published"
        },
        {
            id: 5,
            title: "Awards Ceremony Details",
            content: "The awards ceremony will be held on June 25th at 6:00 PM at Skylight Hotel, Addis Ababa. All contestants and judges are invited to attend. Formal attire is required.",
            date: "June 5, 2023",
            author: "Admin",
            priority: "medium",
            audience: "All",
            status: "Draft"
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
                        <h1 className="text-3xl font-bold">Manage Notices</h1>
                        <button className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/80 transition flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create New Notice
                        </button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Total Notices</h3>
                            <p className="text-3xl font-bold mt-2">{notices.length}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-green-400 text-lg font-medium">Published</h3>
                            <p className="text-3xl font-bold mt-2">{notices.filter(n => n.status === "Published").length}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-yellow-400 text-lg font-medium">Drafts</h3>
                            <p className="text-3xl font-bold mt-2">{notices.filter(n => n.status === "Draft").length}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-red-400 text-lg font-medium">High Priority</h3>
                            <p className="text-3xl font-bold mt-2">{notices.filter(n => n.priority === "high").length}</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search notices by title or content..."
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
                                    <option value="all">All Audiences</option>
                                    <option value="judges">Judges</option>
                                    <option value="contestants">Contestants</option>
                                    <option value="all-users">All Users</option>
                                </select>
                                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                    <option value="all">All Status</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                    <option value="all">All Priorities</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notices List */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Audience</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {notices.map((notice) => (
                                    <tr key={notice.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{notice.content}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {notice.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {notice.audience}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${notice.priority === 'high'
                                                ? 'bg-red-100 text-red-800'
                                                : notice.priority === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${notice.status === 'Published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {notice.status}
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
                                                {notice.status === 'Draft' ? (
                                                    <button className="text-green-600 hover:text-green-800">
                                                        Publish
                                                    </button>
                                                ) : (
                                                    <button className="text-yellow-600 hover:text-yellow-800">
                                                        Unpublish
                                                    </button>
                                                )}
                                                <button className="text-red-600 hover:text-red-800">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Create New Notice Form */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">Create New Notice</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Enter notice title"
                                />
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={5}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Enter notice content"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                                    <select
                                        id="audience"
                                        name="audience"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="">Select Audience</option>
                                        <option value="judges">Judges</option>
                                        <option value="contestants">Contestants</option>
                                        <option value="all">All Users</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="">Select Priority</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="published">Publish Immediately</option>
                                        <option value="draft">Save as Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="sendEmail"
                                    name="sendEmail"
                                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                />
                                <label htmlFor="sendEmail" className="ml-2 block text-sm text-gray-700">
                                    Send email notification to the selected audience
                                </label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    Create Notice
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Bulk Actions */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Bulk Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Send Email Notifications</h3>
                                <p className="text-sm text-gray-600 mb-4">Send email notifications for selected notices.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full">
                                    Send Emails
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Publish Multiple</h3>
                                <p className="text-sm text-gray-600 mb-4">Publish multiple draft notices at once.</p>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition w-full">
                                    Publish Selected
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Delete Multiple</h3>
                                <p className="text-sm text-gray-600 mb-4">Delete multiple notices at once.</p>
                                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition w-full">
                                    Delete Selected
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 