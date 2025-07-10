import AdminSidebar from '../../components/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function ManageCertificates() {
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

    // Mock certificates data - in a real app, this would come from the database
    const certificates = [
        {
            id: 1,
            contestantName: "Hanna Tesfaye",
            projectTitle: "Educational Game for Children",
            category: "Game Development",
            position: "1st Place",
            score: 92,
            dateIssued: "2023-06-25",
            status: "Generated"
        },
        {
            id: 2,
            contestantName: "Yohannes Abebe",
            projectTitle: "AI-Powered Medical Diagnosis Tool",
            category: "AI/ML",
            position: "2nd Place",
            score: 91,
            dateIssued: "2023-06-25",
            status: "Generated"
        },
        {
            id: 3,
            contestantName: "Meron Tadesse",
            projectTitle: "Community Health Tracking System",
            category: "Web Development",
            position: "3rd Place",
            score: 88,
            dateIssued: "2023-06-25",
            status: "Generated"
        },
        {
            id: 4,
            contestantName: "Dawit Haile",
            projectTitle: "Smart Agriculture IoT Solution",
            category: "IoT",
            position: "Finalist",
            score: 85,
            dateIssued: "2023-06-25",
            status: "Generated"
        },
        {
            id: 5,
            contestantName: "Sara Gebre",
            projectTitle: "Amharic Language Learning App",
            category: "Mobile App",
            position: "Finalist",
            score: 84,
            dateIssued: "2023-06-25",
            status: "Generated"
        },
        {
            id: 6,
            contestantName: "Abebe Kebede",
            projectTitle: "E-Commerce Platform for Local Artisans",
            category: "Web Development",
            position: "Participant",
            score: 76,
            dateIssued: null,
            status: "Pending"
        },
        {
            id: 7,
            contestantName: "Tigist Alemu",
            projectTitle: "Mobile Health Monitoring App",
            category: "Mobile App",
            position: "Participant",
            score: 72,
            dateIssued: null,
            status: "Pending"
        }
    ];

    // Calculate statistics
    const stats = {
        total: certificates.length,
        generated: certificates.filter(c => c.status === "Generated").length,
        pending: certificates.filter(c => c.status === "Pending").length,
        winners: certificates.filter(c => ["1st Place", "2nd Place", "3rd Place"].includes(c.position)).length
    };

    // Certificate templates
    const templates = [
        { id: 1, name: "Winner Certificate", description: "For 1st, 2nd, and 3rd place winners", thumbnail: "/images/certificate-winner.png" },
        { id: 2, name: "Finalist Certificate", description: "For contestants who reached the final round", thumbnail: "/images/certificate-finalist.png" },
        { id: 3, name: "Participation Certificate", description: "For all participants", thumbnail: "/images/certificate-participant.png" }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Manage Certificates</h1>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Export All Certificates
                            </button>
                            <button className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/80 transition flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Generate New Certificate
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Total Certificates</h3>
                            <p className="text-3xl font-bold mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-green-400 text-lg font-medium">Generated</h3>
                            <p className="text-3xl font-bold mt-2">{stats.generated}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-yellow-400 text-lg font-medium">Pending</h3>
                            <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-blue-400 text-lg font-medium">Winners</h3>
                            <p className="text-3xl font-bold mt-2">{stats.winners}</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search certificates by contestant name or project..."
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
                                    <option value="all">All Positions</option>
                                    <option value="1st">1st Place</option>
                                    <option value="2nd">2nd Place</option>
                                    <option value="3rd">3rd Place</option>
                                    <option value="finalist">Finalist</option>
                                    <option value="participant">Participant</option>
                                </select>
                                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                    <option value="all">All Status</option>
                                    <option value="generated">Generated</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Certificates Table */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Contestant</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Position</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {certificates.map((certificate) => (
                                    <tr key={certificate.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {certificate.contestantName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {certificate.projectTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {certificate.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${certificate.position === '1st Place' ? 'bg-yellow-100 text-yellow-800' :
                                                certificate.position === '2nd Place' ? 'bg-gray-100 text-gray-800' :
                                                    certificate.position === '3rd Place' ? 'bg-orange-100 text-orange-800' :
                                                        certificate.position === 'Finalist' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                }`}>
                                                {certificate.position}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {certificate.score}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${certificate.status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {certificate.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {certificate.status === 'Generated' ? (
                                                    <>
                                                        <button className="text-accent hover:text-accent-dark">
                                                            View
                                                        </button>
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            Download
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-800">
                                                            Email
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="text-green-600 hover:text-green-800">
                                                        Generate
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

                    {/* Certificate Templates */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">Certificate Templates</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="h-48 bg-gray-100 relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            <span>Certificate Preview</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-lg">{template.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{template.description}</p>
                                        <div className="flex justify-between mt-4">
                                            <button className="text-accent hover:text-accent-dark text-sm">
                                                Preview
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                                                Edit Template
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Generate New Certificate */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">Generate New Certificate</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="contestant" className="block text-sm font-medium text-gray-700 mb-1">Contestant</label>
                                    <select
                                        id="contestant"
                                        name="contestant"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="">Select Contestant</option>
                                        <option value="abebe">Abebe Kebede</option>
                                        <option value="tigist">Tigist Alemu</option>
                                        <option value="dawit">Dawit Haile</option>
                                        <option value="hanna">Hanna Tesfaye</option>
                                        <option value="yonas">Yonas Girma</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">Certificate Template</label>
                                    <select
                                        id="template"
                                        name="template"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="">Select Template</option>
                                        <option value="winner">Winner Certificate</option>
                                        <option value="finalist">Finalist Certificate</option>
                                        <option value="participant">Participation Certificate</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                    <select
                                        id="position"
                                        name="position"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="">Select Position</option>
                                        <option value="1st">1st Place</option>
                                        <option value="2nd">2nd Place</option>
                                        <option value="3rd">3rd Place</option>
                                        <option value="finalist">Finalist</option>
                                        <option value="participant">Participant</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date of Issue</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="customText" className="block text-sm font-medium text-gray-700 mb-1">Custom Text (Optional)</label>
                                    <textarea
                                        id="customText"
                                        name="customText"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="Add any custom text to appear on the certificate..."
                                    ></textarea>
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
                                    Send certificate to contestant via email
                                </label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                                >
                                    Preview
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    Generate Certificate
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Bulk Actions */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Bulk Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Generate Multiple Certificates</h3>
                                <p className="text-sm text-gray-600 mb-4">Generate certificates for multiple contestants at once.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full">
                                    Bulk Generate
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Email Certificates</h3>
                                <p className="text-sm text-gray-600 mb-4">Send generated certificates to contestants via email.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full">
                                    Email Selected
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Download All Certificates</h3>
                                <p className="text-sm text-gray-600 mb-4">Download all generated certificates as a ZIP archive.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition w-full">
                                    Download All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 