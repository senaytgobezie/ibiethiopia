import JudgeSidebar from '../../components/JudgeSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function JudgeReports() {
    // Create client
    const supabase = await createClient();

    // Check authentication
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login');
    }

    // Mock data for reports - in a real app, this would come from the database
    const evaluationStats = {
        totalSubmissions: 45,
        evaluated: 29,
        pending: 16,
        averageScore: 76.8,
        highestScore: 98,
        lowestScore: 42
    };

    const categoryBreakdown = [
        { category: "Makeup Artistry", count: 18, averageScore: 79.2 },
        { category: "Nail Art", count: 12, averageScore: 75.6 },
        { category: "Hair Styling", count: 8, averageScore: 82.4 },
        { category: "Fashion Design", count: 4, averageScore: 81.5 },
        { category: "Creative Look", count: 3, averageScore: 84.3 }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <JudgeSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Evaluation Reports</h1>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg mb-4">Evaluation Progress</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span>Total Submissions</span>
                                <span className="font-bold">{evaluationStats.totalSubmissions}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span>Evaluated</span>
                                <span className="font-bold text-green-400">{evaluationStats.evaluated}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span>Pending</span>
                                <span className="font-bold text-yellow-400">{evaluationStats.pending}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-accent h-2.5 rounded-full"
                                    style={{ width: `${(evaluationStats.evaluated / evaluationStats.totalSubmissions) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-right text-sm mt-2 text-gray-400">
                                {Math.round((evaluationStats.evaluated / evaluationStats.totalSubmissions) * 100)}% Complete
                            </p>
                        </div>

                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg mb-4">Score Statistics</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span>Average Score</span>
                                <span className="font-bold">{evaluationStats.averageScore}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span>Highest Score</span>
                                <span className="font-bold text-green-400">{evaluationStats.highestScore}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Lowest Score</span>
                                <span className="font-bold text-red-400">{evaluationStats.lowestScore}</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Score Distribution</span>
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                    <div className="h-8 bg-red-500 rounded-l-md" style={{ width: '10%' }}></div>
                                    <div className="h-8 bg-orange-500" style={{ width: '15%' }}></div>
                                    <div className="h-8 bg-yellow-500" style={{ width: '25%' }}></div>
                                    <div className="h-8 bg-green-500" style={{ width: '30%' }}></div>
                                    <div className="h-8 bg-green-700 rounded-r-md" style={{ width: '20%' }}></div>
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
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h3 className="text-xl font-semibold mb-6">Category Breakdown</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categoryBreakdown.map((category, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${category.category === 'Makeup Artistry' ? 'bg-pink-100 text-pink-800' :
                                                        category.category === 'Nail Art' ? 'bg-purple-100 text-purple-800' :
                                                            category.category === 'Hair Styling' ? 'bg-yellow-100 text-yellow-800' :
                                                                category.category === 'Fashion Design' ? 'bg-blue-100 text-blue-800' :
                                                                    category.category === 'Creative Look' ? 'bg-indigo-100 text-indigo-800' :
                                                                        'bg-green-100 text-green-800'}`
                                                }>
                                                    {category.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.count}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.averageScore}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-accent h-2.5 rounded-full"
                                                        style={{ width: `${(category.count / evaluationStats.totalSubmissions) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 