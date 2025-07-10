import AdminSidebar from '../../components/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function ManageEvaluations() {
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

    // Mock evaluations data - in a real app, this would come from the database
    const evaluations = [
        {
            id: 1,
            projectTitle: "Educational Game for Children",
            contestant: "Hanna Tesfaye",
            category: "Game Development",
            submissionDate: "2023-06-03",
            evaluationDate: "2023-06-12",
            judge: "Dr. Alemayehu Tadesse",
            score: 92,
            status: "Evaluated",
            feedback: "Excellent project with great educational value. The game mechanics are engaging and the learning objectives are well integrated."
        },
        {
            id: 2,
            projectTitle: "Smart Agriculture IoT Solution",
            contestant: "Dawit Haile",
            category: "IoT",
            submissionDate: "2023-06-05",
            evaluationDate: "2023-06-11",
            judge: "Ms. Tigist Mengistu",
            score: 85,
            status: "Evaluated",
            feedback: "Very innovative solution addressing real agricultural challenges in Ethiopia. The implementation is solid but could use more sensor redundancy."
        },
        {
            id: 3,
            projectTitle: "AI-Powered Translation Tool",
            contestant: "Yonas Girma",
            category: "AI/ML",
            submissionDate: "2023-06-01",
            evaluationDate: "2023-06-10",
            judge: "Dr. Hiwot Bekele",
            score: 78,
            status: "Evaluated",
            feedback: "Good application of machine learning techniques. The accuracy for Amharic to English translation needs improvement."
        },
        {
            id: 4,
            projectTitle: "Community Health Tracking System",
            contestant: "Meron Tadesse",
            category: "Web Development",
            submissionDate: "2023-05-28",
            evaluationDate: "2023-06-09",
            judge: "Dr. Alemayehu Tadesse",
            score: 88,
            status: "Evaluated",
            feedback: "Well-designed system with important social impact. The data visualization components are particularly strong."
        },
        {
            id: 5,
            projectTitle: "Public Transport Tracking App",
            contestant: "Eyob Mengistu",
            category: "Mobile App",
            submissionDate: "2023-05-25",
            evaluationDate: "2023-06-08",
            judge: "Mr. Yonas Abebe",
            score: 76,
            status: "Evaluated",
            feedback: "Good concept addressing a real need. The UI needs improvement and the real-time tracking has some latency issues."
        },
        {
            id: 6,
            projectTitle: "E-Commerce Platform for Local Artisans",
            contestant: "Abebe Kebede",
            category: "Web Development",
            submissionDate: "2023-06-10",
            evaluationDate: null,
            judge: "Dr. Alemayehu Tadesse",
            score: null,
            status: "Pending",
            feedback: null
        },
        {
            id: 7,
            projectTitle: "Mobile Health Monitoring App",
            contestant: "Tigist Alemu",
            category: "Mobile App",
            submissionDate: "2023-06-09",
            evaluationDate: null,
            judge: "Dr. Samuel Negash",
            score: null,
            status: "Pending",
            feedback: null
        }
    ];

    // Calculate statistics
    const stats = {
        totalSubmissions: evaluations.length,
        evaluated: evaluations.filter(e => e.status === "Evaluated").length,
        pending: evaluations.filter(e => e.status === "Pending").length,
        averageScore: Math.round(evaluations.filter(e => e.score !== null).reduce((acc, curr) => acc + (curr.score || 0), 0) / evaluations.filter(e => e.score !== null).length * 10) / 10,
        highestScore: Math.max(...evaluations.filter(e => e.score !== null).map(e => e.score || 0)),
        lowestScore: Math.min(...evaluations.filter(e => e.score !== null).map(e => e.score || 0))
    };

    // Category breakdown
    const categories = [...new Set(evaluations.map(e => e.category))];
    const categoryStats = categories.map(category => {
        const categoryEvaluations = evaluations.filter(e => e.category === category && e.status === "Evaluated");
        return {
            category,
            count: evaluations.filter(e => e.category === category).length,
            evaluated: categoryEvaluations.length,
            averageScore: categoryEvaluations.length > 0
                ? Math.round(categoryEvaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) / categoryEvaluations.length * 10) / 10
                : 0
        };
    });

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Evaluations</h1>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Export Results
                            </button>
                            <button className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/80 transition flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Assign Judges
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Evaluation Progress</h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-3xl font-bold">{stats.evaluated}/{stats.totalSubmissions}</span>
                                <span className="text-lg text-gray-400">
                                    {Math.round((stats.evaluated / stats.totalSubmissions) * 100)}% Complete
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                                <div
                                    className="bg-accent h-2.5 rounded-full"
                                    style={{ width: `${(stats.evaluated / stats.totalSubmissions) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Evaluated</p>
                                    <p className="font-medium text-green-400">{stats.evaluated}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Pending</p>
                                    <p className="font-medium text-yellow-400">{stats.pending}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Score Statistics</h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-3xl font-bold">{stats.averageScore}</span>
                                <span className="text-lg text-gray-400">
                                    Average Score
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Highest</p>
                                    <p className="font-medium text-green-400">{stats.highestScore}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Lowest</p>
                                    <p className="font-medium text-red-400">{stats.lowestScore}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-2">
                                <div className="flex items-center gap-1">
                                    <div className="h-4 bg-red-500 rounded-l-md" style={{ width: '10%' }}></div>
                                    <div className="h-4 bg-orange-500" style={{ width: '15%' }}></div>
                                    <div className="h-4 bg-yellow-500" style={{ width: '25%' }}></div>
                                    <div className="h-4 bg-green-500" style={{ width: '30%' }}></div>
                                    <div className="h-4 bg-green-700 rounded-r-md" style={{ width: '20%' }}></div>
                                </div>
                                <div className="flex justify-between text-xs mt-1 text-gray-400">
                                    <span>0</span>
                                    <span>25</span>
                                    <span>50</span>
                                    <span>75</span>
                                    <span>100</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Judge Activity</h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-3xl font-bold">4/5</span>
                                <span className="text-lg text-gray-400">
                                    Active Judges
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Most Active</p>
                                    <p className="font-medium text-white">Dr. Alemayehu</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Evaluations</p>
                                    <p className="font-medium text-accent">3</p>
                                </div>
                            </div>
                            <Link href="/admin/judges" className="block mt-4 text-accent text-sm hover:underline">
                                View judge details
                            </Link>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search evaluations by project, contestant, or judge..."
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
                                    <option value="evaluated">Evaluated</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Evaluations Table */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Contestant</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Judge</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {evaluations.map((evaluation) => (
                                    <tr key={evaluation.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {evaluation.projectTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {evaluation.contestant}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {evaluation.judge}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {evaluation.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${evaluation.status === 'Evaluated'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {evaluation.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {evaluation.score !== null ? evaluation.score : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button className="text-accent hover:text-accent-dark">
                                                    View
                                                </button>
                                                {evaluation.status === 'Evaluated' ? (
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        Edit
                                                    </button>
                                                ) : (
                                                    <button className="text-green-600 hover:text-green-800">
                                                        Assign
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">Category Breakdown</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluated</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categoryStats.map((category, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.count}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.evaluated}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {category.averageScore > 0 ? category.averageScore : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-accent h-2.5 rounded-full"
                                                        style={{ width: `${category.count > 0 ? (category.evaluated / category.count) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Judge Assignment */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Judge Assignment</h2>
                        <p className="text-gray-600 mb-6">Assign judges to pending submissions based on their expertise and current workload.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-4">Auto-Assign Submissions</h3>
                                <p className="text-sm text-gray-600 mb-4">Automatically assign pending submissions to judges based on their specialty and current workload.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full">
                                    Auto-Assign Pending Submissions
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-4">Manual Assignment</h3>
                                <p className="text-sm text-gray-600 mb-4">Manually assign specific submissions to judges of your choice.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full">
                                    Manage Manual Assignments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 