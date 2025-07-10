import JudgeSidebar from '../../components/JudgeSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export default async function JudgeNotices() {
    // Create client
    const supabase = await createClient();

    // Check authentication
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login');
    }

    // Mock notices data - in a real app, this would come from the database
    const notices = [
        {
            id: 1,
            title: "Final Evaluation Deadline Extended",
            content: "Due to the high volume of submissions, the final evaluation deadline has been extended by 48 hours. Please ensure all evaluations are completed by June 20th.",
            date: "June 15, 2023",
            author: "Organizing Committee",
            priority: "high",
            isNew: true
        },
        {
            id: 2,
            title: "Judges Meeting - Final Round Preparation",
            content: "There will be a virtual meeting for all judges on June 18th at 3:00 PM to discuss the final round evaluation process. Please ensure you have reviewed at least 80% of your assigned submissions before the meeting.",
            date: "June 14, 2023",
            author: "Dr. Alemayehu Tadesse",
            priority: "medium",
            isNew: true
        },
        {
            id: 3,
            title: "Evaluation Guidelines Update",
            content: "Please note that we have updated the evaluation guidelines for the 'Innovation' category. The new guidelines emphasize the importance of local context and sustainability. Please refer to the updated documentation in your judge portal.",
            date: "June 10, 2023",
            author: "Technical Committee",
            priority: "medium",
            isNew: false
        },
        {
            id: 4,
            title: "New Judges Onboarded",
            content: "We are pleased to welcome three new judges to our panel: Dr. Hiwot Bekele (AI/ML specialist), Mr. Yonas Abebe (UX Design expert), and Ms. Tigist Mengistu (IoT specialist). Please extend a warm welcome when you meet them.",
            date: "June 8, 2023",
            author: "Organizing Committee",
            priority: "low",
            isNew: false
        },
        {
            id: 5,
            title: "Feedback System Enhancement",
            content: "We have enhanced the feedback system to allow for more detailed comments on each submission. This will help contestants better understand your evaluation and improve their projects for future competitions.",
            date: "June 5, 2023",
            author: "Technical Support",
            priority: "low",
            isNew: false
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <JudgeSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Notice Board</h1>
                        <div className="flex items-center gap-2">
                            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                <option value="all">All Notices</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                                Mark All as Read
                            </button>
                        </div>
                    </div>

                    {/* Notices List */}
                    <div className="space-y-6">
                        {notices.map((notice) => (
                            <div
                                key={notice.id}
                                className={`bg-white border-l-4 rounded-lg shadow-md overflow-hidden ${notice.priority === 'high' ? 'border-red-500' :
                                    notice.priority === 'medium' ? 'border-yellow-500' :
                                        'border-blue-500'
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-semibold">{notice.title}</h3>
                                                {notice.isNew && (
                                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Posted by {notice.author} • {notice.date}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${notice.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
                                            </span>
                                        </div>
                                    </div>
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700">{notice.content}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                                    <button className="text-accent hover:text-accent-dark text-sm font-medium">
                                        Mark as Read
                                    </button>
                                    <div className="flex gap-2">
                                        <button className="text-gray-500 hover:text-gray-700 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="text-gray-500 hover:text-gray-700 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                                                <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-8">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12</span> notices
                        </p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md bg-black text-white">
                                1
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50">
                                2
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50">
                                3
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 