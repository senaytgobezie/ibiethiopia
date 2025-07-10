import AdminSidebar from '../../components/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminReports() {
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

    // Mock data for reports - in a real app, this would come from the database
    const overviewStats = {
        contestants: {
            total: 156,
            approved: 144,
            pending: 12,
            rejected: 8
        },
        judges: {
            total: 24,
            active: 22,
            inactive: 2
        },
        submissions: {
            total: 132,
            evaluated: 98,
            pending: 34
        },
        evaluations: {
            averageScore: 76.8,
            highestScore: 98,
            lowestScore: 42
        }
    };

    // Category breakdown data
    const categoryBreakdown = [
        { category: "Web Development", count: 48, averageScore: 79.2 },
        { category: "Mobile App", count: 42, averageScore: 75.6 },
        { category: "IoT", count: 18, averageScore: 72.4 },
        { category: "Game Development", count: 12, averageScore: 81.5 },
        { category: "AI/ML", count: 12, averageScore: 84.3 }
    ];

    // Judge performance data
    const judgePerformance = [
        { name: "Dr. Alemayehu Tadesse", evaluations: 24, averageScore: 78.5, specialty: "Software Engineering" },
        { name: "Dr. Hiwot Bekele", evaluations: 18, averageScore: 82.3, specialty: "AI/ML" },
        { name: "Mr. Yonas Abebe", evaluations: 15, averageScore: 75.8, specialty: "UX Design" },
        { name: "Ms. Tigist Mengistu", evaluations: 12, averageScore: 76.2, specialty: "IoT" },
        { name: "Dr. Samuel Negash", evaluations: 0, averageScore: 0, specialty: "Mobile Development" }
    ];

    // Top scoring projects
    const topProjects = [
        { title: "Educational Game for Children", contestant: "Hanna Tesfaye", category: "Game Development", score: 92 },
        { title: "AI-Powered Medical Diagnosis Tool", contestant: "Yohannes Abebe", category: "AI/ML", score: 91 },
        { title: "Community Health Tracking System", contestant: "Meron Tadesse", category: "Web Development", score: 88 },
        { title: "Smart Agriculture IoT Solution", contestant: "Dawit Haile", category: "IoT", score: 85 },
        { title: "Amharic Language Learning App", contestant: "Sara Gebre", category: "Mobile App", score: 84 }
    ];

    // Monthly registration data for chart
    const monthlyRegistrations = [
        { month: "Jan", count: 12 },
        { month: "Feb", count: 18 },
        { month: "Mar", count: 25 },
        { month: "Apr", count: 32 },
        { month: "May", count: 45 },
        { month: "Jun", count: 24 }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Export Reports
                            </button>
                            <button className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/80 transition flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Refresh Data
                            </button>
                        </div>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Contestants</h3>
                            <p className="text-3xl font-bold mt-2">{overviewStats.contestants.total}</p>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Approved</p>
                                    <p className="font-medium text-green-400">{overviewStats.contestants.approved}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Pending</p>
                                    <p className="font-medium text-yellow-400">{overviewStats.contestants.pending}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Rejected</p>
                                    <p className="font-medium text-red-400">{overviewStats.contestants.rejected}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Judges</h3>
                            <p className="text-3xl font-bold mt-2">{overviewStats.judges.total}</p>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Active</p>
                                    <p className="font-medium text-green-400">{overviewStats.judges.active}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Inactive</p>
                                    <p className="font-medium text-red-400">{overviewStats.judges.inactive}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Avg. Evaluations</p>
                                    <p className="font-medium text-accent">{Math.round(overviewStats.submissions.evaluated / overviewStats.judges.active)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Submissions</h3>
                            <p className="text-3xl font-bold mt-2">{overviewStats.submissions.total}</p>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Evaluated</p>
                                    <p className="font-medium text-green-400">{overviewStats.submissions.evaluated}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Pending</p>
                                    <p className="font-medium text-yellow-400">{overviewStats.submissions.pending}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Completion</p>
                                    <p className="font-medium text-accent">{Math.round((overviewStats.submissions.evaluated / overviewStats.submissions.total) * 100)}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Evaluations</h3>
                            <p className="text-3xl font-bold mt-2">{overviewStats.evaluations.averageScore}</p>
                            <div className="flex justify-between text-sm mt-4">
                                <div>
                                    <p className="text-gray-400">Highest</p>
                                    <p className="font-medium text-green-400">{overviewStats.evaluations.highestScore}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Lowest</p>
                                    <p className="font-medium text-red-400">{overviewStats.evaluations.lowestScore}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Range</p>
                                    <p className="font-medium text-accent">{overviewStats.evaluations.highestScore - overviewStats.evaluations.lowestScore}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Monthly Registrations Chart */}
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6">Monthly Contestant Registrations</h2>
                            <div className="h-64 flex items-end justify-between gap-2">
                                {monthlyRegistrations.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <div className="w-12 bg-accent rounded-t-md" style={{ height: `${(data.count / 45) * 100}%` }}></div>
                                        <p className="mt-2 text-sm font-medium">{data.month}</p>
                                        <p className="text-xs text-gray-500">{data.count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Category Distribution */}
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6">Category Distribution</h2>
                            <div className="space-y-4">
                                {categoryBreakdown.map((category, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{category.category}</span>
                                            <span className="text-sm text-gray-500">{category.count} submissions</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-accent h-2.5 rounded-full"
                                                style={{ width: `${(category.count / overviewStats.submissions.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-gray-500">{Math.round((category.count / overviewStats.submissions.total) * 100)}%</span>
                                            <span className="text-xs text-gray-500">Avg. Score: {category.averageScore}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Top Scoring Projects */}
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6">Top Scoring Projects</h2>
                            <div className="space-y-4">
                                {topProjects.map((project, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="text-sm font-medium text-gray-900">{project.title}</div>
                                            <div className="text-sm text-gray-500">{project.contestant} • {project.category}</div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                                </svg>
                                                {project.score}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Judge Performance */}
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6">Judge Performance</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judge</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluations</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {judgePerformance.map((judge, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{judge.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.specialty}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.evaluations}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.averageScore > 0 ? judge.averageScore : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Score Distribution */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">Score Distribution</h2>
                        <div className="flex flex-col space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">90-100 (Excellent)</span>
                                    <span className="text-sm text-gray-500">12 submissions</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">80-89 (Very Good)</span>
                                    <span className="text-sm text-gray-500">24 submissions</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-400 h-2.5 rounded-full" style={{ width: '24%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">70-79 (Good)</span>
                                    <span className="text-sm text-gray-500">38 submissions</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '38%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">60-69 (Satisfactory)</span>
                                    <span className="text-sm text-gray-500">18 submissions</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Below 60 (Needs Improvement)</span>
                                    <span className="text-sm text-gray-500">6 submissions</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '6%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Export Options */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Export Reports</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Contestant Report</h3>
                                <p className="text-sm text-gray-600 mb-4">Export detailed information about all contestants including registration status and submissions.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Export CSV
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Evaluation Report</h3>
                                <p className="text-sm text-gray-600 mb-4">Export comprehensive data about all evaluations including scores and feedback.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Export CSV
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Complete Competition Report</h3>
                                <p className="text-sm text-gray-600 mb-4">Export all data related to the competition including contestants, judges, and evaluations.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Export Excel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 