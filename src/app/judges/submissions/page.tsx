import JudgeSidebar from '../../components/JudgeSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function JudgeSubmissions() {
    // Create client
    const supabase = await createClient();

    // Check authentication
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login');
    }

    // Mock submissions data - in a real app, this would come from the database
    const submissions = [
        {
            id: 1,
            title: "Elegant Bridal Transformation",
            contestant: "Abebe Kebede",
            submittedDate: "2023-06-15",
            category: "Makeup Artistry",
            status: "Pending",
            score: null
        },
        {
            id: 2,
            title: "Ethiopian Cultural Fusion Nails",
            contestant: "Tigist Alemu",
            submittedDate: "2023-06-14",
            category: "Nail Art",
            status: "Pending",
            score: null
        },
        {
            id: 3,
            title: "Modern Updo with Traditional Elements",
            contestant: "Dawit Haile",
            submittedDate: "2023-06-10",
            category: "Hair Styling",
            status: "Evaluated",
            score: 85
        },
        {
            id: 4,
            title: "Sustainable Fashion Evening Gown",
            contestant: "Hanna Tesfaye",
            submittedDate: "2023-06-08",
            category: "Fashion Design",
            status: "Evaluated",
            score: 92
        },
        {
            id: 5,
            title: "Avant-Garde Fantasy Makeup",
            contestant: "Yonas Girma",
            submittedDate: "2023-06-05",
            category: "Creative Look",
            status: "Evaluated",
            score: 78
        }
    ];

    // Beauty contest categories
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
            <JudgeSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Submissions</h1>
                        <div className="flex gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search submissions..."
                                    className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
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
                            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                <option value="all">All Categories</option>
                                {beautyCategories.map((category, index) => (
                                    <option key={index} value={category.toLowerCase().replace(/\s+/g, '-')}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="evaluated">Evaluated</option>
                            </select>
                        </div>
                    </div>

                    {/* Submissions Table */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Look/Design</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Contestant</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.contestant}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.submittedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${submission.category === 'Makeup Artistry' ? 'bg-pink-100 text-pink-800' :
                                                    submission.category === 'Nail Art' ? 'bg-purple-100 text-purple-800' :
                                                        submission.category === 'Hair Styling' ? 'bg-yellow-100 text-yellow-800' :
                                                            submission.category === 'Fashion Design' ? 'bg-blue-100 text-blue-800' :
                                                                submission.category === 'Creative Look' ? 'bg-indigo-100 text-indigo-800' :
                                                                    'bg-green-100 text-green-800'}`
                                            }>
                                                {submission.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${submission.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {submission.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {submission.score !== null ? submission.score : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/judges/evaluate/${submission.id}`}
                                                className={`text-accent hover:text-accent-dark ${submission.status === 'Evaluated' ? 'ml-4' : ''
                                                    }`}
                                            >
                                                {submission.status === 'Pending' ? 'Evaluate' : 'View'}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12</span> results
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